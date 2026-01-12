
from __future__ import annotations

from typing import Any, Dict, List, Tuple


def _pick(pages: List[Dict[str, Any]], predicate) -> bool:
    for p in pages:
        try:
            if predicate(p):
                return True
        except Exception:
            continue
    return False


def compute_content_quality(homepage: Dict[str, Any], pages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Returns:
      score: int (0-100)
      strengths: List[str]
      gaps: List[str]
      recommendations: List[str]
      meta: debug payload (optional)
    """
    strengths: List[str] = []
    gaps: List[str] = []
    recs: List[str] = []

    # Combine homepage with fetched internal pages
    all_pages = []
    hp_url = homepage.get("url")
    if hp_url:
        all_pages.append({"url": hp_url, "wordCount": homepage.get("homepageTextLength", 0) // 5})
    all_pages.extend(pages or [])

    # Coverage checks
    has_services = _pick(all_pages, lambda p: "service" in (p.get("url", "").lower()) or "services" in (p.get("url", "").lower()))
    has_about = _pick(all_pages, lambda p: "about" in (p.get("url", "").lower()))
    has_contact = _pick(all_pages, lambda p: "contact" in (p.get("url", "").lower()))
    has_blog = _pick(all_pages, lambda p: "blog" in (p.get("url", "").lower()) or "insights" in (p.get("url", "").lower()))
    has_pricing = _pick(all_pages, lambda p: bool(p.get("hasPricing")))
    has_faq = _pick(all_pages, lambda p: bool(p.get("hasFaq")))
    has_case = _pick(all_pages, lambda p: bool(p.get("hasCaseStudies")))
    has_testimonials = _pick(all_pages, lambda p: bool(p.get("hasTestimonials")))

    # Depth checks (word count)
    word_counts = [int(p.get("wordCount") or 0) for p in pages or [] if isinstance(p, dict)]
    avg_words = int(sum(word_counts) / len(word_counts)) if word_counts else 0
    thin_pages = [p for p in (pages or []) if int(p.get("wordCount") or 0) < 250]

    # On-page basics
    hp_title = bool(homepage.get("title"))
    hp_meta = bool(homepage.get("metaDescription"))
    hp_h1 = int(homepage.get("h1Count") or 0)

    if hp_title:
        strengths.append("Homepage has a clear page title (good for SEO + click-through).")
    else:
        gaps.append("Homepage title tag is missing or empty.")
        recs.append("Add a descriptive homepage title (include primary service + location).")

    if hp_meta:
        strengths.append("Homepage has a meta description (helps search snippet quality).")
    else:
        gaps.append("Homepage meta description is missing.")
        recs.append("Write a compelling meta description (value proposition + CTA).")

    if hp_h1 == 1:
        strengths.append("Homepage uses a clean single H1 structure.")
    elif hp_h1 == 0:
        gaps.append("Homepage has no H1 heading.")
        recs.append("Add one clear H1 that states your primary offer.")
    else:
        gaps.append("Homepage has multiple H1 headings (can confuse SEO structure).")
        recs.append("Keep one primary H1 per page; use H2/H3 for sections.")

    # Content depth
    if avg_words >= 450:
        strengths.append("Service/site pages have healthy content depth on average.")
    elif avg_words > 0:
        gaps.append("Many pages are thin on content (low word count).")
        recs.append("Expand key pages with benefits, process, FAQs, and proof (aim 400–800 words).")

    if thin_pages:
        gaps.append(f"{len(thin_pages)} internal pages appear thin (<250 words).")
        recs.append("Increase content depth on thin pages and add section headings (H2/H3) for structure.")

    # Coverage/structure (user friendly)
    if has_services:
        strengths.append("Service information pages are present (good for conversions).")
    else:
        gaps.append("No clear Services page detected.")
        recs.append("Create a dedicated Services page listing each service, outcomes, and CTAs.")

    if has_about:
        strengths.append("About/Company content appears present (builds trust).")
    else:
        gaps.append("No About page detected.")
        recs.append("Add an About page with team, credibility, and experience.")

    if has_contact:
        strengths.append("Contact page appears present.")
    else:
        gaps.append("No Contact page detected.")
        recs.append("Add a Contact page with a short form, phone/email, and a clear CTA.")

    # Proof / credibility
    if has_case:
        strengths.append("Case study / results content appears present (strong proof).")
    else:
        gaps.append("No clear case studies/results content detected.")
        recs.append("Publish 2–5 case studies with metrics, process, and outcomes.")

    if has_testimonials:
        strengths.append("Testimonials/reviews content appears present (social proof).")
    else:
        gaps.append("No dedicated testimonials section detected.")
        recs.append("Add testimonials to key pages and link to Google reviews.")

    # Helpful extras
    if has_faq:
        strengths.append("FAQ content appears present (helps conversions + long-tail SEO).")
    else:
        gaps.append("No FAQ section detected.")
        recs.append("Add FAQs to services pages to answer common objections.")

    if has_pricing:
        strengths.append("Pricing/package signals found (reduces friction for leads).")
    else:
        recs.append("If suitable for your business, add pricing ranges or packages to reduce lead friction.")

    if has_blog:
        strengths.append("Blog/insights content appears present (helps ongoing SEO).")
    else:
        recs.append("If you want SEO growth: add an Insights/Blog section and publish consistently.")

    # Score (simple but meaningful)
    score = 100
    score -= 10 if not hp_title else 0
    score -= 8 if not hp_meta else 0
    score -= 6 if hp_h1 != 1 else 0
    score -= 12 if not has_services else 0
    score -= 8 if not has_about else 0
    score -= 10 if not has_case else 0
    score -= 6 if not has_testimonials else 0
    score -= 6 if not has_faq else 0
    score -= 8 if thin_pages else 0
    score = max(0, min(100, score))

    # Deduplicate while preserving order
    def dedupe(items: List[str]) -> List[str]:
        seen = set()
        out = []
        for it in items:
            if it not in seen:
                seen.add(it)
                out.append(it)
        return out

    strengths = dedupe(strengths)
    gaps = dedupe(gaps)
    recs = dedupe(recs)

    return {
        "score": score,
        "strengths": strengths,
        "gaps": gaps,
        "recommendations": recs,
        "meta": {
            "pagesAnalyzed": len(pages or []),
            "avgWords": avg_words,
        },
    }
