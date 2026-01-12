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

    h1 = [ _safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h1") ]
    h2 = [ _safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h2") ]
    h3 = [ _safe_text(h.get_text(" ", strip=True)) for h in soup.find_all("h3") ]

    # Prefer rendered visible text when available
    if rendered_text and isinstance(rendered_text, str) and rendered_text.strip():
        visible_text = rendered_text
    else:
        visible_text = soup.get_text(" ", strip=True)

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
        "h1Count": len([x for x in h1 if x]),
        "h2Count": len([x for x in h2 if x]),
        "h3Count": len([x for x in h3 if x]),
        "wordCount": word_count,
        "hasFAQ": has_faq,
        "hasPricingSignals": has_pricing,
        "hasTestimonialsSignals": has_testimonials,
        "hasCaseStudySignals": has_case_studies,
        "hasCTA": has_cta,
        # keep a small snippet for optional LLM use (avoid huge payloads)
        "textSnippet": (visible_text[:1200] if isinstance(visible_text, str) else ""),
        "usedJsRendering": bool(rendered_text and rendered_text.strip()),
    }


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
    max_pages: Optional[int] = None,
    timeout: Optional[int] = None,
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
    candidates = _pick_candidate_pages(base_url, internal_links)
    candidates = candidates[: max_pages * 3]  # scan more in case of failures

    # Prefer Playwright (JS rendering)
    use_pw = bool(getattr(settings, "USE_PLAYWRIGHT_FOR_CONTENT_PAGES", True))

    if use_pw:
        try:
            pages = _fetch_pages_with_playwright(candidates, timeout_sec=timeout)
            # Trim to max_pages
            if len(pages) > max_pages:
                pages = pages[:max_pages]
            return pages
        except Exception:
            # Fall back to plain HTML
            pass

    # Fallback: raw HTML only (no JS)
    pages: List[Dict[str, Any]] = []
    for u in candidates:
        if len(pages) >= max_pages:
            break
        try:
            r = http_get(u, timeout=timeout)
            if 200 <= r.status_code < 400 and r.text:
                pages.append(_extract_page_signals(r.url, r.text, rendered_text=None))
        except Exception:
            continue

    return pages
