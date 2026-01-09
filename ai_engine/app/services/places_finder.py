from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple
import time
import urllib.parse

import requests

from app.core.config import settings
from app.core.http import http_get

# Simple in-memory cache (process-local)
# key -> (expires_at_epoch, value)
_CACHE: Dict[str, Tuple[float, Any]] = {}
_DEFAULT_TTL_SEC = 60 * 60  # 1 hour


class PlacesAPIError(RuntimeError):
    pass


def _cache_get(key: str) -> Optional[Any]:
    item = _CACHE.get(key)
    if not item:
        return None
    expires_at, value = item
    if expires_at < time.time():
        _CACHE.pop(key, None)
        return None
    return value


def _cache_set(key: str, value: Any, ttl_sec: int = _DEFAULT_TTL_SEC) -> None:
    _CACHE[key] = (time.time() + ttl_sec, value)


def _require_google_key() -> str:
    api_key = getattr(settings, "GOOGLE_API_KEY", None)
    if not api_key:
        raise PlacesAPIError(
            "GOOGLE_API_KEY is not configured. Add it to your .env (GOOGLE_API_KEY=...)."
        )
    return api_key


def text_search(service: str, location: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Google Places Text Search: returns raw place search results (trimmed)."""
    api_key = _require_google_key()

    service = (service or "").strip()
    location = (location or "").strip()
    if not service or not location:
        return []

    cache_key = f"places:text:{service.lower()}|{location.lower()}|{max_results}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    query = f"{service} in {location}"
    params = {
        "query": query,
        "key": api_key,
    }
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json?" + urllib.parse.urlencode(params)

    r = http_get(url)
    if r.status_code >= 400:
        raise PlacesAPIError(f"Places Text Search HTTP {r.status_code}: {r.text[:300]}")
    data = r.json()

    status = data.get("status")
    if status not in ("OK", "ZERO_RESULTS"):
        raise PlacesAPIError(f"Places Text Search error: status={status}, message={data.get('error_message')}")
    results = data.get("results", [])[: max_results or 5]

    trimmed: List[Dict[str, Any]] = []
    for p in results:
        trimmed.append(
            {
                "place_id": p.get("place_id"),
                "name": p.get("name"),
                "formatted_address": p.get("formatted_address") or p.get("vicinity"),
                "rating": p.get("rating"),
                "user_ratings_total": p.get("user_ratings_total"),
                "types": p.get("types") or [],
            }
        )

    _cache_set(cache_key, trimmed)
    return trimmed


def place_details(place_id: str, fields: str = "name,rating,user_ratings_total,website,formatted_address,international_phone_number,reviews", max_reviews: int = 5) -> Dict[str, Any]:
    """Google Place Details: returns selected fields."""
    api_key = _require_google_key()
    place_id = (place_id or "").strip()
    if not place_id:
        return {}

    cache_key = f"places:details:{place_id}:{fields}:{max_reviews}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    params = {
        "place_id": place_id,
        "fields": fields,
        "key": api_key,
    }
    url = "https://maps.googleapis.com/maps/api/place/details/json?" + urllib.parse.urlencode(params)
    r = http_get(url)
    if r.status_code >= 400:
        raise PlacesAPIError(f"Place Details HTTP {r.status_code}: {r.text[:300]}")
    data = r.json()

    status = data.get("status")
    if status != "OK":
        raise PlacesAPIError(f"Place Details error: status={status}, message={data.get('error_message')}")
    result = data.get("result", {}) or {}

    reviews = result.get("reviews") or []
    if isinstance(reviews, list) and max_reviews:
        reviews = reviews[: max_reviews]

    out = {
        "name": result.get("name"),
        "rating": result.get("rating"),
        "user_ratings_total": result.get("user_ratings_total"),
        "website": result.get("website"),
        "formatted_address": result.get("formatted_address"),
        "international_phone_number": result.get("international_phone_number"),
        "reviews": reviews,
    }
    _cache_set(cache_key, out)
    return out


def find_services(service: str, location: str, max_results: int = 5, max_reviews: int = 5) -> List[Dict[str, Any]]:
    """Orchestrates search + per-place details enrichment."""
    places = text_search(service=service, location=location, max_results=max_results)
    enriched: List[Dict[str, Any]] = []
    for p in places:
        pid = p.get("place_id")
        if not pid:
            continue
        details = place_details(pid, max_reviews=max_reviews)
        merged = {**p, **details}
        enriched.append(merged)
    return enriched


def _domain_from_url(url: str) -> str:
    try:
        u = urllib.parse.urlparse(url)
        host = (u.netloc or "").lower()
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""


def find_company_place(company_name: str, location: str | None = None, website: str | None = None) -> Dict[str, Any]:
    """Try to find the most likely Google Place for the company itself."""
    q = (company_name or "").strip()
    loc = (location or "").strip() if location else ""
    if not q:
        return {}
    # If we have a location, add it for disambiguation
    if loc:
        service = q
        location_use = loc
    else:
        # fall back to searching without location (less accurate)
        service = q
        location_use = "near me"  # legacy text search needs both; this is a harmless fallback
    candidates = find_services(service, location_use, max_results=5, max_reviews=10)

    target_domain = _domain_from_url(website or "")
    if target_domain:
        for c in candidates:
            c_domain = _domain_from_url(str(c.get("website") or ""))
            if c_domain and (c_domain == target_domain or target_domain in c_domain or c_domain in target_domain):
                return c
    return candidates[0] if candidates else {}


def build_google_reputation_bundle(service: str, location: str, company_name: str | None = None, company_website: str | None = None,
                                  max_results: int = 5, max_reviews: int = 5) -> Dict[str, Any]:
    """Return a bundle suitable for reputation analysis + competitive context."""
    bundle: Dict[str, Any] = {"query": {"service": service, "location": location}, "company": {}, "competitors": []}

    competitors = find_services(service, location, max_results=max_results, max_reviews=max_reviews)
    bundle["competitors"] = competitors

    if company_name:
        company = find_company_place(company_name, location=location, website=company_website)
        bundle["company"] = company

    return bundle


def to_review_analyzer_source(place: Dict[str, Any]) -> list[dict]:
    """Convert a Google place 'reviews' list into ReviewAnalyzer expected format."""
    out: list[dict] = []
    for r in (place or {}).get("reviews") or []:
        text = (r or {}).get("text") or ""
        rating = (r or {}).get("rating") or ""
        out.append({"rating": rating, "pros": text, "cons": ""})
    return out
