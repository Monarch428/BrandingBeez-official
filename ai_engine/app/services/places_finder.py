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


def _normalize_place_profile(place: Dict[str, Any]) -> Dict[str, Any]:
    place = place if isinstance(place, dict) else {}
    reviews = place.get("reviews") if isinstance(place.get("reviews"), list) else []
    return {
        "placeId": place.get("place_id") or place.get("placeId"),
        "name": place.get("name"),
        "rating": place.get("rating"),
        "reviewCount": place.get("user_ratings_total") or place.get("reviewCount") or 0,
        "website": place.get("website"),
        "address": place.get("formatted_address") or place.get("address"),
        "phone": place.get("international_phone_number") or place.get("phone"),
        "types": place.get("types") or [],
        "reviewsSample": reviews,
    }


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


def text_search(service: str, location: str | None, max_results: int = 5) -> List[Dict[str, Any]]:
    """Places API (New) Text Search, with legacy fallback for older projects."""
    api_key = _require_google_key()

    service = (service or "").strip()
    location = (location or "").strip()
    if not service:
        return []

    cache_key = f"places:text:{service.lower()}|{location.lower() if location else 'noloc'}|{max_results}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    query = f"{service} in {location}" if location else service
    # Prefer the supported Places API (New). It is what Google Cloud enables
    # for newly created projects and does not use query-string API keys.
    r = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        headers={"X-Goog-Api-Key": api_key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types"},
        json={"textQuery": query, "pageSize": min(max_results or 5, 20)},
        timeout=settings.HTTP_TIMEOUT_SEC,
    )
    if r.ok:
        results = r.json().get("places", [])
        trimmed = [{"place_id": p.get("id"), "name": (p.get("displayName") or {}).get("text"), "formatted_address": p.get("formattedAddress"), "rating": p.get("rating"), "user_ratings_total": p.get("userRatingCount"), "types": p.get("types") or []} for p in results]
        _cache_set(cache_key, trimmed)
        return trimmed

    # Some established projects still deliberately expose only legacy Places.
    params = {"query": query, "key": api_key}
    legacy = http_get("https://maps.googleapis.com/maps/api/place/textsearch/json?" + urllib.parse.urlencode(params))
    data = legacy.json() if legacy.ok else {}
    status = data.get("status")
    if status not in ("OK", "ZERO_RESULTS"):
        message = (r.json().get("error", {}).get("message") if r.headers.get("content-type", "").startswith("application/json") else r.text[:300])
        raise PlacesAPIError(f"Places Text Search error: status={status or r.status_code}, message={message or data.get('error_message')}")
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

    new_fields = "id,displayName,formattedAddress,rating,userRatingCount,websiteUri,internationalPhoneNumber,types,reviews"
    new_response = requests.get(
        f"https://places.googleapis.com/v1/places/{urllib.parse.quote(place_id, safe='')}",
        headers={"X-Goog-Api-Key": api_key, "X-Goog-FieldMask": new_fields}, timeout=settings.HTTP_TIMEOUT_SEC,
    )
    if new_response.ok:
        result = new_response.json()
        reviews = (result.get("reviews") or [])[:max_reviews]
        out = {"name": (result.get("displayName") or {}).get("text"), "rating": result.get("rating"), "user_ratings_total": result.get("userRatingCount"), "website": result.get("websiteUri"), "formatted_address": result.get("formattedAddress"), "international_phone_number": result.get("internationalPhoneNumber"), "reviews": reviews, "types": result.get("types") or []}
        _cache_set(cache_key, out)
        return out

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


def find_services(service: str, location: str | None, max_results: int = 5, max_reviews: int = 5) -> List[Dict[str, Any]]:
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
    target_domain = _domain_from_url(website or "")
    # A user can enter their personal name rather than the business name.
    # Add the website's registrable label as a search alias so the website
    # match remains the authority for selecting the Google Business Profile.
    domain_label = target_domain.split(".")[0].replace("-", " ") if target_domain else ""
    queries = list(dict.fromkeys(value for value in (q, domain_label) if value))
    if not queries:
        return {}
    # If we have a location, add it for disambiguation
    location_use = loc or "near me"
    candidates: List[Dict[str, Any]] = []
    seen_ids: set[str] = set()
    for query in queries:
        for candidate in find_services(query, location_use, max_results=5, max_reviews=10):
            candidate_id = str(candidate.get("place_id") or candidate.get("placeId") or "")
            if candidate_id and candidate_id in seen_ids:
                continue
            if candidate_id:
                seen_ids.add(candidate_id)
            candidates.append(candidate)

    if target_domain:
        for c in candidates:
            c_domain = _domain_from_url(str(c.get("website") or ""))
            if c_domain and (c_domain == target_domain or target_domain in c_domain or c_domain in target_domain):
                return c
    return candidates[0] if candidates else {}


def build_google_reputation_bundle(service: str, location: str | None, company_name: str | None = None, company_website: str | None = None,
                                  company_place_id: str | None = None, max_results: int = 5, max_reviews: int = 5) -> Dict[str, Any]:
    """Return a bundle suitable for reputation analysis + competitive context."""
    bundle: Dict[str, Any] = {"query": {"service": service, "location": location or ""}, "company": {}, "profile": {}, "competitors": []}

    # Competitor sweep only makes sense when location is known.
    if location:
        competitors = find_services(service, location, max_results=max_results, max_reviews=max_reviews)
        bundle["competitors"] = competitors

    if company_name or company_place_id:
        # A user-supplied Place ID wins over fuzzy text search. It is the most
        # reliable way to prevent a same-name business being selected.
        company = place_details(company_place_id, max_reviews=max_reviews) if company_place_id else find_company_place(company_name or "", location=location, website=company_website)
        bundle["company"] = company
        bundle["profile"] = _normalize_place_profile(company)

    return bundle


def to_review_analyzer_source(place: Dict[str, Any]) -> list[dict]:
    """Convert a Google place 'reviews' list into ReviewAnalyzer expected format."""
    def localized_text(value: Any) -> str:
        # Places API (New) provides review text as a LocalizedText object,
        # whereas the legacy API returned a direct string.
        if isinstance(value, str):
            return value
        if isinstance(value, dict):
            return str(value.get("text") or value.get("value") or "")
        return "" if value is None else str(value)

    out: list[dict] = []
    for r in (place or {}).get("reviews") or []:
        review = r or {}
        text = localized_text(review.get("text") or review.get("originalText") or review.get("original_text"))
        rating = review.get("rating") or ""
        attribution = review.get("authorAttribution") if isinstance(review.get("authorAttribution"), dict) else {}
        out.append({
            "rating": rating,
            "pros": text,
            "cons": "",
            "reviewer": review.get("author_name") or attribution.get("displayName") or "",
            "relativeTime": review.get("relative_time_description") or review.get("relativePublishTimeDescription") or "",
            "publishedAt": review.get("time") or review.get("publishTime") or "",
            "source": "google",
        })
    return out
