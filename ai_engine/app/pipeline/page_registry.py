"""Unified page registry (Option B foundation).

Purpose
-------
Different crawl/link sources often disagree (Playwright vs HTTP vs sitemap vs service scraper).
This module merges those sources into one deterministic "truth" used across:

- services page detection
- content gaps / false-negative suppression (e.g., "no about page")
- strengths/weaknesses grounding (via presence/absence of key pages)

Design goals
------------
- Deterministic (same inputs => same registry)
- Minimal dependencies (pure Python stdlib)
- Safe defaults (never throws on bad input)
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import urlsplit, urlunsplit


def normalize_url(u: Any, *, default_scheme: str = "https") -> str:
    """Normalize URL into a canonical key:

    - ensures scheme
    - lowercases scheme + host
    - strips www.
    - strips query + fragment
    - normalizes trailing slash (non-root => endswith '/')
    """
    if not isinstance(u, str):
        return ""
    s = u.strip()
    if not s:
        return ""
    if not s.startswith("http://") and not s.startswith("https://"):
        s = f"{default_scheme}://" + s
    try:
        parts = urlsplit(s)
        scheme = (parts.scheme or default_scheme).lower()
        netloc = (parts.netloc or "").lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        path = parts.path or "/"
        if path != "/" and not path.endswith("/"):
            path = path + "/"
        return urlunsplit((scheme, netloc, path, "", ""))
    except Exception:
        s2 = s.split("#", 1)[0].split("?", 1)[0]
        if s2 and not s2.endswith("/") and "/" in s2:
            return s2.rstrip("/") + "/"
        return s2


def merge_sources(
    *,
    crawl_pages: Iterable[str] | None,
    sitemap_urls: Iterable[str] | None,
    internal_links: Iterable[str] | None,
    service_candidates: Iterable[str] | None,
) -> Tuple[List[str], Dict[str, Set[str]]]:
    """Return (all_urls_in_priority_order, sources_by_url)."""

    def _dedupe(items: Iterable[str] | None) -> List[str]:
        seen: Set[str] = set()
        out: List[str] = []
        for it in items or []:
            k = normalize_url(it)
            if not k or k in seen:
                continue
            seen.add(k)
            out.append(k)
        return out

    crawl_n = _dedupe(crawl_pages)
    sm_n = _dedupe(sitemap_urls)
    links_n = _dedupe(internal_links)
    cand_n = _dedupe(service_candidates)

    sources_by_url: Dict[str, Set[str]] = {}
    for u in crawl_n:
        sources_by_url.setdefault(u, set()).add("crawl")
    for u in sm_n:
        sources_by_url.setdefault(u, set()).add("sitemap")
    for u in links_n:
        sources_by_url.setdefault(u, set()).add("links")
    for u in cand_n:
        sources_by_url.setdefault(u, set()).add("service_candidates")

    return (crawl_n + sm_n + links_n + cand_n, sources_by_url)


def classify_url(url: str) -> Optional[str]:
    """Classify into a key page type using URL path patterns."""
    u = (url or "").lower()
    try:
        p = urlsplit(u)
        path = (p.path or "").strip("/")
    except Exception:
        path = u

    if any(x in path for x in ["about", "company", "who-we-are", "our-story", "team"]):
        return "about"
    if any(x in path for x in ["contact", "get-in-touch", "enquiry", "inquiry"]):
        return "contact"
    if any(
        x in path
        for x in [
            "services",
            "what-we-do",
            "solutions",
            "seo",
            "ppc",
            "google-ads",
            "web-design",
            "development",
            "branding",
            "social-media",
            "marketing",
        ]
    ):
        return "services"
    if any(x in path for x in ["case-stud", "portfolio", "work", "projects", "clients", "success-stor"]):
        return "proof"
    if any(x in path for x in ["pricing", "plans", "packages", "fees", "cost"]):
        return "pricing"
    if "faq" in path or "faqs" in path:
        return "faq"
    if any(x in path for x in ["blog", "insights", "news", "articles"]):
        return "blog"
    return None


def build_page_registry(
    *,
    website_url: str,
    crawl_pages: List[str] | None,
    sitemap_urls: List[str] | None,
    internal_links: List[str] | None,
    service_candidates: List[str] | None,
) -> Dict[str, Any]:
    """Merge 4 sources into a single deterministic page registry.

    Priority (highest -> lowest):
      1) crawl_pages (actually fetched)
      2) sitemap_urls
      3) internal_links
      4) service_candidates (heuristic)
    """
    all_urls, sources_by_url = merge_sources(
        crawl_pages=crawl_pages,
        sitemap_urls=sitemap_urls,
        internal_links=internal_links,
        service_candidates=service_candidates,
    )

    buckets: Dict[str, List[str]] = {
        "home": [normalize_url(website_url)],
        "about": [],
        "contact": [],
        "services": [],
        "proof": [],
        "pricing": [],
        "faq": [],
        "blog": [],
    }

    for u in all_urls:
        t = classify_url(u)
        if t and t in buckets and u not in buckets[t]:
            buckets[t].append(u)

    def _pick_primary(urls: List[str]) -> Optional[str]:
        if not urls:
            return None

        def pri(u: str) -> int:
            src = sources_by_url.get(u, set())
            if "crawl" in src:
                return 1
            if "sitemap" in src:
                return 2
            if "links" in src:
                return 3
            if "service_candidates" in src:
                return 4
            return 9

        return sorted(urls, key=lambda x: (pri(x), urls.index(x)))[0]

    pages: Dict[str, Any] = {"home": {"url": buckets["home"][0], "sources": ["homepage"]}}
    for t in ["about", "contact", "pricing", "faq", "proof", "blog"]:
        primary = _pick_primary(buckets[t])
        pages[t] = {"present": bool(primary), "primary": primary, "candidates": buckets[t][:5]}

    services_primary = _pick_primary(buckets["services"])
    pages["services"] = {
        "servicesPagePresent": bool(services_primary),
        "primary": services_primary,
        "candidates": buckets["services"][:8],
    }

    missing: List[str] = []
    if not pages["about"]["present"]:
        missing.append("about")
    if not pages["contact"]["present"]:
        missing.append("contact")
    if not pages["services"]["servicesPagePresent"]:
        missing.append("services")

    return {
        "priority": ["crawl", "sitemap", "links", "service_candidates"],
        "pages": pages,
        "missing": missing,
        "sourcesByUrl": {k: sorted(list(v)) for k, v in sources_by_url.items()},
        "counts": {
            "crawl": len({normalize_url(x) for x in (crawl_pages or []) if normalize_url(x)}),
            "sitemap": len({normalize_url(x) for x in (sitemap_urls or []) if normalize_url(x)}),
            "links": len({normalize_url(x) for x in (internal_links or []) if normalize_url(x)}),
            "service_candidates": len({normalize_url(x) for x in (service_candidates or []) if normalize_url(x)}),
            "merged": len(sources_by_url),
        },
    }
