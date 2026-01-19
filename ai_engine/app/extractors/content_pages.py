from __future__ import annotations

from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

from bs4 import BeautifulSoup

from app.core.http import http_get
from app.core.config import settings


def _is_same_host(base_url: str, candidate: str) -> bool:
    try:
        b = urlparse(base_url)
        c = urlparse(candidate)
        return (b.netloc or "").lower() == (c.netloc or "").lower()
    except Exception:
        return False


def _normalize_url(base_url: str, candidate: str) -> Optional[str]:
    try:
        u = urlparse(candidate)
        if u.scheme not in ("http", "https"):
            return None
        if not _is_same_host(base_url, candidate):
            return None
        # Strip fragments
        cleaned = candidate.split("#", 1)[0]
        return cleaned
    except Exception:
        return None


def _safe_text(s: Any) -> str:
    return (s or "").strip() if isinstance(s, str) else ""


def _extract_visible_text_static(html: str) -> str:
    """Extract visible text from raw HTML without executing JS.

    We try Scrapy/Parsel selectors first (faster + good at stripping non-content),
    then fall back to BeautifulSoup.
    """
    html = html or ""
    if not html.strip():
        return ""

    # Prefer parsel (installed with Scrapy) when available.
    try:
        from parsel import Selector  # type: ignore

        sel = Selector(text=html)
        # Collect only textual nodes under body excluding script/style/noscript.
        parts = sel.xpath(
            "//body//*[not(self::script or self::style or self::noscript)]/text()"
        ).getall()
        text = " ".join([p.strip() for p in parts if isinstance(p, str) and p.strip()])
        return text.strip()
    except Exception:
        pass

    # Fallback to BeautifulSoup
    try:
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "noscript"]):
            tag.extract()
        return soup.get_text(" ", strip=True)
    except Exception:
        return ""


