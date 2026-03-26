import ast
import json
import logging
import os
import random
import re
import time
import threading
from typing import Any, Dict, Optional

import requests

from app.core.config import settings
from app.core.network import is_network_available
from app.llm.provider_manager import LLMProviderManager

logger = logging.getLogger(__name__)


# ----------------------------
# In-process rate-limit controls
# ----------------------------

_openai_sem = threading.Semaphore(max(1, int(getattr(settings, "OPENAI_MAX_CONCURRENT", 2))))
_state_lock = threading.Lock()
_openai_429_strikes: int = 0
_openai_circuit_open_until: float = 0.0

# LLM mode override (in-process)
# - starts from settings.LLM_MODE
# - may be downgraded to 1 when sustained 429/rate-limit errors happen
_llm_mode_override: int | None = None


def get_effective_llm_mode() -> int:
    global _llm_mode_override
    try:
        base = int(getattr(settings, "LLM_MODE", 2))
    except Exception:
        base = 2
    if _llm_mode_override is None:
        return base
    return int(_llm_mode_override)


def downgrade_llm_mode(reason: str = "") -> None:
    """Downgrade LLM mode to 1 (safe) for the remainder of this process.

    This is intended to keep the analysis running even when the LLM provider
    is rate-limiting (429) or quota constrained.
    """
    global _llm_mode_override
    if not bool(getattr(settings, "LLM_DOWNGRADE_ON_429", True)):
        return
    if _llm_mode_override == 1:
        return
    _llm_mode_override = 1
    logger.warning("[LLM] Downgrading to LLM_MODE=1 (safe). %s", (reason or "").strip())


def _circuit_is_open() -> bool:
    with _state_lock:
        return time.time() < _openai_circuit_open_until


def _note_openai_success() -> None:
    global _openai_429_strikes
    with _state_lock:
        _openai_429_strikes = 0


def _note_openai_429() -> None:
    """Track consecutive 429s and open the circuit breaker if threshold is reached."""
    global _openai_429_strikes, _openai_circuit_open_until
    threshold = int(getattr(settings, "OPENAI_429_STRIKE_THRESHOLD", 2))
    cooldown = int(getattr(settings, "OPENAI_CIRCUIT_BREAKER_COOLDOWN_SEC", 60))
    with _state_lock:
        _openai_429_strikes += 1
        if _openai_429_strikes >= max(1, threshold):
            _openai_circuit_open_until = time.time() + max(5, cooldown)
            logger.warning("[LLM] OpenAI circuit-breaker OPEN for %ss after %s consecutive 429s", cooldown, _openai_429_strikes)
            # Also downgrade the overall LLM mode so the pipeline can continue
            # with smaller / fewer LLM calls.
            downgrade_llm_mode("OpenAI sustained 429s")


def _should_fallback_to_gemini() -> bool:
    return bool(getattr(settings, "OPENAI_FALLBACK_TO_GEMINI_ON_429", True)) and bool(settings.GEMINI_API_KEY)


def _set_metadata(metadata_out: Optional[Dict[str, Any]], **values: Any) -> None:
    if metadata_out is not None:
        metadata_out.update(values)


def _is_retryable_http_status(status_code: int | None) -> bool:
    return int(status_code or 0) in {408, 409, 425, 429, 500, 502, 503, 504}


def _is_dns_or_network_error(exc: Exception) -> bool:
    message = str(exc or "").lower()
    if any(
        fragment in message
        for fragment in (
            "name resolution",
            "getaddrinfo",
            "nodename nor servname",
            "temporary failure in name resolution",
            "failed to establish a new connection",
            "no connection adapters",
            "max retries exceeded with url",
        )
    ):
        return True
    return isinstance(exc, requests.ConnectionError)


def _is_retryable_exception(exc: Exception) -> bool:
    if isinstance(exc, requests.Timeout):
        return True
    if isinstance(exc, requests.HTTPError):
        response = getattr(exc, "response", None)
        return _is_retryable_http_status(getattr(response, "status_code", None))
    return False


