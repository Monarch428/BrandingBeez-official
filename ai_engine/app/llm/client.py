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


def _extract_json_from_text(text: str) -> Dict[str, Any]:
    """Best-effort JSON extraction.

    - If text is valid JSON -> returns it
    - Else tries to find the first {...} or [...] block and parse it
    """
    text = (text or "").strip()
    if not text:
        raise ValueError("Empty model output")

    # Direct parse
    try:
        parsed = json.loads(text)
        if isinstance(parsed, (dict, list)):
            return parsed  # type: ignore[return-value]
    except Exception:
        pass

    # Try fenced code block ```json ... ```
    m = re.search(r"```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```", text, flags=re.IGNORECASE)
    if m:
        return json.loads(m.group(1))

    # Try first object/array block
    m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if m:
        return json.loads(m.group(1))

    raise ValueError("Could not parse JSON from model output")



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
    return _extract_json_from_text(content)

def call_openai_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 2000,
    timeout_s: int = 120,
    max_retries: int = 6,
) -> Dict[str, Any]:
    """Calls OpenAI Chat Completions API and returns parsed JSON.

    NOTE: This uses a simple HTTP request to avoid SDK pinning issues.
    """
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("settings.OPENAI_API_KEY is missing")

    model = model or settings.OPENAI_MODEL

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
        )

    last_err: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("[LLM] call_openai_json attempt=%s model=%s", attempt, model)

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
            try:
                return _extract_json_from_text(content)
            except Exception as parse_err:
                logger.warning('[LLM] OpenAI returned non-parseable JSON; attempting repair err=%s', parse_err)
                return _repair_json_with_openai(content, model=model, timeout_s=min(60, timeout_s))

        except Exception as e:
            last_err = e
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
        )

    raise RuntimeError(str(last_err) if last_err else "OpenAI call failed")


def call_gemini_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 1200,
    timeout_s: int = 120,
    max_retries: int = 4,
) -> Dict[str, Any]:
    """Calls Google Gemini generateContent endpoint and returns parsed JSON.

    We keep this dependency-free (requests only). You can override model via env:
    - settings.GEMINI_MODEL_MINI (recommended for lightweight work)
    """
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("settings.GEMINI_API_KEY is missing")

    model = model or settings.GEMINI_MODEL_MINI
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

            try:
                return _extract_json_from_text(text)
            except Exception as parse_err:
                logger.warning('[LLM] Gemini returned non-parseable JSON; attempting repair via OpenAI err=%s', parse_err)
                return _repair_json_with_openai(text, model=getattr(settings, 'OPENAI_MODEL', None), timeout_s=min(60, timeout_s))

        except Exception as e:
            last_err = e
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
) -> Dict[str, Any]:
    """Single entry-point for JSON outputs from the chosen provider."""
    provider = (provider or "").strip().lower()
    if provider in ("openai", "oai"):
        return call_openai_json(
            system_prompt,
            user_prompt,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            timeout_s=timeout_s,
        )
    if provider in ("gemini", "google", "gcp"):
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=model,
            temperature=temperature,
            max_tokens=min(max_tokens, 1800),
            timeout_s=timeout_s,
        )
    raise ValueError(f"Unknown LLM provider: {provider!r}")