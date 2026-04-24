import ast
import json
import logging
import random
import re
import time
import threading
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests

from app.core.config import settings
from app.core.network import is_network_available
from app.llm.provider_manager import LLMProviderManager

logger = logging.getLogger(__name__)
logger.warning("[LLM_DEBUG] client.py loaded from=%s", __file__)
logger.warning("[LLM_DEBUG] helper_defined_initial _should_use_openai_repair=%s", "_should_use_openai_repair" in globals())

_openai_sem = threading.Semaphore(max(1, int(getattr(settings, "OPENAI_MAX_CONCURRENT", 1))))
_state_lock = threading.Lock()
_provider_last_call_at: Dict[str, float] = {"openai": 0.0, "gemini": 0.0}
_openai_429_strikes: int = 0
_openai_circuit_open_until: float = 0.0
_llm_mode_override: int | None = None


def get_effective_llm_mode() -> int:
    global _llm_mode_override
    try:
        base = int(getattr(settings, "LLM_MODE", 2))
    except Exception:
        base = 2
    return base if _llm_mode_override is None else int(_llm_mode_override)


def downgrade_llm_mode(reason: str = "") -> None:
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
    global _openai_429_strikes, _openai_circuit_open_until
    threshold = int(getattr(settings, "OPENAI_429_STRIKE_THRESHOLD", 2))
    cooldown = int(getattr(settings, "OPENAI_CIRCUIT_BREAKER_COOLDOWN_SEC", 60))
    with _state_lock:
        _openai_429_strikes += 1
        if _openai_429_strikes >= max(1, threshold):
            _openai_circuit_open_until = time.time() + max(5, cooldown)
            logger.warning(
                "[LLM] OpenAI circuit-breaker OPEN for %ss after %s consecutive 429s",
                cooldown,
                _openai_429_strikes,
            )
            downgrade_llm_mode("OpenAI sustained 429s")


def _should_fallback_to_gemini() -> bool:
    return bool(getattr(settings, "OPENAI_FALLBACK_TO_GEMINI_ON_429", True)) and bool(settings.GEMINI_API_KEY)


def _set_metadata(metadata_out: Optional[Dict[str, Any]], **values: Any) -> None:
    if metadata_out is not None:
        metadata_out.update(values)


def _compute_backoff_seconds(attempt: int, *, base_delay: float, max_delay: float) -> float:
    exp = base_delay * (2 ** max(0, attempt - 1))
    jitter = random.uniform(0.25, 1.0)
    return min(max_delay, exp + jitter)


def _should_use_openai_repair() -> bool:
    enabled = bool(getattr(settings, "OPENAI_REPAIR_ENABLED", True))
    circuit_open = _circuit_is_open()
    allow_when_open = bool(getattr(settings, "OPENAI_REPAIR_WHEN_CIRCUIT_OPEN", False))
    has_key = bool(getattr(settings, "OPENAI_API_KEY", None))
    logger.warning(
        "[LLM_DEBUG] _should_use_openai_repair enabled=%s circuit_open=%s allow_when_open=%s has_key=%s",
        enabled,
        circuit_open,
        allow_when_open,
        has_key,
    )
    if not enabled:
        return False
    if circuit_open and not allow_when_open:
        return False
    return has_key


def _truncate_prompt_text(text: str) -> str:
    text = (text or "").strip()
    limit = int(getattr(settings, "LLM_REPAIR_MAX_CHARS", 12000) or 12000)
    return text[-limit:] if len(text) > limit else text



def _trim_with_limit(label: str, text: str, limit: int) -> str:
    text = (text or "").strip()
    if limit <= 0 or len(text) <= limit:
        return text
    trimmed = text[:limit].rstrip()
    logger.warning(
        "[LLM_DEBUG] trimming text setting=%s original_chars=%s trimmed_chars=%s",
        label,
        len(text),
        len(trimmed),
    )
    return trimmed


def _prepare_prompt_pair(system_prompt: str, user_prompt: str) -> tuple[str, str]:
    system_prompt = _trim_with_limit(
        "LLM_MAX_SYSTEM_PROMPT_CHARS",
        system_prompt,
        int(getattr(settings, "LLM_MAX_SYSTEM_PROMPT_CHARS", 6000) or 6000),
    )
    user_limit = int(getattr(settings, "LLM_MAX_USER_PROMPT_CHARS", 20000) or 20000)
    system_limit = int(getattr(settings, "LLM_MAX_SYSTEM_PROMPT_CHARS", 6000) or 6000)
    total_limit = int(getattr(settings, "LLM_MAX_TOTAL_PROMPT_CHARS", 26000) or 26000)
    budget_for_user = max(1000, min(user_limit, total_limit - min(system_limit, len(system_prompt))))
    user_prompt = _trim_with_limit("LLM_MAX_USER_PROMPT_CHARS", user_prompt, budget_for_user)
    if len(system_prompt) + len(user_prompt) > total_limit:
        user_budget = max(1000, total_limit - len(system_prompt))
        user_prompt = _trim_with_limit("LLM_MAX_TOTAL_PROMPT_CHARS", user_prompt, user_budget)
    return system_prompt, user_prompt


