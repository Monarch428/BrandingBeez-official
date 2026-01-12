
from __future__ import annotations

from typing import Any, Dict, List, Optional

from app.signals.content_quality import compute_content_quality


def build_website_signals(
    homepage: Dict[str, Any],
    robots_sitemap: Dict[str, Any],
    pagespeed: Optional[Dict[str, Any]] = None,
    content_pages: Optional[List[Dict[str, Any]]] = None,
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

    # Technical SEO score (simple baseline)
    score = 100
    joined = " ".join(issues).lower()
    score -= 20 if "robots.txt" in joined else 0
    score -= 20 if "sitemap.xml" in joined else 0
    score -= 20 if "structured data" in joined else 0
    score = max(0, min(100, score))

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

    # UX/Conversion (light heuristics)
    ux_highlights: List[str] = []
    ux_issues: List[str] = []
    ux_score = 70
    if homepage.get("contactCTA"):
        ux_highlights.append("Clear CTA detected on homepage.")
    else:
        ux_issues.append("No clear primary CTA detected on homepage.")
        ux_score -= 10
    if speed_score is not None and speed_score < 50:
        ux_issues.append("PageSpeed performance is low; may harm conversions.")
        ux_score -= 10
    ux_score = max(0, min(100, ux_score))

    # Content Quality (NEW: multi-page analysis)
    cq = compute_content_quality(homepage, content_pages or [])

    return {
        "technicalSEO": {
            "score": score,
            "issues": issues,
            "strengths": strengths,
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
        },
        "contentGaps": cq.get("gaps", []),
    }
