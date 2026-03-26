from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Sequence, Tuple

from app.signals.detection_utils import deduplicate_list_preserve_order


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
    ("websiteDigitalPresence", "uxConversion", "highlights"),
    ("websiteDigitalPresence", "uxConversion", "issues"),
    ("websiteDigitalPresence", "uxConversion", "recommendations"),
    ("leadGeneration", "missingHighROIChannels"),
    ("competitiveAdvantages", "advantages"),
)


def _clean_text(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    text = " ".join(value.split()).strip()
    if not text:
        return None
    return text


def _is_meaningful_text(value: Any) -> bool:
    text = _clean_text(value)
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
    return deduplicate_list_preserve_order(cleaned)


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

    appendices["dataSources"] = _clean_dict_list(appendices.get("dataSources"))
    appendices["dataGaps"] = _clean_dict_list(appendices.get("dataGaps"))

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
    section["services"] = _clean_dict_list(section.get("services"))
    current_industries = section.get("industriesServed")
    if isinstance(current_industries, dict):
        current_industries["current"] = _clean_string_list(current_industries.get("current"))
        current_industries["highValueIndustries"] = _clean_dict_list(current_industries.get("highValueIndustries"))
    if not section["services"] and not _is_meaningful_text(section.get("mentorNotes")):
        section["mentorNotes"] = "Services are likely present but could not be structurally extracted."


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
    cleaned = deepcopy(report) if isinstance(report, dict) else {}
    _dedupe_known_lists(cleaned)
    _normalize_appendices(cleaned)
    _ensure_services_section(cleaned)
    _ensure_lead_generation_section(cleaned)
    _ensure_content_quality(cleaned)
    _ensure_generic_section_fallbacks(cleaned)
    _ensure_assembled_section_notes(cleaned)
    return cleaned