def _prepare_llm_text(text: str, *, limit_setting: str, default_limit: int) -> str:
    text = (text or "").strip()
    limit = int(getattr(settings, limit_setting, default_limit) or default_limit)
    if limit > 0 and len(text) > limit:
        logger.warning("[LLM] trimming text setting=%s original_chars=%s trimmed_chars=%s", limit_setting, len(text), limit)
        return text[:limit]
    return text


def _prepare_llm_prompts(system_prompt: str, user_prompt: str) -> tuple[str, str]:
    # Raised defaults so Gemini receives full business context without truncation.
    # These match the values in config.py (LLM_MAX_SYSTEM_PROMPT_CHARS=6000, etc.)
    # Old defaults (2000/7000/9000) were cutting context and producing thin reports.
    system_prompt = _prepare_llm_text(system_prompt, limit_setting="LLM_MAX_SYSTEM_PROMPT_CHARS", default_limit=6000)
    user_prompt = _prepare_llm_text(user_prompt, limit_setting="LLM_MAX_USER_PROMPT_CHARS", default_limit=20000)
    total_limit = int(getattr(settings, "LLM_MAX_TOTAL_PROMPT_CHARS", 26000) or 26000)
    total = len(system_prompt or "") + len(user_prompt or "")
    if total_limit > 0 and total > total_limit:
        keep_user = max(2000, total_limit - len(system_prompt or ""))
        if len(user_prompt or "") > keep_user:
            logger.warning(
                "[LLM] trimming combined prompt original_total_chars=%s target_total_chars=%s kept_user_chars=%s",
                total, total_limit, keep_user,
            )
            user_prompt = (user_prompt or "")[:keep_user]
    return (system_prompt or "").strip(), (user_prompt or "").strip()


def _build_strict_json_retry_prompt(user_prompt: str) -> str:
    return (
        (user_prompt or "")
        + "\n\nIMPORTANT: Return ONLY a single valid JSON object."
        + "\nNo markdown fences. No commentary. No trailing commas. Double-quoted keys and strings only."
        + "\nKeep the response compact and complete."
        + "\nDo NOT use placeholders like A1, O1, Seg1, Pain1, Act1, V1, T1, W1."
        + "\nEvery string must be meaningful business wording, not shorthand."
        + "\nPrefer 1-2 short sentences or 3-6 short items per field, not long prose."
    )


def _normalize_expected_keys(expected_keys: Optional[Iterable[str]]) -> List[str]:
    return [str(k).strip() for k in (expected_keys or []) if str(k).strip()]


def _build_smallest_valid_json_retry_prompt(expected_keys: Optional[Iterable[str]] = None) -> str:
    keys = _normalize_expected_keys(expected_keys)
    rendered = ", ".join(keys) if keys else "the expected keys"
    return (
        "Return the SMALLEST valid JSON object that satisfies the schema. "
        "Use short strings. Omit optional commentary. "
        "Do not pretty-print. Do not add blank lines. "
        f"Top-level keys allowed: {rendered}."
    )

def _build_gemini_shape_retry_prompt(user_prompt: str, expected_keys: Optional[Iterable[str]] = None) -> str:
    keys = _normalize_expected_keys(expected_keys)
    base = _build_strict_json_retry_prompt(user_prompt)
    if not keys:
        return base
    rendered = ", ".join(keys)
    return (
        base
        + "\n\nCRITICAL SHAPE REQUIREMENT: The top-level response MUST be a single JSON object."
        + f"\nAllowed/expected top-level keys: {rendered}."
        + "\nDo not wrap the response in data/result/response/json/report objects."
        + "\nDo not return a top-level array."
        + "\nDo not return RFC6902 JSON Patch operations unless explicitly requested."
    )


def _debug_helper_defined(name: str) -> bool:
    present = name in globals()
    logger.warning("[LLM_DEBUG] helper_defined %s=%s", name, present)
    return present


