from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from app.core.config import settings
from app.core.http import http_get

logger = logging.getLogger(__name__)

DEFAULT_SERVICE_URL_HINTS: List[str] = [
    "/services", "services", "what-we-do", "solutions", "capabilities", "offerings",
    "/pricing", "pricing", "/packages", "packages",
    "/seo", "/ppc", "/google-ads", "/web-design", "/web-development", "/branding",
    "/social-media", "/marketing", "/video", "/photography",
]

GENERIC_HEADING_BLACKLIST = {
    "about", "about us", "contact", "get in touch", "home", "blog", "blogs", "insights",
    "news", "portfolio", "projects", "work", "pricing", "packages", "faq", "faqs",
    "testimonials", "reviews", "careers", "team", "read more", "learn more", "book now",
    "menu", "shop", "login", "sign up", "privacy policy", "terms", "cookie policy",
}

SERVICE_KEYWORDS = (
    "seo", "ppc", "google ads", "web design", "web development", "website design",
    "branding", "graphic design", "social media", "email marketing", "content marketing",
    "video", "photography", "automation", "consulting", "strategy", "marketing",
)


def _same_host(a: str, b: str) -> bool:
    try:
        return urlparse(a).netloc.lower().replace("www.", "") == urlparse(b).netloc.lower().replace("www.", "")
    except Exception:
        return False


def _normalize_hints(url_hints: Optional[List[str]]) -> List[str]:
    hints = list(DEFAULT_SERVICE_URL_HINTS)
    for raw in url_hints or []:
        text = str(raw or "").strip()
        if text and text not in hints:
            hints.append(text)
    return hints


def _clean_text(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def _looks_like_service_name(text: str) -> bool:
    cleaned = _clean_text(text)
    if not cleaned:
        return False
    lower = cleaned.lower()
    if lower in GENERIC_HEADING_BLACKLIST:
        return False
    if len(cleaned) < 4 or len(cleaned) > 80:
        return False
    if sum(ch.isdigit() for ch in cleaned) > 4:
        return False
    if lower.startswith(("why ", "how ", "what ", "who ", "when ")):
        return False
    if any(token in lower for token in SERVICE_KEYWORDS):
        return True
    titleish = cleaned == cleaned.title() or cleaned.isupper()
    return titleish and 1 <= len(cleaned.split()) <= 6


def _extract_description(heading) -> str:
    parts: List[str] = []
    current = heading
    for _ in range(3):
        current = current.find_next_sibling()
        if current is None:
            break
        if getattr(current, "name", "") in {"h1", "h2", "h3", "h4"}:
            break
        text = _clean_text(current.get_text(" ", strip=True)) if hasattr(current, "get_text") else ""
        if text:
            parts.append(text)
        if sum(len(p.split()) for p in parts) >= 40:
            break
    joined = " ".join(parts)
    return joined[:280].strip()


def pick_service_urls(
    base_url: str,
    internal_links: List[str],
    max_pages: int = 50,
    *,
    url_hints: Optional[List[str]] = None,
) -> List[str]:
    base = base_url.rstrip("/") + "/"
    hints = _normalize_hints(url_hints)
    candidates: List[str] = [urljoin(base, "/services")]

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

    seen = set()
    out: List[str] = []
    for url in candidates:
        key = url.lower().rstrip("/")
        if key in seen:
            continue
        seen.add(key)
        out.append(url)
        if len(out) >= max_pages:
            break
    return out


def _extract_service_like_blocks(html: str) -> List[Dict[str, Any]]:
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg", "footer"]):
        tag.decompose()

    results: List[Dict[str, Any]] = []
    seen = set()

    # Priority 1: cards / service blocks
    selectors = [
        '[class*="service"]', '[id*="service"]',
        '[class*="solution"]', '[class*="offer"]',
        '[class*="card"] h2', '[class*="card"] h3',
    ]
    priority_nodes = []
    for selector in selectors:
        try:
            priority_nodes.extend(soup.select(selector))
        except Exception:
            continue

    def _push(name: str, description: str = "") -> None:
        cleaned = _clean_text(name)
        if not _looks_like_service_name(cleaned):
            return
        key = cleaned.lower()
        if key in seen:
            return
        seen.add(key)
        results.append({"name": cleaned, "description": _clean_text(description)[:280]})

    for node in priority_nodes[:80]:
        if getattr(node, "name", "") in {"h1", "h2", "h3", "h4"}:
            name = node.get_text(" ", strip=True)
            desc = _extract_description(node)
            _push(name, desc)
        else:
            heading = node.find(["h1", "h2", "h3", "h4"])
            if heading:
                _push(heading.get_text(" ", strip=True), _extract_description(heading))

    # Priority 2: headings on likely service pages
    for heading in soup.find_all(["h1", "h2", "h3"]):
        _push(heading.get_text(" ", strip=True), _extract_description(heading))
        if len(results) >= int(getattr(settings, "MAX_EXTRACTED_SERVICES", 250)):
            break

    return results


def scrape_services(
    website_url: str,
    *,
    internal_links: Optional[List[str]] = None,
    max_pages: int = 50,
    timeout: int = 90,
    url_hints: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    candidates = pick_service_urls(website_url, internal_links or [], max_pages=max_pages, url_hints=url_hints)
    services: List[Dict[str, Any]] = []
    max_services = int(getattr(settings, "MAX_EXTRACTED_SERVICES", 250) or 250)

    for url in candidates:
        try:
            resp = http_get(url, timeout=timeout)
            if resp.status_code >= 400:
                continue
            blocks = _extract_service_like_blocks(resp.text or "")
            for block in blocks:
                if isinstance(block, dict):
                    block.setdefault("source", url)
                    block.setdefault("sourceUrl", url)
            services.extend(blocks)
            if len(services) >= max_services:
                break
        except Exception as exc:
            logger.debug("[Services] fetch/extract failed for %s: %s", url, exc)

    # final clean + dedupe
    out: List[Dict[str, Any]] = []
    seen = set()
    for item in services:
        name = _clean_text(item.get("name"))
        if not _looks_like_service_name(name):
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append({"name": name, "description": _clean_text(item.get("description")), "source": item.get("source") or item.get("sourceUrl")})
        if len(out) >= max_services:
            break
    return out
