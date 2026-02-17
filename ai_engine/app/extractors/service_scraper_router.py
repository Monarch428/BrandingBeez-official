from __future__ import annotations

import logging
import asyncio
from typing import Any, Dict, List, Optional

from app.llm.client import get_effective_llm_mode

# fallback heuristic scraper (existing)
from app.extractors.service_scraper_ext import scrape_services as scrape_services_heuristic

logger = logging.getLogger(__name__)


async def scrape_services_auto(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 8,
    timeout: int = 45,
) -> List[Dict[str, Any]]:
    """Service scraper router.

    - Mode 2: attempt LLM-based extraction (homepage only) and return normalized services list
    - Mode 1: use existing heuristic multi-page scraper

    Any error in mode2 falls back to heuristic.
    """

    mode = int(get_effective_llm_mode() or 2)

    # Mode 1 always uses heuristic
    if mode == 1:
        return scrape_services_heuristic(
            website_url,
            internal_links=internal_links or [],
            max_pages=max_pages,
            timeout=timeout,
        ) or []

    # Mode 2: try richer extraction (then fallback)
    try:
        from app.extractors.service_scraper_llm import scrape_services_llm

        llm_out = await scrape_services_llm(website_url, homepage_html=homepage_html, timeout_s=timeout)
        services = llm_out.get("services") if isinstance(llm_out, dict) else None
        if isinstance(services, list) and services:
            # already normalized by scrape_services_llm
            return [s for s in services if isinstance(s, dict) and s.get("name")]
    except Exception as e:
        logger.warning("[Services] Mode2 extraction failed, falling back to heuristic: %s", str(e))

    # fallback heuristic
    return scrape_services_heuristic(
        website_url,
        internal_links=internal_links or [],
        max_pages=max_pages,
        timeout=timeout,
    ) or []


def scrape_services_auto_sync(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    homepage_html: Optional[str] = None,
    max_pages: int = 8,
    timeout: int = 45,
) -> List[Dict[str, Any]]:
    """Sync wrapper for pipeline code."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # run in a new loop if current is running (rare in this pipeline)
            new_loop = asyncio.new_event_loop()
            try:
                return new_loop.run_until_complete(
                    scrape_services_auto(
                        website_url,
                        internal_links=internal_links,
                        homepage_html=homepage_html,
                        max_pages=max_pages,
                        timeout=timeout,
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
            )
        )
    except RuntimeError:
        # no loop
        return asyncio.run(
            scrape_services_auto(
                website_url,
                internal_links=internal_links,
                homepage_html=homepage_html,
                max_pages=max_pages,
                timeout=timeout,
            )
        )