def _enforce_provider_call_gap(provider: str) -> None:
    provider_key = (provider or "").strip().lower() or "unknown"
    min_gap_ms = int(getattr(settings, "LLM_MIN_CALL_GAP_MS", 0) or 0)
    if min_gap_ms <= 0:
        return
    sleep_for = 0.0
    with _state_lock:
        now = time.time()
        last_at = float(_provider_last_call_at.get(provider_key, 0.0) or 0.0)
        elapsed = now - last_at
        min_gap_s = min_gap_ms / 1000.0
        if elapsed < min_gap_s:
            sleep_for = min_gap_s - elapsed
        _provider_last_call_at[provider_key] = now + sleep_for
    if sleep_for > 0:
        logger.info("[LLM] pacing provider=%s sleep_ms=%s", provider_key, int(sleep_for * 1000))
        time.sleep(sleep_for)


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


def _payload_matches_expected_shape(payload: Dict[str, Any], expected_keys: Optional[Iterable[str]] = None) -> bool:
    keys = _normalize_expected_keys(expected_keys)
    if not keys:
        return bool(payload)
    return isinstance(payload, dict) and any(k in payload for k in keys)


def _strip_control_chars(text: str) -> str:
    if not text:
        return ""
    return "".join(ch for ch in text if ch in "\n\r\t" or ord(ch) >= 32)


def _extract_balanced_json_block(text: str) -> str | None:
    text = text or ""
    start = -1
    start_ch = ""
    for i, ch in enumerate(text):
        if ch in "{[":
            start = i
            start_ch = ch
            break
    if start < 0:
        return None

    stack = [start_ch]
    in_string = False
    escape = False
    for i in range(start + 1, len(text)):
        ch = text[i]
        if in_string:
            if escape:
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
            continue
        if ch in "{[":
            stack.append(ch)
            continue
        if ch in "}]":
            if not stack:
                return None
            open_ch = stack.pop()
            if (open_ch, ch) not in {("{", "}"), ("[", "]")}:
                return None
            if not stack:
                return text[start : i + 1]
    return None


def _extract_balanced_subblock(text: str) -> str | None:
    """Extract a balanced object/array from a fragment, trimming broken suffixes."""
    if not text:
        return None
    text = text.strip()
    for idx, ch in enumerate(text):
        if ch in "{[":
            block = _extract_balanced_json_block(text[idx:])
            if block:
                return block
    return None


def _extract_best_effort_balanced_prefix(text: str) -> str | None:
    """Return the longest balanced prefix from the first object/array start, even if the tail is broken."""
    if not text:
        return None
    text = text.strip()
    start = -1
    opening = ""
    for i, ch in enumerate(text):
        if ch in "{[":
            start = i
            opening = ch
            break
    if start < 0:
        return None

    stack = [opening]
    in_string = False
    escape = False
    last_balanced_end = -1

    for i in range(start + 1, len(text)):
        ch = text[i]
        if in_string:
            if escape:
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
            continue
        if ch in "{[":
            stack.append(ch)
            continue
        if ch in "}]":
            if not stack:
                break
            open_ch = stack.pop()
            if (open_ch, ch) not in {("{", "}"), ("[", "]")}:
                break
            if not stack:
                last_balanced_end = i + 1
                break

    if last_balanced_end > start:
        return text[start:last_balanced_end]
    return None


def _repair_member_fragment(value_text: str) -> str:
    """Repair a single top-level member fragment more aggressively than global cleanup."""
    candidate = _normalize_json_like_text(value_text)
    block = _extract_balanced_subblock(candidate) or _extract_best_effort_balanced_prefix(candidate)
    if block:
        candidate = block
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
    candidate = _escape_newlines_inside_strings(candidate)
    candidate = _sanitize_json_string_values(candidate)
    candidate = re.sub(r'[:,]\s*$', '', candidate)
    return candidate.strip()


def _escape_newlines_inside_strings(text: str) -> str:
    if not text:
        return text
    out: list[str] = []
    in_string = False
    escape = False
    for ch in text:
        if in_string:
            if escape:
                out.append(ch)
                escape = False
                continue
            if ch == "\\":
                out.append(ch)
                escape = True
                continue
            if ch == '"':
                out.append(ch)
                in_string = False
                continue
            if ch == "\n":
                out.append("\\n")
                continue
            if ch == "\r":
                out.append("\\r")
                continue
            if ch == "\t":
                out.append("\\t")
                continue
            out.append(ch)
            continue
        out.append(ch)
        if ch == '"':
            in_string = True
    return "".join(out)


def _sanitize_json_string_values(text: str) -> str:
    if not text:
        return text
    out: list[str] = []
    in_string = False
    escape = False
    for ch in text:
        if in_string:
            if escape:
                out.append(ch)
                escape = False
                continue
            if ch == "\\":
                out.append(ch)
                escape = True
                continue
            if ch == '"':
                out.append(ch)
                in_string = False
                continue
            if ord(ch) < 32 and ch not in "\n\r\t":
                continue
            if ch in ("\u2028", "\u2029"):
                out.append("\\n")
                continue
            out.append(ch)
            continue
        out.append(ch)
        if ch == '"':
            in_string = True
    return "".join(out)


