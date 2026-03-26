from __future__ import annotations

from typing import Any, Dict, List

from app.llm.response_models import (
    LLMCompetitiveAdvantagesPatch,
    LLMFinalSynthesisResponse,
    LLMLeadGenerationPatch,
    LLMReconcileResponse,
    LLMSections810Response,
    LLMServicesPositioningPatch,
)
from app.llm.report_validation import normalize_llm_output


def _merge_notes(existing: Any, additions: List[str]) -> str | None:
    merged: List[str] = []
    seen: set[str] = set()

    if isinstance(existing, str) and existing.strip():
        base = existing.strip()
        merged.append(base)
        seen.add(base.lower())

    for addition in additions:
        note = (addition or "").strip()
        if not note:
            continue
        key = note.lower()
        if key in seen:
            continue
        seen.add(key)
        merged.append(note)

    return "\n".join(merged) if merged else None



def map_services_positioning_patch(patch: LLMServicesPositioningPatch | None) -> Dict[str, Any]:
    if patch is None:
        return {}

    data = patch.model_dump(exclude_none=True)
    service_gaps = []
    for item in patch.serviceGaps:
        if isinstance(item, str):
            text = item.strip()
            if text:
                service_gaps.append({"service": text, "reason": None, "impact": None})
            continue

        row = item.model_dump(exclude_none=True)
        service_name = row.get("service") or row.get("gap") or row.get("title") or row.get("name") or row.get("serviceName")
        if isinstance(service_name, str) and service_name.strip():
            service_gaps.append(
                {
                    **row,
                    "service": service_name.strip(),
                    "reason": row.get("reason") or row.get("whyItMatters"),
                    "impact": row.get("impact") or row.get("businessImpact") or row.get("expectedOutcome"),
                }
            )
    data["serviceGaps"] = service_gaps
    return normalize_llm_output({"servicesPositioning": data}).get("servicesPositioning", {})


def map_lead_generation_patch(patch: LLMLeadGenerationPatch | None) -> Dict[str, Any]:
    if patch is None:
        return {}
    return normalize_llm_output({"leadGeneration": patch.model_dump(exclude_none=True)}).get("leadGeneration", {})


def map_competitive_advantages_patch(patch: LLMCompetitiveAdvantagesPatch | None) -> Dict[str, Any]:
    if patch is None:
        return {}

    advantages: List[str] = []
    note_additions: List[str] = []
    for item in patch.advantages:
        if isinstance(item, str):
            text = item.strip()
            if text:
                advantages.append(text)
            continue

        advantage_text = item.advantage or item.title or item.text or item.name
        if isinstance(advantage_text, str) and advantage_text.strip():
            cleaned = advantage_text.strip()
            advantages.append(cleaned)
            if item.whyItMatters:
                note_additions.append(f"{cleaned}: Why it matters: {item.whyItMatters.strip()}")
            if item.howToLeverage:
                note_additions.append(f"{cleaned}: How to leverage: {item.howToLeverage.strip()}")

    mapped = {
        "advantages": advantages,
        "mentorNotes": patch.mentorNotes,
        "notes": _merge_notes(patch.notes, note_additions),
    }
    return normalize_llm_output({"competitiveAdvantages": mapped}).get("competitiveAdvantages", {})


def map_reconcile_response_to_report_patch(response: LLMReconcileResponse) -> Dict[str, Any]:
    patch: Dict[str, Any] = {}
    if response.reportMetadata is not None:
        patch["reportMetadata"] = response.reportMetadata.model_dump(exclude_none=True)
    if response.executiveSummary is not None:
        patch["executiveSummary"] = response.executiveSummary
    if response.websiteDigitalPresence is not None:
        patch["websiteDigitalPresence"] = response.websiteDigitalPresence
    if response.seoVisibility is not None:
        patch["seoVisibility"] = response.seoVisibility
    if response.reputation is not None:
        patch["reputation"] = response.reputation
    if response.servicesPositioning is not None:
        patch["servicesPositioning"] = map_services_positioning_patch(response.servicesPositioning)
    if response.leadGeneration is not None:
        patch["leadGeneration"] = map_lead_generation_patch(response.leadGeneration)
    if response.competitiveAnalysis is not None:
        patch["competitiveAnalysis"] = response.competitiveAnalysis
    if response.competitiveAdvantages is not None:
        patch["competitiveAdvantages"] = map_competitive_advantages_patch(response.competitiveAdvantages)
    if response.appendices is not None:
        patch["appendices"] = response.appendices
    return normalize_llm_output(patch)


def map_sections_8_10_response_to_internal_sections(response: LLMSections810Response) -> Dict[str, Any]:
    sections = response.model_dump(exclude_none=True)
    return normalize_llm_output(sections)


def map_final_synthesis_response_to_report_patch(response: LLMFinalSynthesisResponse) -> Dict[str, Any]:
    patch: Dict[str, Any] = {}
    if response.reportMetadata is not None:
        patch["reportMetadata"] = response.reportMetadata.model_dump(exclude_none=True)
    if response.executiveSummary is not None:
        patch["executiveSummary"] = response.executiveSummary
    if response.websiteDigitalPresence is not None:
        patch["websiteDigitalPresence"] = response.websiteDigitalPresence
    if response.seoVisibility is not None:
        patch["seoVisibility"] = response.seoVisibility
    if response.reputation is not None:
        patch["reputation"] = response.reputation
    if response.servicesPositioning is not None:
        patch["servicesPositioning"] = map_services_positioning_patch(response.servicesPositioning)
    if response.leadGeneration is not None:
        patch["leadGeneration"] = map_lead_generation_patch(response.leadGeneration)
    if response.competitiveAnalysis is not None:
        patch["competitiveAnalysis"] = response.competitiveAnalysis
    if response.costOptimization is not None:
        patch["costOptimization"] = response.costOptimization
    if response.targetMarket is not None:
        patch["targetMarket"] = response.targetMarket
    if response.financialImpact is not None:
        patch["financialImpact"] = response.financialImpact
    if response.actionPlan90Days is not None:
        patch["actionPlan90Days"] = response.actionPlan90Days
    if response.competitiveAdvantages is not None:
        patch["competitiveAdvantages"] = map_competitive_advantages_patch(response.competitiveAdvantages)
    if response.appendices is not None:
        patch["appendices"] = response.appendices
    return normalize_llm_output(patch)
