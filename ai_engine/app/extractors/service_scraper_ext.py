from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse

from app.core.config import settings
from app.core.http import http_get

logger = logging.getLogger(__name__)

# Default "services/offering" URL hints (agency + local business)
DEFAULT_SERVICE_URL_HINTS: List[str] = [
    "/services", "services", "what-we-do", "solutions",
    "/menu", "menu", "/order", "order", "/products", "products", "shop",
    "/treatments", "treatments", "/procedures", "procedures",
    "/pricing", "pricing", "/packages", "packages",
]


def _same_host(a: str, b: str) -> bool:
    try:
        return urlparse(a).netloc.lower() == urlparse(b).netloc.lower()
    except Exception:
        return False


def _normalize_hints(url_hints: Optional[List[str]]) -> List[str]:
    hints = list(DEFAULT_SERVICE_URL_HINTS)
    if url_hints:
        for h in url_hints:
            if not h:
                continue
            hs = str(h).strip()
            if not hs:
                continue
            if hs not in hints:
                hints.append(hs)
    return hints


def pick_service_urls(
    base_url: str,
    internal_links: List[str],
    max_pages: int = 50,
    *,
    url_hints: Optional[List[str]] = None,
) -> List[str]:
    """Pick candidate URLs likely containing offerings/services/menu/treatments.

    NOTE: Safe + defensive — never raises for bad inputs.
    """
    base = base_url.rstrip("/") + "/"
    hints = _normalize_hints(url_hints)

    candidates: List[str] = []
    candidates.append(urljoin(base, "/services"))

    for raw in internal_links or []:
        try:
            if not raw:
                continue
            u = str(raw).strip()
            if not u:
                continue
            if not u.startswith("http"):
                u = urljoin(base, u)
            if not _same_host(base, u):
                continue
            low = u.lower()
            if any(h.lower() in low for h in hints):
                candidates.append(u)
        except Exception:
            continue

    out: List[str] = []
    seen = set()
    for u in candidates:
        key = u.lower().rstrip("/")
        if key in seen:
            continue
        seen.add(key)
        out.append(u)
        if len(out) >= max_pages:
            break
    return out


def _extract_service_like_blocks(html: str) -> List[Dict[str, Any]]:
    """Very light heuristic extractor.

    Returns list of {name, description}. We keep it simple to avoid schema issues.
    """
    if not html:
        return []
    cleaned = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", html)
    heads = re.findall(r"(?is)<h[1-4][^>]*>(.*?)</h[1-4]>", cleaned)

    items: List[Dict[str, Any]] = []
    for h in heads[:40]:
        name = re.sub(r"(?is)<.*?>", " ", h)
        name = re.sub(r"\s+", " ", name).strip()
        if not name or len(name) < 3:
            continue
        items.append({"name": name, "description": ""})

    # de-dupe by name
    seen = set()
    out: List[Dict[str, Any]] = []
    for it in items:
        k = it["name"].lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(it)
    return out


def scrape_services(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """Heuristic multi-page offerings scraper.

    IMPORTANT: For domains without a 'services' page (cafe/clinic/etc),
    we still store extracted offerings into the existing 'services' field.
    """
    candidates = pick_service_urls(
        website_url,
        internal_links or [],
        max_pages=max_pages,
        url_hints=url_hints,
    )

    services: List[Dict[str, Any]] = []
    max_services = int(getattr(settings, "MAX_EXTRACTED_SERVICES", 250) or 250)
    for u in candidates:
        try:
            r = http_get(u, timeout=timeout)
            if r.status_code >= 400:
                continue
            html = r.text or ""
            blocks = _extract_service_like_blocks(html)
            for b in blocks:
                if b.get("name"):
                    services.append(b)
        except Exception as e:
            logger.debug("[Services] fetch/extract failed for %s: %s", u, str(e))
            continue

        if len(services) >= max_services:
            break

    seen = set()
    out: List[Dict[str, Any]] = []
    for s in services:
        name = (s.get("name") or "").strip()
        if not name:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append({"name": name, "description": (s.get("description") or "").strip()})
    return out
