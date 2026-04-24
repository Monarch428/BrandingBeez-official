from __future__ import annotations

from typing import Any, Dict, List

import re
from difflib import SequenceMatcher

from app.pipeline.recommendation_engine import (
    build_missing_h1_recommendation,
    build_missing_page_recommendation,
    derive_site_context,
)
from app.signals.detection_utils import (
    deduplicate_list_preserve_order,
    detect_case_studies,
    detect_site_proof_signals,
    detect_testimonials,
)


def _norm(s: Any) -> str:
    if not isinstance(s, str):
        return ""
    return re.sub(r"\s+", " ", s).strip().lower()


def _similar(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(a=a, b=b).ratio()


def _contains_fuzzy(hay: str, needles: List[str], threshold: float = 0.82) -> bool:
    h = _norm(hay)
    if not h:
        return False
    for n in needles:
        n2 = _norm(n)
        if not n2:
            continue
        if n2 in h:
            return True
        parts = re.split(r"[^a-z0-9]+", h)
        parts = [p for p in parts if p]
        for p in parts:
            if _similar(p, n2) >= threshold:
                return True
    return False


def _page_text_for_intent(p: Dict[str, Any]) -> str:
    bits: List[str] = []
    for k in ("url", "title", "h1", "firstH1", "textSnippet"):
        v = p.get(k)
        if isinstance(v, str) and v.strip():
            bits.append(v)
    nav = p.get("navLabels")
    if isinstance(nav, list):
        bits.extend([x for x in nav if isinstance(x, str)])
    return "\n".join(bits)


def _is_category(p: Dict[str, Any], cat: str) -> bool:
    txt = _page_text_for_intent(p)
    url = _norm(p.get("url"))
    if cat == "services":
        return (
            any(x in url for x in ("/services", "/service", "/what-we-do", "/solutions", "/offer"))
            or _contains_fuzzy(txt, ["services", "service", "solutions", "offerings", "what we do", "capabilities"], 0.8)
        )
    if cat == "about":
        return any(x in url for x in ("/about", "/our-story", "/company", "/team")) or _contains_fuzzy(txt, ["about", "our story", "company", "team"], 0.82)
    if cat == "contact":
        return any(x in url for x in ("/contact", "/get-in-touch", "/getintouch")) or _contains_fuzzy(txt, ["contact", "get in touch", "talk to", "book a call"], 0.8)
    if cat == "blog":
        return any(x in url for x in ("/blog", "/insights", "/resources", "/news")) or _contains_fuzzy(txt, ["blog", "insights", "resources"], 0.82)
    if cat == "pricing":
        return any(x in url for x in ("/pricing", "/packages", "/plans")) or bool(p.get("hasPricing") or p.get("hasPricingSignals")) or _contains_fuzzy(txt, ["pricing", "packages", "plans"], 0.82)
    if cat == "faq":
        return bool(p.get("hasFaq") or p.get("hasFAQ")) or _contains_fuzzy(txt, ["faq", "frequently asked"], 0.82)
    if cat == "case":
        return bool(p.get("hasCaseStudies") or p.get("hasCaseStudySignals")) or any(x in url for x in ("/case", "/case-studies", "/portfolio", "/work", "/projects")) or _contains_fuzzy(txt, ["case study", "portfolio", "our work"], 0.78)
    if cat == "testimonials":
        return bool(p.get("hasTestimonials") or p.get("hasTestimonialsSignals")) or _contains_fuzzy(txt, ["testimonials", "reviews"], 0.82)
    return False


def _pick(pages: List[Dict[str, Any]], predicate) -> bool:
    for p in pages:
        try:
            if predicate(p):
                return True
        except Exception:
            continue
    return False


def _make_action(title: str, source: str, impact: str, effort: str, details: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "title": title,
        "sourceSection": source,
        "impact": impact,
        "effort": effort,
        "urgency": "high" if impact == "high" else "medium",
        "confidence": 0.85,
        "pillar": "seo" if "H1" in title or "page" in title.lower() else "trust",
        "kpis": ["organic visibility", "conversion rate"],
        "details": details,
    }


def compute_content_quality(
    homepage: Dict[str, Any],
    pages: List[Dict[str, Any]],
    *,
    site_type: str | None = None,
    company_name: str | None = None,
    website: str | None = None,
    services: List[str] | None = None,
    target_market: str | None = None,
    location: str | None = None,
) -> Dict[str, Any]:
    strengths: List[str] = []
    gaps: List[str] = []
    recs: List[str] = []
    recommendation_details: List[Dict[str, Any]] = []
    action_candidates: List[Dict[str, Any]] = []

    all_pages = []
    hp_url = homepage.get("url") or "/"
    if hp_url:
        all_pages.append(
            {
                "url": hp_url,
                "title": homepage.get("title"),
                "textSnippet": homepage.get("text"),
                "wordCount": homepage.get("homepageTextLength", 0) // 5,
            }
        )
    all_pages.extend(pages or [])

    evidence_bits: List[str] = []
    for key in ("title", "metaDescription", "text", "html"):
        value = homepage.get(key)
        if isinstance(value, str) and value.strip():
            evidence_bits.append(value)
    for page in all_pages:
        if not isinstance(page, dict):
            continue
        for key in ("url", "title", "h1", "firstH1", "textSnippet"):
            value = page.get(key)
            if isinstance(value, str) and value.strip():
                evidence_bits.append(value)
        nav = page.get("navLabels")
        if isinstance(nav, list):
            evidence_bits.extend([str(item) for item in nav if isinstance(item, str) and item.strip()])

    evidence_blob = "\n".join(evidence_bits)
    site_context = derive_site_context(
        company_name=company_name or "",
        website=website or (homepage.get("url") or ""),
        homepage=homepage or {},
        services=services or [],
        target_market=target_market,
        location=location,
    )

    has_services = _pick(all_pages, lambda p: _is_category(p, "services"))
    has_about = _pick(all_pages, lambda p: _is_category(p, "about"))
    has_contact = _pick(all_pages, lambda p: _is_category(p, "contact"))
    has_blog = _pick(all_pages, lambda p: _is_category(p, "blog"))
    has_pricing = _pick(all_pages, lambda p: _is_category(p, "pricing"))
    has_faq = _pick(all_pages, lambda p: _is_category(p, "faq"))
    proof_signals = detect_site_proof_signals(evidence_blob)
    case_hits = detect_case_studies(evidence_blob)
    testimonial_hits = detect_testimonials(evidence_blob)
    has_case = _pick(all_pages, lambda p: _is_category(p, "case")) or bool(case_hits)
    has_testimonials = _pick(all_pages, lambda p: _is_category(p, "testimonials")) or bool(testimonial_hits)

    word_counts = [int(p.get("wordCount") or 0) for p in pages or [] if isinstance(p, dict)]
    avg_words = int(sum(word_counts) / len(word_counts)) if word_counts else 0
    thin_pages = [p for p in (pages or []) if int(p.get("wordCount") or 0) < 250]

    hp_title = bool(homepage.get("title"))
    hp_meta = bool(homepage.get("metaDescription"))
    hp_h1 = int(homepage.get("h1Count") or 0)

    if hp_title:
        strengths.append("Homepage has a clear page title (good for SEO and click-through).")
    else:
        gaps.append("Homepage title tag is missing or empty.")
        recs.append("Write a homepage title that states the main service, audience, and value proposition.")

    if hp_meta:
        strengths.append("Homepage has a meta description (helps search snippet quality).")
    else:
        gaps.append("Homepage meta description is missing.")
        recs.append("Write a meta description that explains the offer, audience, and next step.")

    if hp_h1 == 1:
        strengths.append("Homepage uses a clean single H1 structure.")
    elif hp_h1 == 0:
        gaps.append("Homepage has no H1 heading.")
        detail = build_missing_h1_recommendation(
            page_url=hp_url,
            page_label="homepage",
            site_context=site_context,
            primary_keywords=(services or [])[:3],
        )
        recommendation_details.append(detail)
        recs.append(f"{detail['recommendation']} Suggested H1s: {', '.join(detail['suggestedVariants'][:3])}.")
        action_candidates.append(_make_action("Add homepage H1 and strengthen hero messaging", "websiteDigitalPresence", "high", "low", detail))
    else:
        gaps.append("Homepage has multiple H1 headings (can confuse SEO structure).")
        recs.append("Keep one primary H1 on the homepage and use H2/H3 for section hierarchy.")

    if avg_words >= 450:
        strengths.append("Key pages have healthy content depth on average.")
    elif avg_words > 0:
        gaps.append("Many pages are thin on content (low word count).")
        recs.append("Expand key pages with clearer positioning, proof, FAQs, and CTA support.")

    if thin_pages:
        gaps.append(f"{len(thin_pages)} internal pages appear thin (<250 words).")
        recs.append("Increase content depth on thin pages and add section headings, proof, and CTA blocks.")

    if site_type == "content_site":
        if has_blog:
            strengths.append("Content/archive structure appears present, which suits a content-led site.")
        else:
            gaps.append("A clear content archive or topic hub could not be structurally confirmed.")
            recs.append("Create a clearer blog, insights, or resource hub to strengthen discovery and internal linking.")
    elif has_services:
        strengths.append("Service information pages are present (good for conversions).")
    else:
        gaps.append("Dedicated services content could not be structurally confirmed.")
        detail = build_missing_page_recommendation(page_type="services", site_context=site_context, keyword_cluster=services or [])
        recommendation_details.append(detail)
        recs.append(f"{detail['recommendation']} Suggested pages: {', '.join(detail['suggestedVariants'][:4])}.")
        action_candidates.append(_make_action("Create Services page and service landing pages", "websiteDigitalPresence", "high", "medium", detail))

    if has_about:
        strengths.append("About/Company content appears present (builds trust).")
    else:
        gaps.append("No About page detected.")
        detail = build_missing_page_recommendation(page_type="about", site_context=site_context)
        recommendation_details.append(detail)
        recs.append(f"{detail['recommendation']} Suggested sections: {', '.join(detail['suggestedVariants'][:3])}.")
        action_candidates.append(_make_action("Create About page with trust-building content", "websiteDigitalPresence", "medium", "low", detail))

    if has_contact:
        strengths.append("Contact page appears present.")
    elif site_type != "content_site":
        gaps.append("No Contact page detected.")
        detail = build_missing_page_recommendation(page_type="contact", site_context=site_context)
        recommendation_details.append(detail)
        recs.append(f"{detail['recommendation']} Suggested CTA labels: {', '.join(detail['suggestedVariants'][:3])}.")
        action_candidates.append(_make_action("Create Contact page with stronger CTA path", "websiteDigitalPresence", "high", "low", detail))

    if has_case:
        strengths.append(f'Case-study or portfolio signal detected: "{case_hits[0]}".' if case_hits else "Case study / results content appears present (strong proof).")
    else:
        gaps.append("Case studies or project proof could not be structurally confirmed.")
        recs.append("Publish 2–5 case studies with outcomes, process summary, and a CTA to start a conversation.")

    if has_testimonials:
        strengths.append(f'Testimonial or review signal detected: "{testimonial_hits[0]}".' if testimonial_hits else "Testimonials/reviews content appears present (social proof).")
    else:
        gaps.append("Testimonials are likely present but could not be structurally extracted." if not proof_signals.get("trustSignals") else "Trust signals are present, but not fully extractable in structured form.")
        recs.append("Add testimonials or public-review proof near hero, service-page CTA, and proposal request sections.")

    if has_faq:
        strengths.append("FAQ content appears present (helps conversions and long-tail SEO).")
    elif site_type != "content_site":
        gaps.append("No FAQ section detected.")
        recs.append("Add FAQs to key conversion pages to answer common objections and reduce sales friction.")

    if has_pricing:
        strengths.append("Pricing/package signals found (reduces friction for leads).")
    elif site_type != "content_site":
        recs.append("If suitable for your business, add pricing ranges or package structure to reduce lead friction.")

    if has_blog:
        strengths.append("Blog/insights content appears present (helps ongoing SEO).")
    elif site_type != "content_site":
        recs.append("If SEO growth matters, add an Insights/Blog section and publish consistently.")

    score = 100
    score -= 10 if not hp_title else 0
    score -= 8 if not hp_meta else 0
    score -= 6 if hp_h1 != 1 else 0
    score -= 12 if (site_type != "content_site" and not has_services) else 0
    score -= 8 if not has_about else 0
    score -= 10 if not has_case else 0
    score -= 6 if not has_testimonials else 0
    score -= 6 if (site_type != "content_site" and not has_faq) else 0
    score -= 8 if thin_pages else 0
    score = max(0, min(100, score))

    def dedupe(items: List[str]) -> List[str]:
        seen = set()
        out = []
        for it in items:
            if it not in seen:
                seen.add(it)
                out.append(it)
        return out

    strengths = dedupe(deduplicate_list_preserve_order(strengths))
    gaps = dedupe(deduplicate_list_preserve_order(gaps))
    recs = dedupe(deduplicate_list_preserve_order(recs))

    return {
        "score": score,
        "strengths": strengths,
        "gaps": gaps,
        "recommendations": recs,
        "recommendationDetails": recommendation_details,
        "actionCandidates": action_candidates,
        "meta": {
            "pagesAnalyzed": len(pages or []),
            "avgWords": avg_words,
            "caseStudySignals": case_hits,
            "testimonialSignals": testimonial_hits,
            "trustSignals": proof_signals.get("trustSignals", []),
            "siteType": site_type,
        },
    }
