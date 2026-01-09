from playwright.async_api import async_playwright
from app.core.config import settings

async def extract_playwright_links(url: str, timeout_sec: int = 60) -> list[str]:
    """
    Dynamic link extraction using Playwright.

    NOTE (Windows): requires Proactor event loop policy for subprocess support.
    app/main.py sets this automatically for win32.
    """
    goto_timeout = min(settings.PLAYWRIGHT_GOTO_TIMEOUT_MS, timeout_sec * 1000)
    networkidle_timeout = min(settings.PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS, timeout_sec * 1000)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(url, wait_until="domcontentloaded", timeout=goto_timeout)
        # best-effort: some sites never reach networkidle; keep this bounded
        try:
            await page.wait_for_load_state("networkidle", timeout=networkidle_timeout)
        except Exception:
            pass
        await page.wait_for_timeout(800)

        links = await page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
        await browser.close()
        return links
