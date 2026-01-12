import json
import asyncio
from typing import Any, Dict

from app.core.config import settings
from app.llm.client import call_openai_json

SYSTEM_PROMPT = """You are a senior web architecture analyzer.

Your task:
- Infer technologies used by a website for a specific CATEGORY (e.g., CMS, Frontend, Backend, CDN, etc.)
- Be conservative: do NOT hallucinate.
- If unclear, return Unknown with low confidence.
- Always return valid JSON.

Response rules:
- detected -> list of strings
- confidence -> float (0.0–1.0)
- reason -> short technical justification
"""


def _build_user_prompt(features: Dict[str, Any], category: str) -> str:
    html = (features.get("html") or "")
    scripts = features.get("scripts") or []
    cookies = features.get("cookies") or []
    headers = features.get("headers") or {}

    # Keep payload small; we only send a snippet
    html_snip = html[:2500]
    scripts_snip = scripts[:40]
    cookies_snip = cookies[:40]

    return f"""CATEGORY: {category}

URL: {features.get('url')}

HEADERS (subset): {json.dumps(dict(list(headers.items())[:30]))}

SCRIPTS (subset): {json.dumps(scripts_snip)}

COOKIES (subset): {json.dumps(cookies_snip)}

HTML Snippet:
{html_snip}

Return JSON ONLY in this format:
{{
  "detected": ["technology-name"],
  "confidence": 0.0,
  "reason": "technical justification"
}}

If technology is hidden, infer based on architecture patterns, but stay conservative.
"""


async def openai_infer_category(features: Dict[str, Any], category: str) -> Dict[str, Any]:
    """Infer tech for a category using the AI Engine's existing OpenAI JSON caller.

    This avoids adding the `openai` python SDK dependency.
    """
    prompt = _build_user_prompt(features, category)

    try:
        # call_openai_json is sync (requests). Run in a thread so our async analyzers remain non-blocking.
        result = await asyncio.to_thread(call_openai_json, SYSTEM_PROMPT, prompt, 700)

        detected = result.get("detected", ["Unknown"])
        if isinstance(detected, str):
            detected = [detected]
        if not isinstance(detected, list) or not detected:
            detected = ["Unknown"]

        try:
            confidence = float(result.get("confidence", 0.4))
        except Exception:
            confidence = 0.4

        reason = result.get("reason") or "Inferred from page structure"

        return {
            "detected": detected,
            "confidence": max(0.0, min(1.0, confidence)),
            "reason": str(reason)[:280],
        }

    except Exception as e:
        return {
            "detected": ["Unknown"],
            "confidence": 0.3,
            "reason": f"OpenAI inference failed: {str(e)}",
        }