def _looks_like_truncated_minimal_object(text: str) -> bool:
    text = (text or "").strip()
    if not text or len(text) > 80:
        return False
    return text.startswith("{\"financialImpact\":{\"mentor") or text.startswith("{\"financialImpact\": {\"mentor")


def _normalize_json_like_text(text: str) -> str:
    candidate = (text or "").strip().lstrip("\ufeff")
    candidate = _strip_control_chars(candidate)
    candidate = (
        candidate.replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
        .replace("\u00a0", " ")
        .replace("\ufeff", "")
    )
    candidate = re.sub(r"^\s*```(?:json)?\s*", "", candidate, flags=re.IGNORECASE)
    candidate = re.sub(r"\s*```\s*$", "", candidate)
    balanced = _extract_balanced_json_block(candidate)
    if balanced:
        candidate = balanced
    candidate = _escape_newlines_inside_strings(candidate)
    candidate = _sanitize_json_string_values(candidate)
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
    candidate = re.sub(r"\\\\{3,}", r"\\\\", candidate)
    return candidate


def _is_json_patch_operation(item: Any) -> bool:
    return isinstance(item, dict) and isinstance(item.get("op"), str) and isinstance(item.get("path"), str)


def _is_json_patch_list(payload: Any) -> bool:
    return isinstance(payload, list) and payload and all(_is_json_patch_operation(item) for item in payload)


def _decode_json_pointer_token(token: str) -> str:
    return str(token).replace("~1", "/").replace("~0", "~")


def _set_nested_patch_value(target: Dict[str, Any], path_parts: List[str], value: Any) -> None:
    if not path_parts:
        return
    cur: Any = target
    for idx, raw_part in enumerate(path_parts):
        part = _decode_json_pointer_token(raw_part)
        is_last = idx == len(path_parts) - 1
        if isinstance(cur, list):
            try:
                index = int(part)
            except Exception:
                return
            while len(cur) <= index:
                cur.append({})
            if is_last:
                cur[index] = value
                return
            if not isinstance(cur[index], (dict, list)):
                nxt = path_parts[idx + 1]
                cur[index] = [] if _decode_json_pointer_token(nxt).isdigit() else {}
            cur = cur[index]
            continue
        if not isinstance(cur, dict):
            return
        if is_last:
            cur[part] = value
            return
        nxt = path_parts[idx + 1]
        if part not in cur or not isinstance(cur[part], (dict, list)):
            cur[part] = [] if _decode_json_pointer_token(nxt).isdigit() else {}
        cur = cur[part]


def _convert_json_patch_list_to_object_patch(patch_ops: List[Dict[str, Any]]) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    for op in patch_ops:
        op_name = str(op.get("op") or "").strip().lower()
        path = str(op.get("path") or "").strip()
        if op_name not in {"add", "replace", "copy", "move", "test"}:
            continue
        if not path.startswith("/"):
            continue
        parts = [p for p in path.split("/") if p]
        if not parts:
            continue
        _set_nested_patch_value(out, parts, op.get("value"))
    return out


def _extract_gemini_text(payload: Any) -> str:
    if not isinstance(payload, dict):
        return ""
    candidates = payload.get("candidates")
    if not isinstance(candidates, list):
        return ""
    chunks: List[str] = []
    for cand in candidates:
        if not isinstance(cand, dict):
            continue
        direct = cand.get("output_text") or cand.get("text")
        if isinstance(direct, str) and direct.strip():
            chunks.append(direct.strip())
        content = cand.get("content")
        if isinstance(content, dict):
            parts = content.get("parts")
            if isinstance(parts, list):
                for part in parts:
                    if isinstance(part, dict):
                        part_text = part.get("text")
                        if isinstance(part_text, str) and part_text.strip():
                            chunks.append(part_text.strip())
    return "\n".join(chunks).strip()


def _extract_json_from_text(text: str) -> Any:
    normalized = _normalize_json_like_text(text)
    if not normalized:
        raise ValueError("Empty model output")

    try:
        parsed = json.loads(normalized)
        if isinstance(parsed, (dict, list)):
            return parsed
    except Exception as err:
        logger.warning("[LLM_DEBUG] parse_stage=raw_json_loads err=%s", err)
        if _looks_like_truncated_minimal_object(normalized):
            raise ValueError("Truncated minimal object from model output")

    balanced = _extract_balanced_json_block(normalized)
    if balanced:
        try:
            parsed = json.loads(balanced)
            if isinstance(parsed, (dict, list)):
                return parsed
        except Exception as err:
            logger.warning("[LLM_DEBUG] parse_stage=balanced_block_json_loads err=%s", err)

    m = re.search(r"```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```", normalized, flags=re.IGNORECASE)
    if m:
        block = _normalize_json_like_text(m.group(1))
        try:
            return json.loads(block)
        except Exception as err:
            logger.warning("[LLM_DEBUG] parse_stage=fenced_block_json_loads err=%s", err)

    m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", normalized)
    if m:
        block = _normalize_json_like_text(m.group(1))
        try:
            return json.loads(block)
        except Exception as err:
            logger.warning("[LLM_DEBUG] parse_stage=regex_block_json_loads err=%s", err)

    raise ValueError("Could not parse JSON from model output")


