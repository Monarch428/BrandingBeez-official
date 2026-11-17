from __future__ import annotations

import time
import urllib.parse
from typing import Any, Dict, Optional, Tuple

import requests

from app.core.config import settings
from app.core.logging import get_logger

# DB token store (best-effort)
try:
    from app.db.repositories.auth_tokens_repo import find_latest_google_tokens, update_google_tokens  # type: ignore
except Exception:  # pragma: no cover
    find_latest_google_tokens = None  # type: ignore
    update_google_tokens = None  # type: ignore

logger = get_logger(__name__)

TOKEN_URL = "https://oauth2.googleapis.com/token"
SITES_URL = "https://searchconsole.googleapis.com/webmasters/v3/sites"
SEARCH_ANALYTICS_TMPL = "https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"
GSC_ERROR_KEY = "_gsc_error"


def _unavailable(reason: str) -> Dict[str, Any]:
    """Return a safe, reportable diagnostic; never include token data."""
    return {GSC_ERROR_KEY: reason[:300]}


def _now_epoch() -> int:
    return int(time.time())


def _parse_expiry(doc: Dict[str, Any]) -> Optional[int]:
    """Return access token expiry as epoch seconds if present."""
    # Common field names you might be storing
    for k in ["expires_at", "expiresAt", "expiry_date", "expiryDate", "expires_on", "expiresOn"]:
        v = doc.get(k)
        if v is None:
            continue
        # google oauthlib sometimes stores ms since epoch in "expiry_date"
        if isinstance(v, (int, float)):
            v_int = int(v)
            # Heuristic: if it's in ms, convert
            if v_int > 10_000_000_000:
                v_int = int(v_int / 1000)
            return v_int
        # datetime
        try:
            import datetime as _dt
            if isinstance(v, _dt.datetime):
                return int(v.timestamp())
        except Exception:
            pass
        # ISO string
        if isinstance(v, str) and v.strip():
            try:
                import datetime as _dt
                # allow 'Z'
                s = v.replace("Z", "+00:00")
                return int(_dt.datetime.fromisoformat(s).timestamp())
            except Exception:
                pass
    return None


def _extract_tokens(doc: Dict[str, Any]) -> Tuple[Optional[str], Optional[str], Optional[int]]:
    """Return (access_token, refresh_token, expires_at_epoch) from a token doc."""
    access = None
    refresh = None
    for k in ["access_token", "accessToken", "token", "accessTokenValue"]:
        if isinstance(doc.get(k), str) and doc.get(k).strip():
            access = doc.get(k).strip()
            break
    for k in ["refresh_token", "refreshToken"]:
        if isinstance(doc.get(k), str) and doc.get(k).strip():
            refresh = doc.get(k).strip()
            break
    exp = _parse_expiry(doc)
    return access, refresh, exp


def _refresh_access_token(refresh_token: str) -> Optional[Dict[str, Any]]:
    """Exchange refresh token -> new access token (and expiry)."""
    if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET and refresh_token):
        return None

    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }

    r = requests.post(TOKEN_URL, data=data, timeout=settings.HTTP_TIMEOUT_SEC)
    if r.status_code >= 400:
        logger.warning("[GSC] refresh token exchange failed: %s", r.text[:300])
        return None

    payload = r.json() or {}
    access_token = payload.get("access_token")
    expires_in = payload.get("expires_in")  
    if not access_token:
        return _unavailable("No customer-authorised Search Console access token was supplied.")
    expires_at = _now_epoch() + int(expires_in or 0) if expires_in else None

    return {"access_token": access_token, "expires_at": expires_at}