def _extract_json_from_text(text: str) -> Any:
    """Best-effort JSON extraction.

    - If text is valid JSON -> returns it
    - Else tries to find the first {...} or [...] block and parse it
    """
    text = (text or "").strip()
    if not text:
        raise ValueError("Empty model output")

    try:
        parsed = json.loads(text)
        if isinstance(parsed, (dict, list)):
            return parsed
    except Exception:
        pass

    m = re.search(r"```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```", text, flags=re.IGNORECASE)
    if m:
        return json.loads(m.group(1))

    m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if m:
        return json.loads(m.group(1))

    raise ValueError("Could not parse JSON from model output")


def _coerce_json_object(payload: Any) -> Dict[str, Any]:
    if isinstance(payload, dict):
        return payload
    if isinstance(payload, list):
        logger.warning("[LLM] Parsed JSON array where object was required; returning empty object")
        return {}
    return {}


def _lightweight_json_repair(raw_text: str) -> str:
    candidate = (raw_text or "").strip().lstrip("\ufeff")
    if not candidate:
        return "{}"

    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", candidate, flags=re.IGNORECASE)
    if fenced:
        candidate = fenced.group(1).strip()

    block = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", candidate)
    if block:
        candidate = block.group(1).strip()

    candidate = (
        candidate.replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2018", "'")
        .replace("\u2019", "'")
    )
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
    return candidate


def safe_parse_json(
    raw_text: str,
    *,
    repair_callback: Any | None = None,
) -> Dict[str, Any]:
    text = (raw_text or "").strip()
    if not text:
        return {}

    try:
        return _coerce_json_object(_extract_json_from_text(text))
    except Exception:
        pass

    repaired = _lightweight_json_repair(text)
    try:
        return _coerce_json_object(json.loads(repaired))
    except Exception:
        pass

    python_literal = re.sub(r"\bnull\b", "None", repaired, flags=re.IGNORECASE)
    python_literal = re.sub(r"\btrue\b", "True", python_literal, flags=re.IGNORECASE)
    python_literal = re.sub(r"\bfalse\b", "False", python_literal, flags=re.IGNORECASE)
    try:
        literal = ast.literal_eval(python_literal)
        return _coerce_json_object(literal)
    except Exception:
        pass

    if repair_callback is not None:
        try:
            repaired_payload = repair_callback(text)
            return _coerce_json_object(repaired_payload)
        except Exception as repair_err:
            logger.warning("[LLM] JSON repair callback failed err=%s", repair_err)

    logger.warning("[LLM] Could not parse model JSON; returning empty object")
    return {}



def _repair_json_with_openai(raw_text: str, *, model: Optional[str] = None, timeout_s: int = 60) -> Dict[str, Any]:
    """Best-effort JSON repair using OpenAI response_format=json_object.

    This avoids re-running large prompts when the model returns slightly invalid JSON.
    """
    if not settings.OPENAI_API_KEY:
        raise RuntimeError('settings.OPENAI_API_KEY is missing (needed for JSON repair)')
    model = model or settings.OPENAI_MODEL
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {settings.OPENAI_API_KEY}',
        'Content-Type': 'application/json',
    }
    # Keep the repair prompt small; include only the raw output.
    s = (raw_text or '').strip()
    if len(s) > 20000:
        s = s[-20000:]
    payload = {
        'model': model,
        'temperature': 0,
        'max_tokens': 2000,
        'response_format': {'type': 'json_object'},
        'messages': [
            {'role': 'system', 'content': 'Fix the user content into a single valid JSON object. Output JSON only.'},
            {'role': 'user', 'content': s},
        ],
    }
    _openai_sem.acquire()
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=timeout_s)
    finally:
        _openai_sem.release()
    r.raise_for_status()
    data = r.json()
    content = data['choices'][0]['message']['content']
    return safe_parse_json(content)

