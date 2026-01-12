from __future__ import annotations

import json
import time
import urllib.parse
from typing import Any, Dict, Optional

import requests

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

TOKEN_URL = "https://oauth2.googleapis.com/token"
SITES_URL = "https://searchconsole.googleapis.com/webmasters/v3/sites"
SEARCH_ANALYTICS_TMPL = "https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"


def _refresh_access_token() -> Optional[str]:
    """Get an access token using a refresh token.

    We avoid adding heavy google-auth deps; direct OAuth token exchange is enough.
    Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.
    """
    if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET and settings.GOOGLE_REFRESH_TOKEN):
        return None

    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": settings.GOOGLE_REFRESH_TOKEN,
        "grant_type": "refresh_token",
    }
    try:
        r = requests.post(TOKEN_URL, data=data, timeout=25)
        r.raise_for_status()
        payload = r.json() or {}
        return payload.get("access_token")
    except Exception as e:
        logger.warning("[GSC] token refresh failed: %s", str(e))
        return None


def _auth_headers(token: str) -> Dict[str, str]:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def _guess_site_property(website_url: str) -> str:
    # Prefer explicit property if set.
    if settings.GSC_SITE_URL:
        return settings.GSC_SITE_URL

    u = website_url.strip()
    if not u.endswith("/"):
        u = u + "/"

    # common: URL-prefix property
    return u


def _pick_matching_site(available_sites: list[Dict[str, Any]], website_url: str) -> Optional[str]:
    """Try to find a site entry matching website_url."""
    want = _guess_site_property(website_url)

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
    # domain property looks like: sc-domain:example.com
    try:
        parsed = urllib.parse.urlparse(website_url)
        host = (parsed.hostname or "").lower()
    except Exception:
        host = ""
    if host:
        for c in candidates:
            if c.lower().startswith("sc-domain:") and c.lower().split("sc-domain:")[-1].strip("/") == host:
                return c

    return None


def fetch_gsc_summary(website_url: str, days: int = 28) -> Optional[Dict[str, Any]]:
    """Fetch a compact Search Console summary: clicks, impressions, ctr, position, top queries/pages."""
    token = _refresh_access_token()
    if not token:
        return None

    try:
        # list sites
        r = requests.get(SITES_URL, headers=_auth_headers(token), timeout=25)
        r.raise_for_status()
        sites_payload = r.json() or {}
        site_entries = sites_payload.get("siteEntry") or []
        site = _pick_matching_site(site_entries, website_url)
        if not site:
            logger.warning("[GSC] no matching site property found for %s", website_url)
            return None

        end = time.strftime("%Y-%m-%d")
        # naive: days back
        import datetime as _dt
        start = (_dt.date.today() - _dt.timedelta(days=days)).strftime("%Y-%m-%d")

        url = SEARCH_ANALYTICS_TMPL.format(site=urllib.parse.quote(site, safe=""))
        body = {
            "startDate": start,
            "endDate": end,
            "dimensions": ["query"],
            "rowLimit": 10,
        }
        r2 = requests.post(url, headers=_auth_headers(token), data=json.dumps(body), timeout=35)
        r2.raise_for_status()
        q_payload = r2.json() or {}
        top_queries = []
        for row in (q_payload.get("rows") or []):
            keys = row.get("keys") or []
            top_queries.append({
                "query": keys[0] if keys else None,
                "clicks": row.get("clicks"),
                "impressions": row.get("impressions"),
                "ctr": row.get("ctr"),
                "position": row.get("position"),
            })

        # pages summary
        body_pages = {
            "startDate": start,
            "endDate": end,
            "dimensions": ["page"],
            "rowLimit": 10,
        }
        r3 = requests.post(url, headers=_auth_headers(token), data=json.dumps(body_pages), timeout=35)
        r3.raise_for_status()
        p_payload = r3.json() or {}
        top_pages = []
        for row in (p_payload.get("rows") or []):
            keys = row.get("keys") or []
            top_pages.append({
                "page": keys[0] if keys else None,
                "clicks": row.get("clicks"),
                "impressions": row.get("impressions"),
                "ctr": row.get("ctr"),
                "position": row.get("position"),
            })

        # totals (no dimensions)
        body_totals = {
            "startDate": start,
            "endDate": end,
            "rowLimit": 1,
        }
        r4 = requests.post(url, headers=_auth_headers(token), data=json.dumps(body_totals), timeout=35)
        r4.raise_for_status()
        t_payload = r4.json() or {}
        totals = (t_payload.get("rows") or [{}])[0] if (t_payload.get("rows") or []) else {}

        return {
            "siteProperty": site,
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
