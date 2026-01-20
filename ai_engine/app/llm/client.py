import json
import time
import logging
import requests
from requests.exceptions import ReadTimeout, ConnectionError
from app.core.config import settings

logger = logging.getLogger(__name__)


def _extract_json_object(s: str) -> str | None:
    """Best-effort extraction of a single top-level JSON object from a string.

    This helps when the model outputs truncated/extra text around JSON.
    """
    if not s:
        return None
    start = s.find("{")
    if start == -1:
        return None
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(s)):
        ch = s[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        else:
            if ch == '"':
                in_str = True
                continue
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return s[start : i + 1]
    return None

def call_openai_json(system: str, user: str, max_tokens: int = 1800) -> dict:
    url = f"{settings.OPENAI_BASE_URL.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.OPENAI_MODEL,
        "temperature": 0.2,
        "max_tokens": max_tokens,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
    }

    # Option B reliability: retry transient network errors + 429
    max_attempts = int(getattr(settings, "OPENAI_MAX_RETRIES", 3) or 3)
    timeout_s = int(getattr(settings, "OPENAI_TIMEOUT_SECONDS", 120) or 120)

    last_err: Exception | None = None
    for attempt in range(1, max_attempts + 1):
        t0 = time.time()
        try:
            logger.info("[LLM] call_openai_json attempt=%s model=%s", attempt, settings.OPENAI_MODEL)
            r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout_s)

            # Rate limit -> backoff
            if r.status_code == 429:
                wait = min(2 ** attempt, 20)
                logger.warning("[LLM] 429 rate-limited, backing off %ss", wait)
                time.sleep(wait)
                continue

            if r.status_code >= 400:
                raise RuntimeError(f"OpenAI error {r.status_code}: {r.text[:500]}")

            data = r.json()
            content = data["choices"][0]["message"]["content"]

            try:
                return json.loads(content)
            except json.JSONDecodeError:
                extracted = _extract_json_object(content)
                if extracted:
                    return json.loads(extracted)
                snippet = (content or "")[:800]
                raise RuntimeError(f"OpenAI returned non-JSON content: {snippet}")

        except (ReadTimeout, ConnectionError) as e:
            last_err = e
            wait = min(2 ** attempt, 20)
            logger.warning("[LLM] network timeout/error: %s | retrying in %ss", str(e), wait)
            time.sleep(wait)
            continue
        except Exception as e:
            last_err = e
            logger.error("[LLM] call_openai_json failed attempt=%s in %.2fs: %s", attempt, time.time() - t0, str(e))
            # Non-transient -> don't spam retries
            if attempt >= max_attempts:
                break
            time.sleep(min(2 ** attempt, 10))

    raise RuntimeError(str(last_err) if last_err else "OpenAI call failed")
