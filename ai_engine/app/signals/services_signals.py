from __future__ import annotations

from typing import Any, Dict, List
import re

from app.signals.detection_utils import (
    deduplicate_list_preserve_order,
    detect_case_studies,
    detect_site_proof_signals,
    detect_site_type,
    detect_services,
    has_generic_service_cues,
    is_non_service_text,
)


def _norm_text(s: Any) -> str:
    return (s or "").strip().lower() if isinstance(s, str) else ""


# Common marketing/agency service keywords -> canonical service name
SERVICE_MAP = [
    (r"\bseo\b|search engine optimization", "SEO"),
    (r"\bppc\b|pay per click|google ads|adwords", "PPC / Google Ads"),
    (r"\bsocial media\b|facebook ads|instagram ads|tiktok ads|linkedin ads", "Social Media Marketing"),
    (r"\bweb design\b|website design|ui/ux|ux design|web development|website development", "Web Design & Development"),
    (r"\bapp development\b|mobile app development|ios app|android app", "App Development"),
    (r"\bbranding\b|brand identity|logo design", "Branding & Identity"),
    (r"\bcontent marketing\b|copywriting|blog writing|content strategy", "Content Marketing"),
    (r"\bemail marketing\b|newsletter|klaviyo|mailchimp", "Email Marketing"),
    (r"\bconversion\b|cro\b|conversion rate optimization|landing page", "Conversion Rate Optimisation"),
    (r"\bcrm\b|hubspot|salesforce|marketing automation", "CRM & Automation"),
    (r"\bvideo\b|videography|motion graphics|animation", "Video & Creative Production"),
    (r"\bgraphic design\b|design studio|creative studio", "Graphic Design"),
    (r"\bpr\b|public relations", "PR"),
]

INDUSTRY_KEYWORDS = [
    (r"\becommerce\b|shopify|woocommerce", "Ecommerce"),
    (r"\bsaas\b|software", "SaaS"),
    (r"\bhealth\b|clinic|medical|dental", "Healthcare"),
    (r"\bestate\b|property|realtor", "Real Estate"),
    (r"\bfinance\b|bank|insurance", "Finance"),
    (r"\beducation\b|school|university|training", "Education"),
    (r"\bhospitality\b|hotel|restaurant", "Hospitality"),
    (r"\bconstruction\b|builder", "Construction"),
    (r"\blegal\b|law firm|solicitor", "Legal"),
    (r"\bmanufactur", "Manufacturing"),
]


def _extract_services_from_text(text: str) -> List[str]:
    found: List[str] = []
    t = text.lower()
    for pat, name in SERVICE_MAP:
        if re.search(pat, t, re.IGNORECASE):
            found.append(name)
    out: List[str] = []
    seen = set()
    for s in found:
        k = s.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(s)
    return out


def _extract_industries_from_text(text: str) -> List[str]:
    found: List[str] = []
    t = text.lower()
    for pat, name in INDUSTRY_KEYWORDS:
        if re.search(pat, t, re.IGNORECASE):
            found.append(name)
    out: List[str] = []
    seen = set()
    for s in found:
        k = s.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(s)
    return out


def _collect_text_values(source: Dict[str, Any] | None, keys: tuple) -> List[str]:
    out: List[str] = []
    if not isinstance(source, dict):
        return out
    for key in keys:
        value = source.get(key)
        if isinstance(value, str) and value.strip():
            out.append(value)
        elif isinstance(value, list):
            out.extend([str(item) for item in value if isinstance(item, str) and item.strip()])
    return out


def _service_description_from_name(name: str, target_market: str | None = None) -> str | None:
    lower = (name or "").strip().lower()
    if not lower:
        return None
    if "white-label seo" in lower or "white label seo" in lower:
        return "SEO services provided to other agencies under their brand."
    if "white-label design" in lower or "white label design" in lower:
        return "Design services provided to other agencies under their brand."
    if "white-label" in lower or "white label" in lower:
        return "White-label fulfilment delivered under the partner agency's brand."
    if "answer engine" in lower or "aeo" in lower:
        return "Answer Engine Optimisation to improve AI and voice search visibility."
    if "seo" in lower:
        return "Search visibility and organic growth support focused on rankings, qualified traffic, and lead generation."
    if "ppc" in lower or "google ads" in lower:
        return "Paid acquisition management focused on lead quality, conversion intent, and spend efficiency."
    if "social media" in lower:
        return "Social campaign planning and execution designed to improve reach, engagement, and lead generation."
    if "web design" in lower or "web development" in lower or "website" in lower:
        return "Website design and development focused on clarity, conversion, and commercial credibility."
    if "branding" in lower or "brand identity" in lower:
        return "Brand identity and messaging support to improve differentiation and trust."
    if "content marketing" in lower:
        return "Content strategy and production designed to support SEO, trust-building, and demand capture."
    if "email marketing" in lower:
        return "Email lifecycle and campaign support to improve nurture, retention, and reactivation."
    if "conversion" in lower or "cro" in lower:
        return "Conversion-rate optimisation focused on CTA clarity, landing-page performance, and lead quality."
    if "crm" in lower or "automation" in lower:
        return "CRM and automation setup to reduce manual work and improve follow-up consistency."
    if "graphic design" in lower or "design" in lower:
        return "Graphic design and creative production to support brand, content, and campaign needs."
    if "video" in lower or "photography" in lower:
        return "Video and photography production for brand, social, and commercial content."
    if "business development" in lower or "consultancy" in lower:
        return "Business development and consultancy support to identify growth levers and build partnerships."
    if "ai" in lower:
        return "AI-enabled services designed to improve delivery efficiency, insight generation, or automation."
    return None


