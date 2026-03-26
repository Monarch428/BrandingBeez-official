from __future__ import annotations

import logging
import asyncio
from typing import Any, Dict, List, Optional

from app.llm.client import get_effective_llm_mode

# fallback heuristic scraper
from app.extractors.service_scraper_ext import scrape_services as scrape_services_heuristic

logger = logging.getLogger(__name__)


async def scrape_services_auto(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """Service scraper router with safe fallbacks."""

    mode = int(get_effective_llm_mode() or 2)

    if mode == 1:
        return scrape_services_heuristic(
            website_url,
            internal_links=internal_links or [],
            max_pages=max_pages,
            timeout=timeout,
            url_hints=url_hints,
        ) or []

    # Mode 2: try LLM extraction (then fallback)
    try:
        from app.extractors.service_scraper_llm import scrape_services_llm

        llm_out = await scrape_services_llm(website_url, homepage_html=homepage_html, timeout_s=timeout)
        services = llm_out.get("services") if isinstance(llm_out, dict) else None
        if isinstance(services, list) and services:
            return [s for s in services if isinstance(s, dict) and s.get("name")]
    except Exception as e:
        logger.warning("[Services] Mode2 extraction failed, falling back to heuristic: %s", str(e))

    return scrape_services_heuristic(
        website_url,
        internal_links=internal_links or [],
        max_pages=max_pages,
        timeout=timeout,
        url_hints=url_hints,
    ) or []


def scrape_services_auto_sync(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """Sync wrapper for pipeline code."""
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
