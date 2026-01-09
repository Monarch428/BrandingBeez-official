from typing import Any, Dict, List

def build_website_signals(homepage: Dict[str, Any], robots_sitemap: Dict[str, Any], pagespeed: Dict[str, Any] | None) -> Dict[str, Any]:
    issues: List[str] = []
    strengths: List[str] = []

    if not robots_sitemap.get("robots", {}).get("ok"):
        issues.append("robots.txt missing/unreachable.")
    if not robots_sitemap.get("sitemap", {}).get("ok"):
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
    score -= 20 if "robots.txt" in " ".join(issues).lower() else 0
    score -= 20 if "sitemap.xml" in " ".join(issues).lower() else 0
    score -= 20 if "Structured data" in " ".join(issues) else 0
    score = max(0, min(100, score))

    # Content quality
    cq_strengths = []
    if homepage.get("homepageTextLength", 0) > 500:
        cq_strengths.append("Adequate homepage text content")
    if homepage.get("h1Count", 0) == 1:
        cq_strengths.append("Single clear H1 structure")

    content_score = 100 if cq_strengths else 60

    # UX conversion (use page speed if available)
    ux_score = 80
    ux_issues = []
    ux_highlights = []

    if pagespeed:
        mob = pagespeed.get("mobile", {})
        desk = pagespeed.get("desktop", {})
        if mob.get("performanceScore") is not None:
            ux_highlights.append(f"Mobile performance score: {mob['performanceScore']}/100")
            ux_score = int((ux_score + mob["performanceScore"]) / 2)
        if desk.get("performanceScore") is not None:
            ux_highlights.append(f"Desktop performance score: {desk['performanceScore']}/100")
            ux_score = int((ux_score + desk["performanceScore"]) / 2)

        # map top opportunities
        for o in (mob.get("opportunities") or [])[:5]:
            ux_issues.append(o.get("title"))
        for o in (desk.get("opportunities") or [])[:5]:
            if o.get("title") not in ux_issues:
                ux_issues.append(o.get("title"))

    return {
        "technicalSEO": {
            "score": score,
            "strengths": strengths,
            "issues": issues,
            "pageSpeed": pagespeed,
        },
        "contentQuality": {
            "score": content_score,
            "strengths": cq_strengths,
            "gaps": [],
            "recommendations": [],
        },
        "uxConversion": {
            "score": ux_score,
            "highlights": ux_highlights,
            "issues": ux_issues,
            "estimatedUplift": "N/A",
        },
        "contentGaps": [],
    }
