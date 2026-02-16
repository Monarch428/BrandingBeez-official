from __future__ import annotations

import json
import logging
import re
import time
from typing import Any, Dict, List, Optional
from urllib.parse import parse_qs, unquote, urlparse

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


async def scrape_clutch_company(company_name: str) -> Dict[str, Any]:
    """Best-effort scrape of Clutch profile for a company name.

    NOTE: This uses a simple slug guess: https://clutch.co/profile/<slug>
    If the slug is wrong, this may return Not Found.
    """

    if async_playwright is None:
        raise RuntimeError("playwright is not available")

    slug = _slug(company_name)
    company_url = f"https://clutch.co/profile/{slug}"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto(company_url, timeout=60000)
        await page.wait_for_timeout(4000)
        page_text = await page.inner_text("body")
        employees = _extract_field(r"Employees\s+([^\n]+)", page_text)
        founded = _extract_field(r"(?:Year Founded|Founded)\s+([^\n]+)", page_text)
        hourly_rate = _extract_field(r"Avg\.?\s*Hourly\s*Rate\s+([^\n]+)", page_text)
        await browser.close()

    return {
        "employees": employees,
        "founded": founded,
        "hourly_rate": hourly_rate,
        "profile_url": company_url,
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
                        }
                    )
                except Exception:
                    continue
        except Exception:
            break
    return out
