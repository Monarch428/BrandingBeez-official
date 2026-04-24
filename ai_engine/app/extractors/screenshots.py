from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List
import asyncio
import base64
import io
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

_SCREENSHOT_PAGE_SPECS = {
    "desktop": {
        "layout": "landscape",
        "title": "Desktop Screenshot",
        "pdf_page_width_pt": 841.89,
        "pdf_page_height_pt": 595.28,
        "pdf_margin_left_pt": 20,
        "pdf_margin_right_pt": 20,
        "pdf_margin_top_pt": 22,
        "pdf_margin_bottom_pt": 22,
        "pdf_title_block_pt": 24,
        "viewport": lambda: {
            "width": int(getattr(settings, "SCREENSHOT_DESKTOP_WIDTH", 1366)),
            "height": int(getattr(settings, "SCREENSHOT_DESKTOP_HEIGHT", 768)),
        },
        "context_kwargs": lambda: {
            "viewport": {
                "width": int(getattr(settings, "SCREENSHOT_DESKTOP_WIDTH", 1366)),
                "height": int(getattr(settings, "SCREENSHOT_DESKTOP_HEIGHT", 768)),
            },
            "device_scale_factor": 1,
        },
    },
    "mobile": {
        "layout": "portrait",
        "title": "Mobile Screenshot",
        "pdf_page_width_pt": 595.28,
        "pdf_page_height_pt": 841.89,
        "pdf_margin_left_pt": 20,
        "pdf_margin_right_pt": 20,
        "pdf_margin_top_pt": 22,
        "pdf_margin_bottom_pt": 22,
        "pdf_title_block_pt": 24,
        "viewport": lambda: {
            "width": int(getattr(settings, "SCREENSHOT_MOBILE_WIDTH", 390)),
            "height": int(getattr(settings, "SCREENSHOT_MOBILE_HEIGHT", 844)),
        },
        "context_kwargs": lambda: {
            "viewport": {
                "width": int(getattr(settings, "SCREENSHOT_MOBILE_WIDTH", 390)),
                "height": int(getattr(settings, "SCREENSHOT_MOBILE_HEIGHT", 844)),
            },
            "is_mobile": True,
            "has_touch": True,
            "device_scale_factor": 1,
            "user_agent": (
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            ),
        },
    },
}

_OVERLAY_SELECTORS = [
    "[id*='cookie']",
    "[class*='cookie']",
    "[id*='consent']",
    "[class*='consent']",
    "[id*='gdpr']",
    "[class*='gdpr']",
    "[aria-modal='true']",
    "[role='dialog']",
    "[class*='modal']",
    "[class*='popup']",
    "[class*='overlay']",
    "[id*='overlay']",
    "iframe[title*='consent']",
]

_DISMISS_BUTTON_LABELS = [
    "accept",
    "agree",
    "allow",
    "got it",
    "continue",
    "close",
    "dismiss",
    "ok",
    "i understand",
]


