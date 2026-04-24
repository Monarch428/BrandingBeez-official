from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, List, Optional

from app.llm.client import get_effective_llm_mode
from app.extractors.service_scraper_ext import scrape_services as scrape_services_heuristic

logger = logging.getLogger(__name__)


def _merge_services(*service_lists: Any) -> List[Dict[str, Any]]:
    merged: List[Dict[str, Any]] = []
    seen = set()
    for bucket in service_lists:
        if not isinstance(bucket, list):
            continue
        for item in bucket:
            if not isinstance(item, dict):
                continue
            name = str(item.get("name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            seen.add(key)
            merged.append(
                {
                    "name": name,
                    "description": str(item.get("description") or "").strip() or None,
                    "category": str(item.get("category") or "").strip() or None,
                    "source": item.get("source") or None,
                }
            )
    return merged


async def scrape_services_auto(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """Service scraper router with safe fallbacks.

    Production behavior:
    - In safe mode, use heuristic extractor only.
    - In richer mode, try LLM extraction but ALWAYS merge with heuristic extraction.
      This prevents empty or overly-thin service menus from collapsing downstream Sections 5 / 8 / 9.
    """

    heuristic = scrape_services_heuristic(
        website_url,
        internal_links=internal_links or [],
        max_pages=max_pages,
        timeout=timeout,
        url_hints=url_hints,
    ) or []

    mode = int(get_effective_llm_mode() or 2)
    if mode == 1:
        return heuristic

    try:
        from app.extractors.service_scraper_llm import scrape_services_llm

        llm_out = await scrape_services_llm(website_url, homepage_html=homepage_html, timeout_s=timeout)
        llm_services = llm_out.get("services") if isinstance(llm_out, dict) else []
        merged = _merge_services(llm_services, heuristic)
        return merged or heuristic
    except Exception as exc:
        logger.warning("[Services] Mode2 extraction failed, falling back to heuristic: %s", exc)
        return heuristic


def scrape_services_auto_sync(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            new_loop = asyncio.new_event_loop()
            try:
                return new_loop.run_until_complete(
                    scrape_services_auto(
                        website_url,
                        internal_links=internal_links,
                        homepage_html=homepage_html,
                        max_pages=max_pages,
                        timeout=timeout,
                        url_hints=url_hints,
                    )
                )
            finally:
                new_loop.close()
        return loop.run_until_complete(
            scrape_services_auto(
                website_url,
                internal_links=internal_links,
                homepage_html=homepage_html,
                max_pages=max_pages,
                timeout=timeout,
                url_hints=url_hints,
            )
        )
    except RuntimeError:
        return asyncio.run(
            scrape_services_auto(
                website_url,
                internal_links=internal_links,
                homepage_html=homepage_html,
                max_pages=max_pages,
                timeout=timeout,
                url_hints=url_hints,
            )
        )
