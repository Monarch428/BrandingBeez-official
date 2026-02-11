"""Report assembler utilities.

This module is imported by `app.pipeline.orchestrator`:

    from app.pipeline.sections.report_assembler import assemble_final_report, deep_merge

So **both** `assemble_final_report` and `deep_merge` must exist.
The assembler's job is to take whatever the pipeline produced (signals, LLM output,
sections 8–10, etc.) and shape it into a single consistent dict for the PDF builder / API.

It is intentionally defensive: missing keys should not crash the pipeline.
"""

from __future__ import annotations

from typing import Any, Dict, Mapping, Optional
from copy import deepcopy
import logging

logger = logging.getLogger(__name__)


def deep_merge(base: Optional[Dict[str, Any]], incoming: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Recursively merge two dicts (non-destructive).

    - If both values are dicts -> merge recursively
    - Otherwise -> incoming overwrites base
    - Lists are overwritten (not concatenated) by design, to avoid accidental duplication.
    """
    if not isinstance(base, dict):
        base = {}
    if not isinstance(incoming, dict):
        incoming = {}

    result: Dict[str, Any] = deepcopy(base)
    for k, v in incoming.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = deepcopy(v)
    return result


def _ensure_dict(v: Any) -> Dict[str, Any]:
    return v if isinstance(v, dict) else {}


def _pick_first_dict(*vals: Any) -> Dict[str, Any]:
    for v in vals:
        if isinstance(v, dict) and v:
            return v
    return {}


def _normalize_sections(sections: Any) -> Dict[str, Any]:
    """Normalize sections container into {'1': {...}, ..., '10': {...}} shape."""
    out: Dict[str, Any] = {}
    if isinstance(sections, dict):
        # allow int keys too
        for k, v in sections.items():
            sk = str(k)
            out[sk] = v
    elif isinstance(sections, list):
        # sometimes sections are a list; assume index+1 mapping
        for i, v in enumerate(sections, start=1):
            out[str(i)] = v
    return out


def _merge_sections_into(report: Dict[str, Any], extra_sections: Dict[str, Any]) -> Dict[str, Any]:
    rep = deepcopy(report)
    rep_sections = _normalize_sections(rep.get("sections"))
    extra = _normalize_sections(extra_sections)

    for k, v in extra.items():
        if k in rep_sections and isinstance(rep_sections[k], dict) and isinstance(v, dict):
            rep_sections[k] = deep_merge(rep_sections[k], v)
        else:
            rep_sections[k] = v

    rep["sections"] = rep_sections
    return rep


def _extract_sections_8_10(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Find any section 8–10 payload in a variety of shapes."""
    return _pick_first_dict(
        report_data.get("sections_8_10"),
        report_data.get("sec_8_10"),
        report_data.get("sections8_10"),
        report_data.get("sec8_10"),
        report_data.get("sections_8_to_10"),
        report_data.get("sections8to10"),
    )


def assemble_final_report(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Assemble the final report object.

    Expected inputs can be messy:
    - `report_data.get('report')` may already contain a full report
    - LLM output may live under `llm_report`, `llm`, or `report_llm`
    - sections 8–10 may live under `sections_8_10` etc.
    - signals may be under `signals` or top-level keys

    Output is a single dict with:
    - meta: {...}
    - sections: {'1': {...}, ...}
    - signals: {...} (optional)
    """
    if not isinstance(report_data, dict):
        report_data = {}

    # Base report shell
    base_report: Dict[str, Any] = _ensure_dict(report_data.get("report"))
    llm_report: Dict[str, Any] = _pick_first_dict(
        report_data.get("llm_report"),
        report_data.get("report_llm"),
        report_data.get("llm"),
        report_data.get("reconciled_report"),
        report_data.get("final_report"),
    )

    report = deep_merge(base_report, llm_report)

    # Ensure sections exist
    sections = _normalize_sections(report.get("sections"))

    # Provide placeholders 1..10 so PDF doesn't show "No data" due to missing key
    for i in range(1, 11):
        sections.setdefault(str(i), {})

    report["sections"] = sections

    # Merge sections 8–10 if present
    sec_8_10 = _extract_sections_8_10(report_data)
    if sec_8_10:
        try:
            report = _merge_sections_into(report, sec_8_10)
        except Exception:
            logger.exception("[Assembler] Failed merging sections 8–10")

    # Attach signals (optional)
    signals = _pick_first_dict(report_data.get("signals"), report_data.get("website_signals"))
    if signals:
        report["signals"] = signals

    # Carry through meta
    meta = _ensure_dict(report.get("meta"))
    meta = deep_merge(meta, _ensure_dict(report_data.get("meta")))
    report["meta"] = meta

    return report
