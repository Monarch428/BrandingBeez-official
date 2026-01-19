from __future__ import annotations

from typing import Any, Dict
import base64
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


def _b64_png(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def capture_screenshots(url: str) -> Dict[str, Any]:
    """Capture desktop + mobile screenshots using Playwright (sync).

    We keep this synchronous so it can run inside the existing sync pipeline.
    """

    from playwright.sync_api import sync_playwright  # lazy import

    goto_timeout = int(getattr(settings, "PLAYWRIGHT_GOTO_TIMEOUT_MS", 60000))
    full_page = bool(getattr(settings, "SCREENSHOT_FULL_PAGE", True))

    out: Dict[str, Any] = {
        "url": url,
        "generatedAt": None,
        "screenshots": {},
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            # Desktop
            context = browser.new_context(
                viewport={
                    "width": int(getattr(settings, "SCREENSHOT_DESKTOP_WIDTH", 1366)),
                    "height": int(getattr(settings, "SCREENSHOT_DESKTOP_HEIGHT", 768)),
                }
            )
            page = context.new_page()
            try:
                try:
                    page.goto(url, wait_until="networkidle", timeout=goto_timeout)
                except Exception:
                    page.goto(url, wait_until="load", timeout=goto_timeout)
                data = page.screenshot(full_page=full_page)
                out["screenshots"]["desktop"] = {
                    "format": "png",
                    "b64": _b64_png(data),
                    "width": int(getattr(settings, "SCREENSHOT_DESKTOP_WIDTH", 1366)),
                    "height": int(getattr(settings, "SCREENSHOT_DESKTOP_HEIGHT", 768)),
                    "fullPage": full_page,
                }
            finally:
                try:
                    page.close()
                except Exception:
                    pass
                try:
                    context.close()
                except Exception:
                    pass

            # Mobile
            m_context = browser.new_context(
                viewport={
                    "width": int(getattr(settings, "SCREENSHOT_MOBILE_WIDTH", 390)),
                    "height": int(getattr(settings, "SCREENSHOT_MOBILE_HEIGHT", 844)),
                },
                is_mobile=True,
                has_touch=True,
                user_agent=(
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
                    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
                ),
            )
            m_page = m_context.new_page()
            try:
                try:
                    m_page.goto(url, wait_until="networkidle", timeout=goto_timeout)
                except Exception:
                    m_page.goto(url, wait_until="load", timeout=goto_timeout)
                m_data = m_page.screenshot(full_page=full_page)
                out["screenshots"]["mobile"] = {
                    "format": "png",
                    "b64": _b64_png(m_data),
                    "width": int(getattr(settings, "SCREENSHOT_MOBILE_WIDTH", 390)),
                    "height": int(getattr(settings, "SCREENSHOT_MOBILE_HEIGHT", 844)),
                    "fullPage": full_page,
                }
            finally:
                try:
                    m_page.close()
                except Exception:
                    pass
                try:
                    m_context.close()
                except Exception:
                    pass

        finally:
            try:
                browser.close()
            except Exception:
                pass

    from datetime import datetime

    out["generatedAt"] = datetime.utcnow().isoformat() + "Z"
    return out
