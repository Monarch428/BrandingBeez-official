from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Sequence, Tuple
import re

from app.signals.detection_utils import deduplicate_list_preserve_order
from app.pipeline.report_post_processing import dedupe_findings_preserve_order


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

CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")


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
    text = CONTROL_CHAR_RE.sub("", text)
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
    seo_score = int(subs.get("seo") or 0)
    lead_score = int(subs.get("leadGen") or 0)
    services_count = len(_clean_dict_list(report.get("servicesPositioning", {}).get("services"))) if isinstance(report.get("servicesPositioning"), dict) else 0
    keyword_volume = _extract_keyword_volume(report)

    if keyword_volume <= 0:
        return {
            "usable": False,
            "confidence": 25,
            "siteType": site_type,
            "notes": ["Keyword demand data is unavailable, so financial modeling remains low-confidence."],
        }

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

    modeled_traffic = max(0, int(round(keyword_volume * visibility_capture_rate)))
    modeled_leads = estimate_leads(modeled_traffic, conversion_rate)
    modeled_revenue = estimate_revenue(modeled_leads, close_rate, avg_deal_size)

    confidence = 45
    if keyword_volume > 0:
        confidence += 15
    if int(subs.get("leadGen") or 0) > 0:
        confidence += 10
    if int(subs.get("seo") or 0) > 0:
        confidence += 10

    return {
        "usable": True,
        "confidence": min(85, confidence),
        "siteType": site_type,
        "keywordDemand": keyword_volume,
        "visibilityCaptureRate": visibility_capture_rate,
        "traffic": modeled_traffic,
        "conversionRate": conversion_rate,
        "leads": modeled_leads,
        "closeRate": close_rate,
        "avgDealSize": avg_deal_size,
        "revenue": modeled_revenue,
        "notes": [
            f"Modeled organic traffic = keyword demand ({keyword_volume:,}) x visibility capture rate ({visibility_capture_rate:.1%}).",
            f"Modeled leads = traffic ({modeled_traffic:,}) x conversion rate ({conversion_rate:.1%}).",
            f"Modeled revenue = leads ({modeled_leads:,}) x close rate ({close_rate:.1%}) x average deal size ({avg_deal_size:,.0f}).",
        ],
    }


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


def _ensure_financial_section(report: Dict[str, Any]) -> None:
    section = report.get("financialImpact")
    if not isinstance(section, dict):
        return

    estimation_enabled = bool(
        (isinstance(report.get("meta"), dict) and report.get("meta", {}).get("estimationMode"))
        or section.get("estimationDisclaimer")
        or _clean_dict_list(section.get("scenarios"))
    )
    if not estimation_enabled:
        return

    section["revenueTable"] = _clean_dict_list(section.get("revenueTable"))
    assumptions = build_financial_assumptions(report)

    if not assumptions.get("usable"):
        section["confidenceScore"] = min(int(section.get("confidenceScore") or 0) or 100, assumptions.get("confidence", 25))
        if not _is_meaningful_text(section.get("notes")):
            section["notes"] = "Financial modeling remains low-confidence because keyword demand or conversion evidence is incomplete."
        section["mentorNotes"] = " ".join(assumptions.get("notes") or []) or section.get("mentorNotes")
        return

    deterministic_rows = [
        {"metric": "Modeled keyword demand", "value": f"{assumptions['keywordDemand']:,} searches/month"},
        {"metric": "Visibility capture assumption", "value": f"{assumptions['visibilityCaptureRate']:.1%} of keyword demand"},
        {"metric": "Modeled monthly traffic", "value": f"{assumptions['traffic']:,} visits/month"},
        {"metric": "Conversion rate assumption", "value": f"{assumptions['conversionRate']:.1%}"},
        {"metric": "Modeled leads", "value": f"{assumptions['leads']:,} leads/month"},
        {"metric": "Close rate assumption", "value": f"{assumptions['closeRate']:.1%}"},
        {
            "metric": "Average deal size assumption",
            "value": f"{assumptions['avgDealSize']:,.0f} per deal",
            "amount": {"min": assumptions["avgDealSize"], "max": assumptions["avgDealSize"], "currency": None, "period": "one-time"},
        },
        {
            "metric": "Modeled monthly revenue",
            "value": f"{assumptions['revenue']:,.0f} per month",
            "amount": {"min": assumptions["revenue"], "max": assumptions["revenue"], "currency": None, "period": "month"},
        },
    ]

    existing_rows = section["revenueTable"]
    if len(existing_rows) < 4 or not any(_is_meaningful_text(row.get("value")) for row in existing_rows if isinstance(row, dict)):
        section["revenueTable"] = deterministic_rows
    else:
        existing_rows.extend([row for row in deterministic_rows if row["metric"] not in {str(r.get("metric")) for r in existing_rows if isinstance(r, dict)}])
        section["revenueTable"] = _dedupe_dict_list(existing_rows, ("metric", "value"))

    section["confidenceScore"] = max(int(section.get("confidenceScore") or 0), assumptions.get("confidence", 45))
    formula_note = "Formula: keyword demand x visibility capture = traffic; traffic x conversion rate = leads; leads x close rate x average deal size = revenue."
    assumption_note = " ".join(assumptions.get("notes") or [])
    section["mentorNotes"] = " ".join([part for part in [formula_note, assumption_note] if part]).strip()
    if not _is_meaningful_text(section.get("notes")):
        section["notes"] = "Financial impact is modeled from explicit assumptions and should be read as a planning estimate, not booked revenue."


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
    _ensure_financial_section(cleaned)
    _ensure_generic_section_fallbacks(cleaned)
    _ensure_assembled_section_notes(cleaned)
    return cleaned