def _coerce_json_object(payload: Any) -> Dict[str, Any]:
    if isinstance(payload, dict):
        return payload
    if _is_json_patch_list(payload):
        converted = _convert_json_patch_list_to_object_patch(payload)
        logger.warning("[LLM] Parsed JSON Patch array; converted to nested object keys=%s", list(converted.keys()))
        return converted
    if isinstance(payload, list):
        if len(payload) == 1 and isinstance(payload[0], dict):
            first = payload[0]
            if _is_json_patch_operation(first):
                converted = _convert_json_patch_list_to_object_patch([first])
                logger.warning("[LLM] Parsed single JSON Patch item; converted to nested object keys=%s", list(converted.keys()))
                return converted
            logger.warning("[LLM] Parsed single-item JSON array; coercing first object")
            return first
        logger.warning("[LLM] Parsed JSON array where object was required; returning empty object")
        return {}
    return {}


def _lightweight_json_repair(raw_text: str) -> str:
    candidate = _normalize_json_like_text(raw_text)
    if not candidate:
        return "{}"
    block = _extract_balanced_json_block(candidate)
    if block:
        candidate = block
    candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
    candidate = _escape_newlines_inside_strings(candidate)
    candidate = _sanitize_json_string_values(candidate)
    return candidate


def _split_top_level_members(obj_text: str) -> List[Tuple[str, str]]:
    text = obj_text.strip()
    if not text.startswith("{") or not text.endswith("}"):
        return []
    inner = text[1:-1]
    parts: List[str] = []
    start = 0
    depth = 0
    in_string = False
    escape = False
    for i, ch in enumerate(inner):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
            continue
        if ch in "{[":
            depth += 1
            continue
        if ch in "}]":
            depth = max(0, depth - 1)
            continue
        if ch == "," and depth == 0:
            parts.append(inner[start:i].strip())
            start = i + 1
    last = inner[start:].strip()
    if last:
        parts.append(last)

    out: List[Tuple[str, str]] = []
    for part in parts:
        m = re.match(r'^\s*"([^"]+)"\s*:\s*([\s\S]+?)\s*$', part)
        if m:
            out.append((m.group(1), m.group(2)))
    return out


def _salvage_expected_key_members(raw_text: str, expected_keys: Optional[Iterable[str]]) -> Dict[str, Any]:
    keys = _normalize_expected_keys(expected_keys)
    if not keys:
        return {}
    normalized = _normalize_json_like_text(raw_text)
    block = _extract_balanced_json_block(normalized) or normalized
    if not block.strip().startswith("{"):
        return {}
    members = _split_top_level_members(block)
    if not members:
        return {}

    salvaged: Dict[str, Any] = {}
    wanted = set(keys)
    for key, value_src in members:
        if key not in wanted:
            continue

        candidate_variants: List[Tuple[str, str]] = []
        value_text = _normalize_json_like_text(value_src)
        candidate_variants.append(("json_loads_raw", value_text))

        repaired = _lightweight_json_repair(value_text)
        candidate_variants.append(("json_loads_repaired", repaired))

        member_repaired = _repair_member_fragment(value_text)
        if member_repaired != repaired:
            candidate_variants.append(("json_loads_member_repaired", member_repaired))

        balanced_member = _extract_balanced_subblock(member_repaired or repaired or value_text)
        if balanced_member and balanced_member not in {value_text, repaired, member_repaired}:
            candidate_variants.append(("json_loads_balanced_member", balanced_member))

        balanced_prefix = _extract_best_effort_balanced_prefix(member_repaired or repaired or value_text)
        if balanced_prefix and balanced_prefix not in {value_text, repaired, member_repaired, balanced_member}:
            candidate_variants.append(("json_loads_balanced_prefix", balanced_prefix))

        parsed_value = None
        for stage_name, candidate in candidate_variants:
            if not candidate:
                continue
            try:
                parsed_value = json.loads(candidate)
                salvaged[key] = parsed_value
                logger.warning("[LLM_DEBUG] salvage_stage=%s key=%s ok", stage_name, key)
                break
            except Exception as err:
                logger.warning("[LLM_DEBUG] salvage_stage=%s key=%s err=%s", stage_name, key, err)

        if parsed_value is not None:
            continue

        py_literal = re.sub(r"\bnull\b", "None", member_repaired, flags=re.IGNORECASE)
        py_literal = re.sub(r"\btrue\b", "True", py_literal, flags=re.IGNORECASE)
        py_literal = re.sub(r"\bfalse\b", "False", py_literal, flags=re.IGNORECASE)
        try:
            salvaged[key] = ast.literal_eval(py_literal)
            logger.warning("[LLM_DEBUG] salvage_stage=ast_literal_eval key=%s ok", key)
        except Exception as err:
            logger.warning("[LLM_DEBUG] salvage_stage=ast_literal_eval key=%s err=%s", key, err)

    if salvaged:
        logger.warning("[LLM_DEBUG] salvage_success keys=%s", list(salvaged.keys()))
    return salvaged


