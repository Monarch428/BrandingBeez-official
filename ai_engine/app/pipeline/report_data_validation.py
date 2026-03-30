from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Sequence, Tuple
import re
import unicodedata

from app.signals.detection_utils import deduplicate_list_preserve_order
from app.pipeline.report_post_processing import dedupe_findings_preserve_order
from app.utils.currency import infer_currency_from_text


PLACEHOLDER_TEXT = {
    "",
    "n/a",
    "na",
    "none",
    "null",    
    "unknown",
    "not available",
    "no data available",
    "no data generated",
    "0",
    "0.0",
}
 
SECTION_FALLBACKS = {
    "competitiveAnalysis": "This section is currently unavailable due to limited market and competitor data.",
    "costOptimization": "This section is currently unavailable due to limited data sources.",
    "targetMarket": "This section is currently unavailable due to limited data sources.",
    "financialImpact": "This section is currently unavailable due to limited data sources.",
}

STRING_LIST_PATHS: Sequence[Tuple[str, ...]] = (
    ("executiveSummary", "strengths"),
    ("executiveSummary", "weaknesses"),
    ("executiveSummary", "highPriorityRecommendations"),
    ("websiteDigitalPresence", "technicalSEO", "issues"),
    ("websiteDigitalPresence", "technicalSEO", "strengths"),
    ("websiteDigitalPresence", "contentQuality", "strengths"),
    ("websiteDigitalPresence", "contentQuality", "gaps"),
    ("websiteDigitalPresence", "contentQuality", "recommendations"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "strengths"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "gaps"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "recommendations"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "keywordCandidates"),
    ("websiteDigitalPresence", "uxConversion", "highlights"),
    ("websiteDigitalPresence", "uxConversion", "issues"),
    ("websiteDigitalPresence", "uxConversion", "recommendations"),
    ("leadGeneration", "missingHighROIChannels"),
    ("competitiveAdvantages", "advantages"),
)

BROKEN_TEXT_REPLACEMENTS = {
    "â€”": "-",
    "â€“": "-",
    "â€¢": "-",
    "â†’": "->",
    "âœ…": "",
    "âœ”:": "",
    "ðŸ“‹": "",
    "ðŸ‘¥": "",
    "ðŸ”": "",
    "ðŸŽ¯": "",
    "ðŸ¤–": "",
    "ðŸ”§": "",
    "ðŸ’°": "",
    "â°": "",
    "ðŸ“¢": "",
    "ðŸ“ˆ": "",
}

BROKEN_TEXT_REPLACEMENTS["\ufffd"] = ""
BROKEN_TEXT_REPLACEMENTS["&\x05"] = "&"

CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")

ESTIMATION_DISCLAIMER = (
    "Estimation Mode is ON: Sections 8-10 include modeled estimates based on the information you provided plus publicly "
    "available signals (website + listings). These numbers are directional, not audited financials, and should not be used "
    "as the sole basis for budgeting or investment decisions. For higher accuracy, provide real spend/revenue inputs or "
    "connect Ads/Analytics/CRM."
)

_CURRENCY_SYMBOLS = {
    "$": "$",
    "USD": "$",
    "US$": "$",
    "CAD": "$",
    "AUD": "$",
    "£": "£",
    "GBP": "£",
    "€": "€",
    "EUR": "€",
    "₹": "₹",
    "INR": "₹",
}


