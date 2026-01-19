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
    expires_in = payload.get("expires_in")  # seconds
    if not access_token:
        return None
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


def fetch_gsc_summary(site_url: str, days: int = 28) -> Optional[Dict[str, Any]]:
    """Fetch Search Console performance summary for a site.

    Output schema is intentionally compact for your PDF:
      - totals: clicks, impressions, ctr, position
      - topQueries: list of {query, clicks, impressions, ctr, position}
      - topPages: list of {page, clicks, impressions, ctr, position}
      - dateRange: {start, end, days}

    Returns None on missing credentials or access issues.
    """
    access_token = _get_access_token()
    if not access_token:
        return None

    # Date range (last N days)
    import datetime as _dt
    end = _dt.date.today().strftime("%Y-%m-%d")
    start = (_dt.date.today() - _dt.timedelta(days=days)).strftime("%Y-%m-%d")

    # If user configured exact property, honor it
    want_site = settings.GSC_SITE_URL or site_url

    try:
        # 1) list sites to identify property
        headers = {"Authorization": f"Bearer {access_token}"}
        r = requests.get(SITES_URL, headers=headers, timeout=settings.HTTP_TIMEOUT_SEC)
        if r.status_code >= 400:
            logger.warning("[GSC] sites list failed: %s", r.text[:200])
            return None
        payload = r.json() or {}
        entries = payload.get("siteEntry") or []
        best_site = _pick_best_site_property(entries, want_site)
        if not best_site:
            return None

        site_enc = urllib.parse.quote(best_site, safe="")
        url = SEARCH_ANALYTICS_TMPL.format(site=site_enc)

        def _post(dimensions: list[str], row_limit: int) -> dict:
            body = {"startDate": start, "endDate": end, "dimensions": dimensions, "rowLimit": row_limit}
            rr = requests.post(url, headers=headers, json=body, timeout=settings.HTTP_TIMEOUT_SEC)
            rr.raise_for_status()
            return rr.json() or {}

        # 2) top queries + top pages
        q_payload = _post(["query"], 10)
        p_payload = _post(["page"], 10)

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
        top_pages = _rows(p_payload, "page")

        # 3) totals
        totals_payload = _post([], 1)
        totals = (totals_payload.get("rows") or [{}])[0] if (totals_payload.get("rows") or []) else {}
        return {
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

    except Exception as e:
        logger.warning("[GSC] fetch failed: %s", str(e))
        return None
