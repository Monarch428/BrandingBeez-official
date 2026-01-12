from __future__ import annotations

from typing import Any, Dict, Optional


def _avg_int(*vals: Any) -> Optional[int]:
    nums = [v for v in vals if isinstance(v, (int, float))]
    if not nums:
        return None
    return int(round(sum(float(v) for v in nums) / len(nums)))


def build_seo_signals(
    homepage: Dict[str, Any],
    robots_sitemap: Dict[str, Any],
    pagespeed: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Best-effort SEO scoring using only data we actually collected.

    IMPORTANT: This is NOT true "Domain Authority" (which needs Moz/Ahrefs/SEMrush).
    It is an *On‑Page SEO + Lighthouse SEO* score so your report doesn't show hardcoded 0.
    """

    robots = (robots_sitemap or {}).get("robots", {}) or {}
    sitemap = (robots_sitemap or {}).get("sitemap", {}) or {}

    # Lighthouse SEO score (0-100) if PageSpeed is configured
    psi_mobile = (pagespeed or {}).get("mobile") or {}
    psi_desktop = (pagespeed or {}).get("desktop") or {}
    psi_seo = _avg_int(psi_mobile.get("seoScore"), psi_desktop.get("seoScore"))

    # On-page heuristic score
    onpage = 100
    notes_bits = []

    if not homepage.get("title"):
        onpage -= 15
        notes_bits.append("Missing <title> tag")
    if not homepage.get("metaDescription"):
        onpage -= 10
        notes_bits.append("Missing meta description")
    if not homepage.get("hasStructuredData"):
        onpage -= 10
        notes_bits.append("No structured data detected")
    if not robots.get("ok"):
        onpage -= 15
        notes_bits.append("robots.txt missing/unreachable")
    if not sitemap.get("ok"):
        onpage -= 15
        notes_bits.append("sitemap.xml missing/unreachable")

    onpage = max(0, min(100, int(onpage)))

    # Final SEO score = weighted blend when PSI exists, otherwise on-page only
    if psi_seo is not None:
        score = int(round(0.6 * psi_seo + 0.4 * onpage))
        score_notes = (
            "Score = 60% PageSpeed(Lighthouse SEO) + 40% on-page hygiene (title/meta/robots/sitemap/schema). "
            "Backlinks/true authority require Moz/Ahrefs/SEMrush." +
            (f" Issues: {', '.join(notes_bits)}." if notes_bits else "")
        )
    else:
        score = onpage
        score_notes = (
            "Score derived from on-page hygiene only (no PageSpeed SEO score available). "
            "Backlinks/true authority require Moz/Ahrefs/SEMrush." +
            (f" Issues: {', '.join(notes_bits)}." if notes_bits else "")
        )

    return {
        # Kept as domainAuthority to avoid breaking the current PDF section naming.
        # It is documented as 'on-page + Lighthouse SEO score' in notes.
        "domainAuthority": {
            "score": score,
            "benchmark": None,
            "notes": score_notes,
        },
        "backlinks": {
            "totalBacklinks": "N/A",
            "referringDomains": "N/A",
            "linkQualityScore": "N/A",
            "notes": "Not available: requires backlink provider integration.",
        },
        "lighthouseSEO": {
            "mobile": psi_mobile.get("seoScore"),
            "desktop": psi_desktop.get("seoScore"),
        },
    }