def safe_parse_json(
    raw_text: str,
    *,
    repair_callback: Any | None = None,
    expected_keys: Optional[Iterable[str]] = None,
) -> Dict[str, Any]:
    text = (raw_text or "").strip()
    logger.warning("[LLM_DEBUG] safe_parse_json input_len=%s repair_callback=%s", len(text), bool(repair_callback))
    if not text:
        return {}

    try:
        parsed = _coerce_json_object(_extract_json_from_text(text))
        if _payload_matches_expected_shape(parsed, expected_keys) or not _normalize_expected_keys(expected_keys):
            return parsed
    except Exception as err:
        logger.warning("[LLM_DEBUG] parse_stage=extract_json_from_text err=%s", err)

    repaired = _lightweight_json_repair(text)
    try:
        parsed = _coerce_json_object(json.loads(repaired))
        if _payload_matches_expected_shape(parsed, expected_keys) or not _normalize_expected_keys(expected_keys):
            return parsed
    except Exception as err:
        logger.warning("[LLM_DEBUG] parse_stage=repaired_json_loads err=%s", err)

    py_literal = re.sub(r"\bnull\b", "None", repaired, flags=re.IGNORECASE)
    py_literal = re.sub(r"\btrue\b", "True", py_literal, flags=re.IGNORECASE)
    py_literal = re.sub(r"\bfalse\b", "False", py_literal, flags=re.IGNORECASE)
    try:
        literal = ast.literal_eval(py_literal)
        parsed = _coerce_json_object(literal)
        if _payload_matches_expected_shape(parsed, expected_keys) or not _normalize_expected_keys(expected_keys):
            return parsed
    except Exception as err:
        logger.warning("[LLM_DEBUG] parse_stage=ast_literal_eval err=%s", err)

    salvaged = _salvage_expected_key_members(text, expected_keys)
    if _payload_matches_expected_shape(salvaged, expected_keys):
        return salvaged

    if repair_callback is not None:
        try:
            repaired_payload = repair_callback(text)
            parsed = _coerce_json_object(repaired_payload)
            if _payload_matches_expected_shape(parsed, expected_keys) or not _normalize_expected_keys(expected_keys):
                return parsed
        except Exception as repair_err:
            logger.warning("[LLM] JSON repair callback failed err=%s", repair_err)

    if _normalize_expected_keys(expected_keys):
        logger.warning("[LLM] Could not parse model JSON into expected keys=%s; returning empty object (len=%s)", _normalize_expected_keys(expected_keys), len(text))
    else:
        logger.warning("[LLM] Could not parse model JSON; returning empty object (len=%s)", len(text))
    return {}


def _repair_json_with_openai(raw_text: str, *, model: Optional[str] = None, timeout_s: int = 60) -> Dict[str, Any]:
    logger.warning("[LLM_DEBUG] _repair_json_with_openai called len=%s model=%s", len(raw_text or ""), model)
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("settings.OPENAI_API_KEY is missing (needed for JSON repair)")
    model = model or settings.OPENAI_MODEL

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    s = _truncate_prompt_text(raw_text)

    payload = {
        "model": model,
        "temperature": 0,
        "max_tokens": 2000,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "Fix the user content into a single valid JSON object. Output JSON only."},
            {"role": "user", "content": s},
        ],
    }
    _openai_sem.acquire()
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=timeout_s)
    finally:
        _openai_sem.release()
    r.raise_for_status()
    data = r.json()
    content = data["choices"][0]["message"]["content"]
    return safe_parse_json(content)


