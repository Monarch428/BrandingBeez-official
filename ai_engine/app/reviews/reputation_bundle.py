from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict

from app.reviews.ext_sources import scrape_clutch_company, scrape_trustpilot_reviews


logger = logging.getLogger(__name__)


async def build_reputation_bundle(
    *,
    company_name: str,
    website_url: str,
    google_places_bundle: Dict[str, Any] | None = None,
    criteria: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Build Reputation & Trust bundle.

    Primary (attempt): Google Places + Clutch + Trustpilot
    Fallback: existing Google-only (ai_engine current) bundle

    Contract: never raise; always return dict.
    """

    criteria = criteria or {}

    # current google bundle (from places_finder) is our safest baseline
    google_only: Dict[str, Any] = google_places_bundle or {}

    # Primary attempt: run Clutch + Trustpilot independently.
    # Requirement: if one fails, still return the other(s) + google.
    clutch: Any = None
    clutch_error: str | None = None
    trustpilot_reviews: list = []
    trustpilot_error: str | None = None

    # Trustpilot URL: best-effort from domain
    domain = None
    try:
        from app.core.utils import normalize_url

        n = normalize_url(website_url)
        domain = n.replace("https://", "").replace("http://", "").split("/")[0]
        if domain.startswith("www."):
            domain = domain[4:]
    except Exception:
        domain = None

    tp_url = f"https://www.trustpilot.com/review/{domain}" if domain else None

    # Schedule tasks with soft timeouts so the pipeline doesn't hang.
    loop = asyncio.get_event_loop()
    clutch_task: asyncio.Task | None = None
    tp_future = None

    try:
        clutch_task = asyncio.create_task(scrape_clutch_company(company_name))
    except Exception as e:
        clutch_error = str(e)

    try:
        if tp_url:
            # Trustpilot scraper is sync; run in thread pool to avoid blocking
            tp_future = loop.run_in_executor(None, scrape_trustpilot_reviews, tp_url, 2)
    except Exception as e:
        trustpilot_error = str(e)

    # Await clutch
    if clutch_task is not None:
        try:
            clutch = await asyncio.wait_for(clutch_task, timeout=25)
        except Exception as e:
            clutch = None
            clutch_error = str(e)

    # Await trustpilot
    if tp_future is not None:
        try:
            trustpilot_reviews = await asyncio.wait_for(tp_future, timeout=25)
        except Exception as e:
            trustpilot_reviews = []
            trustpilot_error = str(e)

    # Decide mode
    any_extra_source = bool(clutch) or bool(trustpilot_reviews)
    if not any_extra_source:
        # Both failed or unavailable → google-only fallback
        return {
            "mode": "google_only",
            "sources": {"google": google_only},
            "fallback_reason": "both_clutch_and_trustpilot_failed",
            "errors": {
                "clutch": clutch_error,
                "trustpilot": trustpilot_error,
            },
        }

    mode = "full" if (bool(clutch) and bool(trustpilot_reviews)) else "partial"
    return {
        "mode": mode,
        "sources": {
            "google": google_only,
            "clutch": clutch,
            "trustpilot": {
                "url": tp_url,
                "reviews_sample": (trustpilot_reviews or [])[:20],
                "count_sample": len(trustpilot_reviews or []),
            },
        },
        "errors": {
            "clutch": clutch_error,
            "trustpilot": trustpilot_error,
        },
    }


def build_reputation_bundle_sync(
    *,
    company_name: str,
    website_url: str,
    google_places_bundle: Dict[str, Any] | None = None,
    criteria: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Sync wrapper for pipeline code."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            new_loop = asyncio.new_event_loop()
            try:
                return new_loop.run_until_complete(
                    build_reputation_bundle(
                        company_name=company_name,
                        website_url=website_url,
                        google_places_bundle=google_places_bundle,
                        criteria=criteria,
                    )
                )
            finally:
                new_loop.close()
        return loop.run_until_complete(
            build_reputation_bundle(
                company_name=company_name,
                website_url=website_url,
                google_places_bundle=google_places_bundle,
                criteria=criteria,
            )
        )
    except RuntimeError:
        return asyncio.run(
            build_reputation_bundle(
                company_name=company_name,
                website_url=website_url,
                google_places_bundle=google_places_bundle,
                criteria=criteria,
            )
        )
