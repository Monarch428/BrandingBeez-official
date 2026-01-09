import asyncio
import os
import time
from typing import Dict, Set

from app.extractors.universal_links.detector import detect_site_type
from app.extractors.universal_links.static_extractor import extract_static_links
from app.extractors.universal_links.lxml_extractor import extract_lxml_links

ENABLE_PLAYWRIGHT = os.getenv("BB_ENABLE_PLAYWRIGHT", "1") == "1"
ENABLE_SELENIUM = os.getenv("BB_ENABLE_SELENIUM", "0") == "1"  # default OFF for servers


async def extract_links_auto(url: str, timeout_sec: int = 90) -> dict:
    """
    Extract links using best-effort layered approach.
    Designed to be safe in production:
    - Always tries fast static extraction first
    - Uses lxml extraction as a robust fallback
    - Uses Playwright only when needed (dynamic sites) and if enabled
    - Selenium optional (off by default)
    """
    started = time.time()
    site_type = detect_site_type(url)
    links: Set[str] = set()

    def _check_timeout(stage: str):
        elapsed = time.time() - started
        if elapsed > timeout_sec:
            raise TimeoutError(f"Extraction timed out after {int(elapsed)}s during: {stage}")

    # 1) Static extraction (fast)
    _check_timeout("static")
    try:
        links.update(extract_static_links(url))
    except Exception:
        # ignore, move to next engine
        pass

    # 2) lxml fallback (robust for many sites)
    _check_timeout("lxml")
    if (site_type in ("unknown", "static", "cms") and len(links) < 5) or len(links) < 5:
        try:
            links.update(extract_lxml_links(url))
        except Exception:
            pass

    # 3) Playwright for dynamic (only if enabled)
    _check_timeout("pre-playwright")
    if ENABLE_PLAYWRIGHT and (site_type == "dynamic" or len(links) < 5):
        try:
            from app.extractors.universal_links.playwright_extractor import extract_playwright_links
            # Allocate only remaining time to Playwright
            remaining = max(5, int(timeout_sec - (time.time() - started)))
            pw_links = await extract_playwright_links(url, timeout_sec=remaining)
            links.update(pw_links)
        except TimeoutError:
            raise
        except Exception:
            pass

    # 4) Selenium fallback (rare; optional)
    _check_timeout("pre-selenium")
    if ENABLE_SELENIUM and (site_type == "dynamic" or len(links) < 5):
        try:
            from app.extractors.universal_links.selenium_extractor import extract_selenium_links
            links.update(set(extract_selenium_links(url)))
        except Exception:
            pass

    _check_timeout("finalize")

    return {
        "url": url,
        "site_type": site_type,
        "total_links": len(links),
        "links": sorted(links),
        "engine": {
            "playwrightEnabled": ENABLE_PLAYWRIGHT,
            "seleniumEnabled": ENABLE_SELENIUM,
        },
        "meta": {
            "timeoutSec": timeout_sec,
            "elapsedSec": round(time.time() - started, 3),
        },
    }