def call_openai_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 2600,
    timeout_s: int = 120,
    max_retries: int = 3,
    metadata_out: Optional[Dict[str, Any]] = None,
    expected_keys: Optional[Iterable[str]] = None,
) -> Dict[str, Any]:
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
            max_tokens=min(max_tokens, 3200),
            timeout_s=timeout_s,
            max_retries=max_retries,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
        )
    if active_provider is None or not is_network_available("api.openai.com"):
        _set_metadata(metadata_out, skipped=True, reason="network_unavailable")
        raise RuntimeError("OpenAI unavailable: network unavailable")

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    system_prompt, user_prompt = _prepare_prompt_pair(system_prompt, user_prompt)

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

    if _circuit_is_open() and _should_fallback_to_gemini():
        logger.warning("[LLM] OpenAI circuit-breaker is open -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=settings.GEMINI_MODEL_MINI,
            temperature=temperature,
            max_tokens=min(max_tokens, 3200),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
        )

    last_err: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("[LLM] call_openai_json attempt=%s model=%s", attempt, model)
            logger.warning(
                "[LLM_DEBUG] openai_call model=%s prompt_chars=%s max_tokens=%s circuit_open=%s llm_mode=%s",
                model, len(system_prompt or "") + len(user_prompt or ""), max_tokens, _circuit_is_open(), get_effective_llm_mode(),
            )
            if metadata_out is not None:
                metadata_out["attempts"] = attempt
                metadata_out["retries"] = max(0, attempt - 1)

            _enforce_provider_call_gap("openai")
            _openai_sem.acquire()
            try:
                r = requests.post(url, headers=headers, json=payload, timeout=timeout_s)
            finally:
                _openai_sem.release()

            if r.status_code == 429:
                body_preview = ""
                try:
                    body_preview = (r.text or "")[:1200]
                except Exception:
                    pass
                logger.warning("[LLM_DEBUG] openai_429 body=%s prompt_chars=%s max_tokens=%s model=%s", body_preview, len(system_prompt or "") + len(user_prompt or ""), max_tokens, model)
                _note_openai_429()
                if _circuit_is_open() and _should_fallback_to_gemini():
                    logger.warning("[LLM] OpenAI 429 -> circuit-breaker open -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
                    return call_gemini_json(
                        system_prompt,
                        user_prompt,
                        model=settings.GEMINI_MODEL_MINI,
                        temperature=temperature,
                        max_tokens=min(max_tokens, 3200),
                        timeout_s=timeout_s,
                        metadata_out=metadata_out,
                        expected_keys=expected_keys,
                    )
                backoff = _compute_backoff_seconds(
                    attempt,
                    base_delay=float(getattr(settings, "OPENAI_RETRY_BASE_DELAY_SEC", 2.0) or 2.0),
                    max_delay=float(getattr(settings, "OPENAI_RETRY_MAX_DELAY_SEC", 60) or 60.0),
                )
                logger.warning("[LLM] 429 rate-limited, backing off %ss", int(backoff))
                time.sleep(backoff)
                continue

            r.raise_for_status()
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            _note_openai_success()
            repair_cb = None
            if _debug_helper_defined("_should_use_openai_repair") and _should_use_openai_repair():
                repair_cb = lambda raw: _repair_json_with_openai(raw, model=model, timeout_s=min(60, timeout_s))
            return safe_parse_json(content, repair_callback=repair_cb, expected_keys=expected_keys)

        except Exception as e:
            last_err = e
            if _is_dns_or_network_error(e):
                logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; not retrying (network/DNS)", attempt, e)
                break
            if not _is_retryable_exception(e):
                logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; not retrying (non-transient)", attempt, e)
                break
            backoff = _compute_backoff_seconds(
                attempt,
                base_delay=float(getattr(settings, "OPENAI_RETRY_BASE_DELAY_SEC", 2.0) or 2.0),
                max_delay=float(getattr(settings, "OPENAI_RETRY_MAX_DELAY_SEC", 60) or 60.0),
            )
            logger.warning("[LLM] OpenAI call failed attempt=%s err=%s; backing off %ss", attempt, e, int(backoff))
            time.sleep(backoff)

    if _should_fallback_to_gemini():
        logger.warning("[LLM] OpenAI exhausted retries -> routing to Gemini (%s)", settings.GEMINI_MODEL_MINI)
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=settings.GEMINI_MODEL_MINI,
            temperature=temperature,
            max_tokens=min(max_tokens, 3200),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
        )

    raise RuntimeError(str(last_err) if last_err else "OpenAI call failed")


