from __future__ import annotations

from typing import Any, Dict, List, Tuple


JsonDict = Dict[str, Any]


def ensure_dict(value: Any) -> JsonDict:
    return value if isinstance(value, dict) else {}


def ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _norm(text: Any) -> str:
    return str(text or "").strip().lower()


def _compact_text(*values: Any) -> str:
    parts: List[str] = []
    for value in values:
        if isinstance(value, str) and value.strip():
            parts.append(value.strip())
        elif isinstance(value, dict):
            for key in ("title", "metaDescription", "description", "summary", "text", "textSnippet", "h1"):
                item = value.get(key)
                if isinstance(item, str) and item.strip():
                    parts.append(item.strip())
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str) and item.strip():
                    parts.append(item.strip())
                elif isinstance(item, dict):
                    for key in ("name", "title", "label", "text", "description", "summary", "h1"):
                        candidate = item.get(key)
                        if isinstance(candidate, str) and candidate.strip():
                            parts.append(candidate.strip())
                            break
    return "\n".join(parts)


def _dedupe_keep_order(values: List[str]) -> List[str]:
    out: List[str] = []
    seen: set[str] = set()
    for raw in values:
        value = str(raw or "").strip()
        if not value:
            continue
        key = value.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(value)
    return out


def _extract_service_names(services_signals: JsonDict, homepage: JsonDict, own_pages: List[JsonDict]) -> List[str]:
    names: List[str] = []
    for item in ensure_list(services_signals.get("services")):
        if isinstance(item, dict):
            for key in ("name", "title", "service"):
                value = item.get(key)
                if isinstance(value, str) and value.strip():
                    names.append(value.strip())
                    break
        elif isinstance(item, str) and item.strip():
            names.append(item.strip())

    for item in ensure_list(services_signals.get("serviceCandidates")):
        if isinstance(item, str) and item.strip():
            names.append(item.strip())

    for source in [homepage] + own_pages[:12]:
        source = ensure_dict(source)
        for key in ("title", "h1"):
            value = source.get(key)
            if isinstance(value, str) and value.strip() and any(tok in value.lower() for tok in ["seo", "web", "design", "development", "ppc", "automation", "branding"]):
                names.append(value.strip())

    return _dedupe_keep_order(names)


def _detect_offer_types(service_names: List[str], full_text: str) -> List[str]:
    text = _norm(full_text + "\n" + "\n".join(service_names))
    offer_types: List[str] = []
    rules = [
        (["white label", "whitelabel", "outsourcing", "fulfilment", "fulfillment"], "partner_delivery_services"),
        (["web development", "web design", "app development", "software development", "product engineering"], "build_services"),
        (["seo", "ppc", "google ads", "social media", "content marketing", "lead generation", "cro"], "marketing_services"),
        (["automation", "crm", "hubspot", "workflow", "reporting automation"], "automation_services"),
        (["saas", "platform", "free trial", "book demo", "product"], "software_product"),
        (["ecommerce", "shopify", "woocommerce", "catalog", "buy now", "add to cart"], "ecommerce"),
    ]
    for keys, label in rules:
        if any(k in text for k in keys):
            offer_types.append(label)
    if not offer_types:
        offer_types.append("services")
    return _dedupe_keep_order(offer_types)


