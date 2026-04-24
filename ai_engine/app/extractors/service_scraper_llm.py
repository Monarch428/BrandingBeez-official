from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional

import aiohttp
from bs4 import BeautifulSoup

from app.core.config import settings
from app.llm.client import call_llm_json


logger = logging.getLogger(__name__)


_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


async def _fetch(url: str, timeout_s: int = 20) -> str:
    timeout = aiohttp.ClientTimeout(total=max(5, int(timeout_s)))
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url, headers={"User-Agent": _UA}) as resp:
            if resp.status != 200:
                raise RuntimeError(f"fetch failed status={resp.status}")
            return await resp.text()


def _extract_priority_text(html: str, max_chars: int = 25000) -> str:
    soup = BeautifulSoup(html or "", "html.parser")
    for el in soup(["script", "style", "noscript", "svg", "header", "footer", "nav", "meta", "link"]):
        try:
            el.decompose()
        except Exception:
            pass

    # prioritize likely service sections
    priority = soup.find_all(
        ["main", "article", "section", "div"],
        class_=lambda x: x
        and any(k in str(x).lower() for k in ["service", "services", "solution", "what-we-do", "offer", "capabil"]),
    )
    if priority:
        text = " ".join([p.get_text(" ", strip=True) for p in priority[:10]])
    else:
        text = soup.get_text(" ", strip=True)

    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > max_chars:
        text = text[:max_chars]
    return text


def _services_prompt(url: str, text: str) -> str:
    return (
        "Extract the company's services from the website content. "
        "Return JSON only with keys: company_name (string|null), industry (string|null), services (array). "
        "Each service: name (string), description (string|null), category (string|null).\n\n"
        f"URL: {url}\n\n"
        f"CONTENT:\n{text}\n"
    )


async def scrape_services_llm(
    website_url: str,
    *,
    homepage_html: Optional[str] = None,
    timeout_s: int = 30,
) -> Dict[str, Any]:
    """Mode-2 services extractor.

    - Fetches homepage HTML if not provided
    - Extracts prioritized text (capped)
    - Calls LLM with response_format=json_object
    """

    html = homepage_html
    if not html:
        html = await _fetch(website_url, timeout_s=timeout_s)

    text = _extract_priority_text(html)
    if not text:
        return {"company_name": None, "industry": None, "services": []}

    model = getattr(settings, "GEMINI_MODEL_MINI", None) or getattr(settings, "OPENAI_MODEL", "gpt-4.1-mini")

    system = (
        "You are a precise extractor. Output valid JSON only. "
        "Be comprehensive but concise."
    )
    user = _services_prompt(website_url, text)

    try:
        data = call_llm_json(
            "auto",
            system,
            user,
            model=model,
            temperature=0,
            max_tokens=1800,
            timeout_s=max(30, int(timeout_s)),
        )
        if not isinstance(data, dict):
            return {"company_name": None, "industry": None, "services": []}
        services = data.get("services") if isinstance(data.get("services"), list) else []
        # normalize
        cleaned: List[Dict[str, Any]] = []
        seen = set()
        for s in services:
            if not isinstance(s, dict):
                continue
            name = (s.get("name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            seen.add(key)
            cleaned.append(
                {
                    "name": name,
                    "description": (s.get("description") or None),
                    "category": (s.get("category") or None),
                    "source": website_url,
                }
            )
        return {
            "company_name": data.get("company_name") or None,
            "industry": data.get("industry") or None,
            "services": cleaned,
        }
    except Exception as e:
        logger.warning("[Services] LLM extraction failed: %s", str(e))
        raise
