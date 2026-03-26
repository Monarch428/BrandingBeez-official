"""Report assembler utilities.

This module is imported by `app.pipeline.orchestrator`:

    from app.pipeline.sections.report_assembler import assemble_final_report, deep_merge

Both `assemble_final_report` and `deep_merge` must exist.
The assembler accepts either:
- a plain top-level business-growth report dict, or
- a wrapper object that contains `report`, `llm_report`, `sections_8_10`, etc.
"""

from __future__ import annotations

from typing import Any, Dict, Optional
from copy import deepcopy
import logging

logger = logging.getLogger(__name__)

LEGACY_REPORT_KEYS = {
    "reportMetadata",
    "executiveSummary",
    "websiteDigitalPresence",
    "seoVisibility",
    "reputation",
    "servicesPositioning",
    "leadGeneration",
    "competitiveAnalysis",
    "marketDemand",
    "costOptimization",
    "targetMarket",
    "financialImpact",
    "actionPlan90Days",
    "competitiveAdvantages",
    "riskAssessment",
    "appendices",
}


def deep_merge(base: Optional[Dict[str, Any]], incoming: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not isinstance(base, dict):
        base = {}
    if not isinstance(incoming, dict):
        incoming = {}

    result: Dict[str, Any] = deepcopy(base)
    for key, value in incoming.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = deepcopy(value)
    return result


def _ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _pick_first_dict(*values: Any) -> Dict[str, Any]:
    for value in values:
        if isinstance(value, dict) and value:
            return value
    return {}


def _normalize_sections(sections: Any) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    if isinstance(sections, dict):
        for key, value in sections.items():
            out[str(key)] = value
    elif isinstance(sections, list):
        for index, value in enumerate(sections, start=1):
            out[str(index)] = value
    return out


def _merge_sections_into(report: Dict[str, Any], extra_sections: Dict[str, Any]) -> Dict[str, Any]:
    merged = deepcopy(report)
    report_sections = _normalize_sections(merged.get("sections"))
    extra = _normalize_sections(extra_sections)
    for key, value in extra.items():
        if key in report_sections and isinstance(report_sections[key], dict) and isinstance(value, dict):
            report_sections[key] = deep_merge(report_sections[key], value)
        else:
            report_sections[key] = value
    merged["sections"] = report_sections
    return merged


def _extract_sections_8_10(report_data: Dict[str, Any]) -> Dict[str, Any]:
    return _pick_first_dict(
        report_data.get("sections_8_10"),
        report_data.get("sec_8_10"),
        report_data.get("sections8_10"),
        report_data.get("sec8_10"),
        report_data.get("sections_8_to_10"),
        report_data.get("sections8to10"),
    )


def _looks_like_legacy_report(report_data: Dict[str, Any]) -> bool:
    return any(key in report_data for key in LEGACY_REPORT_KEYS)


def assemble_final_report(report_data: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(report_data, dict):
        report_data = {}

    if isinstance(report_data.get("report"), dict):
        base_report = _ensure_dict(report_data.get("report"))
    elif _looks_like_legacy_report(report_data):
        base_report = deepcopy(report_data)
    else:
        base_report = {}

    llm_report = _pick_first_dict(
        report_data.get("llm_report"),
        report_data.get("report_llm"),
        report_data.get("llm"),
        report_data.get("reconciled_report"),
        report_data.get("final_report"),
    )

    report = deep_merge(base_report, llm_report)

    sections = _normalize_sections(report.get("sections"))
    if not sections:
        sections = {str(i): {} for i in range(1, 11)}
    else:
        for i in range(1, 11):
            sections.setdefault(str(i), {})
    report["sections"] = sections

    extra_sections = _extract_sections_8_10(report_data)
    if extra_sections:
        try:
            report = _merge_sections_into(report, extra_sections)
        except Exception:
            logger.exception("[Assembler] Failed merging sections 8-10")

    signals = _pick_first_dict(report_data.get("signals"), report_data.get("website_signals"))
    if signals:
        report["signals"] = signals

    report["meta"] = deep_merge(_ensure_dict(report.get("meta")), _ensure_dict(report_data.get("meta")))

    if isinstance(report_data.get("structuredReport"), dict):
        report["structuredReport"] = deepcopy(report_data["structuredReport"])

    return report