def _detect_business_model(full_text: str, service_names: List[str], user_inputs: JsonDict) -> Tuple[str, int, List[str]]:
    text = _norm(full_text)
    target_market = _norm(user_inputs.get("targetMarket"))
    industry = _norm(user_inputs.get("industry"))
    evidence: List[str] = []
    scores = {
        "white_label_agency_partner": 0,
        "b2b_agency": 0,
        "saas_company": 0,
        "ecommerce_brand": 0,
        "local_healthcare": 0,
        "consulting_firm": 0,
        "education_provider": 0,
        "service_business": 0,
        "general_business": 0,
    }

    def add(model: str, points: int, reason: str) -> None:
        scores[model] += points
        evidence.append(f"{model}: {reason}")

    if any(k in text for k in ["white label", "whitelabel", "agency partner", "reseller", "outsourcing partner", "fulfilment partner", "fulfillment partner"]):
        add("white_label_agency_partner", 5, "explicit partner/white-label wording detected")
    if "agency" in target_market and any(k in text for k in ["white label", "delivery", "outsourcing", "fulfilment", "fulfillment"]):
        add("white_label_agency_partner", 4, "target market references agencies + delivery model cues")
    if "agency" in target_market:
        add("b2b_agency", 2, "target market references agencies")
    if any(k in text for k in ["agency", "marketing", "design studio", "growth partner"]):
        add("b2b_agency", 3, "agency/growth language detected")
    if "agency" in industry:
        add("b2b_agency", 2, "industry suggests agency business")

    if any(k in text for k in ["free trial", "book demo", "request demo", "platform", "saas"]):
        add("saas_company", 4, "saas/demo/platform language detected")
    if "saas" in industry:
        add("saas_company", 3, "industry suggests saas")

    if any(k in text for k in ["add to cart", "shop now", "collections", "buy now", "checkout"]):
        add("ecommerce_brand", 5, "ecommerce storefront language detected")
    if "ecommerce" in industry:
        add("ecommerce_brand", 3, "industry suggests ecommerce")

    if any(k in text for k in ["appointment", "clinic", "doctor", "patient", "treatment", "hospital"]):
        add("local_healthcare", 5, "healthcare/patient language detected")
    if any(k in text for k in ["consulting", "advisor", "consultant", "fractional"]):
        add("consulting_firm", 4, "consulting/advisory language detected")
    if any(k in text for k in ["course", "training", "academy", "curriculum"]):
        add("education_provider", 4, "education/training language detected")

    if service_names:
        add("service_business", 2, "services were detected")
    if any(k in text for k in ["services", "clients", "projects", "trusted by"]):
        add("service_business", 2, "service-business website signals detected")

    top_model = max(scores, key=scores.get)
    top_score = scores[top_model]
    if top_score <= 0:
        top_model = "general_business"
        top_score = 20
        evidence.append("general_business: no strong classification cues; using fallback")
    confidence = min(95, max(35, 30 + top_score * 8))
    model_evidence = [e for e in evidence if e.startswith(top_model)] or evidence[:4]
    return top_model, confidence, model_evidence[:6]


def _detect_sales_motion(business_model: str, full_text: str) -> str:
    text = _norm(full_text)
    if business_model in {"white_label_agency_partner", "b2b_agency", "consulting_firm", "saas_company"}:
        return "high_consideration_b2b"
    if business_model == "ecommerce_brand":
        return "transactional_online"
    if any(k in text for k in ["appointment", "book now", "call us", "visit us"]):
        return "local_service_conversion"
    return "inquiry_led"


def _detect_buyer_type(business_model: str, target_market: str, full_text: str) -> str:
    text = _norm(target_market + "\n" + full_text)
    if any(k in text for k in ["agency", "agencies", "b2b", "business", "brands", "companies", "founders", "teams"]):
        return "business_buyer"
    if business_model == "ecommerce_brand":
        return "consumer_buyer"
    if business_model == "local_healthcare":
        return "patient_buyer"
    return "mixed_buyer"


def _detect_primary_growth_motion(business_model: str, full_text: str, seo_signals: JsonDict, leadgen_signals: JsonDict) -> str:
    text = _norm(full_text)
    channels = " ".join([
        _norm(c.get("channel")) for c in ensure_list(leadgen_signals.get("channels")) if isinstance(c, dict)
    ])
    if business_model == "white_label_agency_partner":
        return "partner_outbound_and_seo"
    if business_model in {"b2b_agency", "consulting_firm", "saas_company"} and any(k in text for k in ["seo", "organic", "content", "search"]):
        return "seo_plus_trust_conversion"
    if any(k in text for k in ["google ads", "ppc", "paid social", "ads"]) or any(k in channels for k in ["ppc", "ads"]):
        return "paid_acquisition"
    if business_model == "ecommerce_brand":
        return "paid_plus_conversion_optimization"
    if isinstance(seo_signals.get("keywordRankings"), dict):
        return "search_led"
    return "inquiry_conversion"


def _detect_geography_type(location: str, target_market: str, full_text: str) -> str:
    text = _norm("\n".join([location, target_market, full_text]))
    if any(k in text for k in ["global", "worldwide", "international"]):
        return "global"
    if any(k in text for k in ["us", "uk", "europe", "india", "canada", "australia"]):
        if sum(1 for k in ["us", "uk", "india", "canada", "australia", "europe"] if k in text) >= 2:
            return "multi_region"
    if any(k in text for k in ["city", "near me", "local", "location"]):
        return "local"
    return "regional"


def _collect_proof_assets(full_text: str, reputation_signals: JsonDict, services_signals: JsonDict) -> List[str]:
    assets: List[str] = []
    text = _norm(full_text)
    if any(k in text for k in ["case study", "portfolio", "projects"]):
        assets.append("case_studies_or_portfolio")
    if any(k in text for k in ["testimonial", "trusted by", "reviews", "clients"]):
        assets.append("testimonial_or_review_signals")
    if isinstance(reputation_signals.get("reviewScore"), (int, float)) or isinstance(reputation_signals.get("overallScore"), (int, float)):
        assets.append("public_review_profile")
    if any(isinstance(x, dict) for x in ensure_list(services_signals.get("services"))):
        assets.append("defined_service_menu")
    return _dedupe_keep_order(assets)


