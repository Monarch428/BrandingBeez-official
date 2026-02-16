from __future__ import annotations

import json
import logging
import os
import re
import time
from typing import Any, Dict, List, Optional, Tuple

from app.integrations.dataforseo_client import DataForSEOClient

logger = logging.getLogger(__name__)

# Cache files (small JSON) to avoid repeated downloads
CACHE_DIR = os.getenv("D4S_CACHE_DIR", "/tmp")
SERP_LOC_CACHE = os.path.join(CACHE_DIR, "d4s_serp_google_locations.json")
ADS_LOC_CACHE = os.path.join(CACHE_DIR, "d4s_google_ads_locations.json")

# Cache TTL (seconds)
CACHE_TTL = int(os.getenv("D4S_LOCATIONS_CACHE_TTL_SEC", str(30 * 24 * 3600)))  # 30 days


def _now() -> int:
    return int(time.time())


def _read_cache(path: str) -> Optional[Dict[str, Any]]:
    try:
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        ts = int(data.get("_cached_at", 0))
        if ts and (_now() - ts) <= CACHE_TTL:
            return data
    except Exception:
        return None
    return None


def _write_cache(path: str, payload: Dict[str, Any]) -> None:
    try:
        payload = dict(payload or {})
        payload["_cached_at"] = _now()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f)
    except Exception:
        # non-fatal
        return


def _unwrap_locations(resp: Dict[str, Any]) -> List[Dict[str, Any]]:
    data = (resp or {}).get("json") if isinstance(resp, dict) else None
    if not isinstance(data, dict):
        return []
    tasks = data.get("tasks")
    if isinstance(tasks, list) and tasks:
        res = tasks[0].get("result")
        if isinstance(res, list) and res:
            # result can be list of dicts
            items = res[0].get("items") if isinstance(res[0], dict) else None
            if isinstance(items, list):
                return [it for it in items if isinstance(it, dict)]
            # sometimes result itself is items list
            if isinstance(res, list) and all(isinstance(x, dict) for x in res):
                return res
    return []


def _norm(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


def _guess_country(location: str) -> Optional[str]:
    s = _norm(location)
    # quick heuristics
    if any(k in s for k in ["india", "tamil nadu", "coimbatore", "chennai", "bangalore", "bengaluru", "mumbai", "delhi", "hyderabad", "pune", "kolkata"]):
        return "in"
    if any(k in s for k in ["united kingdom", "uk", "england", "london", "manchester", "birmingham", "scotland", "wales"]):
        return "gb"
    if any(k in s for k in ["united states", "usa", "us", "new york", "california", "texas", "los angeles", "chicago", "san francisco"]):
        return "us"
    if "australia" in s or "sydney" in s or "melbourne" in s:
        return "au"
    if "canada" in s or "toronto" in s or "vancouver" in s:
        return "ca"
    return None


def _best_match(items: List[Dict[str, Any]], query: str) -> Optional[Dict[str, Any]]:
    q = _norm(query)
    if not q:
        return None

    # score by:
    #  - exact contains
    #  - startswith
    #  - smaller location_name length (more specific tends to be shorter like "Coimbatore,Tamil Nadu,India")
    best: Tuple[int, int, Dict[str, Any]] | None = None

    for it in items:
        name = it.get("location_name") or it.get("location") or ""
        if not isinstance(name, str):
            continue
        n = _norm(name)

        score = 0
        if n == q:
            score += 100
        if q in n:
            score += 50
        if n.startswith(q):
            score += 20

        # penalty for very generic entries
        loc_type = str(it.get("location_type") or "").lower()
        if loc_type in ("country", "continent", "worldwide"):
            score -= 10

        if score <= 0:
            continue

        # tiebreaker: shorter name wins
        length = len(n)
        cand = (score, -length, it)
        if best is None or cand > best:
            best = cand

    return best[2] if best else None


def resolve_location_code(
    location: Optional[str],
    client: Optional[DataForSEOClient] = None,
    prefer: str = "serp",
) -> Optional[int]:
    """Resolve a plain-text location (e.g., 'Coimbatore') to a DataForSEO location_code.

    prefer:
      - 'serp' (default): uses /serp/google/locations (best for SERP tasks)
      - 'ads': uses /keywords_data/google_ads/locations (best for keyword volume tasks)
    """
    if not location or not str(location).strip():
        return None

    loc_text = str(location).strip()
    prefer = (prefer or "serp").strip().lower()
    c = client or DataForSEOClient()

    country = _guess_country(loc_text)

    if prefer == "ads":
        cached = _read_cache(ADS_LOC_CACHE)
        if cached:
            items = cached.get("items") or []
        else:
            resp = c.keywords_google_ads_locations()
            items = _unwrap_locations(resp)
            _write_cache(ADS_LOC_CACHE, {"items": items})
        match = _best_match(items, loc_text)
        code = match.get("location_code") if isinstance(match, dict) else None
        try:
            return int(code) if code is not None else None
        except Exception:
            return None

    # SERP
    cached = _read_cache(SERP_LOC_CACHE)
    if cached and (country is None or cached.get("country") == country):
        items = cached.get("items") or []
    else:
        resp = c.serp_google_locations(country=country)
        items = _unwrap_locations(resp)
        # store country-specific cache separately to avoid mixing
        _write_cache(SERP_LOC_CACHE, {"items": items, "country": country})

    match = _best_match(items, loc_text)
    code = match.get("location_code") if isinstance(match, dict) else None
    try:
        return int(code) if code is not None else None
    except Exception:
        return None
