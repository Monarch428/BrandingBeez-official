from __future__ import annotations

import json
import logging
import re
import time
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

try:
    from playwright.async_api import async_playwright
except Exception:  # pragma: no cover
    async_playwright = None  # type: ignore


logger = logging.getLogger(__name__)


def _slug(name: str) -> str:
    return (name or "").strip().lower().replace(" ", "-")


def _extract_field(pattern: str, text: str) -> str:
    m = re.search(pattern, text or "", re.IGNORECASE)
    return m.group(1).strip() if m else "Not Found"


def _looks_blocked(html: str) -> bool:
    t = (html or "").lower()
    return any(
        k in t
        for k in [
            "access denied",
            "verify you are a human",
            "captcha",
            "cloudflare",
            "unusual traffic",
            "enable cookies",
            "blocked",
            "/cdn-cgi/",
        ]
    )


def _parse_json_ld_reviews(html: str) -> Tuple[Optional[float], Optional[int], List[Dict[str, Any]]]:
    """Extract aggregate rating + reviews from JSON-LD blocks if present."""
    soup = BeautifulSoup(html or "", "html.parser")
    rating = None
    count = None
    reviews: List[Dict[str, Any]] = []

    scripts = soup.find_all("script", attrs={"type": re.compile(r"ld\+json", re.I)})
    for s in scripts:
        raw = (s.string or s.get_text() or "").strip()
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except Exception:
            continue

        # JSON-LD can be dict or list or graph
        candidates: List[Any] = []
        if isinstance(data, list):
            candidates.extend(data)
        elif isinstance(data, dict):
            if "@graph" in data and isinstance(data["@graph"], list):
                candidates.extend(data["@graph"])
            else:
                candidates.append(data)

        for c in candidates:
            if not isinstance(c, dict):
                continue
            agg = c.get("aggregateRating") or {}
            if isinstance(agg, dict):
                rv = agg.get("ratingValue")
                rc = agg.get("reviewCount") or agg.get("ratingCount")
                try:
                    if rv is not None:
                        rating = float(rv)
                except Exception:
                    pass
                try:
                    if rc is not None:
                        count = int(rc)
                except Exception:
                    pass

            revs = c.get("review")
            if isinstance(revs, dict):
                revs = [revs]
            if isinstance(revs, list):
                for r in revs[:30]:
                    if not isinstance(r, dict):
                        continue
                    rr = r.get("reviewRating") or {}
                    rating_value = rr.get("ratingValue") if isinstance(rr, dict) else None
                    reviews.append(
                        {
                            "author": (r.get("author") or {}).get("name") if isinstance(r.get("author"), dict) else r.get("author"),
                            "rating": rating_value,
                            "date": r.get("datePublished") or r.get("dateCreated"),
                            "title": r.get("name") or r.get("headline"),
                            "text": r.get("reviewBody") or r.get("description"),
                            "source": "clutch",
                        }
                    )

    # Clean empty items
    cleaned = []
    for r in reviews:
        if any((r.get("title"), r.get("text"), r.get("rating"))):
            cleaned.append(r)
    return rating, count, cleaned


