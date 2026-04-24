from __future__ import annotations

from typing import Any, Dict, List
import re


def _clean(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def _slugify(value: str) -> str:
    text = _clean(value).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def _dedupe(items: List[Any]) -> List[Any]:
    seen = set()
    out = []
    for item in items:
        key = repr(item)
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def derive_site_context(
    *,
    company_name: str,
    website: str,
    homepage: Dict[str, Any],
    services: List[str],
    target_market: str | None = None,
    location: str | None = None,
) -> Dict[str, Any]:
    title = _clean(homepage.get("title"))
    meta = _clean(homepage.get("metaDescription"))
    text = _clean(homepage.get("text"))
    service_names = [s for s in [_clean(x) for x in services] if s]

    return {
        "companyName": _clean(company_name),
        "website": _clean(website),
        "homepageTitle": title,
        "homepageMeta": meta,
        "homepageText": text,
        "services": service_names,
        "targetMarket": _clean(target_market),
        "location": _clean(location),
    }


def suggest_h1_variants(site_context: Dict[str, Any], primary_keywords: List[str]) -> List[str]:
    services = site_context.get("services") or []
    market = site_context.get("targetMarket") or ""
    top_kw = [k for k in [_clean(x) for x in primary_keywords] if k][:3]
    top_service = services[0] if services else (top_kw[0] if top_kw else "Growth Services")
    second = services[1] if len(services) > 1 else (top_kw[1] if len(top_kw) > 1 else "")

    variants = [
        f"{top_service} for {market}" if market else f"{top_service} That Drives Qualified Growth",
        f"Scale Your Agency with {top_service}" if "agency" in market.lower() else f"{top_service} Built for Better Lead Quality",
        f"{top_service}{(' & ' + second) if second else ''} for Results-Focused Clients",
    ]
    return _dedupe([_clean(v) for v in variants if _clean(v)])[:5]


def build_missing_h1_recommendation(
    *,
    page_url: str,
    page_label: str,
    site_context: Dict[str, Any],
    primary_keywords: List[str],
) -> Dict[str, Any]:
    h1s = suggest_h1_variants(site_context, primary_keywords)
    return {
        "issue": "missing_h1",
        "severity": "high",
        "page": page_url or "/",
        "pageLabel": page_label,
        "placement": "Hero section, above the fold",
        "recommendation": f"Add a single primary H1 on the {page_label} that clearly states the main offer and audience.",
        "why": "The strongest authority page should make the offer and topic obvious to both users and search engines.",
        "suggestedVariants": h1s,
        "supportingBlocks": [
            "Short benefit-led subheadline",
            "Primary CTA button",
            "Secondary CTA button",
            "Trust strip with review/proof signals",
        ],
        "expectedOutcome": "Stronger topical clarity, improved above-the-fold messaging, and better conversion confidence.",
    }


def build_missing_page_recommendation(
    *,
    page_type: str,
    site_context: Dict[str, Any],
    keyword_cluster: List[str] | None = None,
) -> Dict[str, Any]:
    services = site_context.get("services") or []
    keyword_cluster = keyword_cluster or []

    if page_type == "services":
        slugs = [f"/{_slugify(x)}" for x in services[:4]] or [f"/{_slugify(x)}" for x in keyword_cluster[:4]]
        return {
            "issue": "missing_services_page",
            "severity": "high",
            "page": "/services",
            "placement": "Main navigation and homepage",
            "recommendation": "Create a dedicated Services page and link to service-specific landing pages from the homepage hero and navigation.",
            "suggestedVariants": slugs,
            "supportingBlocks": [
                "Service outcomes",
                "Who it is for",
                "Proof/case studies",
                "CTA to book a strategy call or request an audit",
            ],
            "expectedOutcome": "Clearer service messaging, stronger SEO targeting, and reduced friction for prospects.",
        }

    if page_type == "about":
        return {
            "issue": "missing_about_page",
            "severity": "medium",
            "page": "/about",
            "placement": "Main navigation and footer",
            "recommendation": "Create an About page that explains who you help, why clients trust you, and how delivery works.",
            "suggestedVariants": [
                "Who We Help",
                "Why Agencies Choose Us",
                "How Our Delivery Model Works",
            ],
            "supportingBlocks": ["Founder/team intro", "Experience", "Process", "Proof"],
            "expectedOutcome": "Higher trust and better conversion support during the consideration stage.",
        }

    if page_type == "contact":
        return {
            "issue": "missing_contact_page",
            "severity": "high",
            "page": "/contact",
            "placement": "Header, footer, and repeated CTA placements",
            "recommendation": "Create a Contact page with one short form, response expectations, and a strong CTA tied to the main offer.",
            "suggestedVariants": [
                "Book a Strategy Call",
                "Request a Fulfilment Audit",
                "Get a Custom Proposal",
            ],
            "supportingBlocks": ["Short form", "Email/phone", "Calendar CTA", "Trust proof"],
            "expectedOutcome": "Lower enquiry friction and higher conversion from existing traffic.",
        }

    return {
        "issue": f"missing_{page_type}_page",
        "severity": "medium",
        "page": f"/{page_type}",
        "placement": "Main navigation",
        "recommendation": f"Create a dedicated {page_type} page.",
        "suggestedVariants": [],
        "supportingBlocks": [],
        "expectedOutcome": "Improved usability and stronger page-level intent alignment.",
    }


def build_cta_recommendation(
    *,
    site_context: Dict[str, Any],
    weak_reason: str,
) -> Dict[str, Any]:
    market = (site_context.get("targetMarket") or "").lower()
    services = site_context.get("services") or []
    top_service = services[0] if services else "growth service"

    if "agency" in market:
        primary = [
            f"Book a {top_service} Strategy Call",
            "Request a White-Label Growth Audit",
            "Get a Custom Delivery Plan",
        ]
    else:
        primary = [
            f"Book a Consultation for {top_service}",
            "Request a Custom Proposal",
            "Talk to an Expert",
        ]

    return {
        "issue": "weak_cta",
        "severity": "high",
        "placement": "Homepage hero, service pages, sticky header, and footer CTA",
        "recommendation": "Tighten CTA intent so visitors know exactly what next step to take.",
        "why": weak_reason,
        "suggestedVariants": primary,
        "supportingBlocks": ["Trust strip", "Short proof bullets", "Response-time expectation"],
        "expectedOutcome": "Higher CTA click-through and better lead-to-meeting conversion.",
    }


def build_reputation_recommendation(
    *,
    rating: Any,
    review_count: Any,
    site_context: Dict[str, Any],
) -> Dict[str, Any]:
    return {
        "issue": "proof_deployment",
        "severity": "medium",
        "placement": "Homepage hero, service pages, proposals, and footer proof strip",
        "recommendation": "Deploy review proof more visibly and consistently across commercial pages.",
        "why": f"Current review strength is {rating} from {review_count} reviews, but that proof should be merchandised near decision points.",
        "suggestedVariants": [
            "Trusted by agencies across the US and UK",
            "Rated highly by clients for delivery and support",
            "Proof-backed delivery with real client outcomes",
        ],
        "supportingBlocks": ["Review rating badge", "2-3 outcome-based testimonials", "Case study CTA"],
        "expectedOutcome": "Stronger trust at mid- and bottom-funnel stages.",
    }