def call_openai_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 2000,
    timeout_s: int = 120,
    max_retries: int = 6,
    metadata_out: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Calls OpenAI Chat Completions API and returns parsed JSON.

    NOTE: This uses a simple HTTP request to avoid SDK pinning issues.
    """
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("settings.OPENAI_API_KEY is missing")

    model = model or settings.OPENAI_MODEL
    if metadata_out is not None:
        metadata_out.clear()
        metadata_out.update({"provider": "openai", "model": model, "attempts": 0, "retries": 0})

    provider_manager = LLMProviderManager()
    active_provider = provider_manager.get_active_provider(preferred="openai")
    if active_provider == "gemini":
        logger.warning("[LLM] OpenAI unavailable -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
        _set_metadata(metadata_out, provider="gemini", fallback_from="openai", reason="openai_unavailable")
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=settings.GEMINI_MODEL_MINI,
            temperature=temperature,
            max_tokens=min(max_tokens, 1800),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )
    if active_provider is None or not is_network_available("api.openai.com"):
        _set_metadata(metadata_out, skipped=True, reason="network_unavailable")
        raise RuntimeError("OpenAI unavailable: network unavailable")

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    # If the circuit breaker is open, optionally route directly to Gemini.
    if _circuit_is_open() and _should_fallback_to_gemini():
        logger.warning("[LLM] OpenAI circuit-breaker is open -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=settings.GEMINI_MODEL_MINI,
            temperature=temperature,
            max_tokens=min(max_tokens, 1800),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )

    last_err: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("[LLM] call_openai_json attempt=%s model=%s", attempt, model)
            if metadata_out is not None:
                metadata_out["attempts"] = attempt
                metadata_out["retries"] = max(0, attempt - 1)

            # Limit concurrent OpenAI calls to prevent burst 429s.
            _openai_sem.acquire()
            try:
                r = requests.post(url, headers=headers, json=payload, timeout=timeout_s)
            finally:
                _openai_sem.release()

            # OpenAI uses 429 for rate limit
            if r.status_code == 429:
                _note_openai_429()

                # After the strike threshold is reached, route to Gemini (if available)
                if _circuit_is_open() and _should_fallback_to_gemini():
                    logger.warning("[LLM] OpenAI 429 -> circuit-breaker open -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
                    return call_gemini_json(
                        system_prompt,
                        user_prompt,
                        model=settings.GEMINI_MODEL_MINI,
                        temperature=temperature,
                        max_tokens=min(max_tokens, 1800),
                        timeout_s=timeout_s,
                        metadata_out=metadata_out,
                    )

                # Otherwise, back off and retry OpenAI
                backoff = min(60, (2 ** (attempt - 1)) + random.random())
                logger.warning("[LLM] 429 rate-limited, backing off %ss", int(backoff))
                time.sleep(backoff)
                continue

            r.raise_for_status()
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            _note_openai_success()
            return safe_parse_json(
                content,
                repair_callback=lambda raw: _repair_json_with_openai(raw, model=model, timeout_s=min(60, timeout_s)),
            )

        except Exception as e:
            last_err = e
            if _is_dns_or_network_error(e):
                logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; not retrying (network/DNS)", attempt, e)
                break
            if not _is_retryable_exception(e):
                logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; not retrying (non-transient)", attempt, e)
                break
            backoff = min(60, (2 ** (attempt - 1)) + random.random())
            logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; backing off %ss", attempt, e, int(backoff))
            time.sleep(backoff)

    # If we exhausted retries and Gemini is available, make a last attempt on Gemini.
    if _should_fallback_to_gemini():
        logger.warning("[LLM] OpenAI exhausted retries -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=settings.GEMINI_MODEL_MINI,
            temperature=temperature,
            max_tokens=min(max_tokens, 1800),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )

    raise RuntimeError(str(last_err) if last_err else "OpenAI call failed")


def call_gemini_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0,
    max_tokens: int = 1200,
    timeout_s: int = 120,
    max_retries: int = 4,
    metadata_out: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Calls Google Gemini generateContent endpoint and returns parsed JSON.

    We keep this dependency-free (requests only). You can override model via env:
    - settings.GEMINI_MODEL_MINI (recommended for lightweight work)
    """
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("settings.GEMINI_API_KEY is missing")

    model = model or settings.GEMINI_MODEL_MINI
    if metadata_out is not None:
        metadata_out.clear()
        metadata_out.update({"provider": "gemini", "model": model, "attempts": 0, "retries": 0})
    provider_manager = LLMProviderManager()
    active_provider = provider_manager.get_active_provider(preferred="gemini")
    if active_provider == "openai":
        logger.warning("[LLM] Gemini unavailable -> routing to OpenAI (%s)", settings.OPENAI_MODEL)
        _set_metadata(metadata_out, provider="openai", fallback_from="gemini", reason="gemini_unavailable")
        return call_openai_json(
            system_prompt,
            user_prompt,
            model=getattr(settings, "OPENAI_MODEL", None),
            temperature=temperature,
            max_tokens=max_tokens,
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )
    if active_provider is None or not is_network_available("generativelanguage.googleapis.com"):
        _set_metadata(metadata_out, skipped=True, reason="network_unavailable")
        raise RuntimeError("Gemini unavailable: network unavailable")
    # v1beta is still the most compatible across projects
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"

    # Gemini REST supports system_instruction at top-level.
    body = {
        "system_instruction": {"parts": [{"text": system_prompt.strip()}]},
        "contents": [
            {"role": "user", "parts": [{"text": user_prompt.strip()}]}
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            # Encourage JSON-only responses
            "responseMimeType": "application/json",
        },
    }


    last_err: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("[LLM] call_gemini_json attempt=%s model=%s", attempt, model)
            if metadata_out is not None:
                metadata_out["attempts"] = attempt
                metadata_out["retries"] = max(0, attempt - 1)
            r = requests.post(url, json=body, timeout=timeout_s)

            # Gemini may rate-limit with 429 as well
            if r.status_code == 429:
                if attempt >= 2:
                    downgrade_llm_mode("Gemini 429 rate-limited")
                backoff = min(60, (2 ** (attempt - 1)) + random.random())
                logger.warning("[LLM] Gemini 429 rate-limited, backing off %ss", int(backoff))
                time.sleep(backoff)
                continue

            if r.status_code >= 400:
                # Log the response body to diagnose 400/401/403 invalid-argument errors.
                logger.warning("[LLM] Gemini error status=%s body=%s", r.status_code, (r.text or "")[:1000])
            r.raise_for_status()
            data = r.json()

            # Most common layout:
            # candidates[0].content.parts[0].text
            text = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
            )

            return safe_parse_json(
                text,
                repair_callback=lambda raw: _repair_json_with_openai(
                    raw,
                    model=getattr(settings, 'OPENAI_MODEL', None),
                    timeout_s=min(60, timeout_s),
                ),
            )

        except Exception as e:
            last_err = e
            if _is_dns_or_network_error(e):
                logger.warning("[LLM] Gemini call failed attempt=%s err=%s; not retrying (network/DNS)", attempt, e)
                break
            if not _is_retryable_exception(e):
                logger.warning("[LLM] Gemini call failed attempt=%s err=%s; not retrying (non-transient)", attempt, e)
                break
            backoff = min(60, (2 ** (attempt - 1)) + random.random())
            logger.warning("[LLM] Gemini call failed attempt=%s err=%s; backing off %ss", attempt, e, int(backoff))
            time.sleep(backoff)

    raise RuntimeError(str(last_err) if last_err else "Gemini call failed")


