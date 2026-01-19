from __future__ import annotations

from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from app.core.http import http_get


SERVICE_URL_HINTS = [
    "service", "services", "what-we-do", "solutions", "capabilities", "offerings",
    "digital-marketing", "seo", "google-ads", "ppc", "web-design", "web-development",
    "branding", "social-media", "content", "marketing",
]


def _same_host(base_url: str, candidate: str) -> bool:
    try:
        b = urlparse(base_url)
        c = urlparse(candidate)
        return (b.netloc or "").lower() == (c.netloc or "").lower()
    except Exception:
        return False


def pick_service_urls(base_url: str, internal_links: List[str], max_pages: int = 6) -> List[str]:
    """Pick likely service-related URLs from internal links."""
    base = (base_url or "").strip()
    if not base:
        return []

    # normalize links
    candidates: List[str] = []
    for raw in internal_links or []:
        if not raw:
            continue
        u = raw.strip()
        if not u.startswith("http"):
            u = urljoin(base, u)
        if not _same_host(base, u):
            continue
        low = u.lower()
        if any(h in low for h in SERVICE_URL_HINTS):
            candidates.append(u)

    # Always include /services if it exists in site
    candidates.insert(0, urljoin(base, "/services"))
    # de-dupe preserving order
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


def _clean(s: Any) -> str:
    return (s or "").strip() if isinstance(s, str) else ""


def _looks_like_nav_text(text: str) -> bool:
    t = (text or "").strip().lower()
    if not t:
        return True
    if len(t) <= 2:
        return True
    # common navigation / CTA noise
    noise = [
        "learn more", "read more", "view", "contact", "get started", "book", "pricing",
        "about", "home", "blog", "portfolio", "case study", "careers"
    ]
    return t in noise


def extract_services_from_html(html: str, page_url: str) -> List[Dict[str, Any]]:
    """Extract service cards/headings from a single HTML page (best-effort)."""
    soup = BeautifulSoup(html or "", "html.parser")

    services: List[Dict[str, Any]] = []

    # 1) Sections whose id/class hints services
    service_sections = soup.select('[id*="service"], [class*="service"], [id*="solution"], [class*="solution"], [id*="capabil"], [class*="capabil"]')
    if not service_sections:
        service_sections = [soup]  # fallback: scan whole page

    def add(name: str, desc: str = "", url: Optional[str] = None):
        name = _clean(name)
        if not name or _looks_like_nav_text(name):
            return
        services.append({
            "name": name,
            "description": _clean(desc) or None,
            "url": url or page_url,
            "source": page_url,
        })

    # 2) Common patterns: cards with h3/h4 and paragraph
    for sec in service_sections[:8]:
        # cards
        cards = sec.select("article, .card, .service, .service-card, .feature, .box, li")
        for c in cards[:30]:
            h = c.find(["h2", "h3", "h4"])
            if not h:
                continue
            title = _clean(h.get_text(" ", strip=True))
            if not title:
                continue
            # short description
            p = c.find("p")
            desc = _clean(p.get_text(" ", strip=True) if p else "")
            # link
            a = c.find("a", href=True)
            url = None
            if a and a.get("href"):
                href = a.get("href")
                if isinstance(href, str):
                    url = href if href.startswith("http") else urljoin(page_url, href)
            add(title, desc, url)

        # headings list without cards
        for h in sec.find_all(["h2", "h3"], limit=40):
            title = _clean(h.get_text(" ", strip=True))
            if not title:
                continue
            # avoid big generic headings
            if len(title) > 90:
                continue
            add(title)

    # De-dupe by name
    out: List[Dict[str, Any]] = []
    seen = set()
    for s in services:
        key = (s.get("name") or "").strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(s)
    return out


def scrape_services(base_url: str, internal_links: List[str], max_pages: int = 6, timeout: int = 25) -> List[Dict[str, Any]]:
    """Scrape service-related pages and extract services list."""
    urls = pick_service_urls(base_url, internal_links, max_pages=max_pages)
    all_services: List[Dict[str, Any]] = []

    for u in urls:
        try:
            r = http_get(u, timeout=timeout)
            if not r or not getattr(r, "text", None):
                continue
            services = extract_services_from_html(r.text, u)
            all_services.extend(services)
        except Exception:
            continue

    # De-dupe globally
    out: List[Dict[str, Any]] = []
    seen = set()
    for s in all_services:
        key = (s.get("name") or "").strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(s)
    return out