def build_business_profile(
    *,
    homepage: JsonDict | None = None,
    own_pages: List[JsonDict] | None = None,
    services_signals: JsonDict | None = None,
    leadgen_signals: JsonDict | None = None,
    reputation_signals: JsonDict | None = None,
    seo_signals: JsonDict | None = None,
    user_inputs: JsonDict | None = None,
    criteria: JsonDict | None = None,
) -> JsonDict:
    homepage = ensure_dict(homepage)
    own_pages = own_pages if isinstance(own_pages, list) else []
    services_signals = ensure_dict(services_signals)
    leadgen_signals = ensure_dict(leadgen_signals)
    reputation_signals = ensure_dict(reputation_signals)
    seo_signals = ensure_dict(seo_signals)
    user_inputs = ensure_dict(user_inputs)
    criteria = ensure_dict(criteria)

    service_names = _extract_service_names(services_signals, homepage, own_pages)
    full_text = _compact_text(
        homepage,
        own_pages[:12],
        services_signals,
        user_inputs,
        criteria,
        service_names,
    )

    business_model, business_model_confidence, classification_evidence = _detect_business_model(full_text, service_names, user_inputs)
    offer_types = _detect_offer_types(service_names, full_text)
    primary_offer_type = offer_types[0] if offer_types else "services"
    sales_motion = _detect_sales_motion(business_model, full_text)
    location = str(user_inputs.get("location") or criteria.get("location") or "").strip()
    target_market = str(user_inputs.get("targetMarket") or criteria.get("targetMarket") or "").strip()
    industry = str(user_inputs.get("industry") or criteria.get("industry") or "").strip()
    buyer_type = _detect_buyer_type(business_model, target_market, full_text)
    primary_growth_motion = _detect_primary_growth_motion(business_model, full_text, seo_signals, leadgen_signals)
    geography_type = _detect_geography_type(location, target_market, full_text)

    language_map = {
        "white_label_agency_partner": "partner delivery, retained services, proposal conversion, handoff quality, partner trust, capacity proof",
        "b2b_agency": "pipeline, qualified enquiries, retained revenue, proof assets, proposal conversion",
        "saas_company": "category demand, demo conversion, trial activation, product-led trust",
        "ecommerce_brand": "traffic efficiency, conversion rate, AOV, repeat purchase, merchandising",
        "local_healthcare": "local visibility, appointment conversion, trust, patient enquiries",
        "consulting_firm": "authority, trust packaging, lead qualification, proposal conversion, expertise positioning",
        "education_provider": "course demand, enquiry conversion, outcomes proof, enrolment flow",
        "service_business": "service clarity, trust, enquiries, conversion readiness",
        "general_business": "discoverability, trust, enquiries, conversion readiness",
    }

    tone_profile = {
        "voice": "commercial_consultant",
        "style": "evidence_based_and_business_specific",
        "lexicon": language_map.get(business_model, language_map["general_business"]),
        "avoid": [
            "generic marketing jargon",
            "one-size-fits-all recommendations",
            "unsupported industry claims",
        ],
    }

    return {
        "businessModel": business_model,
        "businessModelConfidence": business_model_confidence,
        "classificationEvidence": classification_evidence,
        "offerType": primary_offer_type,
        "offerTypes": offer_types,
        "salesMotion": sales_motion,
        "buyerType": buyer_type,
        "primaryGrowthMotion": primary_growth_motion,
        "geographyType": geography_type,
        "industry": industry or "unknown",
        "location": location or "unknown",
        "targetMarket": target_market or "unknown",
        "serviceDeliveryModel": "white_label" if business_model == "white_label_agency_partner" else "direct",
        "serviceNames": service_names,
        "proofAssets": _collect_proof_assets(full_text, reputation_signals, services_signals),
        "reportToneProfile": tone_profile,
        "businessLanguage": language_map.get(business_model, language_map["general_business"]),
        "summary": {
            "headline": f"{business_model.replace('_', ' ').title()} | {primary_offer_type.replace('_', ' ').title()} | {sales_motion.replace('_', ' ').title()}",
            "commercialLens": language_map.get(business_model, language_map["general_business"]),
            "classificationConfidence": business_model_confidence,
        },
    }