def call_llm_json(
    provider: str,
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 2000,
    timeout_s: int = 120,
    metadata_out: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Single entry-point for JSON outputs from the chosen provider."""
    provider = (provider or "").strip().lower()
    provider_manager = LLMProviderManager()
    if provider in ("", "auto"):
        selected = provider_manager.get_active_provider(preferred="openai")
        if not selected:
            _set_metadata(metadata_out, provider="none", skipped=True, reason="no_provider_available")
            raise RuntimeError("No LLM provider available")
        provider = selected
    elif provider in ("openai", "oai") and not provider_manager.can_use_openai():
        fallback = provider_manager.fallback_provider("openai")
        if not fallback:
            _set_metadata(metadata_out, provider="openai", skipped=True, reason="openai_unavailable")
            raise RuntimeError("OpenAI unavailable")
        provider = fallback
    elif provider in ("gemini", "google", "gcp") and not provider_manager.can_use_gemini():
        fallback = provider_manager.fallback_provider("gemini")
        if not fallback:
            _set_metadata(metadata_out, provider="gemini", skipped=True, reason="gemini_unavailable")
            raise RuntimeError("Gemini unavailable")
        provider = fallback
    if provider in ("openai", "oai"):
        return call_openai_json(
            system_prompt,
            user_prompt,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )
    if provider in ("gemini", "google", "gcp"):
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=model,
            temperature=temperature,
            max_tokens=min(max_tokens, 1800),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
        )
    raise ValueError(f"Unknown LLM provider: {provider!r}")
