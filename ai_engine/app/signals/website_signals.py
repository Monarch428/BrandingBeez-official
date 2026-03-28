
from __future__ import annotations

from typing import Any, Dict, List, Optional

from app.signals.content_quality import compute_content_quality


def build_website_signals(
    homepage: Dict[str, Any],
    robots_sitemap: Dict[str, Any],
    pagespeed: Optional[Dict[str, Any]] = None,
    content_pages: Optional[List[Dict[str, Any]]] = None,
    uiux: Optional[Dict[str, Any]] = None,
    site_type: Optional[str] = None,
) -> Dict[str, Any]:
    issues: List[str] = []
    strengths: List[str] = []

    robots = (robots_sitemap or {}).get("robots", {}) or {}
    sitemap = (robots_sitemap or {}).get("sitemap", {}) or {}

    if not robots.get("ok"):
        issues.append("robots.txt missing/unreachable.")
    if not sitemap.get("ok"):
        issues.append("sitemap.xml missing/unreachable.")
    if not homepage.get("hasStructuredData"):
        issues.append("Structured data not detected on homepage.")

    if homepage.get("title"):
        strengths.append(f'Homepage title detected: "{homepage["title"]}"')
    if homepage.get("metaDescription"):
        strengths.append("Meta description detected on homepage.")
    if homepage.get("contactCTA"):
        strengths.append("A contact CTA appears to exist on homepage (heuristic check).")

    # -----------------------------
    # Technical SEO score (reasoned)
    # -----------------------------
    # We compute a stable, explainable score using only signals we actually collect.
    # Missing data should not default to 100.
    breakdown: Dict[str, int] = {
        "crawlability": 0,      # robots + sitemap
        "on_page": 0,           # title/meta/h1 + basic text
        "structured_data": 0,   # schema presence
        "mobile_speed": 0,      # PageSpeed mobile perf proxy
        "hygiene": 0,           # small bonus items
    }

    # Crawlability (20)
    crawl = 0
    crawl += 10 if robots.get("ok") else 0
    crawl += 10 if sitemap.get("ok") else 0
    breakdown["crawlability"] = crawl

    # On-page essentials (35)
    on_page = 0
    on_page += 10 if homepage.get("title") else 0
    on_page += 10 if homepage.get("metaDescription") else 0
    h1_count = homepage.get("h1Count")
    if isinstance(h1_count, int):
        if h1_count == 1:
            on_page += 10
        elif h1_count > 1:
            on_page += 6
            issues.append("Multiple H1 headings detected (recommend 1 primary H1).")
        else:
            issues.append("No H1 heading detected on homepage.")
    else:
        # Unknown H1 count -> conservative partial credit
        on_page += 5

    txt_len = homepage.get("homepageTextLength")
    if isinstance(txt_len, int):
        if txt_len >= 1200:
            on_page += 5
        elif txt_len >= 600:
            on_page += 3
        else:
            issues.append("Homepage appears thin on crawlable text (may reduce relevance signals).")
    breakdown["on_page"] = min(35, on_page)

    # Structured data (10)
    breakdown["structured_data"] = 10 if homepage.get("hasStructuredData") else 0

    # Mobile speed proxy (25)
    mobile_speed = 10
    try:
        if pagespeed and isinstance(pagespeed, dict):
            mobile = (pagespeed.get("mobile") or {}) if isinstance(pagespeed.get("mobile"), dict) else {}
            perf = mobile.get("performanceScore")
            if isinstance(perf, int):
                mobile_speed = int(round(max(0, min(100, perf)) * 0.25))
    except Exception:
        pass
    breakdown["mobile_speed"] = max(0, min(25, mobile_speed))

    # Hygiene (10)
    hygiene = 0
    hygiene += 5 if homepage.get("contactCTA") else 0
    hygiene += 5 if homepage.get("metaDescription") else 0
    breakdown["hygiene"] = hygiene

    score = max(0, min(100, int(sum(breakdown.values()))))

    # Speed section
    speed_score = None
    if pagespeed and isinstance(pagespeed, dict):
        mobile = (pagespeed.get("mobile") or {}) if isinstance(pagespeed.get("mobile"), dict) else {}
        desktop = (pagespeed.get("desktop") or {}) if isinstance(pagespeed.get("desktop"), dict) else {}
        m = mobile.get("performanceScore")
        d = desktop.get("performanceScore")
        vals = [v for v in [m, d] if isinstance(v, int)]
        if vals:
            speed_score = int(round(sum(vals) / len(vals)))

    # UX/Conversion
    ux_highlights: List[str] = []
    ux_issues: List[str] = []
    ux_score = 70
    ux_details: Dict[str, Any] = {}
    ux_recs: List[str] = []

    if isinstance(uiux, dict) and uiux:
        # Prefer dedicated analyzer scores when available
        try:
            ux_score = int(round(float(uiux.get("overall_score", ux_score))))
        except Exception:
            pass
        ux_details = uiux.get("details") if isinstance(uiux.get("details"), dict) else {}
        ux_recs = uiux.get("recommendations") if isinstance(uiux.get("recommendations"), list) else []

        # Map key issues into the main report fields for readability
        acc_issues = ((ux_details.get("accessibility") or {}).get("issues") if isinstance(ux_details, dict) else None)
        if isinstance(acc_issues, list):
            ux_issues.extend([str(x) for x in acc_issues if x])
        # Homepage CTA heuristic still valuable
        if homepage.get("contactCTA"):
            ux_highlights.append("Clear CTA detected on homepage.")
        else:
            ux_issues.append("Primary CTA could not be structurally confirmed on homepage.")
        if not ux_highlights:
            if ux_score >= 80:
                # Safe narrative guard: avoid contradicting a strong UX score with an empty-negative fallback.
                ux_highlights.append(
                    "Strong usability signals were detected overall; focus next on sharpening CTA intent and conversion paths."
                )
            elif not ux_issues:
                ux_issues.append("No conversion positives detected.")
    else:
        # fallback heuristics
        if homepage.get("contactCTA"):
            ux_highlights.append("Clear CTA detected on homepage.")
        else:
            ux_issues.append("Primary CTA could not be structurally confirmed on homepage.")
            ux_score -= 10
        if speed_score is not None and speed_score < 50:
            ux_issues.append("PageSpeed performance is low; may harm conversions.")
            ux_score -= 10
        ux_score = max(0, min(100, ux_score))

    # Content Quality (NEW: multi-page analysis)
    cq = compute_content_quality(homepage, content_pages or [], site_type=site_type)

    return {
        "technicalSEO": {
            "score": score,
            "issues": issues,
            "strengths": strengths,
            "breakdown": breakdown,
            # ✅ Canonical key expected by Node PDF + UI
            "pageSpeed": pagespeed if isinstance(pagespeed, dict) else None,
        },
        "speedPerformance": {
            "score": speed_score if speed_score is not None else "—",
            "notes": "Derived from PageSpeed if configured." if speed_score is not None else "Not available (no PageSpeed API key).",
            "mobile": (pagespeed or {}).get("mobile") if isinstance(pagespeed, dict) else None,
            "desktop": (pagespeed or {}).get("desktop") if isinstance(pagespeed, dict) else None,
        },
        "contentQuality": {
            "score": cq.get("score", 0),
            "strengths": cq.get("strengths", []),
            "gaps": cq.get("gaps", []),
            "recommendations": cq.get("recommendations", []),
            "meta": cq.get("meta", {}),
        },
        "uxConversion": {
            "score": ux_score,
            "highlights": ux_highlights,
            "issues": ux_issues,
            "estimatedUplift": "N/A",
            "details": ux_details,
            "recommendations": ux_recs,
        },
        "contentGaps": cq.get("gaps", []),
    }
