from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict, Optional

from app.reviews.ext_sources import scrape_clutch_company, scrape_trustpilot_reviews

logger = logging.getLogger(__name__)


def _get_first(criteria: Dict[str, Any], keys: list[str]) -> Optional[str]:
    for k in keys:
        v = criteria.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return None


async def build_reputation_bundle(
    *,
    company_name: str,
    website_url: str,
    google_places_bundle: Dict[str, Any] | None = None,
    criteria: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Build Reputation & Trust bundle.

    Primary (attempt): Google Places + Clutch + Trustpilot
    Contract: never raise; always return dict.
    """
    criteria = criteria or {}
    google_only: Dict[str, Any] = google_places_bundle or {}

    clutch: Any = None
    clutch_error: str | None = None
    trustpilot_reviews: list = []
    trustpilot_error: str | None = None

    # Prefer explicit URLs from criteria (DB-saved URLs)
    clutch_profile_url = _get_first(criteria, ["clutchProfileUrl", "clutchUrl", "clutch_profile_url"])
    trustpilot_url = _get_first(criteria, ["trustpilotUrl", "trustpilotReviewUrl", "trustpilot_profile_url"])

    # If Trustpilot URL not provided, derive from domain
    if not trustpilot_url:
        domain = None
        try:
            from app.core.utils import normalize_url

            n = normalize_url(website_url)
            domain = n.replace("https://", "").replace("http://", "").split("/")[0]
            if domain.startswith("www."):
                domain = domain[4:]
        except Exception:
            domain = None
        trustpilot_url = f"https://www.trustpilot.com/review/{domain}" if domain else None

    loop = asyncio.get_event_loop()
    clutch_task: asyncio.Task | None = None
    tp_future = None

    try:
        clutch_task = asyncio.create_task(scrape_clutch_company(company_name, clutch_profile_url))
    except Exception as e:
        clutch_error = str(e)

    try:
        if trustpilot_url:
            tp_future = loop.run_in_executor(None, scrape_trustpilot_reviews, trustpilot_url, 2)
    except Exception as e:
        trustpilot_error = str(e)

    if clutch_task is not None:
        try:
            clutch = await asyncio.wait_for(clutch_task, timeout=35)
        except Exception as e:
            clutch = None
            clutch_error = str(e)

    if tp_future is not None:
        try:
            trustpilot_reviews = await asyncio.wait_for(tp_future, timeout=35)
        except Exception as e:
            trustpilot_reviews = []
            trustpilot_error = str(e)

    any_extra_source = bool(clutch) or bool(trustpilot_reviews)
    if not any_extra_source:
        return {
            "mode": "google_only",
            "sources": {"google": google_only},
            "fallback_reason": "both_clutch_and_trustpilot_failed",
            "errors": {"clutch": clutch_error, "trustpilot": trustpilot_error},
        }

    mode = "full" if (bool(clutch) and bool(trustpilot_reviews)) else "partial"
    return {
        "mode": mode,
        "sources": {
            "google": google_only,
            "clutch": clutch,
            "trustpilot": {
                "url": trustpilot_url,
                "reviews_sample": (trustpilot_reviews or [])[:20],
                "count_sample": len(trustpilot_reviews or []),
            },
        },
        "errors": {"clutch": clutch_error, "trustpilot": trustpilot_error},
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