def _extract_page_signals(url: str, html: str, rendered_text: Optional[str] = None) -> Dict[str, Any]:
    """Extract content-quality signals from a single page.

    - `html` is used to parse headings/links/structure.
    - `rendered_text` (if provided) is preferred for word-count and visible text quality
      because it reflects JS-rendered content.
    """
    soup = BeautifulSoup(html or "", "html.parser")

    title = _safe_text(soup.title.string if soup.title else "")
    meta_desc = ""
    md = soup.find("meta", attrs={"name": "description"})
    if md and md.get("content"):
        meta_desc = _safe_text(md.get("content"))

    h1 = [_safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h1")]
    h2 = [_safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h2")]
    h3 = [_safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h3")]

    first_h1 = next((x for x in h1 if x), "")

    # Try to capture top navigation labels as additional page intent signal.
    nav_labels: List[str] = []
    try:
        nav = soup.find("nav")
        if nav:
            for a in nav.find_all("a"):
                t = _safe_text(a.get_text(" ", strip=True))
                if t and len(t) <= 40:
                    nav_labels.append(t)
        # Fallback: header menu links
        if not nav_labels:
            header = soup.find("header")
            if header:
                for a in header.find_all("a"):
                    t = _safe_text(a.get_text(" ", strip=True))
                    if t and len(t) <= 40:
                        nav_labels.append(t)
    except Exception:
        nav_labels = []
    # Dedupe + cap
    if nav_labels:
        seen = set()
        out: List[str] = []
        for t in nav_labels:
            k = t.lower()
            if k in seen:
                continue
            seen.add(k)
            out.append(t)
            if len(out) >= 20:
                break
        nav_labels = out

    # Prefer rendered visible text when available
    if rendered_text and isinstance(rendered_text, str) and rendered_text.strip():
        visible_text = rendered_text
    else:
        visible_text = _extract_visible_text_static(html)

    # Basic word count
    words = [w for w in (visible_text or "").split() if len(w) > 1]
    word_count = len(words)

    # Basic content patterns
    has_faq = "faq" in (visible_text or "").lower() or bool(soup.select('[id*="faq"], [class*="faq"]'))
    has_pricing = "pricing" in (visible_text or "").lower() or "price" in (visible_text or "").lower()
    has_testimonials = "testimonial" in (visible_text or "").lower() or bool(soup.select('[class*="testimonial"], [id*="testimonial"]'))
    has_case_studies = "case study" in (visible_text or "").lower() or "portfolio" in (visible_text or "").lower()

    # CTA heuristic
    cta_keywords = ["contact", "get quote", "book", "schedule", "call", "start", "enquire", "enquiry"]
    has_cta = any(k in (visible_text or "").lower() for k in cta_keywords)

    return {
        "url": url,
        "title": title,
        "metaDescription": meta_desc,
        "h1": first_h1 or "",
        "navLabels": nav_labels,
        "h1Count": len([x for x in h1 if x]),
        "h2Count": len([x for x in h2 if x]),
        "h3Count": len([x for x in h3 if x]),
        "wordCount": word_count,
        # Back/forward compatible flags used across the codebase
        "hasFAQ": has_faq,
        "hasFaq": has_faq,
        "hasPricingSignals": has_pricing,
        "hasPricing": has_pricing,
        "hasTestimonialsSignals": has_testimonials,
        "hasTestimonials": has_testimonials,
        "hasCaseStudySignals": has_case_studies,
        "hasCaseStudies": has_case_studies,
        "hasCTA": has_cta,
        # keep a small snippet for optional LLM use (avoid huge payloads)
        "textSnippet": (visible_text[:1200] if isinstance(visible_text, str) else ""),
        "usedJsRendering": bool(rendered_text and rendered_text.strip()),
    }


def _canonical_page_key(url: str) -> str:
    """Create a stable key to match pages across HTTP/Playwright fetches."""
    try:
        u = urlparse(url)
        host = (u.netloc or "").lower()
        path = (u.path or "/")
        if path != "/":
            path = path.rstrip("/")
        return f"{host}{path}".lower()
    except Exception:
        return (url or "").lower().strip()


def _looks_like_spa_shell(html: str) -> bool:
    h = (html or "").lower()
    if not h:
        return False
    markers = [
        'id="__next"',
        "__next_data__",
        "data-reactroot",
        "ng-version",
        "__nuxt__",
        "window.__nuxt__",
        "id=\"app\"",
        "react-dom",
        "webpack",
    ]
    return any(m in h for m in markers)


def _needs_js_rendering(url: str, html: str, static_signals: Dict[str, Any]) -> bool:
    """Heuristic gating: decide if a page likely needs JS rendering for meaningful content."""
    try:
        wc = int(static_signals.get("wordCount") or 0)
    except Exception:
        wc = 0

    soup = BeautifulSoup(html or "", "html.parser")
    script_count = len(soup.find_all("script"))

    # If the HTML already has enough content, do not spend Playwright.
    if wc >= int(getattr(settings, "JS_TEXT_MIN_WORDS", 280)):
        return False

    # SPA shell / thin content + lots of scripts
    if _looks_like_spa_shell(html) and wc < 200:
        return True

    if wc < 160 and script_count >= 12:
        return True

    # Some service pages intentionally short; avoid running Playwright on "contact" etc.
    path = (urlparse(url).path or "").lower()
    low_value = ["/privacy", "/terms", "/cookie", "/login", "/signup", "/wp-admin"]
    if any(p in path for p in low_value):
        return False

    return wc < 120


def _pick_candidate_pages(base_url: str, internal_links: List[str]) -> List[str]:
    """Choose a small set of high-value content pages.

    We score URLs by intent keywords (services/about/contact/blog/case-study/pricing/faq),
    and return a deduped list.
    """
    candidates: List[str] = []
    for u in internal_links or []:
        nu = _normalize_url(base_url, u)
        if nu:
            candidates.append(nu)

    # Deduplicate
    seen = set()
    normalized: List[str] = []
    for u in candidates:
        if u not in seen:
            seen.add(u)
            normalized.append(u)

    keywords = [
        "service", "services", "about", "contact", "blog", "insight", "resources",
        "case", "case-study", "case-studies", "portfolio", "work",
        "pricing", "price", "packages", "plans",
        "faq", "questions", "testimonials", "reviews",
    ]

    def score_url(u: str) -> int:
        path = (urlparse(u).path or "").lower()
        score = 0
        for k in keywords:
            if k in path:
                score += 3
        # prefer shorter, cleaner paths
        score += max(0, 5 - path.count("/"))
        # avoid obvious non-content
        bad = ["privacy", "terms", "cookie", "login", "signup", "wp-admin", "cdn-cgi"]
        if any(b in path for b in bad):
            score -= 10
        return score

    normalized.sort(key=score_url, reverse=True)

    # Always include homepage first
    homepage = base_url.rstrip("/")
    if homepage not in normalized:
        normalized.insert(0, homepage)

    return normalized


def _fetch_pages_with_playwright(urls: List[str], timeout_sec: int) -> List[Dict[str, Any]]:
    """Fetch pages using Playwright and return extracted signals.

    This captures **JS-rendered** content by extracting the final DOM + innerText.
    If Playwright is not available, raises ImportError.
    """
    from playwright.sync_api import sync_playwright  # imported lazily

    goto_timeout = int(getattr(settings, "PLAYWRIGHT_GOTO_TIMEOUT_MS", 60000))
    networkidle_timeout = int(getattr(settings, "PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS", 30000))

    pages: List[Dict[str, Any]] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        try:
            for u in urls:
                page = context.new_page()
                try:
                    # Prefer networkidle for SPAs; fallback to load if it never settles.
                    try:
                        page.goto(u, wait_until="networkidle", timeout=goto_timeout)
                    except Exception:
                        page.goto(u, wait_until="load", timeout=goto_timeout)

                    # Give hydration a small chance if networkidle happened too early
                    try:
                        page.wait_for_timeout(min(networkidle_timeout, 1500))
                    except Exception:
                        pass

                    final_url = page.url or u
                    html = page.content() or ""
                    rendered_text = ""
                    try:
                        rendered_text = page.evaluate("() => document.body ? document.body.innerText : ''") or ""
                    except Exception:
                        rendered_text = ""

                    if html:
                        pages.append(_extract_page_signals(final_url, html, rendered_text=rendered_text))
                except Exception:
                    # ignore individual failures
                    pass
                finally:
                    try:
                        page.close()
                    except Exception:
                        pass
        finally:
            try:
                context.close()
            except Exception:
                pass
            try:
                browser.close()
            except Exception:
                pass

    return pages


def fetch_content_pages(
    base_url: str,
    internal_links: List[str],
    candidate_urls: Optional[List[str]] = None,
    max_pages: Optional[int] = None,
    timeout: Optional[int] = None,
    use_playwright: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    """Fetch and extract signals from a handful of internal pages.

    ✅ With Playwright enabled, this collects:
    - **Rendered DOM HTML** (`page.content()`)
    - **Visible JS-rendered text** (`document.body.innerText`)

    So it works for both:
    - SSR/static sites
    - SPA/React sites (JS rendered)

    If Playwright is missing or disabled, falls back to plain HTTP HTML.
    """
    max_pages = int(max_pages or getattr(settings, "MAX_CONTENT_PAGES", 6))
    timeout = int(timeout or getattr(settings, "HTTP_TIMEOUT_SEC", 20))

    # Pick candidate pages
    if candidate_urls:
        # Use provided URLs as the source of truth (typically from sitemap selection).
        candidates: List[str] = []
        for u in candidate_urls:
            nu = _normalize_url(base_url, u)
            if nu:
                candidates.append(nu)
        # Ensure homepage is included
        homepage = base_url.rstrip("/")
        if homepage not in candidates:
            candidates.insert(0, homepage)
    else:
        candidates = _pick_candidate_pages(base_url, internal_links)
    candidates = candidates[: max_pages * 3]  # scan more in case of failures

    # --- Scrapy/HTTP-first gating + overlay merge ---
    # 1) Always fetch via HTTP first (fast) and extract as much as possible from raw HTML.
    # 2) Only render a small subset via Playwright when the page looks like a JS shell / thin HTML.
    # 3) Overlay JS-rendered signals back onto the static ones (wordCount/snippet/pattern flags).

    # Decide whether Playwright is allowed at all
    if use_playwright is None:
        allow_playwright = bool(getattr(settings, "USE_PLAYWRIGHT_FOR_CONTENT_PAGES", False))
    else:
        allow_playwright = bool(use_playwright)

    max_playwright_pages = int(getattr(settings, "MAX_PLAYWRIGHT_CONTENT_PAGES", 4))

    static_pages: List[Dict[str, Any]] = []
    static_html_by_key: Dict[str, str] = {}
    needs_js_urls: List[str] = []

    for u in candidates:
        if len(static_pages) >= max_pages:
            break
        try:
            r = http_get(u, timeout=timeout)
            if not (200 <= r.status_code < 400 and r.text):
                continue

            url_final = r.url or u
            signals = _extract_page_signals(url_final, r.text, rendered_text=None)
            key = _canonical_page_key(url_final)
            static_pages.append(signals)
            static_html_by_key[key] = r.text

            if allow_playwright and _needs_js_rendering(url_final, r.text, signals):
                needs_js_urls.append(url_final)
        except Exception:
            continue

    # If we couldn't fetch enough pages, try to top up with more candidates (still static)
    if len(static_pages) < max_pages:
        for u in candidates[len(static_pages):]:
            if len(static_pages) >= max_pages:
                break
            try:
                r = http_get(u, timeout=timeout)
                if 200 <= r.status_code < 400 and r.text:
                    url_final = r.url or u
                    signals = _extract_page_signals(url_final, r.text, rendered_text=None)
                    key = _canonical_page_key(url_final)
                    static_pages.append(signals)
                    static_html_by_key[key] = r.text
                    if allow_playwright and _needs_js_rendering(url_final, r.text, signals):
                        needs_js_urls.append(url_final)
            except Exception:
                continue

    # Deduplicate JS urls and cap them
    js_seen = set()
    js_urls: List[str] = []
    for u in needs_js_urls:
        k = _canonical_page_key(u)
        if k in js_seen:
            continue
        js_seen.add(k)
        js_urls.append(u)
        if len(js_urls) >= max_playwright_pages:
            break

    # 2) Render only the JS-needed subset
    js_pages: List[Dict[str, Any]] = []
    if allow_playwright and js_urls:
        try:
            js_pages = _fetch_pages_with_playwright(js_urls, timeout_sec=timeout)
        except Exception:
            js_pages = []

    # 3) Overlay merge
    if js_pages:
        js_by_key = { _canonical_page_key(p.get("url") or ""): p for p in js_pages }
        merged: List[Dict[str, Any]] = []
        for sp in static_pages:
            key = _canonical_page_key(sp.get("url") or "")
            jp = js_by_key.get(key)
            if jp:
                # Keep stable identifiers, overlay quality/content signals.
                merged_item = dict(sp)
                for fld in [
                    "title",
                    "metaDescription",
                    "h1Count",
                    "h2Count",
                    "h3Count",
                    "wordCount",
                    "hasFAQ",
                    "hasPricingSignals",
                    "hasTestimonialsSignals",
                    "hasCaseStudySignals",
                    "hasCTA",
                    "textSnippet",
                    "usedJsRendering",
                ]:
                    if fld in jp and jp.get(fld) is not None:
                        merged_item[fld] = jp.get(fld)
                merged.append(merged_item)
            else:
                merged.append(sp)
        static_pages = merged

    return static_pages[:max_pages]