def _clean_text(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    text = " ".join(value.split()).strip()
    if not text:
        return None
    return text


def sanitize_text_for_pdf(value: Any) -> str:
    """Normalize mojibake/control characters before Node/PDF rendering."""
    text = _clean_text(value)
    if not text:
        return ""
    for broken, fixed in BROKEN_TEXT_REPLACEMENTS.items():
        text = text.replace(broken, fixed)
    text = unicodedata.normalize("NFKC", text)
    text = CONTROL_CHAR_RE.sub("", text)
    text = text.replace("\u200b", "").replace("\ufeff", "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _is_meaningful_text(value: Any) -> bool:
    text = sanitize_text_for_pdf(value)
    if not text:
        return False
    return text.lower() not in PLACEHOLDER_TEXT


def _has_meaningful_content(value: Any, *, count_numbers: bool = True) -> bool:
    if isinstance(value, dict):
        for nested in value.values():
            if _has_meaningful_content(nested, count_numbers=count_numbers):
                return True
        return False
    if isinstance(value, list):
        for nested in value:
            if _has_meaningful_content(nested, count_numbers=count_numbers):
                return True
        return False
    if isinstance(value, str):
        return _is_meaningful_text(value)
    if isinstance(value, (int, float)):
        return count_numbers
    return value is not None


def _section_has_substance(section: Any) -> bool:
    if not isinstance(section, dict):
        return False
    ignored = {
        "score",
        "overallScore",
        "confidenceScore",
        "opportunityScore",
        "riskScore",
        "breakdown",
    }
    for key, value in section.items():
        if key in ignored:
            continue
        if _has_meaningful_content(value, count_numbers=False):
            return True
    return False


def _get_path(root: Dict[str, Any], path: Sequence[str]) -> Any:
    cursor: Any = root
    for key in path:
        if not isinstance(cursor, dict):
            return None
        cursor = cursor.get(key)
    return cursor


def _set_path(root: Dict[str, Any], path: Sequence[str], value: Any) -> None:
    cursor: Dict[str, Any] = root
    for key in path[:-1]:
        child = cursor.get(key)
        if not isinstance(child, dict):
            child = {}
            cursor[key] = child
        cursor = child
    cursor[path[-1]] = value


def _clean_string_list(values: Any) -> List[str]:
    if not isinstance(values, list):
        return []
    cleaned: List[str] = []
    for value in values:
        text = _clean_text(value)
        if text and _is_meaningful_text(text):
            cleaned.append(text)
    return dedupe_findings_preserve_order(deduplicate_list_preserve_order(cleaned))


def _clean_dict_list(values: Any) -> List[Dict[str, Any]]:
    if not isinstance(values, list):
        return []
    cleaned: List[Dict[str, Any]] = []
    for value in values:
        if not isinstance(value, dict):
            continue
        if _has_meaningful_content(value, count_numbers=False):
            cleaned.append(value)
    return cleaned


def _dedupe_dict_list(values: Any, text_keys: Sequence[str]) -> List[Dict[str, Any]]:
    return [
        item for item in dedupe_findings_preserve_order(_clean_dict_list(values), text_keys=text_keys)
        if isinstance(item, dict)
    ]


def _normalize_keyword_entry(item: Any) -> Dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    keyword = _clean_text(item.get("keyword") or item.get("term") or item.get("query"))
    if not keyword:
        return None
    return {
        "keyword": keyword,
        "monthlySearches": item.get("monthlySearches", item.get("searchVolume")),
        "difficulty": item.get("difficulty", item.get("competitionIntensity")),
        "intent": item.get("intent", item.get("label")),
        "currentRank": item.get("currentRank", item.get("rank")),
    }


def _sanitize_nested_strings(value: Any) -> Any:
    if isinstance(value, dict):
        out: Dict[str, Any] = {}
        for key, item in value.items():
            if key in {"b64", "url", "website", "pdfUrl", "reportId", "token"}:
                out[key] = item
            else:
                out[key] = _sanitize_nested_strings(item)
        return out
    if isinstance(value, list):
        return [_sanitize_nested_strings(item) for item in value]
    if isinstance(value, str):
        return sanitize_text_for_pdf(value)
    return value


def _has_signal(items: Any, *tokens: str) -> bool:
    hay = str(items or "").lower()
    return any(token in hay for token in tokens)


def sync_cross_section_signals(report: Dict[str, Any]) -> Dict[str, Any]:
    """Align soft detections across sections so the final report does not contradict itself."""
    cleaned = deepcopy(report) if isinstance(report, dict) else {}

    website = cleaned.get("websiteDigitalPresence")
    services = cleaned.get("servicesPositioning")
    lead = cleaned.get("leadGeneration")
    appendices = cleaned.get("appendices")

    if not all(isinstance(section, dict) for section in (website, services, lead, appendices)):
        return cleaned

    content = website.get("contentQuality")
    ux = website.get("uxConversion")
    if not isinstance(content, dict):
        content = {}
        website["contentQuality"] = content
    if not isinstance(ux, dict):
        ux = {}
        website["uxConversion"] = ux

    strengths = _clean_string_list(content.get("strengths"))
    gaps = _clean_string_list(content.get("gaps"))
    recommendations = _clean_string_list(content.get("recommendations"))
    channels = _clean_dict_list(lead.get("channels"))
    missing_channels = _clean_string_list(lead.get("missingHighROIChannels"))
    service_rows = _clean_dict_list(services.get("services"))

    proof_detected = (
        _has_signal(content.get("meta"), "case", "testimonial", "trust")
        or _has_signal(strengths, "case-study", "portfolio", "testimonial", "review", "trusted by")
        or _has_signal(services.get("mentorNotes"), "trust signals detected", "proof/case-study")
    )
    cta_detected = any(str((row.get("status") or "")).lower() == "detected" for row in channels) or _has_signal(
        ux.get("highlights"), "cta", "conversion"
    )
    services_detected = bool(service_rows) or _has_signal(services.get("mentorNotes"), "services are clearly present")

    if proof_detected:
        gaps = [
            item
            for item in gaps
            if "case studies" not in item.lower() and "testimonials" not in item.lower()
        ]
        if not _has_signal(strengths, "case-study", "testimonial", "review", "trusted by"):
            strengths.append("Proof and trust signals are present, though some are only partially structured.")

    if cta_detected:
        ux["issues"] = [
            item
            for item in _clean_string_list(ux.get("issues"))
            if "no conversion positives detected" not in item.lower()
            and "could not be structurally confirmed" not in item.lower()
        ]
        missing_channels = [
            item for item in missing_channels if "cta signals" not in item.lower()
        ]
        if not _clean_string_list(ux.get("highlights")):
            ux["highlights"] = ["Conversion intent signals are present, though CTA extraction is not fully structured."]

    if services_detected:
        appendices["dataGaps"] = [
            item
            for item in _clean_dict_list(appendices.get("dataGaps"))
            if "service" not in str(item.get("area") or "").lower()
        ]

    content["strengths"] = dedupe_findings_preserve_order(strengths)
    content["gaps"] = dedupe_findings_preserve_order(gaps)
    content["recommendations"] = dedupe_findings_preserve_order(recommendations)
    lead["missingHighROIChannels"] = dedupe_findings_preserve_order(missing_channels)
    return cleaned


def estimate_leads(traffic: float | int | None, conversion_rate: float | None) -> int:
    try:
        if traffic is None or conversion_rate is None:
            return 0
        return max(0, int(round(float(traffic) * float(conversion_rate))))
    except Exception:
        return 0


def estimate_revenue(leads: int | float | None, close_rate: float | None, avg_deal_size: float | None) -> float:
    try:
        if leads is None or close_rate is None or avg_deal_size is None:
            return 0.0
        return max(0.0, float(leads) * float(close_rate) * float(avg_deal_size))
    except Exception:
        return 0.0


def _extract_keyword_volume(report: Dict[str, Any]) -> int:
    total = 0
    appendices = report.get("appendices")
    if not isinstance(appendices, dict):
        return 0
    for tier in appendices.get("keywords") or []:
        if not isinstance(tier, dict):
            continue
        items = tier.get("keywords") if isinstance(tier.get("keywords"), list) else tier.get("items")
        if not isinstance(items, list):
            continue
        for item in items[:20]:
            if not isinstance(item, dict):
                continue
            volume = item.get("monthlySearches", item.get("searchVolume", item.get("search_volume")))
            try:
                if volume is not None:
                    total += max(0, int(float(volume)))
            except Exception:
                continue
    return total


def build_financial_assumptions(report: Dict[str, Any]) -> Dict[str, Any]:
    metadata = report.get("reportMetadata") if isinstance(report.get("reportMetadata"), dict) else {}
    subs = metadata.get("subScores") if isinstance(metadata.get("subScores"), dict) else {}
    appendices = report.get("appendices") if isinstance(report.get("appendices"), dict) else {}
    extraction = appendices.get("evidence", {}).get("extraction", {}) if isinstance(appendices.get("evidence"), dict) else {}

    site_type = extraction.get("businessModelSiteType") or "mixed"
    website_score = int(subs.get("website") or 0)
    seo_score = int(subs.get("seo") or 0)
    reputation_score = int(subs.get("reputation") or 0)
    lead_score = int(subs.get("leadGen") or 0)
    services_score = int(subs.get("services") or 0)
    services_section = report.get("servicesPositioning") if isinstance(report.get("servicesPositioning"), dict) else {}
    lead_section = report.get("leadGeneration") if isinstance(report.get("leadGeneration"), dict) else {}
    keyword_section = report.get("websiteDigitalPresence", {}).get("websiteKeywordAnalysis") if isinstance(report.get("websiteDigitalPresence"), dict) else {}
    services_count = len(_clean_dict_list(services_section.get("services"))) if isinstance(services_section, dict) else 0
    keyword_volume = _extract_keyword_volume(report)
    keyword_candidates = len(_clean_string_list(keyword_section.get("keywordCandidates"))) if isinstance(keyword_section, dict) else 0
    target_market = report.get("targetMarket") if isinstance(report.get("targetMarket"), dict) else {}
    segments = _clean_dict_list(target_market.get("segments")) if isinstance(target_market, dict) else []
    industries = services_section.get("industriesServed") if isinstance(services_section, dict) and isinstance(services_section.get("industriesServed"), dict) else {}
    segment_count = max(len(segments), len(_clean_dict_list(industries.get("highValueIndustries"))))
    cta_detected = bool(_clean_dict_list(lead_section.get("channels")) or _clean_dict_list(lead_section.get("leadMagnets")))
    pricing_detected = any(_is_meaningful_text(row.get("startingPrice")) for row in _clean_dict_list(services_section.get("services")))
    reputation = report.get("reputation") if isinstance(report.get("reputation"), dict) else {}
    trust_detected = bool(
        (reputation.get("totalReviews") or 0)
        or _clean_dict_list(reputation.get("summaryTable"))
        or _clean_string_list(reputation.get("sentimentThemes", {}).get("positive") if isinstance(reputation.get("sentimentThemes"), dict) else [])
    )

    if site_type == "service_business":
        visibility_capture_rate = 0.03 if seo_score < 50 else 0.05 if seo_score < 70 else 0.07
        conversion_rate = 0.018 if lead_score < 50 else 0.028 if lead_score < 70 else 0.04
        close_rate = 0.15 if lead_score < 50 else 0.2 if lead_score < 70 else 0.25
        avg_deal_size = 1500 + (services_count * 350)
    elif site_type == "content_site":
        visibility_capture_rate = 0.04 if seo_score < 50 else 0.06
        conversion_rate = 0.01 if lead_score < 50 else 0.015
        close_rate = 0.04 if lead_score < 50 else 0.07
        avg_deal_size = 600
    elif site_type == "ecommerce":
        visibility_capture_rate = 0.02 if seo_score < 50 else 0.035
        conversion_rate = 0.012 if lead_score < 50 else 0.02
        close_rate = 0.12
        avg_deal_size = 180
    else:
        visibility_capture_rate = 0.03
        conversion_rate = 0.02
        close_rate = 0.12
        avg_deal_size = 1000

    evidence_mode = "keyword_model"
    if keyword_volume > 0:
        modeled_traffic = max(0, int(round(keyword_volume * visibility_capture_rate)))
    else:
        evidence_mode = "heuristic_model"
        base_demand = {
            "service_business": 320,
            "content_site": 650,
            "ecommerce": 1200,
            "mixed": 420,
        }.get(site_type, 420)
        demand_multiplier = (
            0.9
            + min(0.45, services_count * 0.08)
            + min(0.2, keyword_candidates * 0.03)
            + min(0.18, segment_count * 0.06)
        )
        seo_multiplier = 0.85 + ((100 - max(seo_score, 40)) / 100.0) * 0.25
        modeled_traffic = max(120, int(round(base_demand * demand_multiplier * seo_multiplier)))
    modeled_leads = estimate_leads(modeled_traffic, conversion_rate)
    modeled_revenue = estimate_revenue(modeled_leads, close_rate, avg_deal_size)

    confidence = 52
    if keyword_volume > 0:
        confidence += 10
    if services_count > 0:
        confidence += 4
    if segment_count > 0:
        confidence += 4
    if cta_detected:
        confidence += 4
    if trust_detected:
        confidence += 3
    if seo_score > 0:
        confidence += 3
    if lead_score > 0:
        confidence += 3

    return {
        "usable": True,
        "confidence": min(80, confidence),
        "siteType": site_type,
        "evidenceMode": evidence_mode,
        "websiteScore": website_score,
        "seoScore": seo_score,
        "leadScore": lead_score,
        "reputationScore": reputation_score,
        "servicesScore": services_score,
        "servicesCount": services_count,
        "segmentCount": max(segment_count, 1 if _is_meaningful_text(report.get("meta", {}).get("targetMarket") if isinstance(report.get("meta"), dict) else None) else 0),
        "ctaDetected": cta_detected,
        "pricingDetected": pricing_detected,
        "trustDetected": trust_detected,
        "keywordDemand": keyword_volume,
        "visibilityCaptureRate": visibility_capture_rate,
        "traffic": modeled_traffic,
        "conversionRate": conversion_rate,
        "leads": modeled_leads,
        "closeRate": close_rate,
        "avgDealSize": avg_deal_size,
        "revenue": modeled_revenue,
        "notes": [
            (
                f"Modeled organic traffic = keyword demand ({keyword_volume:,}) x visibility capture rate ({visibility_capture_rate:.1%})."
                if keyword_volume > 0
                else f"Keyword demand was not available, so traffic was estimated conservatively from site type ({site_type}), service breadth, and SEO evidence."
            ),
            f"Modeled leads = traffic ({modeled_traffic:,}) x conversion rate ({conversion_rate:.1%}).",
            f"Modeled revenue = leads ({modeled_leads:,}) x close rate ({close_rate:.1%}) x average deal size ({avg_deal_size:,.0f}).",
        ],
    }


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def _safe_float(value: Any) -> float | None:
    if value is None or value == "" or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = sanitize_text_for_pdf(value)
    if not text:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", text.replace(",", ""))
    if not match:
        return None
    try:
        return float(match.group(0))
    except Exception:
        return None


def _first_value(source: Dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in source and source.get(key) not in (None, ""):
            return source.get(key)
    return None


def _as_non_negative(value: Any) -> float | None:
    parsed = _safe_float(value)
    if parsed is None:
        return None
    return max(0.0, parsed)


def _as_ratio(value: Any) -> float | None:
    parsed = _safe_float(value)
    if parsed is None:
        return None
    if parsed > 1:
        parsed = parsed / 100.0
    return _clamp(parsed, 0.0, 1.0)


def _money_symbol_for(code_or_symbol: Any) -> str | None:
    if not code_or_symbol:
        return None
    text = sanitize_text_for_pdf(code_or_symbol).upper()
    if not text:
        return None
    return _CURRENCY_SYMBOLS.get(text) or (str(code_or_symbol) if str(code_or_symbol) in _CURRENCY_SYMBOLS.values() else None)


def _resolve_currency_symbol(report: Dict[str, Any], user_financials: Dict[str, Any] | None = None) -> str:
    user_financials = user_financials if isinstance(user_financials, dict) else {}
    direct = _money_symbol_for(
        _first_value(user_financials, "currencySymbol", "currency_symbol", "currencyCode", "currency")
    )
    if direct:
        return str(direct)

    for section_name in ("financialImpact", "costOptimization", "targetMarket"):
        section = report.get(section_name)
        if not isinstance(section, dict):
            continue
        currency_context = section.get("currencyContext")
        if not isinstance(currency_context, dict):
            continue
        company_currency = currency_context.get("companyCurrency")
        if isinstance(company_currency, dict) and company_currency.get("symbol"):
            return sanitize_text_for_pdf(company_currency.get("symbol")) or "$"
        if currency_context.get("symbol"):
            return sanitize_text_for_pdf(currency_context.get("symbol")) or "$"

    meta = report.get("meta") if isinstance(report.get("meta"), dict) else {}
    for hint in (meta.get("location"), meta.get("targetMarket")):
        info = infer_currency_from_text(sanitize_text_for_pdf(hint))
        if getattr(info, "symbol", None):
            return info.symbol
    return "$"


def _format_percent(value: float) -> str:
    pct = max(0.0, value) * 100.0
    if pct >= 10:
        return f"{pct:.0f}%"
    if pct >= 1:
        return f"{pct:.1f}%".replace(".0%", "%")
    return f"{pct:.2f}%".replace(".00%", "%")


def _format_money(value: float, symbol: str = "$") -> str:
    raw_amount = float(value or 0.0)
    sign = "-" if raw_amount < 0 else ""
    amount = abs(raw_amount)
    if amount >= 1_000_000:
        text = f"{amount / 1_000_000:.2f}".rstrip("0").rstrip(".")
        return f"{sign}{symbol}{text}M"
    if amount >= 1_000:
        text = f"{amount / 1_000:.1f}".rstrip("0").rstrip(".")
        return f"{sign}{symbol}{text}K"
    return f"{sign}{symbol}{amount:,.0f}"


def _format_money_range(low: float, high: float, symbol: str = "$") -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if abs(high - low) <= max(1.0, high * 0.05):
        return _format_money(high, symbol)
    return f"{_format_money(low, symbol)}-{_format_money(high, symbol)}"


def _format_number_range(low: float, high: float, digits: int = 0) -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if digits <= 0:
        low_text = f"{int(round(low)):,}"
        high_text = f"{int(round(high)):,}"
    else:
        low_text = f"{low:.{digits}f}".rstrip("0").rstrip(".")
        high_text = f"{high:.{digits}f}".rstrip("0").rstrip(".")
    return low_text if low_text == high_text else f"{low_text}-{high_text}"


def _format_percent_range(low: float, high: float) -> str:
    low_text = _format_percent(low)
    high_text = _format_percent(high)
    return low_text if low_text == high_text else f"{low_text}-{high_text}"


def _format_roi(low: float, high: float) -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if abs(high - low) <= 0.15:
        return f"{high:.1f}x".replace(".0x", "x")
    return f"{low:.1f}x-{high:.1f}x".replace(".0x", "x")


def _sum_present(values: Sequence[float | None]) -> float:
    return float(sum(value for value in values if value is not None))


def _normalize_user_financials(user_financials: Dict[str, Any] | None) -> Dict[str, Any]:
    raw = user_financials if isinstance(user_financials, dict) else {}
    improvement_factors = raw.get("improvement_factors")
    if not isinstance(improvement_factors, dict):
        improvement_factors = raw.get("improvementFactors") if isinstance(raw.get("improvementFactors"), dict) else {}

    return {
        "currency": _first_value(raw, "currency", "currencyCode", "currency_code"),
        "monthly_payroll": _as_non_negative(_first_value(raw, "monthly_payroll", "monthlyPayroll", "monthlyPayrollCost", "monthly_payroll_cost")),
        "monthly_overhead": _as_non_negative(_first_value(raw, "monthly_overhead", "monthlyOverhead", "monthlyOverheadCost", "monthly_overhead_cost")),
        "monthly_tools_cost": _as_non_negative(_first_value(raw, "monthly_tools_cost", "monthlyToolsCost", "monthly_tools")),
        "monthly_marketing_cost": _as_non_negative(_first_value(raw, "monthly_marketing_cost", "monthlyMarketingCost", "monthlyAdSpend", "monthly_ad_spend")),
        "current_monthly_revenue": _as_non_negative(_first_value(raw, "current_monthly_revenue", "currentMonthlyRevenue", "monthlyRevenue", "current_revenue")),
        "avg_deal_size": _as_non_negative(_first_value(raw, "avg_deal_size", "avgDealSize", "avgDealValue", "avg_deal_value")),
        "close_rate": _as_ratio(_first_value(raw, "close_rate", "closeRate")),
        "monthly_traffic": _as_non_negative(_first_value(raw, "monthly_traffic", "monthlyTraffic", "currentTrafficPerMonth", "current_monthly_traffic")),
        "site_conversion_rate": _as_ratio(_first_value(raw, "site_conversion_rate", "siteConversionRate", "conversionRate")),
        "monthly_leads": _as_non_negative(_first_value(raw, "monthly_leads", "monthlyLeads", "qualifiedLeads")),
        "implementation_cost": _as_non_negative(_first_value(raw, "implementation_cost", "implementationCost")),
        "improvement_factors": {
            "seo_growth_pct": _as_ratio(_first_value(improvement_factors, "seo_growth_pct", "seoGrowthPct")),
            "conversion_rate_lift_pct": _as_ratio(_first_value(improvement_factors, "conversion_rate_lift_pct", "conversionRateLiftPct")),
            "price_increase_pct": _as_ratio(_first_value(improvement_factors, "price_increase_pct", "priceIncreasePct")),
            "cost_savings_pct": _as_ratio(_first_value(improvement_factors, "cost_savings_pct", "costSavingsPct")),
        },
    }


def _extract_user_financials(report: Dict[str, Any]) -> Dict[str, Any]:
    meta = report.get("meta") if isinstance(report.get("meta"), dict) else {}
    for key in ("userFinancials", "businessInputs", "optionalBusinessInputs"):
        candidate = meta.get(key)
        if isinstance(candidate, dict) and candidate:
            return candidate
    return {}


def _has_actual_company_data(user_financials: Dict[str, Any]) -> bool:
    numeric_fields = [
        "monthly_payroll",
        "monthly_overhead",
        "monthly_tools_cost",
        "monthly_marketing_cost",
        "current_monthly_revenue",
        "avg_deal_size",
        "close_rate",
        "monthly_traffic",
        "site_conversion_rate",
        "monthly_leads",
        "implementation_cost",
    ]
    present = sum(1 for key in numeric_fields if user_financials.get(key) is not None)
    cost_present = any(user_financials.get(key) is not None for key in ("monthly_payroll", "monthly_overhead", "monthly_tools_cost", "monthly_marketing_cost"))
    revenue_present = user_financials.get("current_monthly_revenue") is not None
    funnel_present = sum(
        1
        for key in ("monthly_traffic", "site_conversion_rate", "avg_deal_size", "close_rate", "monthly_leads")
        if user_financials.get(key) is not None
    )
    return present >= 3 or (cost_present and revenue_present) or funnel_present >= 3


def build_financial_impact_general(report_data: Dict[str, Any]) -> Dict[str, Any]:
    assumptions = build_financial_assumptions(report_data)
    symbol = _resolve_currency_symbol(report_data)

    traffic = max(assumptions.get("traffic") or 120, 120)
    leads = max(assumptions.get("leads") or 4, 4)
    close_rate = max(assumptions.get("closeRate") or 0.1, 0.08)
    avg_deal_size = max(float(assumptions.get("avgDealSize") or 1000), 750.0)
    monthly_revenue_mid = max(float(assumptions.get("revenue") or 4000), 2500.0)
    annual_revenue_mid = monthly_revenue_mid * 12.0

    low_factor = 0.72 if assumptions.get("evidenceMode") == "heuristic_model" else 0.82
    high_factor = 1.28 if assumptions.get("evidenceMode") == "heuristic_model" else 1.18
    monthly_revenue_low = monthly_revenue_mid * low_factor
    monthly_revenue_high = monthly_revenue_mid * high_factor
    annual_revenue_low = monthly_revenue_low * 12.0
    annual_revenue_high = monthly_revenue_high * 12.0

    website_score = int(assumptions.get("websiteScore") or 55)
    services_count = max(int(assumptions.get("servicesCount") or 0), 1)
    segment_count = max(int(assumptions.get("segmentCount") or 0), 1)
    site_type = assumptions.get("siteType") or "mixed"
    base_impl_cost = {"service_business": 7000, "content_site": 6500, "ecommerce": 11000, "mixed": 8000}.get(site_type, 8000)
    implementation_cost_low = base_impl_cost + (services_count * 500)
    implementation_cost_high = implementation_cost_low * (1.35 + min(0.25, segment_count * 0.06))

    hours_saved_per_month = 10 + max(0, 70 - website_score) / 6.0 + (services_count * 1.75) + (segment_count * 1.5)
    hourly_cost_low = 30.0 if site_type == "content_site" else 40.0 if site_type == "service_business" else 35.0
    hourly_cost_high = hourly_cost_low + 18.0
    annual_cost_savings_low = hours_saved_per_month * hourly_cost_low * 12.0 * 0.8
    annual_cost_savings_high = hours_saved_per_month * hourly_cost_high * 12.0 * 1.1

    total_impact_low = annual_revenue_low + annual_cost_savings_low
    total_impact_high = annual_revenue_high + annual_cost_savings_high
    roi_low = total_impact_low / max(implementation_cost_high, 1.0)
    roi_high = total_impact_high / max(implementation_cost_low, 1.0)

    weight_seo = 0.42 if assumptions.get("keywordDemand", 0) > 0 else 0.28
    weight_conversion = 0.33 if not assumptions.get("ctaDetected") else 0.27
    weight_pricing = 0.25 if not assumptions.get("pricingDetected") else 0.18
    weight_vertical = 0.20 if assumptions.get("segmentCount", 0) > 1 else 0.10
    weights = [
        ("seo", weight_seo),
        ("conversion", weight_conversion),
        ("pricing", weight_pricing),
        ("vertical", weight_vertical),
    ]
    total_weight = sum(weight for _, weight in weights if weight > 0) or 1.0
    normalized_weights = {name: weight / total_weight for name, weight in weights if weight > 0}

    revenue_opportunities: List[Dict[str, str]] = []
    if normalized_weights.get("seo"):
        seo_title = "SEO content marketing" if assumptions.get("keywordDemand", 0) > 0 else "Directory optimization"
        seo_share = normalized_weights["seo"]
        revenue_opportunities.append(
            {
                "opportunity": seo_title,
                "monthlyImpact": _format_money_range(monthly_revenue_low * seo_share, monthly_revenue_high * seo_share, symbol),
                "annualImpact": _format_money_range(annual_revenue_low * seo_share, annual_revenue_high * seo_share, symbol),
                "effortLevel": "High",
            }
        )
    if normalized_weights.get("conversion"):
        revenue_opportunities.append(
            {
                "opportunity": "Lead magnets + nurture",
                "monthlyImpact": _format_money_range(monthly_revenue_low * normalized_weights["conversion"], monthly_revenue_high * normalized_weights["conversion"], symbol),
                "annualImpact": _format_money_range(annual_revenue_low * normalized_weights["conversion"], annual_revenue_high * normalized_weights["conversion"], symbol),
                "effortLevel": "Medium",
            }
        )
    trailing_share = normalized_weights.get("pricing", 0.0) + normalized_weights.get("vertical", 0.0)
    trailing_title = "Niche vertical targeting" if assumptions.get("segmentCount", 0) > 1 else "Price increase + packaging"
    revenue_opportunities.append(
        {
            "opportunity": trailing_title,
            "monthlyImpact": _format_money_range(monthly_revenue_low * trailing_share, monthly_revenue_high * trailing_share, symbol),
            "annualImpact": _format_money_range(annual_revenue_low * trailing_share, annual_revenue_high * trailing_share, symbol),
            "effortLevel": "Medium" if assumptions.get("segmentCount", 0) > 1 else "Low",
        }
    )

    assumptions_list = [
        assumptions.get("notes", [])[0] if assumptions.get("notes") else "Demand was modeled conservatively from available report evidence.",
        f"Modeled close rate range reflects current lead-generation evidence: {_format_percent_range(close_rate * 0.85, close_rate * 1.1)}.",
        f"Average deal size was inferred from site type, visible services, and offer depth: {_format_money_range(avg_deal_size * 0.85, avg_deal_size * 1.15, symbol)}.",
        f"Cost savings assume {hours_saved_per_month:.0f}-{hours_saved_per_month * 1.2:.0f} operational hours reclaimed per month through automation and standardization.",
    ]

    return {
        "mode": "general_estimation",
        "mentorNotes": (
            f"The strongest modeled upside comes from {'organic visibility' if assumptions.get('keywordDemand', 0) > 0 else 'local/discovery visibility'}, "
            f"paired with conversion fixes that turn existing demand into {_format_money_range(monthly_revenue_low, monthly_revenue_high, symbol)} in monthly revenue opportunity. "
            f"Cost savings are modeled separately so the total impact reflects both growth and efficiency, not just traffic gains."
        ),
        "notes": "Financial impact is modeled from report evidence and conservative operating assumptions; use it as a planning range, not audited revenue.",
        "confidenceScore": int(_clamp(float(assumptions.get("confidence") or 58), 50, 80)),
        "estimationDisclaimer": ESTIMATION_DISCLAIMER,
        "assumptions": [item for item in assumptions_list if _is_meaningful_text(item)],
        "revenueOpportunities": revenue_opportunities,
        "costSavings": [
            {
                "initiative": "Automated reporting and follow-up workflows",
                "annualSavings": _format_money_range(annual_cost_savings_low * 0.45, annual_cost_savings_high * 0.45, symbol),
            },
            {
                "initiative": "Standardized delivery processes",
                "annualSavings": _format_money_range(annual_cost_savings_low * 0.55, annual_cost_savings_high * 0.55, symbol),
            },
        ],
        "netImpact": {
            "revenueGrowth": _format_money_range(annual_revenue_low, annual_revenue_high, symbol),
            "costSavings": _format_money_range(annual_cost_savings_low, annual_cost_savings_high, symbol),
            "totalFinancialImpact": _format_money_range(total_impact_low, total_impact_high, symbol),
            "roi": _format_roi(roi_low, roi_high),
        },
        "revenueTable": [
            {"metric": "Monthly traffic opportunity", "value": _format_number_range(traffic * low_factor, traffic * high_factor)},
            {"metric": "Leads per Month", "value": _format_number_range(leads * low_factor, leads * high_factor)},
            {"metric": "Close Rate", "value": _format_percent_range(close_rate * 0.85, close_rate * 1.1)},
            {"metric": "Average Deal Size", "value": _format_money_range(avg_deal_size * 0.85, avg_deal_size * 1.15, symbol)},
            {"metric": "Monthly Revenue Opportunity", "value": _format_money_range(monthly_revenue_low, monthly_revenue_high, symbol)},
            {"metric": "Annual Revenue Opportunity", "value": _format_money_range(annual_revenue_low, annual_revenue_high, symbol)},
            {"metric": "Annual Cost Savings", "value": _format_money_range(annual_cost_savings_low, annual_cost_savings_high, symbol)},
            {"metric": "ROI on Implementation", "value": _format_roi(roi_low, roi_high)},
        ],
        "currentRevenueEstimate": _format_money_range(monthly_revenue_low, monthly_revenue_high, symbol) + "/mo opportunity",
        "improvementPotential": _format_money_range(annual_revenue_low, annual_revenue_high, symbol) + "/yr revenue growth",
        "projectedRevenueIncrease": _format_money_range(total_impact_low, total_impact_high, symbol) + "/yr total impact",
    }


def build_financial_impact_from_actuals(report_data: Dict[str, Any], user_financials: Dict[str, Any]) -> Dict[str, Any]:
    normalized = _normalize_user_financials(user_financials)
    assumptions = build_financial_assumptions(report_data)
    symbol = _resolve_currency_symbol(report_data, normalized)

    current_total_monthly_cost = _sum_present(
        [
            normalized.get("monthly_payroll"),
            normalized.get("monthly_overhead"),
            normalized.get("monthly_tools_cost"),
            normalized.get("monthly_marketing_cost"),
        ]
    )

    close_rate = normalized.get("close_rate") if normalized.get("close_rate") is not None else (assumptions.get("closeRate") or 0.15)
    site_conversion_rate = normalized.get("site_conversion_rate") if normalized.get("site_conversion_rate") is not None else (assumptions.get("conversionRate") or 0.025)
    avg_deal_size = normalized.get("avg_deal_size") if normalized.get("avg_deal_size") is not None else (assumptions.get("avgDealSize") or 1500.0)

    monthly_traffic = normalized.get("monthly_traffic")
    monthly_leads_input = normalized.get("monthly_leads")
    if monthly_traffic is None and monthly_leads_input is not None:
        monthly_traffic = monthly_leads_input / max(site_conversion_rate, 0.01)
    if monthly_traffic is None:
        monthly_traffic = assumptions.get("traffic") or 250.0

    current_leads = monthly_leads_input if monthly_leads_input is not None else monthly_traffic * site_conversion_rate
    current_customers = current_leads * close_rate
    modeled_current_revenue = current_customers * avg_deal_size
    current_monthly_revenue = normalized.get("current_monthly_revenue") if normalized.get("current_monthly_revenue") is not None else modeled_current_revenue

    factors = normalized.get("improvement_factors") if isinstance(normalized.get("improvement_factors"), dict) else {}
    seo_growth_pct = factors.get("seo_growth_pct")
    if seo_growth_pct is None:
        seo_growth_pct = _clamp(0.08 + ((70 - min(int(assumptions.get("seoScore") or 55), 70)) * 0.002), 0.08, 0.22)
    conversion_rate_lift_pct = factors.get("conversion_rate_lift_pct")
    if conversion_rate_lift_pct is None:
        conversion_rate_lift_pct = _clamp(0.06 + ((70 - min(int(assumptions.get("leadScore") or 55), 70)) * 0.0025), 0.06, 0.18)
    price_increase_pct = factors.get("price_increase_pct")
    if price_increase_pct is None:
        price_increase_pct = 0.05 if assumptions.get("pricingDetected") else 0.08
    cost_savings_pct = factors.get("cost_savings_pct")
    if cost_savings_pct is None:
        cost_savings_pct = _clamp(0.04 + ((72 - min(int(assumptions.get("websiteScore") or 58), 72)) * 0.0018), 0.04, 0.12)

    improved_traffic = monthly_traffic * (1.0 + seo_growth_pct)
    improved_conversion_rate = site_conversion_rate * (1.0 + conversion_rate_lift_pct)
    improved_avg_deal_size = avg_deal_size * (1.0 + price_increase_pct)
    improved_leads = improved_traffic * improved_conversion_rate
    improved_customers = improved_leads * close_rate
    improved_monthly_revenue = improved_customers * improved_avg_deal_size

    baseline_revenue = max(current_monthly_revenue, modeled_current_revenue)
    monthly_revenue_growth = max(0.0, improved_monthly_revenue - baseline_revenue)
    annual_revenue_growth = monthly_revenue_growth * 12.0
    monthly_cost_savings = current_total_monthly_cost * cost_savings_pct
    annual_cost_savings = monthly_cost_savings * 12.0
    total_annual_financial_impact = annual_revenue_growth + annual_cost_savings

    implementation_cost = normalized.get("implementation_cost")
    if implementation_cost is None:
        implementation_cost = max(7500.0, min(25000.0, max(current_total_monthly_cost * 0.9, current_monthly_revenue * 0.18)))
    roi = total_annual_financial_impact / max(implementation_cost, 1.0)
    current_monthly_profit = current_monthly_revenue - current_total_monthly_cost

    component_traffic = max(0.0, (improved_traffic * site_conversion_rate * close_rate * avg_deal_size) - modeled_current_revenue)
    component_conversion = max(0.0, (improved_traffic * improved_conversion_rate * close_rate * avg_deal_size) - (improved_traffic * site_conversion_rate * close_rate * avg_deal_size))
    component_pricing = max(0.0, improved_monthly_revenue - (improved_traffic * improved_conversion_rate * close_rate * avg_deal_size))
    component_total = component_traffic + component_conversion + component_pricing
    if component_total > 0 and monthly_revenue_growth > 0:
        scale = monthly_revenue_growth / component_total
        component_traffic *= scale
        component_conversion *= scale
        component_pricing *= scale

    revenue_opportunities: List[Dict[str, str]] = []
    if component_traffic > 0:
        revenue_opportunities.append({"opportunity": "SEO growth", "monthlyImpact": _format_money(component_traffic, symbol), "annualImpact": _format_money(component_traffic * 12.0, symbol), "effortLevel": "High"})
    if component_conversion > 0:
        revenue_opportunities.append({"opportunity": "Conversion optimization", "monthlyImpact": _format_money(component_conversion, symbol), "annualImpact": _format_money(component_conversion * 12.0, symbol), "effortLevel": "Medium"})
    if component_pricing > 0:
        revenue_opportunities.append({"opportunity": "Price increase + packaging", "monthlyImpact": _format_money(component_pricing, symbol), "annualImpact": _format_money(component_pricing * 12.0, symbol), "effortLevel": "Low"})
    if not revenue_opportunities:
        revenue_opportunities.append({"opportunity": "Revenue optimization", "monthlyImpact": _format_money(monthly_revenue_growth, symbol), "annualImpact": _format_money(annual_revenue_growth, symbol), "effortLevel": "Medium"})

    tool_and_marketing = _sum_present([normalized.get("monthly_tools_cost"), normalized.get("monthly_marketing_cost")]) * cost_savings_pct * 12.0
    payroll_and_overhead = _sum_present([normalized.get("monthly_payroll"), normalized.get("monthly_overhead")]) * cost_savings_pct * 12.0
    cost_savings: List[Dict[str, str]] = []
    if tool_and_marketing > 0:
        cost_savings.append({"initiative": "Tool stack and media-spend efficiency", "annualSavings": _format_money(tool_and_marketing, symbol)})
    if payroll_and_overhead > 0:
        cost_savings.append({"initiative": "Automation and process standardization", "annualSavings": _format_money(payroll_and_overhead, symbol)})
    if not cost_savings:
        cost_savings.append({"initiative": "Operational cost optimization", "annualSavings": _format_money(annual_cost_savings, symbol)})

    explicit_fields = [
        normalized.get("monthly_payroll"),
        normalized.get("monthly_overhead"),
        normalized.get("monthly_tools_cost"),
        normalized.get("monthly_marketing_cost"),
        normalized.get("current_monthly_revenue"),
        normalized.get("avg_deal_size"),
        normalized.get("close_rate"),
        normalized.get("monthly_traffic"),
        normalized.get("site_conversion_rate"),
        normalized.get("monthly_leads"),
        normalized.get("implementation_cost"),
    ]
    provided_count = sum(1 for value in explicit_fields if value is not None)

    assumption_strings = [
        f"Current monthly cost baseline = {_format_money(current_total_monthly_cost, symbol)} from payroll, overhead, tools, and marketing inputs.",
        f"Improvement factors applied: SEO {_format_percent(seo_growth_pct)}, conversion {_format_percent(conversion_rate_lift_pct)}, pricing {_format_percent(price_increase_pct)}, cost savings {_format_percent(cost_savings_pct)}.",
        f"ROI uses an implementation cost of {_format_money(implementation_cost, symbol)}.",
    ]
    if normalized.get("current_monthly_revenue") is None or normalized.get("monthly_traffic") is None or normalized.get("site_conversion_rate") is None:
        assumption_strings.append("Missing company inputs were filled with conservative defaults inferred from the report evidence.")

    return {
        "mode": "actual_company_data",
        "mentorNotes": (
            f"Using company-provided inputs, the model projects {_format_money(annual_revenue_growth, symbol)} in annual revenue growth and "
            f"{_format_money(annual_cost_savings, symbol)} in annual savings. The largest lift comes from turning current traffic into more customers before "
            f"adding a pricing increase, which keeps the projection tied to your existing operating baseline."
        ),
        "notes": "Financial impact uses company-provided inputs plus explicit improvement assumptions, so the projection is tighter than general estimation mode but still directional.",
        "confidenceScore": int(_clamp(75 + (provided_count / max(len(explicit_fields), 1)) * 20, 75, 95)),
        "estimationDisclaimer": ESTIMATION_DISCLAIMER,
        "assumptions": assumption_strings,
        "revenueOpportunities": revenue_opportunities,
        "costSavings": cost_savings,
        "netImpact": {
            "revenueGrowth": _format_money(annual_revenue_growth, symbol),
            "costSavings": _format_money(annual_cost_savings, symbol),
            "totalFinancialImpact": _format_money(total_annual_financial_impact, symbol),
            "roi": _format_roi(roi, roi),
        },
        "revenueTable": [
            {"metric": "Current Monthly Revenue", "value": _format_money(current_monthly_revenue, symbol)},
            {"metric": "Current Monthly Cost", "value": _format_money(current_total_monthly_cost, symbol)},
            {"metric": "Current Monthly Profit", "value": _format_money(current_monthly_profit, symbol)},
            {"metric": "Current Leads per Month", "value": _format_number_range(current_leads, current_leads)},
            {"metric": "Improved Leads per Month", "value": _format_number_range(improved_leads, improved_leads)},
            {"metric": "Improved Monthly Revenue", "value": _format_money(improved_monthly_revenue, symbol)},
            {"metric": "Annual Revenue Growth", "value": _format_money(annual_revenue_growth, symbol)},
            {"metric": "Annual Financial Impact", "value": _format_money(total_annual_financial_impact, symbol)},
        ],
        "currentRevenueEstimate": _format_money(current_monthly_revenue, symbol) + "/mo current revenue",
        "improvementPotential": _format_money(annual_revenue_growth, symbol) + "/yr revenue growth",
        "projectedRevenueIncrease": _format_money(total_annual_financial_impact, symbol) + "/yr total impact",
    }


def ensure_financial_impact_section(
    financial_section: Dict[str, Any] | None,
    report_data: Dict[str, Any],
    user_financials: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    section = deepcopy(financial_section) if isinstance(financial_section, dict) else {}
    normalized_user_financials = _normalize_user_financials(user_financials or _extract_user_financials(report_data))

    modeled = (
        build_financial_impact_from_actuals(report_data, normalized_user_financials)
        if _has_actual_company_data(normalized_user_financials)
        else build_financial_impact_general(report_data)
    )

    scenarios = _clean_dict_list(section.get("scenarios"))
    profitability_levers = _clean_dict_list(section.get("profitabilityLevers"))

    section.update(modeled)
    section["revenueTable"] = _dedupe_dict_list(section.get("revenueTable"), ("metric", "value"))
    section["revenueOpportunities"] = _dedupe_dict_list(section.get("revenueOpportunities"), ("opportunity", "monthlyImpact", "annualImpact"))
    section["costSavings"] = _dedupe_dict_list(section.get("costSavings"), ("initiative", "annualSavings"))
    section["assumptions"] = _clean_string_list(section.get("assumptions"))
    section["confidenceScore"] = int(_clamp(float(section.get("confidenceScore") or 0), 0, 100))
    section["estimationDisclaimer"] = sanitize_text_for_pdf(section.get("estimationDisclaimer")) or ESTIMATION_DISCLAIMER
    if scenarios:
        section["scenarios"] = scenarios
    if profitability_levers:
        section["profitabilityLevers"] = profitability_levers
    return section


def _normalize_appendices(report: Dict[str, Any]) -> None:
    appendices = report.get("appendices")
    if not isinstance(appendices, dict):
        appendices = {}
        report["appendices"] = appendices

    keyword_tiers = appendices.get("keywords")
    normalized_tiers: List[Dict[str, Any]] = []
    if isinstance(keyword_tiers, list):
        for tier in keyword_tiers:
            if not isinstance(tier, dict):
                continue
            normalized_keywords = _clean_dict_list(tier.get("keywords"))
            if not normalized_keywords and isinstance(tier.get("items"), list):
                converted = [_normalize_keyword_entry(item) for item in tier.get("items", [])]
                normalized_keywords = [item for item in converted if isinstance(item, dict)]
            cleaned_items = _clean_dict_list(tier.get("items"))
            if not normalized_keywords and not cleaned_items:
                continue
            tier_copy = deepcopy(tier)
            if normalized_keywords:
                tier_copy["keywords"] = normalized_keywords
            if cleaned_items:
                tier_copy["items"] = cleaned_items
            normalized_tiers.append(tier_copy)
    appendices["keywords"] = normalized_tiers

    appendices["dataSources"] = _dedupe_dict_list(appendices.get("dataSources"), ("source", "use", "label"))
    appendices["dataGaps"] = _clean_dict_list(appendices.get("dataGaps"))
    appendices["scoreSummary"] = _clean_dict_list(appendices.get("scoreSummary"))
    appendices["growthForecastTables"] = _clean_dict_list(appendices.get("growthForecastTables"))
    appendices["serp"] = [
        tier
        for tier in _clean_dict_list(appendices.get("serp"))
        if _has_meaningful_content(tier.get("items"), count_numbers=False)
    ]
    appendices["backlinks"] = [
        tier
        for tier in _clean_dict_list(appendices.get("backlinks"))
        if _has_meaningful_content(tier.get("items"), count_numbers=False)
    ]
    appendices["evidenceScreenshots"] = _clean_dict_list(appendices.get("evidenceScreenshots"))
    pages_crawled = appendices.get("pagesCrawled")
    if isinstance(pages_crawled, list):
        appendices["pagesCrawled"] = _clean_string_list(pages_crawled)

    evidence = appendices.get("evidence")
    if isinstance(evidence, dict):
        screenshots = evidence.get("screenshots")
        if isinstance(screenshots, dict):
            for variant in ("desktop", "mobile"):
                shot = screenshots.get(variant)
                if not isinstance(shot, dict):
                    continue
                slices = shot.get("slices")
                if isinstance(slices, list):
                    shot["slices"] = [
                        slice_item
                        for slice_item in slices
                        if isinstance(slice_item, dict) and _is_meaningful_text(slice_item.get("b64"))
                    ]


def _dedupe_known_lists(report: Dict[str, Any]) -> None:
    for path in STRING_LIST_PATHS:
        current = _get_path(report, path)
        if isinstance(current, list):
            _set_path(report, path, _clean_string_list(current))


def _ensure_services_section(report: Dict[str, Any]) -> None:
    section = report.get("servicesPositioning")
    if not isinstance(section, dict):
        return
    section["services"] = _dedupe_dict_list(section.get("services"), ("name", "description"))
    current_industries = section.get("industriesServed")
    if isinstance(current_industries, dict):
        current_industries["current"] = _clean_string_list(current_industries.get("current"))
        current_industries["highValueIndustries"] = _clean_dict_list(current_industries.get("highValueIndustries"))
    if not section["services"] and not _is_meaningful_text(section.get("mentorNotes")):
        section["mentorNotes"] = "Services are clearly present, but the extraction layer could not fully structure them."


def _ensure_lead_generation_section(report: Dict[str, Any]) -> None:
    section = report.get("leadGeneration")
    if not isinstance(section, dict):
        return
    section["channels"] = _clean_dict_list(section.get("channels"))
    section["leadMagnets"] = _clean_dict_list(section.get("leadMagnets"))
    section["missingHighROIChannels"] = _clean_string_list(section.get("missingHighROIChannels"))
    if (
        not section["channels"]
        and not section["leadMagnets"]
        and not section["missingHighROIChannels"]
        and not _is_meaningful_text(section.get("mentorNotes"))
    ):
        section["mentorNotes"] = "CTA signals are likely present but could not be structurally extracted."


def _ensure_content_quality(report: Dict[str, Any]) -> None:
    section = report.get("websiteDigitalPresence")
    if not isinstance(section, dict):
        return
    content_quality = section.get("contentQuality")
    if not isinstance(content_quality, dict):
        return
    content_quality["strengths"] = _clean_string_list(content_quality.get("strengths"))
    content_quality["gaps"] = _clean_string_list(content_quality.get("gaps"))
    content_quality["recommendations"] = _clean_string_list(content_quality.get("recommendations"))
    if (
        not content_quality["strengths"]
        and not content_quality["gaps"]
        and not content_quality["recommendations"]
    ):
        content_quality["gaps"] = ["This section is currently unavailable due to limited data sources."]

    keyword_analysis = section.get("websiteKeywordAnalysis")
    if isinstance(keyword_analysis, dict):
        keyword_analysis["strengths"] = _clean_string_list(keyword_analysis.get("strengths"))
        keyword_analysis["gaps"] = _clean_string_list(keyword_analysis.get("gaps"))
        keyword_analysis["recommendations"] = _clean_string_list(keyword_analysis.get("recommendations"))
        keyword_analysis["keywordCandidates"] = _clean_string_list(keyword_analysis.get("keywordCandidates"))
        keyword_analysis["opportunities"] = _dedupe_dict_list(keyword_analysis.get("opportunities"), ("keyword", "intent", "currentCoverage"))


def _ensure_executive_summary(report: Dict[str, Any]) -> None:
    section = report.get("executiveSummary")
    if not isinstance(section, dict):
        return
    quick_wins = section.get("quickWins")
    if isinstance(quick_wins, list):
        section["quickWins"] = _dedupe_dict_list(quick_wins, ("title", "details"))


def _ensure_competitive_section(report: Dict[str, Any]) -> None:
    section = report.get("competitiveAnalysis")
    if not isinstance(section, dict):
        return
    section["competitors"] = _dedupe_dict_list(section.get("competitors"), ("website", "domain", "name"))
    section["positioningMatrix"] = _clean_dict_list(section.get("positioningMatrix"))
    section["opportunities"] = _clean_string_list(section.get("opportunities"))
    section["threats"] = _clean_string_list(section.get("threats"))


def _ensure_risk_section(report: Dict[str, Any]) -> None:
    section = report.get("riskAssessment")
    if not isinstance(section, dict):
        return
    section["risks"] = _dedupe_dict_list(section.get("risks"), ("risk", "mitigation", "notes"))
    section["compliance"] = _clean_string_list(section.get("compliance"))


def normalize_seo_visibility_object(section: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize SEO aliases into one validated object shape."""

    out = dict(section) if isinstance(section, dict) else {}
    backlinks = out.get("backlinks") if isinstance(out.get("backlinks"), dict) else {}
    backlink_profile = out.get("backlinkProfile") if isinstance(out.get("backlinkProfile"), dict) else {}
    local_seo = out.get("localSeo") if isinstance(out.get("localSeo"), dict) else {}
    local_alias = out.get("localSEO") if isinstance(out.get("localSEO"), dict) else {}

    if backlink_profile and not backlinks:
        backlinks = backlink_profile
    if backlinks:
        out["backlinks"] = backlinks
        out["backlinkProfile"] = backlinks

    if local_alias and not local_seo:
        local_seo = local_alias
    if local_seo:
        out["localSeo"] = local_seo
        out["localSEO"] = local_seo

    site_type = sanitize_text_for_pdf(out.get("siteType"))
    if site_type in {"content_site", "service_business", "ecommerce", "mixed"}:
        out["siteType"] = site_type
    elif "siteType" in out:
        out["siteType"] = "mixed"

    return out


def validate_seo_render_payload(section: Dict[str, Any]) -> Dict[str, Any]:
    """Drop half-built SEO subsections so PDF rendering stays truthful."""

    out = normalize_seo_visibility_object(section)
    for key in ("domainAuthority", "backlinks", "keywordRankings", "localSeo"):
        value = out.get(key)
        if isinstance(value, dict) and not _section_has_substance(value):
            out[key] = {}

    if isinstance(out.get("backlinks"), dict):
        out["backlinkProfile"] = out["backlinks"]
    if isinstance(out.get("localSeo"), dict):
        out["localSEO"] = out["localSeo"]

    return out


def has_meaningful_competitor_benchmark(section: Dict[str, Any]) -> bool:
    comparison = section.get("competitorComparison")
    if not isinstance(comparison, dict):
        return False
    return bool(_clean_dict_list(comparison.get("directCompetitors")))


def has_meaningful_local_seo(section: Dict[str, Any]) -> bool:
    local_seo = section.get("localSeo")
    if not isinstance(local_seo, dict):
        return False
    if local_seo.get("priority") == "low":
        return bool(
            _clean_string_list(local_seo.get("issues"))
            or _is_meaningful_text(local_seo.get("impact"))
            or _is_meaningful_text(local_seo.get("businessImpact"))
        )
    return _section_has_substance(local_seo)


def clean_authority_benchmark_rows(benchmark: Dict[str, Any]) -> Dict[str, Any]:
    """Remove empty authority benchmark competitor rows."""

    out = dict(benchmark) if isinstance(benchmark, dict) else {}
    out["competitors"] = [
        item
        for item in _clean_dict_list(out.get("competitors"))
        if _is_meaningful_text(item.get("score")) or _is_meaningful_text(item.get("note"))
    ]
    for key in ("competitorA", "competitorB", "competitorC"):
        if not _is_meaningful_text(out.get(key)):
            out.pop(key, None)
    return out


def validate_benchmark_payload(section: Dict[str, Any]) -> None:
    """Normalize authority benchmark payload before persistence/rendering."""

    domain_authority = section.get("domainAuthority")
    if not isinstance(domain_authority, dict):
        return
    benchmark = domain_authority.get("benchmark")
    if isinstance(benchmark, dict):
        domain_authority["benchmark"] = clean_authority_benchmark_rows(benchmark)


def _ensure_seo_section(report: Dict[str, Any]) -> None:
    section = report.get("seoVisibility")
    if not isinstance(section, dict):
        return
    section = validate_seo_render_payload(section)
    report["seoVisibility"] = section

    backlink_profile = section.get("backlinkProfile")
    backlinks = section.get("backlinks")
    if isinstance(backlink_profile, dict) and not isinstance(backlinks, dict):
        section["backlinks"] = backlink_profile
        backlinks = backlink_profile
    elif isinstance(backlinks, dict) and not isinstance(backlink_profile, dict):
        section["backlinkProfile"] = backlinks

    local_alias = section.get("localSEO")
    local_seo = section.get("localSeo")
    if isinstance(local_alias, dict) and not isinstance(local_seo, dict):
        section["localSeo"] = local_alias
        local_seo = local_alias
    elif isinstance(local_seo, dict) and not isinstance(local_alias, dict):
        section["localSEO"] = local_seo

    domain_authority = section.get("domainAuthority")
    if isinstance(domain_authority, dict):
        validate_benchmark_payload(section)

    if isinstance(backlinks, dict):
        backlinks["competitorComparison"] = _clean_dict_list(backlinks.get("competitorComparison"))
        backlinks["riskSignals"] = _clean_string_list(backlinks.get("riskSignals"))
        if not _is_meaningful_text(backlinks.get("anchorMixSummary")):
            backlinks["anchorMixSummary"] = "Anchor mix detail was limited in this run."
        section["backlinkProfile"] = backlinks

    competitor_comparison = section.get("competitorComparison")
    if isinstance(competitor_comparison, dict):
        competitor_comparison["directCompetitors"] = _clean_dict_list(competitor_comparison.get("directCompetitors"))
        competitor_comparison["discoveryPlatforms"] = _clean_dict_list(competitor_comparison.get("discoveryPlatforms"))
        if not has_meaningful_competitor_benchmark(section) and not competitor_comparison["discoveryPlatforms"]:
            section["competitorComparison"] = {}

    keyword_rankings = section.get("keywordRankings")
    if isinstance(keyword_rankings, dict):
        keyword_rankings["targetKeywords"] = _clean_string_list(keyword_rankings.get("targetKeywords"))
        by_priority = keyword_rankings.get("byPriority")
        if isinstance(by_priority, dict):
            keyword_rankings["byPriority"] = {str(k): _clean_string_list(v) for k, v in by_priority.items()}
        by_intent = keyword_rankings.get("byIntent")
        if isinstance(by_intent, dict):
            keyword_rankings["byIntent"] = {str(k): _clean_string_list(v) for k, v in by_intent.items()}
        keyword_rankings["topRankingKeywords"] = _clean_dict_list(keyword_rankings.get("topRankingKeywords"))
        keyword_rankings["missingHighValueKeywords"] = _clean_dict_list(keyword_rankings.get("missingHighValueKeywords"))
        branded = _clean_dict_list(keyword_rankings.get("brandedKeywords"))
        non_branded = _clean_dict_list(keyword_rankings.get("nonBrandedKeywords"))
        if not branded:
            branded = [
                item
                for item in keyword_rankings["topRankingKeywords"]
                if isinstance(item, dict) and str(item.get("type") or "").lower() == "brand"
            ]
        if not non_branded:
            non_branded = [
                item
                for item in keyword_rankings["topRankingKeywords"]
                if isinstance(item, dict) and str(item.get("type") or "").lower() != "brand"
            ]
        keyword_rankings["brandedKeywords"] = branded
        keyword_rankings["nonBrandedKeywords"] = non_branded

        if not _is_meaningful_text(keyword_rankings.get("notes")):
            keyword_rankings["notes"] = "Keyword visibility is based on the SEO evidence available in this run and falls back to conservative placeholders when rank data is missing."

    if isinstance(local_seo, dict):
        local_priority = sanitize_text_for_pdf(local_seo.get("priority"))
        if local_priority not in {"primary", "secondary", "low"}:
            local_priority = "low"
        local_seo["priority"] = local_priority
        local_seo["currentListings"] = _clean_string_list(local_seo.get("currentListings"))
        local_seo["missingListings"] = _clean_string_list(local_seo.get("missingListings"))
        local_seo["issues"] = _clean_string_list(local_seo.get("issues"))
        local_seo["localRankingGaps"] = _clean_string_list(local_seo.get("localRankingGaps"))
        if not _is_meaningful_text(local_seo.get("businessImpact")) and _is_meaningful_text(local_seo.get("impact")):
            local_seo["businessImpact"] = sanitize_text_for_pdf(local_seo.get("impact"))
        if not _is_meaningful_text(local_seo.get("impact")) and _is_meaningful_text(local_seo.get("businessImpact")):
            local_seo["impact"] = sanitize_text_for_pdf(local_seo.get("businessImpact"))
        if not _is_meaningful_text(local_seo.get("notes")):
            local_seo["notes"] = "Local SEO recommendations are calibrated to whether local search appears to be a primary or secondary channel."
        section["localSEO"] = local_seo
        if not has_meaningful_local_seo(section):
            section["localSeo"] = {}
            section["localSEO"] = {}

    if not _is_meaningful_text(section.get("opportunitySummary")) and isinstance(keyword_rankings, dict):
        section["opportunitySummary"] = sanitize_text_for_pdf(keyword_rankings.get("opportunitySummary"))
    section["priorityActions"] = _clean_string_list(section.get("priorityActions"))


def _ensure_financial_section(report: Dict[str, Any]) -> None:
    section = report.get("financialImpact")
    if not isinstance(section, dict):
        section = {}
        report["financialImpact"] = section

    estimation_enabled = bool(
        (isinstance(report.get("meta"), dict) and report.get("meta", {}).get("estimationMode"))
        or section.get("estimationDisclaimer")
        or _clean_dict_list(section.get("scenarios"))
        or _extract_user_financials(report)
    )
    if not estimation_enabled:
        return
    report["financialImpact"] = ensure_financial_impact_section(section, report, _extract_user_financials(report))


def _ensure_generic_section_fallbacks(report: Dict[str, Any]) -> None:
    for section_name, message in SECTION_FALLBACKS.items():
        section = report.get(section_name)
        if not isinstance(section, dict):
            continue
        if _section_has_substance(section):
            continue
        note_key = "mentorNotes" if "mentorNotes" in section or section_name != "competitiveAnalysis" else "notes"
        if not _is_meaningful_text(section.get(note_key)):
            section[note_key] = message


def _ensure_assembled_section_notes(report: Dict[str, Any]) -> None:
    sections = report.get("sections")
    if not isinstance(sections, dict):
        return
    for section_key, section_value in sections.items():
        if not isinstance(section_value, dict):
            continue
        if _section_has_substance(section_value):
            continue
        if not _is_meaningful_text(section_value.get("notes")):
            section_value["notes"] = "This section is currently unavailable due to limited data sources."


def validate_report_data(report: Dict[str, Any] | None) -> Dict[str, Any]:
    cleaned = _sanitize_nested_strings(deepcopy(report) if isinstance(report, dict) else {})
    cleaned = sync_cross_section_signals(cleaned)
    _dedupe_known_lists(cleaned)
    _normalize_appendices(cleaned)
    _ensure_executive_summary(cleaned)
    _ensure_services_section(cleaned)
    _ensure_lead_generation_section(cleaned)
    _ensure_content_quality(cleaned)
    _ensure_competitive_section(cleaned)
    _ensure_risk_section(cleaned)
    _ensure_seo_section(cleaned)
    _ensure_financial_section(cleaned)
    _ensure_generic_section_fallbacks(cleaned)
    _ensure_assembled_section_notes(cleaned)
    return cleaned