def _b64_png(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def _usable_pdf_area(spec: Dict[str, Any]) -> tuple[float, float]:
    usable_width = max(
        1.0,
        float(spec["pdf_page_width_pt"])
        - float(spec["pdf_margin_left_pt"])
        - float(spec["pdf_margin_right_pt"]),
    )
    usable_height = max(
        1.0,
        float(spec["pdf_page_height_pt"])
        - float(spec["pdf_margin_top_pt"])
        - float(spec["pdf_margin_bottom_pt"])
        - float(spec["pdf_title_block_pt"]),
    )
    return usable_width, usable_height


def _slice_screenshot_for_pdf(data: bytes, kind: str) -> Dict[str, Any]:
    from PIL import Image

    spec = _SCREENSHOT_PAGE_SPECS[kind]
    image = Image.open(io.BytesIO(data))
    width, height = image.size
    usable_width_pt, usable_height_pt = _usable_pdf_area(spec)
    max_slice_height = max(1, int(width * (usable_height_pt / usable_width_pt)))

    if height <= max_slice_height:
        slices_meta: List[Dict[str, Any]] = []
    else:
        target_parts = max(2, -(-height // max_slice_height))
        target_slice_height = max(max_slice_height, -(-height // target_parts))
        slices_meta = []
        top = 0
        index = 1
        while top < height:
            bottom = min(height, top + target_slice_height)
            crop = image.crop((0, top, width, bottom))
            buffer = io.BytesIO()
            crop.save(buffer, format="PNG")
            slice_bytes = buffer.getvalue()
            slices_meta.append(
                {
                    "index": index,
                    "format": "png",
                    "b64": _b64_png(slice_bytes),
                    "width": crop.size[0],
                    "height": crop.size[1],
                    "pageLayout": spec["layout"],
                    "title": spec["title"],
                    "kind": kind,
                }
            )
            if bottom >= height:
                break
            top = bottom
            index += 1

    return {
        "format": "png",
        "b64": _b64_png(data),
        "width": width,
        "height": height,
        "fullPage": True,
        "pageLayout": spec["layout"],
        "title": spec["title"],
        "kind": kind,
        "sliceCount": max(1, len(slices_meta)),
        "slices": slices_meta,
    }


async def _remove_overlays(page: Any) -> None:
    for label in _DISMISS_BUTTON_LABELS:
        try:
            await page.get_by_role("button", name=label, exact=False).first.click(timeout=800)
            await page.wait_for_timeout(100)
        except Exception:
            pass
        try:
            await page.get_by_role("link", name=label, exact=False).first.click(timeout=800)
            await page.wait_for_timeout(100)
        except Exception:
            pass

    await page.evaluate(
        """
        (selectors) => {
          const selectorList = Array.isArray(selectors) ? selectors : [];
          for (const selector of selectorList) {
            for (const node of document.querySelectorAll(selector)) {
              try { node.remove(); } catch (e) {}
            }
          }
          for (const node of document.querySelectorAll('body *')) {
            const text = (node.textContent || '').toLowerCase();
            const id = (node.id || '').toLowerCase();
            const cls = (typeof node.className === 'string' ? node.className : '').toLowerCase();
            const rect = typeof node.getBoundingClientRect === 'function' ? node.getBoundingClientRect() : null;
            const style = window.getComputedStyle(node);
            const isOverlayText = ['cookie', 'consent', 'gdpr', 'privacy'].some(token => text.includes(token) || id.includes(token) || cls.includes(token));
            const isBlocking = style.position === 'fixed' || style.position === 'sticky';
            const isLarge = !!rect && rect.width >= window.innerWidth * 0.45 && rect.height >= 80;
            const zIndex = Number(style.zIndex || 0);
            if ((isOverlayText && isBlocking) || (isBlocking && isLarge && zIndex >= 20)) {
              try { node.remove(); } catch (e) {}
            }
          }
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.overflow = 'visible';
          document.documentElement.style.overflow = 'visible';
        }
        """,
        _OVERLAY_SELECTORS,
    )


async def _capture_variant(browser: Any, url: str, kind: str, timeout_sec: int) -> tuple[str, Dict[str, Any]]:
    spec = _SCREENSHOT_PAGE_SPECS[kind]
    context = await browser.new_context(**spec["context_kwargs"]())
    page = await context.new_page()
    goto_timeout = min(int(getattr(settings, "PLAYWRIGHT_GOTO_TIMEOUT_MS", 60000)), timeout_sec * 1000)
    networkidle_timeout = min(int(getattr(settings, "PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS", 30000)), max(3000, timeout_sec * 1000))
    logger.info("[Screenshots] page=%s variant=%s start", url, kind)
    try:
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=goto_timeout)
        except Exception:
            await page.goto(url, wait_until="load", timeout=goto_timeout)
        try:
            await page.wait_for_load_state("networkidle", timeout=networkidle_timeout)
        except Exception:
            pass
        await page.wait_for_timeout(250)
        try:
            await _remove_overlays(page)
        except Exception:
            logger.debug("[Screenshots] overlay removal failed", exc_info=True)
        await page.wait_for_timeout(150)
        screenshot_timeout_ms = max(30000, int(getattr(settings, "SCREENSHOT_CAPTURE_TIMEOUT_MS", timeout_sec * 1000) or (timeout_sec * 1000)))
        try:
            data = await page.screenshot(
                full_page=True,
                type="png",
                animations="disabled",
                timeout=screenshot_timeout_ms,
            )
        except Exception:
            logger.warning("[Screenshots] page=%s variant=%s full_page capture failed; retrying viewport-only", url, kind, exc_info=True)
            data = await page.screenshot(
                full_page=False,
                type="png",
                animations="disabled",
                timeout=screenshot_timeout_ms,
            )
        logger.info("[Screenshots] page=%s variant=%s success=True", url, kind)
        return kind, _slice_screenshot_for_pdf(data, kind)
    except Exception:
        logger.exception("[Screenshots] page=%s variant=%s success=False", url, kind)
        raise
    finally:
        try:
            await page.close()
        except Exception:
            pass
        try:
            await context.close()
        except Exception:
            pass


async def _capture_screenshots_async(url: str) -> Dict[str, Any]:
    from playwright.async_api import async_playwright

    out: Dict[str, Any] = {
        "url": url,
        "generatedAt": None,
        "screenshots": {},
    }

    variants = list(_SCREENSHOT_PAGE_SPECS.keys())
    if not variants:
        out["generatedAt"] = datetime.utcnow().isoformat() + "Z"
        return out

    timeout_sec = max(30, int(getattr(settings, "SCREENSHOT_TIMEOUT_SEC", 60) or 60))
    attempted = len(variants)
    captured = 0
    failed = 0

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        try:
            tasks = [_capture_variant(browser, url, kind, timeout_sec) for kind in variants]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results:
                if isinstance(result, Exception):
                    failed += 1
                    continue
                kind, payload = result
                out["screenshots"][kind] = payload
                captured += 1
        finally:
            try:
                await browser.close()
            except Exception:
                pass

    out["generatedAt"] = datetime.utcnow().isoformat() + "Z"
    out["attemptedVariants"] = attempted
    out["capturedVariants"] = captured
    out["failedVariants"] = failed
    return out


def capture_screenshots(url: str) -> Dict[str, Any]:
    """Capture all configured full-page screenshot variants using Playwright async API."""
    try:
        return asyncio.run(_capture_screenshots_async(url))
    except RuntimeError:
        loop = asyncio.new_event_loop()
        try:
            asyncio.set_event_loop(loop)
            return loop.run_until_complete(_capture_screenshots_async(url))
        finally:
            try:
                loop.close()
            except Exception:
                pass
