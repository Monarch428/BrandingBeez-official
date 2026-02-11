from __future__ import annotations

import re
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


def _visible(tag) -> bool:
    style = (tag.get("style") or "").lower()
    return "display:none" not in style and "visibility:hidden" not in style


def _heading_like(tag) -> bool:
    cls = " ".join(tag.get("class", [])).lower()
    return any(x in cls for x in [
        "title", "heading", "headline", "hero",
        "text-xl", "text-2xl", "text-3xl", "text-4xl",
        "font-bold", "font-semibold",
    ])


def _detect_heading_structure(soup: BeautifulSoup) -> Dict[str, int]:
    headings = {f"h{i}": set() for i in range(1, 7)}

    # Native headings
    for i in range(1, 7):
        for tag in soup.find_all(f"h{i}"):
            if _visible(tag):
                text = tag.get_text(strip=True)
                if text:
                    headings[f"h{i}"].add(text)

    # ARIA headings
    for tag in soup.select('[role="heading"][aria-level]'):
        level = tag.get("aria-level")
        if level and str(level).isdigit():
            lvl = int(level)
            if 1 <= lvl <= 6 and _visible(tag):
                text = tag.get_text(strip=True)
                if text:
                    headings[f"h{lvl}"].add(text)

    # Styled semantic headings (best-effort)
    for tag in soup.find_all(["div", "span", "section"]):
        if _visible(tag) and _heading_like(tag):
            text = tag.get_text(strip=True)
            if 3 < len(text) < 80:
                headings["h2"].add(text)

    return {k: len(v) for k, v in headings.items()}