def _service_target_market_from_name(name: str, target_market: str | None = None) -> str | None:
    lower = (name or "").lower()
    tm = (target_market or "").strip()
    if "white-label" in lower or "white label" in lower:
        return tm or "Agencies needing outsourced fulfilment support"
    return tm or None


def _is_scraped_service_valid(s: Dict[str, Any]) -> bool:
    """Check if a scraped service entry represents a real service, not noise."""
    if not isinstance(s, dict):
        return False
    name = (s.get("name") or "").strip()
    if not name:
        return False
    # Apply the non-service filter
    if is_non_service_text(name):
        return False
    return True


def build_services_signals(
    homepage: Dict[str, Any] | None = None,
    pages: List[Dict[str, Any]] | None = None,
    scraped_services: List[Dict[str, Any]] | None = None,
    *,
    company_name: str | None = None,
    website: str | None = None,
    location: str | None = None,
    target_market: str | None = None,
    screenshots_text: Any = None,
    site_type: str | None = None,
    page_registry: Dict[str, Any] | None = None,
    **kwargs,
) -> Dict[str, Any]:
    """
    Deterministic, best-effort services extraction using already-fetched content pages.
    Filters out FAQ titles, CTA headings, package labels, case-study names, step labels,
    slogans, and other non-service noise before adding anything to the services list.
    """
    homepage = homepage or {}
    pages = pages or []
    scraped_services = scraped_services or []

    # Build combined text evidence
    chunks: List[str] = []
    if isinstance(homepage.get("title"), str):
        chunks.append(homepage["title"])
    if isinstance(homepage.get("metaDescription"), str):
        chunks.append(homepage["metaDescription"])
    if isinstance(homepage.get("text"), str):
        chunks.append(homepage["text"])
    chunks.extend(_collect_text_values(homepage, ("h1", "headings", "ocrText", "screenshotText", "imageText", "heroText")))

    page_html_chunks: List[str] = []
    for p in pages:
        if not isinstance(p, dict):
            continue
        for k in ("title", "metaDescription", "textSnippet", "h1"):
            if isinstance(p.get(k), str) and p.get(k).strip():
                chunks.append(p[k])
        chunks.extend(_collect_text_values(p, ("headings", "ocrText", "screenshotText", "imageText", "heroText")))
        nav_labels = p.get("navLabels")
        if isinstance(nav_labels, list):
            chunks.extend([x for x in nav_labels if isinstance(x, str) and x.strip()])
        if isinstance(p.get("html"), str) and p.get("html").strip():
            page_html_chunks.append(p["html"])

    # Add scraped service metadata to text (for keyword matching only)
    for s in scraped_services:
        if not isinstance(s, dict):
            continue
        name = (s.get("name") or "").strip()
        desc = (s.get("description") or "").strip() if isinstance(s.get("description"), str) else ""
        # Only add actual service names to text (not noise)
        if name and not is_non_service_text(name):
            chunks.append(name)
        if desc:
            chunks.append(desc)

    evidence = "\n".join(chunks)
    homepage_html = homepage.get("html") if isinstance(homepage.get("html"), str) else ""
    combined_html = "\n".join([homepage_html, *page_html_chunks])

    resolved_site_type = site_type or detect_site_type(
        {"homepage": homepage, "pages": pages, "scrapedServices": scraped_services, "screenshotsText": screenshots_text}
    )

    # Detect real services via keyword matching
    services = detect_services(combined_html, evidence, screenshots_text=screenshots_text)
    if not services:
        services = _extract_services_from_text(evidence)
    services = deduplicate_list_preserve_order(services)

    industries = _extract_industries_from_text(evidence)
    proof_signals = detect_site_proof_signals("\n".join([homepage_html, evidence, str(screenshots_text or "")]), page_registry)
    testimonial_hits = proof_signals.get("testimonials") or []
    case_study_hits = detect_case_studies(
        {
            "homepage": {"title": homepage.get("title"), "metaDescription": homepage.get("metaDescription"), "text": homepage.get("text")},
            "pages": pages,
            "scrapedServices": scraped_services,
            "screenshotsText": screenshots_text,
        },
        page_registry=page_registry,
    )

    # Build final services list — ONLY real services pass through
    services_list: List[Dict[str, Any]] = []

    # From scraped services (filtered strictly)
    for s in scraped_services:
        if not _is_scraped_service_valid(s):
            continue
        name = s["name"].strip()
        existing_names = {(x.get("name") or "").strip().lower() for x in services_list}
        if name.lower() in existing_names:
            continue
        desc = s.get("description") or _service_description_from_name(name, target_market)
        services_list.append({
            "name": name,
            "startingPrice": None,
            "targetMarket": _service_target_market_from_name(name, target_market),
            "description": desc,
            "url": s.get("url") or None,
            "source": s.get("source") or None,
        })

    # From keyword-detected services (add ones not already in list)
    existing = {(x.get("name") or "").strip().lower() for x in services_list if isinstance(x, dict)}
    for s in services:
        key = (s or "").strip().lower()
        if not key or key in existing:
            continue
        # Double-check this detected service name is not non-service text
        if is_non_service_text(s):
            continue
        existing.add(key)
        services_list.append({
            "name": s,
            "startingPrice": None,
            "targetMarket": _service_target_market_from_name(s, target_market),
            "description": _service_description_from_name(s, target_market),
        })

    service_cues_present = bool(services) or has_generic_service_cues(homepage_html, evidence)
    if not services_list and service_cues_present:
        services_list.append({
            "name": "Services are clearly present, but the extraction layer could not fully structure them.",
            "startingPrice": None,
            "targetMarket": target_market or None,
            "description": "Detected service-related headings, on-page text, or screenshot-derived cues in site content. Manual review recommended.",
        })

    # Service gaps vs a baseline checklist for agencies
    baseline = [
        "SEO",
        "PPC / Google Ads",
        "Social Media Marketing",
        "Web Design & Development",
        "Content Marketing",
        "Conversion Rate Optimisation",
    ] if resolved_site_type == "service_business" else []

    detected_names = {str(x.get("name") or "").strip().lower() for x in services_list if isinstance(x, dict)}
    gaps = []
    for svc in baseline:
        if svc.lower() not in detected_names:
            gaps.append({
                "service": svc,
                "reason": "Not clearly detected in site navigation or offer copy.",
                "impact": "May limit discoverability or perceived breadth if this is a real offer.",
            })

    # Positioning statement
    positioning_statement = None
    if isinstance(homepage.get("metaDescription"), str) and homepage["metaDescription"].strip():
        positioning_statement = homepage["metaDescription"].strip()
    elif isinstance(homepage.get("title"), str) and homepage["title"].strip():
        positioning_statement = homepage["title"].strip()

    # Infer industries from target market if none found
    if not industries and target_market:
        lowered = str(target_market).lower()
        if "agency" in lowered or "agencies" in lowered:
            industries = ["Agencies"]
        elif "saas" in lowered:
            industries = ["SaaS"]
        elif "healthcare" in lowered or "health" in lowered:
            industries = ["Healthcare"]
        elif "ecommerce" in lowered or "e-commerce" in lowered:
            industries = ["Ecommerce"]

    # Mentor notes
    mentor_notes = None
    if resolved_site_type == "content_site":
        mentor_notes = "This appears to be a content-led site. Service extraction is treated conservatively so editorial content is not over-classified as a service catalogue."
    elif resolved_site_type == "ecommerce":
        mentor_notes = "This appears to be an ecommerce-led site. Service extraction is treated conservatively so product/catalog content is not over-classified as agency services."
    elif service_cues_present and len(services_list) == 0:
        mentor_notes = "Services are clearly present, but the extraction layer could not fully structure them."

    if testimonial_hits or case_study_hits or proof_signals.get("trustSignals"):
        proof_parts: List[str] = []
        if testimonial_hits:
            proof_parts.append(f"Trust signals detected: {', '.join(testimonial_hits[:2])}.")
        if case_study_hits:
            proof_parts.append(f"Proof/case-study signals detected: {', '.join(case_study_hits[:2])}.")
        trust_hits = proof_signals.get("trustSignals") or []
        if trust_hits:
            proof_parts.append(f"Additional trust markers detected: {', '.join(trust_hits[:2])}.")
        proof_note = " ".join(proof_parts).strip()
        mentor_notes = " ".join([n for n in [mentor_notes, proof_note] if n]).strip() or None

    return {
        "services": services_list,
        "mentorNotes": mentor_notes,
        "serviceGaps": gaps,
        "industriesServed": {
            "current": deduplicate_list_preserve_order(industries),
            "concentrationNote": None,
            "highValueIndustries": [],
        },
        "positioning": {
            "currentStatement": positioning_statement or "N/A",
            "competitorComparison": "N/A",
            "differentiation": "N/A",
        },
        "notes": f"Generated from on-site content evidence (deterministic extractor, site_type={resolved_site_type}).",
    }
