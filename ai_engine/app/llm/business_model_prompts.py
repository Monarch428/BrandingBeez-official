from __future__ import annotations

from typing import Any, Dict

BUSINESS_MODEL_PROMPT_GUIDANCE: Dict[str, Dict[str, Any]] = {
    "white_label_agency_partner": {
        "language": "Use partner-delivery, proposal conversion, retained services, capacity proof, and handoff-quality language.",
        "focus": [
            "agency trust and delivery reliability",
            "service packaging for partner buyers",
            "proof assets and case studies",
            "non-brand service-page demand",
            "proposal-to-close efficiency",
        ],
        "avoid": ["retail language", "consumer-style UX wording", "purely local SEO framing unless evidence supports it"],
        "sectionRules": {
            "seoVisibility": "Emphasize commercial service pages, non-brand demand, and comparison-page opportunities. Do not over-weight local SEO unless there is strong local evidence.",
            "leadGeneration": "Prefer partner-capacity calls, fulfilment proposals, and audit-style CTAs over generic contact language.",
            "costOptimization": "Focus on retained pricing, utilization, automation, delivery margin, and qualification efficiency.",
            "targetMarket": "Segment by agency type, delivery pain point, and service mix rather than generic SMB categories.",
            "financialImpact": "Connect proposal conversion, average deal size, and retained revenue improvements before recommending more spend.",
        },
    },
    "b2b_agency": {
        "language": "Use pipeline, qualified enquiries, retained revenue, proof assets, and commercial trust language.",
        "focus": ["offer clarity", "proof deployment", "non-brand visibility", "CTA intent", "proposal conversion"],
        "avoid": ["ecommerce merchandising language"],
        "sectionRules": {
            "leadGeneration": "Emphasize lead quality, CTA clarity, and trust transfer into proposals or meetings.",
            "financialImpact": "Prefer pricing, conversion, and funnel-efficiency levers before traffic-only advice.",
        },
    },
    "saas_company": {
        "language": "Use category demand, product-led trust, demo/trial conversion, and activation language.",
        "focus": ["category SEO", "comparison pages", "demo flow", "pricing clarity", "activation friction"],
        "avoid": ["local citation language unless clearly relevant"],
        "sectionRules": {
            "leadGeneration": "Prioritize demo/trial paths and activation friction.",
            "seoVisibility": "Focus on category, competitor-comparison, and problem-solution search demand.",
        },
    },
    "service_business": {
        "language": "Use service clarity, trust, enquiries, and conversion-readiness language.",
        "focus": ["service pages", "reviews", "CTA clarity", "proof", "search visibility"],
        "avoid": ["unsupported enterprise terminology"],
        "sectionRules": {
            "websiteDigitalPresence": "Emphasize core pages, proof, and conversion flow completeness.",
        },
    },
}

def _looks_like_white_label_agency_partner(profile: Dict[str, Any]) -> bool:
    target_market = str(profile.get("targetMarket") or "").lower()
    buyer_type = str(profile.get("buyerType") or "").lower()
    service_names = [str(s).lower() for s in (profile.get("serviceNames") or [])]
    has_agency_target = "agenc" in target_market
    has_business_buyer = buyer_type == "business_buyer"
    has_white_label_service = any("white-label" in s or "white label" in s for s in service_names)
    has_delivery_services = sum(any(k in s for k in ("seo", "ppc", "web", "design", "development")) for s in service_names) >= 2
    return (has_agency_target and has_business_buyer) or (has_white_label_service and has_delivery_services)

def build_business_model_prompt_guidance(business_profile: Dict[str, Any] | None) -> Dict[str, Any]:
    business_profile = business_profile or {}
    base_model = str(business_profile.get("businessModel") or "service_business")
    business_model = "white_label_agency_partner" if _looks_like_white_label_agency_partner(business_profile) else base_model
    base = BUSINESS_MODEL_PROMPT_GUIDANCE.get(business_model, BUSINESS_MODEL_PROMPT_GUIDANCE["service_business"])
    return {
        "businessModel": business_model,
        "language": base["language"],
        "focus": list(base.get("focus") or []),
        "avoid": list(base.get("avoid") or []),
        "sectionRules": dict(base.get("sectionRules") or {}),
        "serviceNames": list(business_profile.get("serviceNames") or []),
        "buyerType": business_profile.get("buyerType") or "mixed_buyer",
        "salesMotion": business_profile.get("salesMotion") or "inquiry_led",
        "primaryGrowthMotion": business_profile.get("primaryGrowthMotion") or "inquiry_conversion",
        "geographyType": business_profile.get("geographyType") or "regional",
        "targetMarket": business_profile.get("targetMarket"),
    }