def analyze_uiux(url: str, html: Optional[str] = None, timeout_s: int = 12) -> Dict[str, Any]:
    """Lightweight UI/UX & accessibility analyzer.

    - Uses only homepage HTML (or fetches it).
    - No external APIs.
    - Returns stable fields that can be embedded into llm_context and appended into report.websiteDigitalPresence.uxConversion.details

    Inspired by the uiux2 prototype, rewritten to avoid aiohttp dependency.
    """
    try:
        if html is None:
            r = requests.get(url, timeout=timeout_s, headers={"User-Agent": "Mozilla/5.0"}, allow_redirects=True)
            html = r.text or ""
    except Exception as e:
        return {
            "overall_score": 0,
            "error": f"fetch_failed: {e}",
            "details": {},
            "recommendations": ["Recommendation: Fix homepage fetch errors so UX signals can be evaluated."],
        }

    soup = BeautifulSoup(html, "lxml")

    scripts = soup.find_all("script")
    styles = soup.find_all("link", rel="stylesheet")
    images = soup.find_all("img")

    # PERFORMANCE
    performance = {
        "page_size_kb": round(len(html.encode(errors='ignore')) / 1024, 2),
        "scripts_count": len(scripts),
        "stylesheets_count": len(styles),
        "images_count": len(images),
        "has_minified_resources": any(".min." in ((s.get("src") or "") + (s.get("href") or "")) for s in scripts),
    }
    performance_score = max(0, min(100, 100 - len(scripts) * 2 - len(images)))

    # ACCESSIBILITY
    images_without_alt = [i for i in images if not (i.get("alt") or "").strip()]
    semantic_tags = ["header", "nav", "main", "footer"]
    semantic = {t: bool(soup.find(t)) for t in semantic_tags}
    headings = _detect_heading_structure(soup)

    issues = []
    if images_without_alt:
        issues.append(f"{len(images_without_alt)} images missing alt text")
    if not semantic["header"] or not semantic["main"]:
        issues.append("Missing semantic HTML5 elements")
    if headings.get("h1", 0) == 0:
        issues.append("Missing H1 heading")

    accessibility = {
        "total_images": len(images),
        "images_without_alt": len(images_without_alt),
        "semantic_elements": semantic,
        "heading_structure": headings,
        "aria_labels_count": len(soup.find_all(attrs={"aria-label": True})),
        "aria_labelledby_count": len(soup.find_all(attrs={"aria-labelledby": True})),
        "forms_count": len(soup.find_all("form")),
        "inputs_count": len(soup.find_all("input")),
        "labels_count": len(soup.find_all("label")),
        "issues": issues,
    }

    accessibility_score = max(40, 100 - len(images_without_alt) * 10 - (10 if headings.get("h1", 0) == 0 else 0))

    # DESIGN
    viewport = soup.find("meta", attrs={"name": "viewport"})
    favicon = soup.find("link", rel=re.compile("icon", re.I))
    design = {
        "external_stylesheets": len(styles),
        "inline_styles": len(soup.find_all(style=True)),
        "has_viewport_meta": bool(viewport),
        "has_favicon": bool(favicon),
        "custom_fonts": bool(soup.find("link", href=re.compile("fonts", re.I))),
        "text_elements_count": len(soup.find_all(["p", "li", "span"])),
    }
    design_score = 100 if viewport and favicon else 85

    # USABILITY
    nav = soup.find("nav")
    buttons = soup.find_all("button")
    links = soup.find_all("a")
    host = urlparse(url).netloc
    usability = {
        "has_navigation": bool(nav),
        "nav_links_count": len(nav.find_all("a")) if nav else 0,
        "has_search": bool(soup.find("input", {"type": "search"})),
        "buttons_count": len(buttons),
        "cta_links_count": len([a for a in links if "contact" in (a.get_text() or "").lower()]),
        "has_contact_info": bool(re.search(r"mailto:|tel:", html, re.I)),
        "total_links": len(links),
        "internal_links": len([l for l in links if host and host in ((l.get("href") or ""))]),
    }
    usability_score = max(50, 100 - (20 if not nav else 0) - (10 if not buttons else 0))

    # MOBILE
    mobile = {
        "has_viewport": bool(viewport),
        "viewport_content": viewport["content"] if viewport and viewport.get("content") else None,
        "has_media_queries": "@media" in html,
        "touch_targets_count": len(buttons),
        "fixed_width_elements": len(soup.find_all(style=re.compile(r"width:\s*\d+px", re.I))),
    }
    mobile_score = 100 if viewport else 70

    # SEO MICRO SIGNALS
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    seo = {
        "has_title": bool(title),
        "title_text": title,
        "title_length": len(title),
        "has_meta_description": bool(meta_desc and meta_desc.get("content")),
        "description_content": (meta_desc.get("content") or "") if meta_desc else "",
        "description_length": len((meta_desc.get("content") or "")) if meta_desc else 0,
        "h1_count": headings.get("h1", 0),
        "images_with_alt_percentage": round(100 - (len(images_without_alt) / max(1, len(images))) * 100, 2),
        "og_tags_count": len(soup.find_all("meta", property=re.compile("^og:", re.I))),
        "has_canonical": bool(soup.find("link", rel="canonical")),
    }
    seo_score = max(50, 100 - (15 if not title else 0) - (10 if headings.get("h1", 0) == 0 else 0))

    overall = round((performance_score + accessibility_score + design_score + usability_score + mobile_score + seo_score) / 6, 1)

    recs = []
    if images_without_alt:
        recs.append("Recommendation: Add descriptive alt text to all images.")
    if headings.get("h1", 0) == 0:
        recs.append("Recommendation: Add a single H1 heading to the homepage.")
    if not semantic["header"] or not semantic["main"]:
        recs.append("Recommendation: Use semantic HTML5 elements (header, nav, main, footer).")
    if not nav:
        recs.append("Recommendation: Add a clear navigation menu.")
    if not buttons:
        recs.append("Recommendation: Add visible call-to-action buttons above the fold.")

    return {
        "overall_score": overall,
        "performance_score": performance_score,
        "accessibility_score": accessibility_score,
        "design_score": design_score,
        "usability_score": usability_score,
        "mobile_score": mobile_score,
        "seo_score": seo_score,
        "details": {
            "performance": performance,
            "accessibility": accessibility,
            "design": design,
            "usability": usability,
            "mobile": mobile,
            "seo": seo,
        },
        "recommendations": recs[:10],
    }