def _get_access_token() -> Optional[str]:
    """Get an access token from (1) env, (2) DB stored tokens, (3) refresh."""
    # 1) Explicit env override (good for dev)
    if settings.GOOGLE_REFRESH_TOKEN and settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
        refreshed = _refresh_access_token(settings.GOOGLE_REFRESH_TOKEN)
        if refreshed and refreshed.get("access_token"):
            return str(refreshed["access_token"])

    # 2) DB token doc
    if callable(find_latest_google_tokens):
        doc = find_latest_google_tokens()  # type: ignore
    else:
        doc = None

    if not doc:
        return None

    access, refresh, exp = _extract_tokens(doc)

    # Use access token if valid for at least 60s
    if access and exp and exp - _now_epoch() > 60:
        return access
    if access and not exp:
        # If no expiry stored, try using it; if it fails, pipeline will record data gap.
        return access

    # 3) Refresh using stored refresh token
    if refresh:
        refreshed = _refresh_access_token(refresh)
        if refreshed and refreshed.get("access_token"):
            new_access = str(refreshed["access_token"])
            updates: Dict[str, Any] = {
                "access_token": new_access,
            }
            if refreshed.get("expires_at"):
                updates["expires_at"] = refreshed["expires_at"]
                # Also write ms variant for convenience
                updates["expiry_date"] = int(refreshed["expires_at"]) * 1000
            try:
                if callable(update_google_tokens):
                    update_google_tokens(doc.get("_id"), updates)  # type: ignore
            except Exception:
                pass
            return new_access

    return None


def _pick_best_site_property(available_sites: list[dict], want: str) -> Optional[str]:
    """Find best matching siteUrl in GSC properties.

    - Prefer exact URL-prefix match (ignoring trailing slash)
    - Then try sc-domain property based on hostname
    """
    want = (want or "").strip()
    if not want:
        return None

    # Normalize for comparisons
    want_norm = want.lower().rstrip("/")
    candidates = []
    for s in available_sites:
        site_url = (s.get("siteUrl") or "").strip()
        if not site_url:
            continue
        candidates.append(site_url)

    # Exact match
    for c in candidates:
        if c.lower().rstrip("/") == want_norm:
            return c

    # Try domain property match if url-prefix property isn't available
    try:
        from urllib.parse import urlparse
        host = urlparse(want if want.startswith("http") else "https://" + want).netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        domain_prop = f"sc-domain:{host}"
        for c in candidates:
            if c.lower().rstrip("/") == domain_prop.lower().rstrip("/"):
                return c
    except Exception:
        pass

    # Fallback: first candidate
    return candidates[0] if candidates else None


def _canonical_landing_page(value: Any) -> str:
    """Remove tracking/query variants so GSC pages remain safe and useful."""
    try:
        parsed = urllib.parse.urlsplit(str(value or ""))
        if not parsed.scheme or not parsed.netloc:
            return str(value or "")
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path or "/", "", ""))
    except Exception:
        return str(value or "")


def _aggregate_landing_pages(rows: list[dict]) -> list[dict]:
    grouped: Dict[str, Dict[str, Any]] = {}
    for row in rows:
        page = _canonical_landing_page(row.get("page"))
        if not page:
            continue
        current = grouped.setdefault(page, {"page": page, "clicks": 0.0, "impressions": 0.0, "weighted_position": 0.0})
        clicks = float(row.get("clicks") or 0)
        impressions = float(row.get("impressions") or 0)
        current["clicks"] += clicks
        current["impressions"] += impressions
        current["weighted_position"] += float(row.get("position") or 0) * impressions
    out = []
    for item in grouped.values():
        impressions = item["impressions"]
        out.append({
            "page": item["page"],
            "clicks": int(item["clicks"]),
            "impressions": int(impressions),
            "ctr": (item["clicks"] / impressions) if impressions else 0,
            "position": (item["weighted_position"] / impressions) if impressions else None,
        })
    return sorted(out, key=lambda item: (item["clicks"], item["impressions"]), reverse=True)[:10]


def _performance_insights(totals: Dict[str, Any], top_queries: list[dict], top_pages: list[dict]) -> list[str]:
    clicks = int(totals.get("clicks") or 0)
    impressions = int(totals.get("impressions") or 0)
    position = totals.get("position")
    insights: list[str] = [f"Verified Search Console data shows {clicks} clicks from {impressions} impressions in the reporting period."]
    if isinstance(position, (int, float)) and 8 <= position <= 20:
        insights.append(f"Average position is {position:.1f}; prioritise pages and queries already close to page-one visibility before expanding into new topics.")
    if top_pages and impressions:
        homepage_impressions = next((int(row.get("impressions") or 0) for row in top_pages if str(row.get("page") or "").rstrip("/").count("/") <= 2), 0)
        if homepage_impressions / impressions >= 0.6:
            insights.append("Organic visibility is concentrated on the homepage; build and internally link focused service and agency-partner landing pages to distribute demand capture.")
    if top_queries:
        insights.append("Use the verified query list to refine title tags, H1s, FAQs, and dedicated landing pages; do not treat sampled third-party ranking data as a substitute for this first-party evidence.")
    return insights


