from __future__ import annotations

from typing import Any, Dict, List


JsonDict = Dict[str, Any]


def ensure_dict(value: Any) -> JsonDict:
    return value if isinstance(value, dict) else {}


def ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _relevance(level: str, reason: str) -> JsonDict:
    return {"level": level, "reason": reason}


def _evidence_strength(score: int, reason: str) -> str:
    """
    Returns a PLAIN STRING label rather than a dict.
    The PDF renderer templates received a dict and serialised it as "[object Object]".
    We now always return a safe string: "high", "medium", or "low" — optionally with
    the score appended for developer debugging, but always a string type.
    """
    score = max(0, min(100, int(score or 0)))
    if score >= 70:
        return "high"
    elif score >= 40:
        return "medium"
    return "low"


def _evidence_strength_meta(score: int, reason: str) -> JsonDict:
    """
    Full metadata dict used internally for logic only — NOT passed to template fields
    that would render as [object Object].  Use _evidence_strength() for any field
    that surfaces in the PDF.
    """
    label = _evidence_strength(score, reason)
    return {"score": max(0, min(100, int(score or 0))), "level": label, "reason": reason}


def _has_reviews(rep: JsonDict) -> bool:
    if isinstance(rep.get("reviewScore"), (int, float)):
        return True
    if isinstance(rep.get("overallScore"), (int, float)):
        return True
    return any(
        isinstance(p, dict) and (p.get("reviewCount") or p.get("reviews") or p.get("count"))
        for p in ensure_list(rep.get("platforms"))
    )


def _has_keywords(website: JsonDict, seo: JsonDict, market: JsonDict) -> bool:
    kwa = ensure_dict(website.get("websiteKeywordAnalysis"))
    if ensure_list(kwa.get("opportunities")):
        return True
    kr = ensure_dict(seo.get("keywordRankings"))
    if any(kr.get(k) for k in ("totalKeywords", "totalRankingKeywords", "visibleKeywordCount", "missingHighValueKeywords")):
        return True
    return bool(ensure_list(market.get("keywords")))


def _financial_input_coverage(user_financials: JsonDict) -> JsonDict:
    keys = {
        "monthlyRevenue": user_financials.get("monthlyRevenue") or user_financials.get("currentMonthlyRevenue"),
        "monthlyAdSpend": user_financials.get("monthlyAdSpend") or user_financials.get("monthlyMarketingCost"),
        "monthlyLeads": user_financials.get("monthlyLeads") or user_financials.get("qualifiedLeads"),
        "closeRate": user_financials.get("closeRate") or user_financials.get("close_rate"),
        "avgDealValue": user_financials.get("avgDealValue") or user_financials.get("avgDealSize"),
        "currentTraffic": user_financials.get("currentTrafficPerMonth") or user_financials.get("monthly_traffic"),
        "teamSize": user_financials.get("teamSize") or user_financials.get("teamSizeRange"),
    }
    available = [k for k, v in keys.items() if v not in (None, "", [], {})]
    score = int(round((len(available) / max(len(keys), 1)) * 100))
    return {"score": score, "availableKeys": available, "missingKeys": [k for k in keys if k not in available]}


