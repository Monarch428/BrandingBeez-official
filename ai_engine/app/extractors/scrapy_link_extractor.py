from __future__ import annotations

"""Scrapy-powered link extraction (no full crawl).

Why this exists:
- BeautifulSoup is fine, but Scrapy's LinkExtractor + Selector is more robust across
  messy HTML and can handle relative URLs + canonicalization better.
- We DO NOT run a full Scrapy crawl (Twisted reactor complexity). We reuse our
  existing HTTP fetcher and then parse the HTML using Scrapy utilities.

If Scrapy is not installed, callers should catch ImportError and fall back.
"""

from typing import Dict, List
from urllib.parse import urlparse

from app.core.utils import normalize_url, domain_of


def extract_links_scrapy(home_url: str, html: str, max_links: int = 60) -> Dict:
    # Lazy imports so the whole engine still runs without Scrapy.
    from scrapy.http import HtmlResponse
    from scrapy.linkextractors import LinkExtractor

    home_url = normalize_url(home_url)
    base_domain = domain_of(home_url)

    if not html:
        return {
            "company_website": home_url,
            "internal_links": [],
            "external_links": [],
            "total_internal_links": 0,
            "total_external_links": 0,
            "extraction_engine": "scrapy_link_extractor",
        }

    # Create a fake response so Scrapy parsers work.
    resp = HtmlResponse(url=home_url, body=html.encode('utf-8', errors='ignore'), encoding='utf-8')

    # Restrict to http/https only.
    le = LinkExtractor(deny_extensions=None, unique=True)
    links = le.extract_links(resp)

    internal: List[str] = []
    external: List[str] = []
    seen: set[str] = set()

    def push(lst: List[str], u: str):
        if not u or u in seen:
            return
        seen.add(u)
        lst.append(u)

    for link in links:
        u = normalize_url(link.url)
        if not u:
            continue
        p = urlparse(u)
        if p.scheme not in ('http', 'https'):
            continue
        if domain_of(u) == base_domain:
            push(internal, u)
        else:
            push(external, u)

        if len(internal) >= max_links and len(external) >= max_links:
            break

    return {
        "company_website": home_url,
        "internal_links": internal[:max_links],
        "external_links": external[:max_links],
        "total_internal_links": len(internal),
        "total_external_links": len(external),
        "extraction_engine": "scrapy_link_extractor",
    }