async def scrape_clutch_company(company_name: str, profile_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Scrape Clutch company profile. Supports:
    - explicit profile_url (preferred, from DB)
    - fallback to slug-based URL if not provided

    Returns metadata + review aggregates + a small review sample when available.
    """
    if async_playwright is None:
        raise RuntimeError("playwright is not available")

    slug = _slug(company_name)
    company_url = (profile_url or f"https://clutch.co/profile/{slug}").strip()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            locale="en-US",
        )
        page = await context.new_page()

        resp = await page.goto(company_url, timeout=60000, wait_until="domcontentloaded")
        status = getattr(resp, "status", None)
        await page.wait_for_timeout(1500)

        # Scroll to trigger lazy-loaded sections (reviews often appear later)
        try:
            for _ in range(6):
                await page.mouse.wheel(0, 1400)
                await page.wait_for_timeout(600)
        except Exception:
            pass

        # Try to click Reviews tab if present
        try:
            btn = page.locator('a:has-text("Reviews"), button:has-text("Reviews")').first
            if await btn.count() > 0:
                await btn.click(timeout=1500)
                await page.wait_for_timeout(1200)
        except Exception:
            pass

        html = await page.content()
        title = ""
        try:
            title = await page.title()
        except Exception:
            title = ""

        blocked = _looks_blocked(html) or (title and _looks_blocked(title))
        not_found = False
        if status in (404, 410):
            not_found = True
        if "page not found" in (title or "").lower():
            not_found = True

        # Basic text-based fields (best-effort)
        page_text = ""
        try:
            page_text = await page.inner_text("body")
        except Exception:
            page_text = ""

        employees = _extract_field(r"Employees\s+([^\n]+)", page_text)
        founded = _extract_field(r"(?:Year Founded|Founded)\s+([^\n]+)", page_text)
        hourly_rate = _extract_field(r"Avg\.?\s*Hourly\s*Rate\s+([^\n]+)", page_text)

        # Reviews via JSON-LD (most stable)
        agg_rating, agg_count, jsonld_reviews = _parse_json_ld_reviews(html)

        # If JSON-LD is missing, attempt DOM heuristics for review cards
        reviews_sample: List[Dict[str, Any]] = jsonld_reviews[:20]
        if not reviews_sample:
            try:
                # Common heuristic: look for blocks mentioning "Review" with star rating
                cards = page.locator('[itemprop="review"], article:has-text("Review"), div:has-text("Review")')
                n = min(await cards.count(), 10)
                for i in range(n):
                    txt = (await cards.nth(i).inner_text())[:1200]
                    if txt:
                        reviews_sample.append({"text": txt, "source": "clutch"})
            except Exception:
                pass

        await browser.close()

    if blocked:
        return {
            "profile_url": company_url,
            "error": "clutch_blocked_or_captcha",
            "http_status": status,
        }
    if not_found:
        return {
            "profile_url": company_url,
            "error": "clutch_profile_not_found",
            "http_status": status,
        }

    return {
        "employees": employees if employees != "Not Found" else "N/A",
        "founded": founded if founded != "Not Found" else "N/A",
        "hourly_rate": hourly_rate if hourly_rate != "Not Found" else "N/A",
        "profile_url": company_url,
        "rating": agg_rating if agg_rating is not None else "N/A",
        "total_reviews": agg_count if agg_count is not None else (len(reviews_sample) or "N/A"),
        "reviews_sample": reviews_sample[:20],
        "http_status": status,
    }


def scrape_trustpilot_reviews(base_url: str, max_pages: int = 3) -> List[Dict[str, Any]]:
    """Scrape basic Trustpilot review stats from a Trustpilot domain page.

    Expects base_url like: https://www.trustpilot.com/review/<domain>
    """
    out: List[Dict[str, Any]] = []
    headers = {"User-Agent": "Mozilla/5.0"}
    for page_number in range(1, max_pages + 1):
        url = f"{base_url}?page={page_number}"
        try:
            r = requests.get(url, headers=headers, timeout=20)
            r.raise_for_status()
            time.sleep(1)
            soup = BeautifulSoup(r.text, "html.parser")
            script_tag = soup.find("script", id="__NEXT_DATA__")
            if not script_tag:
                break
            raw = json.loads(script_tag.string)
            reviews = (((raw.get("props") or {}).get("pageProps") or {}).get("reviews"))
            if not isinstance(reviews, list) or not reviews:
                break
            for rev in reviews:
                try:
                    out.append(
                        {
                            "rating": rev.get("rating"),
                            "publishedDate": ((rev.get("dates") or {}).get("publishedDate")),
                            "source": "trustpilot",
                        }
                    )
                except Exception:
                    continue
        except Exception:
            break
    return out