def build_section_contexts(
    *,
    business_profile: JsonDict,
    website_signals: JsonDict,
    seo_signals: JsonDict,
    reputation_signals: JsonDict,
    services_signals: JsonDict,
    leadgen_signals: JsonDict,
    market_demand: JsonDict,
    user_financials: JsonDict | None = None,
    page_registry: JsonDict | None = None,
) -> JsonDict:
    business_profile = ensure_dict(business_profile)
    website_signals = ensure_dict(website_signals)
    seo_signals = ensure_dict(seo_signals)
    reputation_signals = ensure_dict(reputation_signals)
    services_signals = ensure_dict(services_signals)
    leadgen_signals = ensure_dict(leadgen_signals)
    market_demand = ensure_dict(market_demand)
    user_financials = ensure_dict(user_financials)
    page_registry = ensure_dict(page_registry)

    business_model = business_profile.get("businessModel") or "general_business"
    service_names = ensure_list(business_profile.get("serviceNames"))
    pages = ensure_dict(page_registry.get("pages"))
    financial_inputs = _financial_input_coverage(user_financials)

    seo_evidence_score = 75 if _has_keywords(website_signals, seo_signals, market_demand) else 40
    reputation_evidence_score = 75 if _has_reviews(reputation_signals) else 35
    services_evidence_score = 70 if service_names else 30
    leadgen_evidence_score = 65 if ensure_list(leadgen_signals.get("channels")) else 35
    competitive_evidence_score = 55 if ensure_list(ensure_dict(seo_signals.get("competitorComparison")).get("directCompetitors")) else 25
    financial_evidence_score = financial_inputs.get("score", 0)

    base_assumptions = [
        "Recommendations should respect the detected business model.",
        "Sections with weaker evidence should be treated as directional, not definitive.",
    ]

    # Determine if local SEO should be treated as primary channel
    local_business_models = {"local_service_business", "local_healthcare", "local_retail"}
    local_seo_is_primary = business_model in local_business_models

    return {
        "executiveSummary": {
            "relevance": _relevance("high", "Always relevant; sets the commercial framing for the report."),
            "evidenceStrength": _evidence_strength(80, "Executive summary can draw from all collected sections."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["overall score", "confidence", "biggest blocker", "biggest opportunity"],
        },
        "websiteDigitalPresence": {
            "relevance": _relevance("high", "Website structure, UX, and trust flow are foundational across all business models."),
            "evidenceStrength": _evidence_strength(78, "Website and page-level crawl signals are available."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["technical SEO score", "content quality", "UX / conversion score"],
            "pageCoverage": {
                "about": bool(ensure_dict(pages.get("about")).get("present")),
                "contact": bool(ensure_dict(pages.get("contact")).get("present")),
                "services": bool(ensure_dict(pages.get("services")).get("servicesPagePresent")),
            },
        },
        "seoVisibility": {
            "relevance": _relevance(
                "high" if _has_keywords(website_signals, seo_signals, market_demand) else "medium",
                "SEO matters for discoverability, but confidence depends on keyword and authority evidence.",
            ),
            "evidenceStrength": _evidence_strength(seo_evidence_score, "Keyword, authority, and market-demand evidence were evaluated."),
            "businessFit": "high" if business_model in {"white_label_agency_partner", "b2b_agency", "saas_company", "consulting_firm", "service_business"} else "medium",
            "assumptions": base_assumptions + [
                "Local SEO should only dominate the narrative when the business model is locally dependent.",
                "For agency and B2B businesses, non-brand keyword coverage matters more than map-pack presence.",
            ],
            "kpis": ["domain authority", "ranking keywords", "referring domains", "non-brand visibility"],
            "businessLens": "local intent + map pack" if local_seo_is_primary else "non-brand visibility + commercial page coverage",
            "localSeoIsPrimary": local_seo_is_primary,
        },
        "reputation": {
            "relevance": _relevance(
                "high" if _has_reviews(reputation_signals) else "medium",
                "Trust packaging matters across service, SaaS, and local businesses.",
            ),
            "evidenceStrength": _evidence_strength(reputation_evidence_score, "Review and proof signals were checked."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["review score", "review count", "proof visibility", "testimonial deployment"],
        },
        "servicesPositioning": {
            "relevance": _relevance("high", "Offer clarity and positioning are central to service-led businesses."),
            "evidenceStrength": _evidence_strength(services_evidence_score, "Service extraction and page signals were checked."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["service clarity", "ICP match", "proof per offer", "pricing / packaging clarity"],
            "serviceNames": service_names,
        },
        "leadGeneration": {
            "relevance": _relevance("high", "Lead capture and funnel readiness directly affect pipeline quality."),
            "evidenceStrength": _evidence_strength(leadgen_evidence_score, "CTA, channels, and lead capture signals were evaluated."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["CTA clarity", "lead quality", "lead-to-meeting rate", "channel readiness"],
            "businessLens": "partner conversion + proposal flow" if business_model == "white_label_agency_partner" else "enquiry conversion",
        },
        "competitiveAnalysis": {
            "relevance": _relevance("medium", "Competitive pressure is useful when valid direct peers are detected."),
            "evidenceStrength": _evidence_strength(competitive_evidence_score, "Competitor evidence depends on direct-peer quality."),
            "businessFit": "medium",
            "assumptions": base_assumptions + ["Competitor advice should be conservative when overlap evidence is weak."],
            "kpis": ["market overlap", "proof gap", "service overlap", "positioning gap"],
        },
        "costOptimization": {
            "relevance": _relevance(
                "high" if financial_inputs.get("score", 0) >= 40 else "medium",
                "Commercial efficiency is meaningful for any business, but precision depends on financial inputs.",
            ),
            "evidenceStrength": _evidence_strength(financial_evidence_score, "Financial input coverage determines modeling quality."),
            "businessFit": "high" if business_model in {"white_label_agency_partner", "b2b_agency", "consulting_firm", "service_business"} else "medium",
            "assumptions": base_assumptions + ["For services businesses, utilization, pricing, and qualification usually matter more than blunt cost cutting."],
            "kpis": ["avg deal size", "gross margin", "CAC / qualification efficiency", "delivery efficiency"],
            "businessLens": "utilization + retained pricing" if business_model in {"white_label_agency_partner", "b2b_agency", "consulting_firm"} else "channel / conversion efficiency",
            "inputCoverage": financial_inputs,
            "modeledInputs": {
                "monthlyRevenue": user_financials.get("monthlyRevenue") or user_financials.get("currentMonthlyRevenue"),
                "monthlyAdSpend": user_financials.get("monthlyAdSpend") or user_financials.get("monthlyMarketingCost"),
                "monthlyLeads": user_financials.get("monthlyLeads") or user_financials.get("qualifiedLeads"),
                "closeRate": user_financials.get("closeRate") or user_financials.get("close_rate"),
                "avgDealValue": user_financials.get("avgDealValue") or user_financials.get("avgDealSize"),
                "teamSize": user_financials.get("teamSize") or user_financials.get("teamSizeRange"),
                "traffic": user_financials.get("currentTrafficPerMonth") or user_financials.get("monthly_traffic"),
            },
        },
        "targetMarket": {
            "relevance": _relevance("high", "ICP clarity and segment fit shape messaging, landing pages, and pipeline quality."),
            "evidenceStrength": _evidence_strength(max(45, financial_evidence_score), "Targeting can be inferred from services, geography, and user inputs."),
            "businessFit": "high",
            "assumptions": base_assumptions + ["If explicit segments are missing, segments should be inferred from services, geography, and offer model."],
            "kpis": ["segment clarity", "landing page relevance", "qualified lead rate", "message-market fit"],
            "inputCoverage": {
                "targetMarket": business_profile.get("targetMarket"),
                "buyerType": business_profile.get("buyerType"),
                "geographyType": business_profile.get("geographyType"),
                "serviceNames": service_names,
            },
        },
        "financialImpact": {
            "relevance": _relevance(
                "high" if financial_inputs.get("score", 0) >= 40 else "medium",
                "Financial impact should be generated for all businesses, but some will be directional only.",
            ),
            "evidenceStrength": _evidence_strength(financial_evidence_score, "Financial inputs and modeled assumptions drive this section."),
            "businessFit": "high",
            "assumptions": base_assumptions + ["Financial impact should connect conversion, pricing, and acquisition logic rather than stand alone."],
            "kpis": ["monthly revenue", "improvement potential", "profit impact", "ROI levers"],
            "inputCoverage": financial_inputs,
        },
        "actionPlan90Days": {
            "relevance": _relevance("high", "Always relevant; should synthesize the highest-priority cross-section actions."),
            "evidenceStrength": _evidence_strength(76, "Action plan can synthesize from all prior sections."),
            "businessFit": "high",
            "assumptions": base_assumptions,
            "kpis": ["implementation cadence", "owner-ready priorities", "commercial outcomes"],
        },
    }