def call_gemini_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: Optional[str] = None,
    temperature: float = 0,
    max_tokens: int = 3200,
    timeout_s: int = 120,
    max_retries: int = 2,
    metadata_out: Optional[Dict[str, Any]] = None,
    expected_keys: Optional[Iterable[str]] = None,
    allow_openai_repair: bool = False,
) -> Dict[str, Any]:
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
            max_retries=max_retries,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
        )
    if active_provider is None or not is_network_available("generativelanguage.googleapis.com"):
        _set_metadata(metadata_out, skipped=True, reason="network_unavailable")
        raise RuntimeError("Gemini unavailable: network unavailable")

    # Single unified prompt preparation (removes double-trim that was causing excessive truncation)
    system_prompt, user_prompt = _prepare_llm_prompts(system_prompt, user_prompt)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
    body = {
        "system_instruction": {"parts": [{"text": system_prompt.strip()}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt.strip()}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "responseMimeType": "application/json",
        },
    }

    last_err: Exception | None = None
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("[LLM] call_gemini_json attempt=%s model=%s", attempt, model)
            logger.warning(
                "[LLM_DEBUG] gemini_call model=%s prompt_chars=%s max_tokens=%s helper_defined=%s",
                model, len(system_prompt or "") + len(user_prompt or ""), max_tokens, "_should_use_openai_repair" in globals(),
            )
            if metadata_out is not None:
                metadata_out["attempts"] = attempt
                metadata_out["retries"] = max(0, attempt - 1)

            _enforce_provider_call_gap("gemini")
            r = requests.post(url, json=body, timeout=timeout_s)

            if r.status_code == 429:
                if attempt >= 2:
                    downgrade_llm_mode("Gemini 429 rate-limited")
                backoff = _compute_backoff_seconds(
                    attempt,
                    base_delay=float(getattr(settings, "OPENAI_RETRY_BASE_DELAY_SEC", 2.0) or 2.0),
                    max_delay=float(getattr(settings, "OPENAI_RETRY_MAX_DELAY_SEC", 60) or 60.0),
                )
                logger.warning("[LLM] Gemini 429 rate-limited, backing off %ss", int(backoff))
                time.sleep(backoff)
                continue

            if r.status_code >= 400:
                logger.warning("[LLM] Gemini error status=%s body=%s", r.status_code, (r.text or "")[:1000])
            r.raise_for_status()
            data = r.json()

            text = _extract_gemini_text(data)
            logger.warning("[LLM_DEBUG] gemini_text_preview len=%s preview=%s", len(text), (text or "")[:240].replace("\n", " "))

            repair_callback = None
            if allow_openai_repair and _debug_helper_defined("_should_use_openai_repair") and _should_use_openai_repair():
                repair_callback = lambda raw: _repair_json_with_openai(
                    raw,
                    model=getattr(settings, "OPENAI_MODEL", None),
                    timeout_s=min(60, timeout_s),
                )

            parsed = safe_parse_json(text, repair_callback=repair_callback, expected_keys=expected_keys)
            if _payload_matches_expected_shape(parsed, expected_keys):
                return parsed

            if attempt < max_retries:
                logger.warning(
                    "[LLM] Gemini JSON shape mismatch on attempt=%s expected_keys=%s; retrying with stricter prompt",
                    attempt,
                    _normalize_expected_keys(expected_keys),
                )
                retry_prompt = (
                    _build_gemini_shape_retry_prompt(user_prompt, expected_keys)
                    + "\n\n"
                    + _build_smallest_valid_json_retry_prompt(expected_keys)
                )
                retry_prompt = _prepare_llm_text(
                    retry_prompt,
                    limit_setting="LLM_MAX_RETRY_PROMPT_CHARS",
                    default_limit=14000,
                )
                body["contents"] = [{"role": "user", "parts": [{"text": retry_prompt.strip()}]}]
                continue

            logger.warning(
                "[LLM] Gemini JSON parsed but missing expected keys=%s; returning parsed payload keys=%s",
                _normalize_expected_keys(expected_keys),
                list(parsed.keys()) if isinstance(parsed, dict) else [],
            )
            return parsed

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
    max_retries: int = 2,
    metadata_out: Optional[Dict[str, Any]] = None,
    expected_keys: Optional[Iterable[str]] = None,
    allow_openai_repair: bool = False,
) -> Dict[str, Any]:
    provider = (provider or "").strip().lower()
    provider_manager = LLMProviderManager()
    if provider in ("", "auto"):
        selected = provider_manager.get_active_provider(preferred="gemini")
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
            max_retries=max_retries,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
        )
    if provider in ("gemini", "google", "gcp"):
        return call_gemini_json(
            system_prompt,
            user_prompt,
            model=model,
            temperature=temperature,
            max_tokens=min(max_tokens, 3200),
            timeout_s=timeout_s,
            metadata_out=metadata_out,
            expected_keys=expected_keys,
            allow_openai_repair=allow_openai_repair,
        )
    raise ValueError(f"Unknown LLM provider: {provider!r}")