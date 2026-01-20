import time
import json
import requests
from requests.exceptions import ReadTimeout, ConnectionError
from app.core.config import settings


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

    # ✅ More tolerant defaults (override via env if you want)
    timeout_s = int(getattr(settings, "OPENAI_TIMEOUT_SECONDS", 240) or 240)  # 3 minutes
    max_attempts = int(getattr(settings, "OPENAI_MAX_RETRIES", 2) or 2)       # retry on transient network timeouts

    last_err: Exception | None = None

    for attempt in range(1, max_attempts + 1):
        try:
            r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout_s)

            if r.status_code >= 400:
                # keep your existing behavior
                raise RuntimeError(f"OpenAI error {r.status_code}: {r.text[:500]}")

            data = r.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)

        except (ReadTimeout, ConnectionError) as e:
            last_err = e
            if attempt < max_attempts:
                # small backoff (1.5s, then 3s, ...)
                time.sleep(1.5 * attempt)
                continue
            raise  # re-raise the last timeout/connection error
        except json.JSONDecodeError as e:
            # If the model returns something not valid JSON, surface the content for debugging
            snippet = ""
            try:
                snippet = (data.get("choices", [{}])[0].get("message", {}).get("content") or "")[:500]  # type: ignore[name-defined]
            except Exception:
                pass
            raise RuntimeError(f"OpenAI returned non-JSON content: {snippet}") from e
