# ai_engine/app/extractors/sitemap_key_pages.py
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Dict, Any
import re


@dataclass
class KeyPageResult:
    key_pages: List[str]
    reasons: Dict[str, str]


# Heuristic keywords for "key business pages"
_KEY_PATTERNS = [
    (re.compile(r"/contact\b", re.I), "Contact intent page"),
    (re.compile(r"/about\b", re.I), "About / credibility page"),
    (re.compile(r"/services?\b", re.I), "Services / offer page"),
    (re.compile(r"/pricing\b|/plans\b|/packages\b|/cost\b", re.I), "Pricing / package page"),
    (re.compile(r"/portfolio\b|/work\b|/case-stud(y|ies)\b|/results\b", re.I), "Proof / portfolio page"),
    (re.compile(r"/testimonials?\b|/reviews?\b", re.I), "Trust / testimonials page"),
    (re.compile(r"/blog\b|/insights\b|/resources\b", re.I), "Content / blog hub"),
    (re.compile(r"/faq\b|/faqs\b", re.I), "FAQ / objections page"),
]

# Fallback “homepage-like” pattern
_HOME_PATTERN = re.compile(r"^https?://[^/]+/?$", re.I)


def _to_url_list(pages: Any) -> List[str]:
    """
    Accepts a list[str] or list[dict] (common outputs from crawlers/sitemap parsers)
    and returns a normalized list[str] of URLs.
    """
    if not pages:
        return []

    if isinstance(pages, list):
        # list[str]
        if all(isinstance(x, str) for x in pages):
            return [x.strip() for x in pages if x and isinstance(x, str)]

        # list[dict]
        if all(isinstance(x, dict) for x in pages):
            urls: List[str] = []
            for d in pages:
                # Try common keys
                for k in ("url", "loc", "href", "link"):
                    v = d.get(k)
                    if isinstance(v, str) and v.strip():
                        urls.append(v.strip())
                        break
            return urls

    # Unknown structure
    return []


def select_key_pages(
    pages: Any,
    limit: int = 12,
) -> Dict[str, Any]:
    """
    Select important pages from sitemap/crawl output.

    Returns a dict to keep integration easy with your existing pipeline:
    {
      "key_pages": [...],
      "reasons": { url: "reason", ... }
    }
    """
    urls = _to_url_list(pages)
    if not urls:
        return {"key_pages": [], "reasons": {}}

    # Deduplicate while preserving order
    seen = set()
    deduped: List[str] = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            deduped.append(u)

    reasons: Dict[str, str] = {}
    selected: List[str] = []

    # Always try to include homepage if present
    for u in deduped:
        if _HOME_PATTERN.match(u):
            selected.append(u)
            reasons[u] = "Homepage"
            break

    # Match key patterns
    for u in deduped:
        if u in reasons:
            continue
        for pattern, reason in _KEY_PATTERNS:
            if pattern.search(u):
                selected.append(u)
                reasons[u] = reason
                break
        if len(selected) >= limit:
            break

    # If still not enough, fill with first URLs (reasonable fallback)
    if len(selected) < limit:
        for u in deduped:
            if u not in reasons:
                selected.append(u)
                reasons[u] = "Additional relevant page (fallback)"
            if len(selected) >= limit:
                break

    return {"key_pages": selected[:limit], "reasons": reasons}