def fetch_gsc_summary(
    site_url: str,
    days: int = 28,
    access_token_override: Optional[str] = None,
    property_override: Optional[str] = None,
    allow_shared_credentials: bool = False,
) -> Optional[Dict[str, Any]]:
    """Fetch Search Console performance summary for a site.

    Output schema is intentionally compact for your PDF:
      - totals: clicks, impressions, ctr, position
      - topQueries: list of {query, clicks, impressions, ctr, position}
      - topPages: list of {page, clicks, impressions, ctr, position}
      - dateRange: {start, end, days}

    Returns None on missing credentials or access issues.
    """
    # Customer-specific credentials take precedence. This lets a public report
    # use the visitor's approved property without exposing or persisting their
    # OAuth token in the browser or report data.
    # Never silently use an operator's Search Console account for a public
    # visitor's report. A shared credential remains available only to explicit
    # internal callers that opt in for controlled development/admin jobs.
    access_token = access_token_override or (_get_access_token() if allow_shared_credentials else None)
    if not access_token:
        return None

    # Date range (last N days)
    import datetime as _dt
    end = _dt.date.today().strftime("%Y-%m-%d")
    start = (_dt.date.today() - _dt.timedelta(days=days)).strftime("%Y-%m-%d")

    # If user configured exact property, honor it
    want_site = property_override or settings.GSC_SITE_URL or site_url

    try:
        # 1) list sites to identify property
        headers = {"Authorization": f"Bearer {access_token}"}
        r = requests.get(SITES_URL, headers=headers, timeout=settings.HTTP_TIMEOUT_SEC)
        if r.status_code >= 400:
            logger.warning("[GSC] sites list failed: %s", r.text[:200])
            return _unavailable(f"Google Search Console property lookup failed (HTTP {r.status_code}).")
        payload = r.json() or {}
        entries = payload.get("siteEntry") or []
        best_site = _pick_best_site_property(entries, want_site)
        if not best_site:
            return _unavailable("The authorised Google account has no matching Search Console property.")

        site_enc = urllib.parse.quote(best_site, safe="")
        url = SEARCH_ANALYTICS_TMPL.format(site=site_enc)

        def _post(dimensions: list[str], row_limit: int) -> dict:
            body = {"startDate": start, "endDate": end, "dimensions": dimensions, "rowLimit": row_limit}
            rr = requests.post(url, headers=headers, json=body, timeout=settings.HTTP_TIMEOUT_SEC)
            rr.raise_for_status()
            return rr.json() or {}

        # 2) top queries + top pages
        q_payload = _post(["query"], 10)
        # Request more rows before canonicalising URLs because Google can return
        # several tracking-token variants of the same landing page.
        p_payload = _post(["page"], 100)

        def _rows(payload: dict, key_name: str) -> list[dict]:
            out = []
            for row in (payload.get("rows") or []):
                keys = row.get("keys") or []
                out.append({
                    key_name: keys[0] if keys else None,
                    "clicks": row.get("clicks"),
                    "impressions": row.get("impressions"),
                    "ctr": row.get("ctr"),
                    "position": row.get("position"),
                })
            return out

        top_queries = _rows(q_payload, "query")
        top_pages = _aggregate_landing_pages(_rows(p_payload, "page"))

        # 3) totals
        totals_payload = _post([], 1)
        totals = (totals_payload.get("rows") or [{}])[0] if (totals_payload.get("rows") or []) else {}
        result = {
            "property": best_site,
            "dateRange": {"start": start, "end": end, "days": days},
            "totals": {
                "clicks": totals.get("clicks"),
                "impressions": totals.get("impressions"),
                "ctr": totals.get("ctr"),
                "position": totals.get("position"),
            },
            "topQueries": top_queries,
            "topPages": top_pages,
        }
        result["insights"] = _performance_insights(result["totals"], top_queries, top_pages)
        return result

    except Exception as e:
        logger.warning("[GSC] fetch failed: %s", str(e))
        return _unavailable(f"Google Search Console query failed: {str(e)}")
