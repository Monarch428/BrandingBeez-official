from __future__ import annotations

from typing import Any, Dict, List


JsonDict = Dict[str, Any]


RECOMMENDATION_LIBRARY: Dict[str, Dict[str, List[JsonDict]]] = {
    "white_label_agency_partner": {
        "website": [
            {
                "trigger": "hero_unclear",
                "title": "Clarify the partner-delivery offer in the homepage hero",
                "where": ["homepage hero", "first scroll", "navigation CTA"],
                "why": "Agency buyers need to understand delivery capacity, quality, and handoff speed immediately.",
                "priority": "high",
                "effort": "low",
                "confidence": 88,
                "suggestedVariants": [
                    "White-Label Web Development for Agencies That Need Reliable Delivery",
                    "Scale Agency Delivery Without Hiring In-House Developers",
                    "White-Label SEO & Web Delivery Built for Agency Retainers",
                ],
                "supportingBlocks": ["client logos", "delivery model", "response-time promise", "case-study CTA"],
            }
        ],
        "leadGeneration": [
            {
                "trigger": "cta_weak",
                "title": "Use agency-fit CTA intent instead of generic contact language",
                "where": ["homepage hero", "service pages", "footer CTA"],
                "why": "White-label buyers respond better to proposal, audit, and partner-capacity CTAs than generic contact CTAs.",
                "priority": "high",
                "effort": "low",
                "confidence": 86,
                "suggestedVariants": [
                    "Request a White-Label Delivery Plan",
                    "Book a Partner Capacity Call",
                    "Get a Custom Agency Fulfilment Proposal",
                ],
                "supportingBlocks": ["turnaround promise", "delivery workflow", "scope examples"],
            }
        ],
        "seoVisibility": [
            {
                "trigger": "service_pages_missing",
                "title": "Create agency-focused service and comparison pages",
                "where": ["/white-label-web-development", "/white-label-seo", "/agency-outsourcing-partner"],
                "why": "Commercial B2B demand is captured better through partner-service pages than through generic homepage messaging.",
                "priority": "high",
                "effort": "medium",
                "confidence": 84,
                "supportingBlocks": ["ideal client", "handoff model", "delivery stack", "case studies", "FAQ"],
            }
        ],
        "targetMarket": [
            {
                "trigger": "segments_generic",
                "title": "Define segment-specific ICPs for agency buyers",
                "where": ["homepage messaging", "service pages", "sales decks"],
                "why": "White-label buyers vary by service mix, team size, and delivery pain points; generic ICPs reduce conversion quality.",
                "priority": "high",
                "effort": "medium",
                "confidence": 82,
                "supportingBlocks": ["segment pains", "offer fit", "proof by segment", "FAQ by buyer type"],
            }
        ],
        "financialImpact": [
            {
                "trigger": "pricing_flat",
                "title": "Improve retained pricing before scaling spend",
                "where": ["proposal structure", "pricing sheets", "service packaging"],
                "why": "For white-label agencies, margin usually improves faster through cleaner tiering and scope control than through immediate acquisition expansion.",
                "priority": "high",
                "effort": "medium",
                "confidence": 83,
            }
        ],
        "actionPlan90Days": [
            {
                "trigger": "strategy_missing",
                "title": "Sequence partner-trust, packaging, and page expansion over 90 days",
                "where": ["90-day plan"],
                "why": "This business model grows best when proof, pricing, and partner-fit landing pages are improved before acquisition is scaled.",
                "priority": "high",
                "effort": "medium",
                "confidence": 85,
            }
        ],
    },
    "b2b_agency": {
        "leadGeneration": [
            {
                "trigger": "proof_thin",
                "title": "Merchandise proof near decision points",
                "where": ["homepage hero", "service pages", "proposal pages"],
                "why": "B2B buyers need proof before they convert from enquiry to meeting.",
                "priority": "high",
                "effort": "low",
                "confidence": 84,
                "supportingBlocks": ["review badge", "case studies", "results bullets"],
            }
        ],
        "financialImpact": [
            {
                "trigger": "pricing_or_close_rate_gap",
                "title": "Improve proposal conversion before adding more traffic",
                "where": ["sales process", "proposal stage"],
                "why": "For agencies, improving proposal-to-close rate often outperforms adding more low-fit top-of-funnel traffic.",
                "priority": "high",
                "effort": "medium",
                "confidence": 81,
            }
        ],
    },
    "ecommerce_brand": {
        "financialImpact": [
            {
                "trigger": "cro_gap",
                "title": "Prioritize conversion-rate improvement before traffic expansion",
                "where": ["product pages", "cart flow", "collection pages"],
                "why": "Conversion, AOV, and repeat purchase improvements usually outperform raw traffic growth in the near term.",
                "priority": "high",
                "effort": "medium",
                "confidence": 84,
            }
        ]
    },
    "saas_company": {
        "leadGeneration": [
            {
                "trigger": "demo_flow_unclear",
                "title": "Clarify the demo / trial conversion path",
                "where": ["hero", "pricing", "product pages"],
                "why": "SaaS growth depends on category clarity and a visible next-step path into demo or trial.",
                "priority": "high",
                "effort": "low",
                "confidence": 83,
            }
        ]
    },
    "service_business": {
        "websiteDigitalPresence": [
            {
                "trigger": "core_pages_missing",
                "title": "Strengthen service, about, and contact page coverage",
                "where": ["main navigation", "homepage", "service architecture"],
                "why": "Service businesses need complete trust and conversion paths before SEO or paid demand can convert efficiently.",
                "priority": "high",
                "effort": "medium",
                "confidence": 78,
            }
        ]
    },
}


def get_recommendation_templates(business_model: str, section: str) -> List[JsonDict]:
    model_bucket = RECOMMENDATION_LIBRARY.get(business_model, {})
    templates = list(model_bucket.get(section, []))
    if not templates and business_model != "service_business":
        templates = list(RECOMMENDATION_LIBRARY.get("service_business", {}).get(section, []))
    return templates
