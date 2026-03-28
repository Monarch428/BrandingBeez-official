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
    (r"\bdesign\b|creative design|product design", "Design"),
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
    # de-dup while preserving order
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


def _collect_text_values(source: Dict[str, Any] | None, keys: tuple[str, ...]) -> List[str]:
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

def build_services_signals(
    homepage: Dict[str, Any] | None = None,
    pages: List[Dict[str, Any]] | None = None,
    scraped_services: List[Dict[str, Any]] | None = None,
    *,
    screenshots_text: Any = None,
    site_type: str | None = None,
    page_registry: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    Deterministic, best-effort services extraction using already-fetched content pages.
    This avoids empty 'Services' section in the PDF when the LLM is conservative.
    """
    homepage = homepage or {}
    pages = pages or []
    scraped_services = scraped_services or []

    # Combine evidence text
    chunks: List[str] = []
    if isinstance(homepage.get("title"), str):
        chunks.append(homepage.get("title"))
    if isinstance(homepage.get("metaDescription"), str):
        chunks.append(homepage.get("metaDescription"))
    if isinstance(homepage.get("text"), str):
        chunks.append(homepage.get("text"))
    chunks.extend(
        _collect_text_values(
            homepage,
            ("h1", "headings", "ocrText", "screenshotText", "imageText", "heroText"),
        )
    )

    page_html_chunks: List[str] = []
    for p in pages:
        if not isinstance(p, dict):
            continue
        for k in ("title", "metaDescription", "textSnippet", "h1"):
            if isinstance(p.get(k), str) and p.get(k).strip():
                chunks.append(p.get(k))
        chunks.extend(
            _collect_text_values(
                p,
                ("headings", "ocrText", "screenshotText", "imageText", "heroText"),
            )
        )
        nav_labels = p.get("navLabels")
        if isinstance(nav_labels, list):
            chunks.extend([x for x in nav_labels if isinstance(x, str) and x.strip()])
        if isinstance(p.get("html"), str) and p.get("html").strip():
            page_html_chunks.append(p.get("html"))

    # Optional: richer scraper output (service cards/pages)
    if scraped_services:
        try:
            for s in scraped_services:
                if not isinstance(s, dict):
                    continue
                name = (s.get("name") or "").strip()
                desc = (s.get("description") or "").strip() if isinstance(s.get("description"), str) else ""
                if name:
                    chunks.append(name)
                if desc:
                    chunks.append(desc)
                chunks.extend(
                    _collect_text_values(
                        s,
                        ("heading", "headings", "ocrText", "screenshotText", "imageText"),
                    )
                )
        except Exception:
            pass

    evidence = "\n".join(chunks)
    homepage_html = homepage.get("html") if isinstance(homepage.get("html"), str) else ""
    combined_html = "\n".join([homepage_html, *page_html_chunks])
    resolved_site_type = site_type or detect_site_type(
        {
            "homepage": homepage,
            "pages": pages,
            "scrapedServices": scraped_services,
            "screenshotsText": screenshots_text,
        }
    )
    services = detect_services(combined_html, evidence, screenshots_text=screenshots_text)
    if not services:
        services = _extract_services_from_text(evidence)
    services = deduplicate_list_preserve_order(services)
    industries = _extract_industries_from_text(evidence)
    proof_signals = detect_site_proof_signals("\n".join([homepage_html, evidence, str(screenshots_text or "")]), page_registry)
    testimonial_hits = proof_signals.get("testimonials") or []
    case_study_hits = detect_case_studies(
        {
            "homepage": {
                "title": homepage.get("title"),
                "metaDescription": homepage.get("metaDescription"),
                "text": homepage.get("text"),
            },
            "pages": pages,
            "scrapedServices": scraped_services,
            "screenshotsText": screenshots_text,
        },
        page_registry=page_registry,
    )

    # Create list objects for PDF (name/description/targetMarket)
    services_list: List[Dict[str, Any]] = []

    # Prefer structured scraped services (if available)
    if scraped_services:
        for s in scraped_services:
            if not isinstance(s, dict):
                continue
            name = (s.get("name") or "").strip()
            if not name:
                continue
            services_list.append({
                "name": name,
                "startingPrice": None,
                "targetMarket": None,
                "description": (s.get("description") or None),
                "url": s.get("url") or None,
                "source": s.get("source") or None,
            })

    # Add regex-detected services (avoid duplicates)
    existing = { (x.get("name") or "").strip().lower() for x in services_list if isinstance(x, dict) }
    for s in services:
        key = (s or "").strip().lower()
        if not key or key in existing:
            continue
        existing.add(key)
        services_list.append({"name": s, "startingPrice": None, "targetMarket": None, "description": None})

    service_cues_present = bool(services) or has_generic_service_cues(homepage_html, evidence)
    if not services_list and service_cues_present:
        services_list.append(
            {
                "name": "Services are clearly present, but the extraction layer could not fully structure them.",
                "startingPrice": None,
                "targetMarket": None,
                "description": "Detected service-related headings, on-page text, or screenshot-derived cues in site content. Manual review recommended.",
            }
        )


    # Service gaps: compare against a baseline checklist for agencies
    if resolved_site_type == "service_business":
        baseline = [
            "SEO",
            "PPC / Google Ads",
            "Social Media Marketing",
            "Web Design & Development",
            "Content Marketing",
            "Conversion Rate Optimisation",
        ]
    else:
        baseline = []
    gaps = [s for s in baseline if s not in services]

    positioning_statement = None
    if isinstance(homepage.get("metaDescription"), str) and homepage.get("metaDescription").strip():
        positioning_statement = homepage.get("metaDescription").strip()
    elif isinstance(homepage.get("title"), str) and homepage.get("title").strip():
        positioning_statement = homepage.get("title").strip()

    mentor_notes = None
    if service_cues_present and len(services) == 0:
        mentor_notes = "Services are clearly present, but the extraction layer could not fully structure them."
    if resolved_site_type == "content_site":
        mentor_notes = "This appears to be a content-led site. Service extraction is treated conservatively so editorial content is not over-classified as a service catalogue."
    elif resolved_site_type == "ecommerce":
        mentor_notes = "This appears to be an ecommerce-led site. Service extraction is treated conservatively so product/catalog content is not over-classified as agency services."
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
