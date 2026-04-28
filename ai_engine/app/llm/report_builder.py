import hashlib
import logging
import time
import re
from datetime import datetime
from typing import Any, Dict

from app.core.config import settings
from app.llm.client import call_llm_json, downgrade_llm_mode, get_effective_llm_mode
from app.llm.context_compactor import (
    compact_base_report,
    compact_estimation_context,
    compact_final_context,
    compact_llm_context,
    compact_reconcile_context,
    slice_report_for_final_stage,
    slice_report_for_reconcile,
)
from app.llm.prompts import (
    ESTIMATION_DISCLAIMER,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    SYSTEM_PROMPT_FINAL_SYNTHESIS,
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_COST_OPTIMIZATION,
    SYSTEM_PROMPT_TARGET_MARKET,
    SYSTEM_PROMPT_FINANCIAL_IMPACT,
    SYSTEM_PROMPT_FINAL_EXEC_SUMMARY,
    SYSTEM_PROMPT_FINAL_VISIBILITY_PATCH,
    SYSTEM_PROMPT_FINAL_GROWTH_PATCH,
    SYSTEM_PROMPT_FINAL_GROWTH_COMMERCIAL_PATCH,
    SYSTEM_PROMPT_FINAL_ACTIONPLAN_PATCH,
    build_user_prompt_estimation_8_10,
    build_user_prompt_final_synthesis,
    build_user_prompt_reconcile,
    build_user_prompt_cost_optimization,
    build_user_prompt_target_market,
    build_user_prompt_financial_impact,
    build_user_prompt_final_exec_summary,
    build_user_prompt_final_visibility_patch,
    build_user_prompt_final_growth_patch,
    build_user_prompt_final_growth_commercial_patch,
    build_user_prompt_final_actionplan_patch,
)
from app.llm.report_validation import (
    normalize_llm_output,
    validate_stage_response_with_fallback,
    validate_with_fallback,
    has_junk_output,
    _scrub_junk_strings,
)
from app.llm.response_mappers import (
    map_final_synthesis_response_to_report_patch,
    map_reconcile_response_to_report_patch,
    map_sections_8_10_response_to_internal_sections,
)
from app.llm.response_models import (
    LLMFinalSynthesisResponse,
    LLMReconcileResponse,
    LLMSections810Response,
)
from app.models.report_schema import BusinessGrowthReport, CostOptimization, FinancialImpact, TargetMarket
from app.utils.currency import build_currency_guidance

logger = logging.getLogger(__name__)

RECONCILE_EXPECTED_KEYS = [
    "reportMetadata",
    "executiveSummary",
    "websiteDigitalPresence",
    "seoVisibility",
    "reputation",
    "servicesPositioning",
    "leadGeneration",
    "competitiveAnalysis",
    "competitiveAdvantages",
    "appendices",
]

ESTIMATION_EXPECTED_KEYS = ["costOptimization", "targetMarket", "financialImpact"]

COST_OPTIMIZATION_EXPECTED_KEYS = ["costOptimization"]
TARGET_MARKET_EXPECTED_KEYS = ["targetMarket"]
FINANCIAL_IMPACT_EXPECTED_KEYS = ["financialImpact"]
FINAL_EXEC_SUMMARY_EXPECTED_KEYS = ["executiveSummary"]
FINAL_VISIBILITY_EXPECTED_KEYS = ["websiteDigitalPresence", "seoVisibility", "reputation"]
FINAL_GROWTH_EXPECTED_KEYS = ["servicesPositioning", "leadGeneration", "competitiveAnalysis", "competitiveAdvantages"]
FINAL_GROWTH_COMMERCIAL_EXPECTED_KEYS = ["costOptimization", "targetMarket", "financialImpact"]
FINAL_ACTIONPLAN_EXPECTED_KEYS = ["actionPlan90Days"]

FINAL_SYNTHESIS_EXPECTED_KEYS = [
    "reportMetadata",
    "executiveSummary",
    "websiteDigitalPresence",
    "seoVisibility",
    "reputation",
    "servicesPositioning",
    "leadGeneration",
    "competitiveAnalysis",
    "costOptimization",
    "targetMarket",
    "financialImpact",
    "actionPlan90Days",
    "competitiveAdvantages",
    "appendices",
]

CACHE_SCHEMA_VERSION = "v20260422d"


def _copy_jsonable(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: _copy_jsonable(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_copy_jsonable(v) for v in value]
    return value


def _build_stage_context(
    llm_context: Dict[str, Any],
    *,
    stage_name: str,
    base_report: Dict[str, Any] | None = None,
    reconcile_patch: Dict[str, Any] | None = None,
    sections_8_10: Dict[str, Any] | None = None,
    final_report: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    ctx = _copy_jsonable(llm_context if isinstance(llm_context, dict) else {}) or {}
    ctx["llmSequentialFlow"] = {
        "mode": "sequential_chained",
        "currentStage": stage_name,
        "previousStageOutputs": {
            "baseReport": _copy_jsonable(base_report or {}),
            "reconcilePatch": _copy_jsonable(reconcile_patch or {}),
            "sections8to10": _copy_jsonable(sections_8_10 or {}),
        },
    }
    if isinstance(final_report, dict) and final_report:
        ctx["llmSequentialFlow"]["currentMergedReport"] = _copy_jsonable(final_report)
    return ctx


def _stage_pause(stage_name: str) -> None:
    gap_ms = int(getattr(settings, "LLM_MIN_CALL_GAP_MS", 0) or 0)
    if gap_ms <= 0:
        return
    logger.info("[LLM] stage pacing before=%s sleep_ms=%s", stage_name, gap_ms)
    time.sleep(gap_ms / 1000.0)


def _stage_max_tokens(stage_name: str, default: int) -> int:
    # v4: output shapes are now absolute minimum — hardcoded JSON templates
    # Each limit is slightly above the actual expected token count of the template
    stage_defaults = {
        "reconcile":                     int(getattr(settings, "LLM_RECONCILE_MAX_TOKENS", 800) or 800),
        "cost_optimization":             int(getattr(settings, "LLM_ESTIMATION_STAGE_MAX_TOKENS", 700) or 700),
        "target_market":                 int(getattr(settings, "LLM_ESTIMATION_STAGE_MAX_TOKENS", 700) or 700),
        "financial_impact":              int(getattr(settings, "LLM_SECTION_MAX_TOKENS", 750) or 750),
        "final_exec_summary":            int(getattr(settings, "LLM_FINAL_EXEC_SUMMARY_MAX_TOKENS", 550) or 550),
        "final_visibility_patch":        int(getattr(settings, "LLM_FINAL_VISIBILITY_MAX_TOKENS", 350) or 350),
        "final_growth_patch":            int(getattr(settings, "LLM_FINAL_GROWTH_MAX_TOKENS", 350) or 350),
        "final_growth_commercial_patch": int(getattr(settings, "LLM_FINAL_VISIBILITY_MAX_TOKENS", 250) or 250),
        "final_actionplan_patch":        int(getattr(settings, "LLM_FINAL_ACTIONPLAN_MAX_TOKENS", 700) or 700),
    }
    return int(stage_defaults.get(stage_name, default) or default)


def _stage_max_retries(stage_name: str, default: int = 2) -> int:
    stage_defaults = {
        "reconcile": 2,
        "cost_optimization": 2,
        "target_market": 2,
        "financial_impact": 2,
        "final_exec_summary": 2,
        "final_visibility_patch": 2,
        "final_growth_patch": 2,
        "final_growth_commercial_patch": 2,
        "final_actionplan_patch": 2,
    }
    if stage_name == "reconcile":
        return int(getattr(settings, "LLM_RECONCILE_MAX_RETRIES", stage_defaults.get(stage_name, default)) or stage_defaults.get(stage_name, default))
    if stage_name in {"cost_optimization", "target_market", "financial_impact"}:
        return int(getattr(settings, "LLM_ESTIMATION_MAX_RETRIES", stage_defaults.get(stage_name, default)) or stage_defaults.get(stage_name, default))
    return int(getattr(settings, "LLM_FINAL_PATCH_MAX_RETRIES", stage_defaults.get(stage_name, default)) or stage_defaults.get(stage_name, default))


def _safe_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip().replace(",", "")
    if not text:
        return None
    normalized = (
        text.replace("₹", "")
        .replace("$", "")
        .replace("£", "")
        .replace("€", "")
        .replace("%", "")
        .strip()
        .lower()
    )
    normalized = re.sub(r"(?:/|\bper\b)\s*(mo|month|yr|year|annum)\b", "", normalized).strip()
    m = re.search(r"-?\d+(?:\.\d+)?\s*(k|m|l|lac|lakh|cr|crore)?", normalized)
    if not m:
        return None
    try:
        base_match = re.search(r"-?\d+(?:\.\d+)?", m.group(0))
        if not base_match:
            return None
        base = float(base_match.group(0))
    except Exception:
        return None
    suffix_match = re.search(r"(k|m|l|lac|lakh|cr|crore)$", m.group(0).strip())
    if not suffix_match:
        return base
    suffix = suffix_match.group(1)
    if suffix == "k":
        return base * 1_000.0
    if suffix == "m":
        return base * 1_000_000.0
    if suffix in ("l", "lac", "lakh"):
        return base * 100_000.0
    if suffix in ("cr", "crore"):
        return base * 10_000_000.0
    return base


def _as_ratio(value: Any) -> float | None:
    parsed = _safe_float(value)
    if parsed is None:
        return None
    if parsed > 1:
        parsed = parsed / 100.0
    return max(0.0, min(1.0, parsed))


def _parse_range_string(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if not isinstance(value, str):
        return None
    raw = value.strip()
    if not raw:
        return None
    compact_raw = raw.replace(",", "").replace(" ", "").lower()
    compact_raw = compact_raw.replace("₹", "").replace("$", "").replace("£", "").replace("€", "")
    compact_raw = compact_raw.lstrip("<>~")
    for sep in ("-", "to"):
        if sep in compact_raw:
            parts = compact_raw.split(sep, 1)
            lo = _safe_float(parts[0])
            hi = _safe_float(parts[1])
            if lo is not None and hi is not None:
                return (lo + hi) / 2.0
    compact_value = _safe_float(compact_raw)
    if compact_value is not None:
        return compact_value
    cleaned = raw.replace("$", "").replace("£", "").replace("€", "").replace("₹", "")
    cleaned = cleaned.replace(",", "").replace(" ", "").lower()

    def _expand(s: str) -> str:
        return s.replace("k", "000").replace("m", "000000")

    cleaned = cleaned.lstrip("<>~≈≤≥±")
    for sep in ("-", "to", "–", "—"):
        if sep in cleaned:
            parts = cleaned.split(sep, 1)
            try:
                lo = float(_expand(parts[0]))
                hi = float(_expand(parts[1]))
                return (lo + hi) / 2.0
            except Exception:
                continue
    try:
        return float(_expand(cleaned))
    except Exception:
        return None


def _estimation_inputs_to_financials(ei: dict) -> dict:
    if not isinstance(ei, dict):
        return {}
    out: dict = {}
    direct = {
        "monthlyRevenue": "monthlyRevenue",
        "monthlyAdSpend": "monthlyAdSpend",
        "monthlyLeads": "monthlyLeads",
        "closeRate": "closeRate",
        "avgDealValue": "avgDealValue",
        "currentTrafficPerMonth": "currentTrafficPerMonth",
        "teamSize": "teamSize",
        "monthlyPayrollCost": "monthlyPayrollCost",
        "monthlyToolsCost": "monthlyToolsCost",
        "monthlyOverheadCost": "monthlyOverheadCost",
        "currency": "currency",
    }
    for src_key, dst_key in direct.items():
        v = ei.get(src_key)
        if v is not None:
            out[dst_key] = v

    def _range(key: str, dst: str, is_percent: bool = False) -> None:
        if dst in out:
            return
        parsed = _parse_range_string(ei.get(key))
        if parsed is not None:
            if is_percent and parsed > 1.0:
                parsed = parsed / 100.0
            out[dst] = parsed

    _range("monthlyAdSpendRange", "monthlyAdSpend")
    _range("leadsPerMonthRange", "monthlyLeads")
    _range("avgDealValueRange", "avgDealValue")
    _range("closeRateRange", "closeRate", is_percent=True)
    _range("currentTrafficPerMonthRange", "currentTrafficPerMonth")
    _range("teamSizeRange", "teamSize")
    _range("toolsStackEstimate", "monthlyToolsCost")
    return out


def _context_user_financials(llm_context: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(llm_context, dict):
        return {}
    for key in ("userFinancials", "businessInputs", "optionalBusinessInputs"):
        value = llm_context.get(key)
        if isinstance(value, dict) and value:
            return value
    ui = llm_context.get("userInputs")
    if isinstance(ui, dict):
        for key in ("userFinancials", "businessInputs", "optionalBusinessInputs"):
            value = ui.get(key)
            if isinstance(value, dict) and value:
                return value
    for src in (llm_context, ui or {}):
        if not isinstance(src, dict):
            continue
        ei = src.get("estimationInputs")
        if isinstance(ei, dict) and ei:
            parsed = _estimation_inputs_to_financials(ei)
            if parsed:
                return parsed
    return {}


def _extract_service_names(llm_context: Dict[str, Any]) -> list[str]:
    names: list[str] = []
    services_signals = llm_context.get("servicesSignals") if isinstance(llm_context, dict) else {}
    if isinstance(services_signals, dict):
        for item in services_signals.get("services") or []:
            if isinstance(item, dict) and item.get("name"):
                names.append(str(item.get("name")).strip())
            elif isinstance(item, str) and item.strip():
                names.append(item.strip())
    md = llm_context.get("marketDemand") if isinstance(llm_context, dict) else {}
    if isinstance(md, dict):
        for item in md.get("services") or []:
            if isinstance(item, str) and item.strip():
                names.append(item.strip())
    seen, out = set(), []
    for n in names:
        k = n.lower()
        if k and k not in seen:
            seen.add(k)
            out.append(n)
    return out


def _business_model_from_context(llm_context: Dict[str, Any]) -> str:
    if not isinstance(llm_context, dict):
        return "service_business"
    business_profile = llm_context.get("businessProfile")
    if isinstance(business_profile, dict):
        model = business_profile.get("businessModel") or business_profile.get("offerType")
        if isinstance(model, str) and model.strip():
            return model.strip()
    return "service_business"


def _section_context_from_context(llm_context: Dict[str, Any], key: str) -> Dict[str, Any]:
    if not isinstance(llm_context, dict):
        return {}
    section_contexts = llm_context.get("sectionContexts")
    if isinstance(section_contexts, dict):
        value = section_contexts.get(key)
        if isinstance(value, dict):
            return value
    return {}


def _apply_template_actions(existing_actions: list[dict[str, Any]], business_model: str, section: str) -> list[dict[str, Any]]:
    out = [item for item in (existing_actions or []) if isinstance(item, dict)]
    seen = {str(item.get("title") or "").strip().lower() for item in out if isinstance(item, dict)}
    templates: dict[tuple[str, str], list[dict[str, Any]]] = {
        ("white_label_agency_partner", "leadgen"): [{
            "title": "Add a white-label audit CTA",
            "details": {
                "recommendation": "Offer a white-label fulfilment audit or delivery-capacity review as the primary CTA.",
                "expectedOutcome": "Better-fit agency enquiries and stronger proposal conversations.",
            },
        }],
        ("white_label_agency_partner", "website"): [{
            "title": "Create agency-partner landing pages",
            "details": {
                "recommendation": "Build landing pages specifically for UK/US agencies, showing delivery model, turnaround, and proof.",
                "expectedOutcome": "Higher segment-message fit and more qualified partner enquiries.",
            },
        }],
        ("white_label_agency_partner", "financial"): [{
            "title": "Increase retained partner value",
            "details": {
                "recommendation": "Package fulfilment into retained tiers to lift monthly revenue per partner.",
                "expectedOutcome": "Higher MRR and better utilisation of the delivery team.",
            },
        }],
    }
    for template in templates.get((business_model, section), []):
        title = str(template.get("title") or "").strip()
        if not title or title.lower() in seen:
            continue
        out.append({
            "title": title,
            "sourceSection": section,
            "impact": "medium",
            "effort": "medium",
            "urgency": "medium",
            "confidence": 0.74,
            "pillar": section,
            "kpis": [],
            "details": template.get("details") or {},
        })
        seen.add(title.lower())
    return out


def _currency_symbol_from_context(llm_context: Dict[str, Any]) -> str:
    candidates = []
    fin = _context_user_financials(llm_context)
    candidates.extend([fin.get("currency"), fin.get("currencyCode"), fin.get("currencySymbol")])
    cg = llm_context.get("currencyGuidance") if isinstance(llm_context, dict) else {}
    if isinstance(cg, dict):
        company = cg.get("companyCurrency") if isinstance(cg.get("companyCurrency"), dict) else {}
        candidates.extend([company.get("symbol"), company.get("code"), cg.get("symbol")])
    mapping = {"USD": "$", "$": "$", "GBP": "£", "£": "£", "EUR": "€", "€": "€", "INR": "₹", "₹": "₹"}
    for c in candidates:
        if not c:
            continue
        text = str(c).strip().upper()
        if text in mapping:
            return mapping[text]
    return "$"


def _top_market_keywords(llm_context: Dict[str, Any], limit: int = 8) -> list[Dict[str, Any]]:
    md = llm_context.get("marketDemand") if isinstance(llm_context, dict) else {}
    if not isinstance(md, dict):
        return []
    out: list[Dict[str, Any]] = []
    for item in md.get("keywords") or []:
        if not isinstance(item, dict):
            continue
        keyword = str(item.get("keyword") or "").strip()
        if not keyword:
            continue
        out.append({
            "keyword": keyword,
            "searchVolume": item.get("searchVolume") or item.get("search_volume") or 0,
            "cpc": item.get("cpc") or item.get("avgCpc") or item.get("avg_cpc") or "-",
            "competition": item.get("competitionIntensity") or item.get("competition") or "-",
            "demandScore": item.get("demandScore") or item.get("score") or 0,
        })
        if len(out) >= limit:
            break
    return out


def _text_blob(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.lower()
    if isinstance(value, dict):
        return " ".join(part for part in (_text_blob(v) for v in value.values()) if part)
    if isinstance(value, list):
        return " ".join(part for part in (_text_blob(v) for v in value) if part)
    return str(value).lower()


def _build_semantic_hints(llm_context: Dict[str, Any], fallback_section: Dict[str, Any] | None = None) -> dict[str, Any]:
    profile = llm_context.get("businessProfile") if isinstance(llm_context, dict) and isinstance(llm_context.get("businessProfile"), dict) else {}
    user_fin = _context_user_financials(llm_context)
    user_inputs = llm_context.get("userInputs") if isinstance(llm_context, dict) and isinstance(llm_context.get("userInputs"), dict) else {}
    safe_target = str(user_inputs.get("targetMarket") or profile.get("targetMarket") or "").strip()
    target_terms = [part.strip().lower() for part in re.split(r"[,/&]|\band\b", safe_target, flags=re.I) if part.strip()] if safe_target else []
    customer_segments = []
    raw_segments = user_fin.get("customerSegments") or user_inputs.get("customerSegments") or []
    if isinstance(raw_segments, list):
        customer_segments = [str(x).strip() for x in raw_segments if str(x).strip()]
    service_names = [str(x).strip() for x in (profile.get("serviceNames") or []) if str(x).strip()]
    buyer_type = str(profile.get("buyerType") or "").strip().lower()
    requires_agency_specificity = (
        "agency" in " ".join(target_terms)
        or any("agency" in s.lower() for s in customer_segments)
        or any("white-label" in s.lower() or "white label" in s.lower() for s in service_names)
    )
    exact_segment_phrases = {s.lower() for s in customer_segments if s.strip()}
    exact_target_phrases = {t.lower() for t in target_terms if t.strip()}
    cost_context_terms = {"pricing","package","packaging","bundle","retainer","proposal","qualification","conversion","margin","utilisation","utilization","fulfilment","fulfillment","delivery","white-label","white","label","upsell","cross-sell","agency","agencies","partner","partners","scope","recurring","renewal","uk","us"}
    return {
        "buyer_type": buyer_type,
        "service_names": service_names,
        "exact_segment_phrases": exact_segment_phrases,
        "exact_target_phrases": exact_target_phrases,
        "cost_context_terms": cost_context_terms,
        "requires_agency_specificity": requires_agency_specificity,
    }


def _has_strong_cost_specificity(text: str, hints: dict[str, Any]) -> bool:
    lowered = (text or "").lower().strip()
    if not lowered:
        return False
    strong_terms = ["white-label","white label","agency","agencies","partner","partners","retainer","retained","proposal","fulfilment","fulfillment","margin","packaging","qualification","conversion","uk","us"]
    if any(term in lowered for term in strong_terms):
        return True
    if hints.get("service_names") and any(str(name).lower() in lowered for name in hints.get("service_names") or []):
        return True
    return False


def _segment_matches_business_context(name: str, notes: str, hints: dict[str, Any]) -> bool:
    lowered_name = (name or "").strip().lower()
    combined = f"{lowered_name} {(notes or '').strip().lower()}".strip()
    if not lowered_name:
        return False
    if lowered_name in set(hints.get("exact_segment_phrases") or []):
        return True
    if any(target and target in combined for target in set(hints.get("exact_target_phrases") or [])):
        return True
    if hints.get("requires_agency_specificity"):
        # For white-label/agency businesses, generic B2B labels like
        # "Digital Marketing Agencies" pass the broad term check but are too
        # generic when the segment notes say "inferred" or have no delivery context.
        # Require at least one white-label / outsourced-delivery signal.
        _wl_terms = [
            "white-label", "white label", "whitelabel",
            "outsource", "outsourced", "fulfilment", "fulfillment",
            "overflow", "delivery partner", "agency partner",
            "uk", "us", "united kingdom", "united states",
            "retainer", "retained", "resell", "reseller",
        ]
        return any(term in combined for term in _wl_terms)
    return any(term in combined for term in ["business", "startup", "agency", "partner"])


def _cost_section_is_specific(section: Dict[str, Any], llm_context: Dict[str, Any]) -> bool:
    if not isinstance(section, dict):
        return False
    blob = " ".join([
        _text_blob(section.get("mentorNotes")),
        _text_blob(section.get("notes")),
        _text_blob(section.get("opportunities")),
        _text_blob(section.get("actionCandidates")),
    ]).strip()
    if not blob:
        return False
    try:
        hints = _build_semantic_hints(llm_context or {}, section)
        bm = _business_model_from_context(llm_context or {})
        if bm == "white_label_agency_partner":
            # For white-label partners, reject generic ops language unless it
            # contains at least one agency-fulfilment commercial signal.
            _required_terms = [
                "white-label", "white label", "fulfilment", "fulfillment",
                "retainer", "retained", "proposal", "packaging",
                "partner delivery", "delivery utilis", "delivery utiliz",
                "agency-fit", "agency fit", "qualification",
                "proposal-to-close", "proposal to close",
                "uk", "us agencies", "uk agencies",
            ]
            if not any(t in blob for t in _required_terms):
                logger.warning(
                    "[LLM] costOptimization rejected for white_label_agency_partner: "
                    "no fulfilment/retainer/proposal/packaging language found in blob"
                )
                return False
        return _has_strong_cost_specificity(blob, hints)
    except Exception:
        return any(term in blob for term in ["white-label","agency","partner","proposal","retainer","margin","qualification","uk","us"])


def _target_section_is_specific(section: Dict[str, Any], llm_context: Dict[str, Any]) -> bool:
    if not isinstance(section, dict):
        return False
    segments = section.get("segments") or section.get("currentTargetSegments") or section.get("detectedSegments") or []
    if not isinstance(segments, list) or not segments:
        return False
    try:
        hints = _build_semantic_hints(llm_context or {}, section)
        valid = 0
        for seg in segments:
            if not isinstance(seg, dict):
                continue
            name = str(seg.get("segment") or seg.get("name") or "").strip().lower()
            notes = " ".join([str(seg.get("notes") or ""), " ".join([str(x) for x in (seg.get("painPoints") or []) if str(x).strip()])]).strip().lower()
            if _segment_matches_business_context(name, notes, hints):
                valid += 1
        return valid >= 1
    except Exception:
        blob = _text_blob(segments)
        return any(term in blob for term in ["agency","agencies","startup","startups","partner","white-label","white label","uk","us"])


def _has_substance(section: Dict[str, Any], list_key: str) -> bool:
    if not isinstance(section, dict):
        return False
    if section.get("confidenceScore"):
        return True
    items = section.get(list_key)
    return isinstance(items, list) and len(items) > 0


# deterministic estimation helpers kept from user's file, lightly cleaned
def _build_deterministic_estimation_sections(llm_context: Dict[str, Any]) -> Dict[str, Any]:
    ui = llm_context.get("userInputs") if isinstance(llm_context, dict) else {}
    logger.warning("[LLM_DEBUG] deterministic estimation raw_financials=%s", _context_user_financials(llm_context))
    ui = ui if isinstance(ui, dict) else {}
    fin = _context_user_financials(llm_context)
    services = _extract_service_names(llm_context)
    symbol = _currency_symbol_from_context(llm_context)
    business_model = _business_model_from_context(llm_context)
    cost_section_context = _section_context_from_context(llm_context, "costOptimization")
    target_section_context = _section_context_from_context(llm_context, "targetMarket")
    financial_section_context = _section_context_from_context(llm_context, "financialImpact")

    target_market = str(ui.get("targetMarket") or "Primary target market").strip() or "Primary target market"
    location = str(ui.get("location") or "Primary market").strip() or "Primary market"

    monthly_rev_input = _safe_float(fin.get("monthlyRevenue") or fin.get("currentMonthlyRevenue"))
    ad_spend_input = _safe_float(fin.get("monthlyAdSpend") or fin.get("monthlyMarketingCost"))
    payroll_input = _safe_float(fin.get("monthlyPayrollCost"))
    tools_input = _safe_float(fin.get("monthlyToolsCost"))
    overhead_input = _safe_float(fin.get("monthlyOverheadCost"))
    leads_input = _safe_float(fin.get("monthlyLeads") or fin.get("qualifiedLeads"))
    close_rate_input = _as_ratio(fin.get("closeRate"))
    avg_deal_input = _safe_float(fin.get("avgDealValue") or fin.get("avgDealSize"))
    traffic_input = _safe_float(fin.get("currentTrafficPerMonth"))
    team_size_input = _safe_float(fin.get("teamSize") or ui.get("teamSize"))

    svc_count = max(1, len(services))
    if business_model in ("white_label_agency_partner",):
        _default_leads, _default_close, _default_avg_deal, _default_visit_to_lead, _default_traffic = 12.0, 0.20, 2800.0 + (svc_count * 200.0), 0.018, 600.0
        _pricing_uplift_pct, _conversion_uplift_pct, _efficiency_pct, _team_cost_per_head = 0.12, 0.08, 0.18, 2800.0
        _tool_cost_base, _ad_cost_base, _upsell_pct, _segment_budget_min, _segment_budget_max = 600.0, 400.0, 0.14, 1500, 5000
        _model_label = "white-label agency partner"
    elif business_model in ("b2b_agency", "b2b_saas", "consulting_firm"):
        _default_leads, _default_close, _default_avg_deal, _default_visit_to_lead, _default_traffic = 15.0, 0.18, 2200.0 + (svc_count * 150.0), 0.022, 800.0
        _pricing_uplift_pct, _conversion_uplift_pct, _efficiency_pct, _team_cost_per_head = 0.10, 0.10, 0.15, 3000.0
        _tool_cost_base, _ad_cost_base, _upsell_pct, _segment_budget_min, _segment_budget_max = 500.0, 600.0, 0.12, 1200, 4000
        _model_label = "B2B agency"
    elif business_model in ("local_service_business", "local_healthcare", "local_retail"):
        _default_leads, _default_close, _default_avg_deal, _default_visit_to_lead, _default_traffic = 35.0, 0.30, 650.0 + (svc_count * 80.0), 0.040, 1200.0
        _pricing_uplift_pct, _conversion_uplift_pct, _efficiency_pct, _team_cost_per_head = 0.08, 0.14, 0.12, 2200.0
        _tool_cost_base, _ad_cost_base, _upsell_pct, _segment_budget_min, _segment_budget_max = 250.0, 1200.0, 0.08, 300, 1200
        _model_label = "local service business"
    elif business_model in ("saas_company", "saas"):
        _default_leads, _default_close, _default_avg_deal, _default_visit_to_lead, _default_traffic = 60.0, 0.08, 1800.0 + (svc_count * 100.0), 0.030, 3500.0
        _pricing_uplift_pct, _conversion_uplift_pct, _efficiency_pct, _team_cost_per_head = 0.15, 0.12, 0.20, 4500.0
        _tool_cost_base, _ad_cost_base, _upsell_pct, _segment_budget_min, _segment_budget_max = 1500.0, 2000.0, 0.18, 500, 3000
        _model_label = "SaaS company"
    else:
        _default_leads, _default_close, _default_avg_deal, _default_visit_to_lead, _default_traffic = 20.0, 0.22, 1600.0 + (svc_count * 120.0), 0.025, 900.0
        _pricing_uplift_pct, _conversion_uplift_pct, _efficiency_pct, _team_cost_per_head = 0.10, 0.10, 0.14, 2500.0
        _tool_cost_base, _ad_cost_base, _upsell_pct, _segment_budget_min, _segment_budget_max = 400.0, 700.0, 0.10, 500, 2500
        _model_label = "service business"

    traffic = traffic_input or _default_traffic
    leads = leads_input or max(_default_leads, traffic * _default_visit_to_lead)
    close_rate = close_rate_input or _default_close
    avg_deal = avg_deal_input or _default_avg_deal
    if monthly_rev_input is not None and monthly_rev_input >= 1000:
        monthly_rev = monthly_rev_input
    elif leads_input and close_rate_input and avg_deal_input:
        monthly_rev = leads_input * close_rate_input * avg_deal_input
    else:
        monthly_rev = leads * close_rate * avg_deal

    if monthly_rev < 1000 and leads and close_rate and avg_deal:
        modeled_revenue = leads * close_rate * avg_deal
        if modeled_revenue >= 1000:
            monthly_rev = modeled_revenue

    team_size = team_size_input or max(2.0, monthly_rev / (_team_cost_per_head * 4))
    payroll = payroll_input if payroll_input is not None and payroll_input >= 1000 else (team_size * _team_cost_per_head)
    tools = tools_input if tools_input is not None and tools_input >= 1000 else max(_tool_cost_base, monthly_rev * 0.04 if monthly_rev >= 1000 else _tool_cost_base)
    ad_spend = ad_spend_input or _ad_cost_base
    overhead = overhead_input if overhead_input is not None and overhead_input >= 1000 else (monthly_rev * 0.05)
    total_cost = payroll + tools + ad_spend + overhead

    explicit_inputs = sum([
        monthly_rev_input is not None, leads_input is not None, close_rate_input is not None,
        avg_deal_input is not None, ad_spend_input is not None, payroll_input is not None, tools_input is not None,
    ])

    pricing_uplift = monthly_rev * _pricing_uplift_pct
    conversion_uplift = monthly_rev * _conversion_uplift_pct
    efficiency_savings = total_cost * _efficiency_pct
    upsell_uplift = monthly_rev * _upsell_pct

    conservative_rev = pricing_uplift * 0.5 + conversion_uplift * 0.4
    conservative_savings = efficiency_savings * 0.3
    base_rev = pricing_uplift + conversion_uplift
    base_savings = efficiency_savings * 0.7
    aggressive_rev = pricing_uplift + conversion_uplift + upsell_uplift + (monthly_rev * 0.06)
    aggressive_savings = efficiency_savings

    def money(v: float) -> str:
        v = max(0.0, float(v or 0))
        if v >= 1_000_000:
            return f"{symbol}{v/1_000_000:.1f}M".replace(".0M", "M")
        if v >= 1_000:
            return f"{symbol}{v/1_000:.1f}K".replace(".0K", "K")
        return f"{symbol}{int(round(v)):,}"

    confidence = 48 + min(30, explicit_inputs * 5)
    if monthly_rev_input is not None:
        confidence += 8
    if leads_input and close_rate_input:
        confidence += 4
    confidence = max(48, min(88, confidence))
    estimation_enabled = bool(llm_context.get("estimationMode")) if isinstance(llm_context, dict) else False
    estimation_disclaimer = ESTIMATION_DISCLAIMER if estimation_enabled else None

    cost_opp = [
        {"title": "Pricing tier optimisation", "description": "Package the current services into clearer value tiers and raise average realised deal value.", "impact": f"{money(pricing_uplift * 0.5)}-{money(pricing_uplift)}/mo", "effort": "medium"},
        {"title": "Reporting and fulfilment automation", "description": "Automate recurring reporting, QA, and client updates to reduce delivery time.", "impact": f"{money(efficiency_savings * 0.3)}-{money(efficiency_savings * 0.6)}/mo", "effort": "medium"},
        {"title": "Tool stack consolidation", "description": "Remove duplicated tooling and renegotiate underused subscriptions.", "impact": f"{money(max(100.0, tools * 0.20))}-{money(max(300.0, tools * 0.40))}/mo", "effort": "low"},
        {"title": "Lead qualification tightening", "description": "Reduce time spent on low-fit enquiries through clearer forms and qualification logic.", "impact": f"{money(monthly_rev * 0.02)}-{money(monthly_rev * 0.05)}/mo", "effort": "low"},
        {"title": "Channel efficiency improvement", "description": "Shift budget toward the best-converting offer/channel combinations.", "impact": f"{money(max(200.0, ad_spend * 0.10))}-{money(max(500.0, ad_spend * 0.20))}/mo", "effort": "medium"},
    ]

    cost_actions = _apply_template_actions([{
        "title": "Introduce clearer retained-service pricing tiers",
        "sourceSection": "costOptimization",
        "impact": "high",
        "effort": "medium",
        "urgency": "high",
        "confidence": 0.84,
        "pillar": "profitability",
        "kpis": ["avg deal size", "gross margin", "close rate"],
        "details": {"placement": "Sales proposals, service pages, discovery calls", "recommendation": "Package core offers into 3 pricing tiers with clear deliverables and upgrade paths.", "expectedOutcome": "Higher average deal size and cleaner qualification."},
    }], business_model, "leadgen")

    segment_list: list[str] = []
    raw_segments = fin.get("customerSegments") or fin.get("topCustomerSegments") or ui.get("customerSegments") or ui.get("topCustomerSegments") or []
    if isinstance(raw_segments, list):
        segment_list.extend([str(x).strip() for x in raw_segments if str(x).strip()])
    elif isinstance(raw_segments, str) and raw_segments.strip():
        segment_list.extend([seg.strip() for seg in raw_segments.split(",") if seg.strip()])
    if not segment_list and target_market:
        segment_list.extend([x.strip() for x in str(target_market).split(",") if x.strip()])
    if not segment_list:
        segment_list = ["Businesses seeking dependable outsourced delivery", "SMBs looking for growth support and accountability", "Referral or partner channel opportunities", "Businesses expanding into new service areas"]
    segment_list = segment_list[:4]
    service_hint = services[0] if services else "core growth services"
    pain_template = [
        "Needs a reliable partner with proven results in their sector",
        f"Wants stronger outcomes from {service_hint.lower()} with less friction",
        "Looking for clear scope, transparent reporting, and accountability",
    ]
    segment_objects = [{
        "segment": seg,
        "name": seg,
        "painPoints": pain_template,
        "marketCountry": location if idx == 0 else (target_market or location),
        "currency": None,
        "expectedBudget": {"min": _segment_budget_min, "max": _segment_budget_max, "currency": None, "period": "month"},
        "notes": f"Best-fit segment for {_model_label} offers, positioned around {service_hint}.",
    } for idx, seg in enumerate(segment_list)]

    target_actions = _apply_template_actions([{
        "title": "Build segment-specific landing pages",
        "sourceSection": "targetMarket",
        "impact": "high",
        "effort": "medium",
        "urgency": "high",
        "confidence": 0.82,
        "pillar": "positioning",
        "kpis": ["landing-page conversion rate", "qualified leads", "non-brand enquiries"],
        "details": {"placement": "Service and industry landing pages", "recommendation": f"Create pages tailored to {segment_list[0]} with proof, FAQs, and explicit CTA intent.", "expectedOutcome": "Stronger segment-message fit and better lead quality from targeted pages."},
    }], business_model, "website")

    scenarios = [
        {"name": "Conservative", "assumptions": ["Focus on quick pricing and conversion fixes only.", "No new channel spend — optimise existing traffic.", f"Assumes {int(_pricing_uplift_pct * 50 * 100)}% pricing realisation and {int(_conversion_uplift_pct * 40 * 100)}% CTA improvement."], "modeledOutcomes": [{"label": "Monthly revenue upside", "value": money(conservative_rev)}, {"label": "Monthly savings", "value": money(conservative_savings)}, {"label": "Annual impact (directional)", "value": money((conservative_rev + conservative_savings) * 12)}]},
        {"name": "Base", "assumptions": ["Improve packaging, automate reporting, and tighten qualification.", "Expand the best-fit service pages and offers.", f"Assumes full pricing uplift ({int(_pricing_uplift_pct * 100)}%) and conversion improvement ({int(_conversion_uplift_pct * 100)}%)."], "modeledOutcomes": [{"label": "Monthly revenue upside", "value": money(base_rev)}, {"label": "Monthly savings", "value": money(base_savings)}, {"label": "Annual impact (directional)", "value": money((base_rev + base_savings) * 12)}]},
        {"name": "Aggressive", "assumptions": ["Add segment-specific pages and launch focused acquisition experiments.", "Standardise delivery, activate upsell motion, and pursue new channels.", f"Assumes pricing + conversion + upsell uplift ({int(_upsell_pct * 100)}% of MRR) + 6% new channel revenue."], "modeledOutcomes": [{"label": "Monthly revenue upside", "value": money(aggressive_rev)}, {"label": "Monthly savings", "value": money(aggressive_savings)}, {"label": "Annual impact (directional)", "value": money((aggressive_rev + aggressive_savings) * 12)}]},
    ]

    revenue_ops = [
        {"lever": "SEO growth", "impact": f"{money(monthly_rev * 0.20)} - {money(monthly_rev * 2.40)}", "effort": "High", "confidence": "medium", "notes": f"Based on estimated organic lead potential at current authority levels for a {_model_label}."},
        {"lever": "Conversion optimization", "impact": f"{money(monthly_rev * 0.06)} - {money(monthly_rev * 0.30)}", "effort": "Low", "confidence": "high", "notes": "CTA clarity, proof placement, and page-level intent improvements applied to existing traffic."},
        {"lever": "Price increase + packaging", "impact": f"{money(monthly_rev * 0.08)} - {money(monthly_rev * 0.22)}", "effort": "Medium", "confidence": "medium", "notes": f"Tiered packaging and value-based pricing for a {_model_label} with {svc_count} detected service area(s)."},
    ]
    revenue_table = [
        {"metric": "Current Monthly Revenue (estimated)", "value": money(monthly_rev)},
        {"metric": "Current Monthly Cost (estimated)", "value": money(total_cost)},
        {"metric": "Monthly Leads (estimated)", "value": str(int(round(leads)))},
        {"metric": "Close Rate (estimated)", "value": f"{int(round(close_rate * 100))}%"},
        {"metric": "Average Deal Value (estimated)", "value": money(avg_deal)},
        {"metric": "Base Monthly Revenue Upside", "value": money(base_rev)},
        {"metric": "Annual Revenue Growth (base scenario)", "value": money(base_rev * 12)},
        {"metric": "Annual Financial Impact (base + savings)", "value": money((base_rev + base_savings) * 12)},
    ]
    current_revenue_estimate = money(monthly_rev) + "/mo current revenue"
    improvement_potential = money(base_rev * 12) + "/yr revenue growth"
    projected_total = money((base_rev + base_savings) * 12) + "/yr total impact"
    summary = f"Revenue is {'modeled from explicit inputs' if explicit_inputs >= 4 else 'directionally modeled'} at around {money(monthly_rev)}/month for this {_model_label}. Base scenario upside is {money(base_rev)}/month; aggressive scenario is {money(aggressive_rev)}/month."

    financial_actions = _apply_template_actions([{
        "title": "Prioritise conversion and pricing before scaling spend",
        "sourceSection": "financialImpact",
        "impact": "high",
        "effort": "medium",
        "urgency": "high",
        "confidence": 0.86,
        "pillar": "revenue",
        "kpis": ["monthly revenue", "gross margin", "proposal conversion"],
        "details": {"recommendation": "Improve packaging, proof, and CTA clarity before pushing more traffic into the funnel.", "expectedOutcome": f"Better revenue per visit and stronger payback on future acquisition for this {_model_label}."},
    }], business_model, "financial")

    cost_mentor = f"The biggest cost-efficiency gains for this {_model_label} are likely from tighter pricing, automated reporting, and better channel qualification rather than blunt cost-cutting."
    target_mentor = f"The near-term target market strategy for this {_model_label} should prioritise the clearest-fit client groups implied by the service mix, geography, and current offer packaging."
    financial_mentor = f"Modeled at {money(monthly_rev)}/mo. Base upside is {money(base_rev)}/mo from pricing and conversion improvements. Use as a directional planning estimate, not an audited forecast."
    spend_rows = [
        {"category": "Payroll", "current": money(payroll), "industryAvg": money(payroll * 1.05), "notes": "Delivery and account-management cost base."},
        {"category": "Tools", "current": money(tools), "industryAvg": money(max(tools, monthly_rev * 0.05)), "notes": "Software stack and recurring tools."},
        {"category": "Marketing", "current": money(ad_spend), "industryAvg": money(max(ad_spend, monthly_rev * 0.08)), "notes": "Acquisition and paid channel spend."},
        {"category": "Overhead", "current": money(overhead), "industryAvg": money(max(overhead, monthly_rev * 0.06)), "notes": "General operating overhead."},
    ]
    waste_rows = [
        {"area": item["title"], "costPerMonth": item["impact"], "fix": item["description"], "impact": item["impact"]}
        for item in cost_opp[:4]
    ]
    automation_rows = [
        {"process": "Reporting and client updates", "tool": "Dashboard + workflow automation", "timeSavedPerMonth": "8-12 hrs", "costSaved": money(efficiency_savings * 0.35), "notes": "Removes repeat reporting and follow-up work."},
        {"process": "Lead qualification", "tool": "Forms + CRM routing", "timeSavedPerMonth": "4-6 hrs", "costSaved": money(efficiency_savings * 0.18), "notes": "Reduces time spent on low-fit enquiries."},
    ]
    recommended_segments = [
        {
            "segment": seg.get("segment"),
            "whyFit": str(seg.get("notes") or "").strip() or "Segment fit derived from services, geography, and offer packaging.",
            "avgBudget": money(_segment_budget_min) + "-" + money(_segment_budget_max) + "/mo",
            "competitionLevel": "Medium",
            "notes": str(seg.get("notes") or "").strip() or "Commercial fit inferred from current demand and offer packaging.",
        }
        for seg in segment_objects[:2]
    ]
    positioning_advice = f"Position {service_hint} around buyer pain, delivery clarity, and proof for {segment_list[0]}."
    financial_notes = "Financial impact is computed from supplied inputs when available and otherwise from traffic, lead, and offer evidence surfaced by the pipeline."

    return {
        "costOptimization": {
            "mentorNotes": cost_mentor,
            "notes": f"Current monthly operating cost baseline is {money(total_cost)} with the biggest savings likely in packaging, reporting, and qualification.",
            "currencyContext": llm_context.get("currencyGuidance") if isinstance(llm_context, dict) else None,
            "businessLens": cost_section_context.get("businessLens"),
            "relevance": cost_section_context.get("relevance"),
            "estimatedMonthlySpend": spend_rows,
            "wasteAreas": waste_rows,
            "automationOpportunities": automation_rows,
            "opportunities": cost_opp,
            "estimationDisclaimer": estimation_disclaimer,
            "confidenceScore": confidence,
            "actionCandidates": cost_actions,
        },
        "targetMarket": {
            "mentorNotes": target_mentor,
            "notes": "Segments were computed from target market inputs, detected services, geography, and visible commercial positioning.",
            "currencyContext": llm_context.get("currencyGuidance") if isinstance(llm_context, dict) else None,
            "businessLens": target_section_context.get("businessLens"),
            "relevance": target_section_context.get("relevance"),
            "segments": segment_objects,
            "currentTargetSegments": segment_objects,
            "detectedSegments": segment_objects,
            "recommendedSegments": recommended_segments,
            "positioningAdvice": positioning_advice,
            "estimationDisclaimer": estimation_disclaimer,
            "confidenceScore": max(48, confidence - 6),
            "actionCandidates": target_actions,
        },
        "financialImpact": {
            "mentorNotes": financial_mentor,
            "notes": financial_notes,
            "summary": summary,
            "businessLens": financial_section_context.get("businessLens"),
            "relevance": financial_section_context.get("relevance"),
            "revenueTable": revenue_table,
            "currentRevenueEstimate": current_revenue_estimate,
            "improvementPotential": improvement_potential,
            "projectedRevenueIncrease": projected_total,
            "profitabilityLevers": revenue_ops,
            "revenueOpportunities": revenue_ops,
            "estimationDisclaimer": estimation_disclaimer,
            "confidenceScore": confidence,
            "actionCandidates": financial_actions,
        },
    }


def _coerce_mentor_snapshot(v: Any) -> str | None:
    if v is None:
        return None
    if isinstance(v, str):
        s = v.strip()
        return s or None
    if isinstance(v, dict):
        for k in ("summary", "text", "mentorSnapshot", "value"):
            vv = v.get(k)
            if isinstance(vv, str) and vv.strip():
                return vv.strip()
        return str(v)
    return str(v)


def _merge_text_notes(existing: Any, additions: list[str]) -> str | None:
    parts: list[str] = []
    seen: set[str] = set()
    if isinstance(existing, str) and existing.strip():
        base = existing.strip()
        parts.append(base)
        seen.add(base.lower())
    for item in additions:
        note = (item or "").strip()
        if not note:
            continue
        key = note.lower()
        if key in seen:
            continue
        seen.add(key)
        parts.append(note)
    return "\n".join(parts) if parts else None


def _normalize_final_synthesis_shapes(report: dict) -> dict:
    if not isinstance(report, dict):
        return report
    report = normalize_llm_output(report)

    # ── websiteDigitalPresence: contentGaps must be list of strings ───────────
    wdp = report.get("websiteDigitalPresence")
    if isinstance(wdp, dict):
        cg = wdp.get("contentGaps")
        if isinstance(cg, list):
            wdp["contentGaps"] = [
                (v if isinstance(v, str) else str(v.get("gap") or v.get("title") or v.get("name") or ""))
                for v in cg if v
            ]
        hpf = wdp.get("highPriorityFixes")
        if isinstance(hpf, list):
            wdp["highPriorityFixes"] = [
                (v if isinstance(v, str) else str(v.get("fix") or v.get("title") or v.get("issue") or ""))
                for v in hpf if v
            ]

    # ── seoVisibility: priorityActions must be list of strings ────────────────
    seo = report.get("seoVisibility")
    if isinstance(seo, dict):
        pa = seo.get("priorityActions")
        if isinstance(pa, list):
            seo["priorityActions"] = [
                (v if isinstance(v, str) else str(v.get("action") or v.get("title") or v.get("recommendation") or ""))
                for v in pa if v
            ]

    # ── servicesPositioning: serviceGaps ──────────────────────────────────────
    sp = report.get("servicesPositioning")
    if isinstance(sp, dict):
        gaps = sp.get("serviceGaps")
        if isinstance(gaps, list):
            fixed_gaps = []
            for row in gaps:
                if isinstance(row, str) and row.strip():
                    fixed_gaps.append({"service": row.strip()})
                elif isinstance(row, dict):
                    normalized = dict(row)
                    if "service" not in normalized:
                        for alias in ("gap", "name", "title", "serviceName"):
                            alias_value = normalized.get(alias)
                            if isinstance(alias_value, str) and alias_value.strip():
                                normalized["service"] = alias_value.strip()
                                break
                    if isinstance(normalized.get("service"), str) and normalized["service"].strip():
                        normalized["service"] = normalized["service"].strip()
                        fixed_gaps.append(normalized)
            sp["serviceGaps"] = fixed_gaps

    # ── actionPlan90Days: unwrap dict wrappers, normalize week shape ──────────
    ap = report.get("actionPlan90Days")
    if isinstance(ap, dict):
        for alias in ("weekByWeek", "weeks", "actionPlan90Days", "blocks", "plan"):
            if isinstance(ap.get(alias), list):
                report["actionPlan90Days"] = ap[alias]
                break
        else:
            report["actionPlan90Days"] = []

    if isinstance(report.get("actionPlan90Days"), list):
        fixed_weeks = []
        for i, w in enumerate(report["actionPlan90Days"]):
            if not isinstance(w, dict):
                continue
            # weekRange aliases
            if "weekRange" not in w:
                for alias in ("week", "period", "range", "timeframe"):
                    if isinstance(w.get(alias), str):
                        w["weekRange"] = w[alias]
                        break
                else:
                    w["weekRange"] = f"Week {i*2+1}-{i*2+2}"
            # title aliases
            if "title" not in w:
                for alias in ("focus", "theme", "name", "phase"):
                    if isinstance(w.get(alias), str):
                        w["title"] = w[alias]
                        break
                else:
                    w["title"] = w.get("weekRange", "")
            # actions → list of strings
            if isinstance(w.get("actions"), str):
                w["actions"] = [w["actions"]]
            elif w.get("actions") is None:
                w["actions"] = []
            # kpis — always normalize to list of {kpi,current,target} objects
            kpis = w.get("kpis")
            if isinstance(kpis, dict):
                kpis = [kpis]
            elif isinstance(kpis, str):
                kpis = [kpis]
            elif kpis is None:
                kpis = []
            if isinstance(kpis, list):
                fixed_kpis = []
                for k in kpis:
                    if isinstance(k, str) and k.strip():
                        fixed_kpis.append({"kpi": k.strip(), "current": "N/A", "target": "N/A"})
                    elif isinstance(k, dict):
                        kk = k.get("kpi") or k.get("name") or k.get("metric") or k.get("label") or str(k)
                        fixed_kpis.append({"kpi": str(kk), "current": k.get("current", "N/A"), "target": k.get("target", "N/A")})
                w["kpis"] = fixed_kpis
            else:
                w["kpis"] = []
            fixed_weeks.append(w)
        report["actionPlan90Days"] = fixed_weeks

    # ── competitiveAdvantages ─────────────────────────────────────────────────
    ca = report.get("competitiveAdvantages")
    if isinstance(ca, dict):
        adv = ca.get("advantages")
        note_additions: list[str] = []
        if isinstance(adv, list):
            fixed_advantages = []
            for item in adv:
                if isinstance(item, str) and item.strip():
                    fixed_advantages.append(item.strip())
                elif isinstance(item, dict):
                    advantage_text = item.get("advantage") or item.get("title") or item.get("text") or item.get("name")
                    if isinstance(advantage_text, str) and advantage_text.strip():
                        advantage_text = advantage_text.strip()
                        fixed_advantages.append(advantage_text)
                        why = item.get("whyItMatters")
                        how = item.get("howToLeverage")
                        if isinstance(why, str) and why.strip():
                            note_additions.append(f"{advantage_text}: Why it matters: {why.strip()}")
                        if isinstance(how, str) and how.strip():
                            note_additions.append(f"{advantage_text}: How to leverage: {how.strip()}")
            ca["advantages"] = fixed_advantages
            merged_notes = _merge_text_notes(ca.get("notes"), note_additions)
            if merged_notes:
                ca["notes"] = merged_notes

    # ── appendices dataGaps ───────────────────────────────────────────────────
    appx = report.get("appendices")
    if isinstance(appx, dict):
        dgs = appx.get("dataGaps")
        if isinstance(dgs, list):
            for dg in dgs:
                if not isinstance(dg, dict):
                    continue
                if isinstance(dg.get("missing"), str):
                    dg["missing"] = [dg["missing"]]
                elif dg.get("missing") is None:
                    dg["missing"] = []
                if isinstance(dg.get("howToEnable"), str):
                    dg["howToEnable"] = [dg["howToEnable"]]
                elif dg.get("howToEnable") is None:
                    dg["howToEnable"] = []

    # ── leadGeneration.missingHighROIChannels ────────────────────────────────
    lg = report.get("leadGeneration")
    if isinstance(lg, dict):
        mh = lg.get("missingHighROIChannels")
        if isinstance(mh, str) and mh.strip():
            lg["missingHighROIChannels"] = [{"channel": mh.strip()}]
        elif isinstance(mh, list):
            fixed_mh = []
            for item in mh:
                if isinstance(item, str) and item.strip():
                    fixed_mh.append({"channel": item.strip()})
                elif isinstance(item, dict):
                    normalized = dict(item)
                    if "channel" not in normalized:
                        for alias in ("name", "title", "channelName"):
                            if isinstance(normalized.get(alias), str):
                                normalized["channel"] = normalized.pop(alias)
                                break
                    if isinstance(normalized.get("channel"), str) and normalized["channel"].strip():
                        normalized["channel"] = normalized["channel"].strip()
                        fixed_mh.append(normalized)
            lg["missingHighROIChannels"] = fixed_mh

    # ── executiveSummary.quickWins: strings → QuickWin objects ────────────────
    es = report.get("executiveSummary")
    if isinstance(es, dict):
        raw_qw = es.get("quickWins")
        if isinstance(raw_qw, list):
            fixed_qw = []
            for item in raw_qw:
                if isinstance(item, str) and item.strip():
                    fixed_qw.append({"title": item.strip(), "impact": None, "time": None})
                elif isinstance(item, dict):
                    row = dict(item)
                    if not row.get("title"):
                        for alias in ("win", "action", "recommendation", "text", "name", "label"):
                            if isinstance(row.get(alias), str) and row[alias].strip():
                                row["title"] = row[alias].strip()
                                break
                    if isinstance(row.get("title"), str) and row["title"].strip():
                        fixed_qw.append(row)
            es["quickWins"] = fixed_qw

    return report


def _log_stage_metrics(stage_name: str, started_at: float, metadata: Dict[str, Any] | None) -> None:
    duration_ms = int((time.perf_counter() - started_at) * 1000)
    meta = metadata or {}
    logger.info(
        "[LLM] stage=%s provider=%s model=%s attempts=%s retries=%s duration_ms=%s",
        stage_name, meta.get("provider", "unknown"), meta.get("model", "unknown"),
        meta.get("attempts", 0), meta.get("retries", 0), duration_ms,
    )


def _prompt_hash(*parts: str) -> str:
    joined = "\n\n".join([(p or "").strip() for p in parts])
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()[:16]


def _deep_merge(base: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:
    out: Dict[str, Any] = dict(base or {})
    for k, v in (patch or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def _default_estimation_sections(llm_context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    logger.warning("[LLM_DEBUG] default estimation sections invoked")
    deterministic = _build_deterministic_estimation_sections(llm_context or {})
    return {
        "costOptimization": validate_with_fallback(CostOptimization, deterministic.get("costOptimization", {}), section_name="costOptimization_default").model_dump(),
        "targetMarket": validate_with_fallback(TargetMarket, deterministic.get("targetMarket", {}), section_name="targetMarket_default").model_dump(),
        "financialImpact": validate_with_fallback(FinancialImpact, deterministic.get("financialImpact", {}), section_name="financialImpact_default").model_dump(),
    }


def build_report_with_llm(
    base_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    logger.info("[LLM] build_report_with_llm (reconcile) start")
    logger.warning("[LLM_DEBUG] build_report_with_llm effective_llm_mode=%s", get_effective_llm_mode())
    logger.warning("[LLM_DEBUG] entering reconcile")
    base_report = normalize_llm_output(base_report)
    base_report = validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report_input").model_dump()

    if int(get_effective_llm_mode()) <= 1 or bool(getattr(settings, "LLM_SKIP_RECONCILE", True)):
        logger.warning("[LLM] reconcile skipped -> returning base_report")
        return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()

    stage_context = _build_stage_context(llm_context, stage_name="reconcile", base_report=base_report)
    base_report_c = slice_report_for_reconcile(base_report)
    logger.warning("[LLM_DEBUG] estimation llm_context keys=%s", list((stage_context or {}).keys()))
    llm_context_c = compact_reconcile_context(stage_context)
    logger.warning("[LLM_DEBUG] reconcile compact sizes report_chars=%s ctx_chars=%s", len(str(base_report_c)), len(str(llm_context_c)))
    prompt = build_user_prompt_reconcile(base_report_c, llm_context_c)
    if len(prompt) > int(getattr(settings, "LLM_MAX_TOTAL_PROMPT_CHARS", 18000) or 18000) * 2:
        logger.warning("[LLM] reconcile prompt still too large after compaction; skipping reconcile")
        return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()

    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None
    if use_cache:
        cache_section = f"llm_reconcile:any:{_prompt_hash(SYSTEM_PROMPT_RECONCILE, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] build_report_with_llm (reconcile) cache HIT")
            llm_patch = cached
        else:
            call_meta: Dict[str, Any] = {}
            stage_started = time.perf_counter()
            try:
                _stage_pause("reconcile")
                llm_patch = call_llm_json("auto", SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=_stage_max_tokens("reconcile", 1800), max_retries=_stage_max_retries("reconcile"), metadata_out=call_meta, expected_keys=RECONCILE_EXPECTED_KEYS)
                _log_stage_metrics("reconcile", stage_started, call_meta)
            except Exception as e:
                _log_stage_metrics("reconcile", stage_started, call_meta)
                downgrade_llm_mode(f"reconcile failed: {e}")
                logger.warning("[LLM] reconcile failed -> returning base_report")
                return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()
            if isinstance(llm_patch, dict) and llm_patch:
                cache_repo.upsert_section(cache_key, cache_section, llm_patch)
    else:
        call_meta: Dict[str, Any] = {}
        stage_started = time.perf_counter()
        try:
            _stage_pause("reconcile")
            llm_patch = call_llm_json("auto", SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=_stage_max_tokens("reconcile", 1800), max_retries=_stage_max_retries("reconcile"), metadata_out=call_meta, expected_keys=RECONCILE_EXPECTED_KEYS)
            _log_stage_metrics("reconcile", stage_started, call_meta)
        except Exception as e:
            _log_stage_metrics("reconcile", stage_started, call_meta)
            downgrade_llm_mode(f"reconcile failed: {e}")
            logger.warning("[LLM] reconcile failed -> returning base_report")
            return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()

    logger.warning("[LLM_DEBUG] reconcile raw_patch_type=%s keys=%s", type(llm_patch).__name__, list(llm_patch.keys()) if isinstance(llm_patch, dict) else None)
    if not isinstance(llm_patch, dict):
        logger.warning("[LLM] reconcile returned non-object JSON; using empty patch")
        llm_patch = {}

    stage_response = validate_stage_response_with_fallback(LLMReconcileResponse, llm_patch, stage_name="reconcile_response")
    llm_patch = map_reconcile_response_to_report_patch(stage_response)
    combined = _normalize_final_synthesis_shapes(_deep_merge(base_report, llm_patch))
    combined = validate_with_fallback(BusinessGrowthReport, combined, fallback_data=base_report, section_name="reconciled_report").model_dump()
    logger.warning("[LLM_DEBUG] reconcile mapped_patch_keys=%s", list(llm_patch.keys()) if isinstance(llm_patch, dict) else None)
    logger.info("[LLM] build_report_with_llm (reconcile) ok")
    return combined



def _call_llm_stage_with_optional_cache(
    *,
    stage_name: str,
    system_prompt: str,
    user_prompt: str,
    expected_keys: list[str],
    max_tokens: int,
    max_retries: int,
    cache_repo: Any | None,
    cache_key: str | None,
    allow_openai_repair: bool = False,
) -> Dict[str, Any]:
    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = f"{stage_name}:{CACHE_SCHEMA_VERSION}:any:{_prompt_hash(system_prompt, user_prompt)}"
    if use_cache:
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] %s cache HIT", stage_name)
            return cached

    call_meta: Dict[str, Any] = {}
    stage_started = time.perf_counter()
    _stage_pause(stage_name)
    result = call_llm_json(
        "auto",
        system_prompt,
        user_prompt,
        max_tokens=max_tokens,
        max_retries=max_retries,
        metadata_out=call_meta,
        expected_keys=expected_keys,
        allow_openai_repair=allow_openai_repair,
    )
    _log_stage_metrics(stage_name, stage_started, call_meta)
    if use_cache and isinstance(result, dict) and result:
        cache_repo.upsert_section(cache_key, cache_section, result)
    return result if isinstance(result, dict) else {}


def _build_stage_context_with_currency(
    llm_context: Dict[str, Any],
    *,
    stage_name: str,
    base_report: Dict[str, Any] | None = None,
    reconcile_patch: Dict[str, Any] | None = None,
    sections_8_10: Dict[str, Any] | None = None,
    final_report: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    stage_context = _build_stage_context(
        llm_context,
        stage_name=stage_name,
        base_report=base_report,
        reconcile_patch=reconcile_patch,
        sections_8_10=sections_8_10,
        final_report=final_report,
    )
    try:
        if isinstance(stage_context, dict) and "currencyGuidance" not in stage_context:
            ui = stage_context.get("userInputs") if isinstance(stage_context.get("userInputs"), dict) else {}
            company_loc = ui.get("location")
            target_market = ui.get("targetMarket")
            stage_context["currencyGuidance"] = build_currency_guidance(company_loc, target_market)
    except Exception:
        logger.exception("[LLM] Failed to build currency guidance; continuing")
    return stage_context


def _call_single_estimation_section(
    *,
    section_name: str,
    llm_context: Dict[str, Any],
    system_prompt: str,
    user_prompt_builder,
    expected_keys: list[str],
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    section_key = expected_keys[0] if expected_keys else section_name
    compact_ctx = compact_estimation_context(llm_context, section_key)
    prompt = user_prompt_builder(compact_ctx)
    total_chars = len(system_prompt) + len(prompt)
    logger.warning("[LLM_DEBUG] %s prompt_chars=%s (system=%s user=%s)",
                   section_name, total_chars, len(system_prompt), len(prompt))

    # Hard guard: if prompt is still too large, skip LLM and use fallback
    _MAX_ESTIMATION_PROMPT = int(getattr(settings, "LLM_MAX_ESTIMATION_PROMPT_CHARS", 3000) or 3000)
    if total_chars > _MAX_ESTIMATION_PROMPT:
        logger.warning("[LLM] %s prompt too large (%s chars > %s) -> skipping LLM, using fallback",
                       section_name, total_chars, _MAX_ESTIMATION_PROMPT)
        return {}

    try:
        result = _call_llm_stage_with_optional_cache(
            stage_name=section_name,
            system_prompt=system_prompt,
            user_prompt=prompt,
            expected_keys=expected_keys,
            max_tokens=_stage_max_tokens(section_name, 1400),
            max_retries=_stage_max_retries(section_name),
            cache_repo=cache_repo,
            cache_key=cache_key,
            allow_openai_repair=False,
        )
    except Exception as e:
        downgrade_llm_mode(f"{section_name} failed: {e}")
        logger.warning("[LLM] %s failed err=%s", section_name, e)
        return {}
    return result if isinstance(result, dict) else {}


def _call_final_patch_section(
    *,
    stage_name: str,
    final_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    system_prompt: str,
    user_prompt_builder,
    expected_keys: list[str],
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    rep_c = slice_report_for_final_stage(final_report, stage_name)
    ctx_c = compact_final_context(llm_context, stage_name)
    prompt = user_prompt_builder(rep_c, ctx_c)
    total_chars = len(system_prompt) + len(prompt)
    logger.warning("[LLM_DEBUG] %s prompt_chars=%s (system=%s user=%s)",
                   stage_name, total_chars, len(system_prompt), len(prompt))

    # Hard guard: if prompt is still too large, skip LLM for this stage
    _MAX_FINAL_PROMPT = int(getattr(settings, "LLM_MAX_FINAL_PATCH_PROMPT_CHARS", 3500) or 3500)
    if total_chars > _MAX_FINAL_PROMPT:
        logger.warning("[LLM] %s prompt too large (%s chars > %s) -> skipping",
                       stage_name, total_chars, _MAX_FINAL_PROMPT)
        return {}

    try:
        result = _call_llm_stage_with_optional_cache(
            stage_name=stage_name,
            system_prompt=system_prompt,
            user_prompt=prompt,
            expected_keys=expected_keys,
            max_tokens=_stage_max_tokens(stage_name, 900),
            max_retries=_stage_max_retries(stage_name),
            cache_repo=cache_repo,
            cache_key=cache_key,
            allow_openai_repair=False,
        )
    except Exception as e:
        downgrade_llm_mode(f"{stage_name} failed: {e}")
        logger.warning("[LLM] %s failed err=%s", stage_name, e)
        return {}
    return result if isinstance(result, dict) else {}

def build_sections_8_10_with_llm(
    llm_context: Dict[str, Any],
    *,
    base_report: Dict[str, Any] | None = None,
    reconcile_patch: Dict[str, Any] | None = None,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    logger.info("[LLM] build_sections_8_10_with_llm start")
    logger.warning("[LLM_DEBUG] entering sections_8_10 effective_llm_mode=%s", get_effective_llm_mode())

    stage_context = _build_stage_context_with_currency(
        llm_context,
        stage_name="estimation_8_10",
        base_report=base_report,
        reconcile_patch=reconcile_patch,
    )
    logger.warning("[LLM_DEBUG] estimation llm_context keys=%s", list((stage_context or {}).keys()))

    computed_sections = _default_estimation_sections(stage_context)
    cost = computed_sections["costOptimization"]
    target = computed_sections["targetMarket"]
    impact = computed_sections["financialImpact"]

    if not _has_substance(cost, "opportunities") or not _cost_section_is_specific(cost, stage_context):
        raise ValueError("Computed costOptimization section is missing real pipeline data")
    if not _has_substance(target, "segments") or not _target_section_is_specific(target, stage_context):
        raise ValueError("Computed targetMarket section is missing real pipeline data")
    if not _has_substance(impact, "revenueTable"):
        raise ValueError("Computed financialImpact section is missing real pipeline data")

    segs = target.get("segments") or target.get("currentTargetSegments") or target.get("detectedSegments") or []
    target["segments"] = segs
    target.setdefault("currentTargetSegments", segs)
    target.setdefault("detectedSegments", segs)
    target.setdefault("recommendedSegments", target.get("recommendedSegments") or [])

    if impact.get("revenueOpportunities") and not impact.get("profitabilityLevers"):
        impact["profitabilityLevers"] = impact.get("revenueOpportunities")
    if impact.get("profitabilityLevers") and not impact.get("revenueOpportunities"):
        impact["revenueOpportunities"] = impact.get("profitabilityLevers")

    logger.warning("[LLM_DEBUG] sections_8_10 computed cost=%s target=%s financial=%s", bool(cost), bool(target), bool(impact))
    logger.info("[LLM] build_sections_8_10_with_llm ok")
    return {"costOptimization": cost, "targetMarket": target, "financialImpact": impact}

    stage_context = _build_stage_context_with_currency(
        llm_context,
        stage_name="estimation_8_10",
        base_report=base_report,
        reconcile_patch=reconcile_patch,
    )
    logger.warning("[LLM_DEBUG] estimation llm_context keys=%s", list((stage_context or {}).keys()))

    fallback_sections = _default_estimation_sections(stage_context)

    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> returning deterministic sections 8-10")
        return fallback_sections

    cost_raw = _call_single_estimation_section(
        section_name="cost_optimization",
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_COST_OPTIMIZATION,
        user_prompt_builder=build_user_prompt_cost_optimization,
        expected_keys=COST_OPTIMIZATION_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    target_raw = _call_single_estimation_section(
        section_name="target_market",
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_TARGET_MARKET,
        user_prompt_builder=build_user_prompt_target_market,
        expected_keys=TARGET_MARKET_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    financial_raw = _call_single_estimation_section(
        section_name="financial_impact",
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINANCIAL_IMPACT,
        user_prompt_builder=build_user_prompt_financial_impact,
        expected_keys=FINANCIAL_IMPACT_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )

    logger.warning("[LLM_DEBUG] sections_8_10 split raw keys cost=%s target=%s financial=%s",
                   list(cost_raw.keys()) if isinstance(cost_raw, dict) else None,
                   list(target_raw.keys()) if isinstance(target_raw, dict) else None,
                   list(financial_raw.keys()) if isinstance(financial_raw, dict) else None)

    merged_llm = {}
    if isinstance(cost_raw, dict):
        merged_llm.update(cost_raw)
    if isinstance(target_raw, dict):
        merged_llm.update(target_raw)
    if isinstance(financial_raw, dict):
        merged_llm.update(financial_raw)

    # Reject LLM output that is dominated by placeholder junk (A1, O1, Seg1, etc.)
    if has_junk_output(merged_llm, threshold=3):
        logger.warning("[LLM] sections_8_10 junk output detected -> using deterministic fallback")
        return fallback_sections

    llm_json = map_sections_8_10_response_to_internal_sections(
        validate_stage_response_with_fallback(
            LLMSections810Response,
            merged_llm,
            stage_name="estimation_8_10_response_split",
        )
    ) if merged_llm else {}

    cost = validate_with_fallback(
        CostOptimization,
        llm_json.get("costOptimization", {}),
        fallback_data=fallback_sections["costOptimization"],
        section_name="costOptimization",
    ).model_dump()
    target = validate_with_fallback(
        TargetMarket,
        llm_json.get("targetMarket", {}),
        fallback_data=fallback_sections["targetMarket"],
        section_name="targetMarket",
    ).model_dump()
    impact = validate_with_fallback(
        FinancialImpact,
        llm_json.get("financialImpact", {}),
        fallback_data=fallback_sections["financialImpact"],
        section_name="financialImpact",
    ).model_dump()

    if not _has_substance(cost, "opportunities") or not _cost_section_is_specific(cost, stage_context):
        cost = fallback_sections["costOptimization"]
    if not _has_substance(target, "segments") or not _target_section_is_specific(target, stage_context):
        target = fallback_sections["targetMarket"]
    if not _has_substance(impact, "revenueTable"):
        impact = fallback_sections["financialImpact"]
    else:
        # Sanity-check the baseline revenue figure. If the cached or LLM-generated
        # financialImpact has a currentRevenueEstimate that is numerically < 100
        # (e.g. "₹2/mo", "$5/mo") it means the model hallucinated or the cache is
        # stale from a broken run. In that case, transplant the revenue rows from
        # the freshly-computed deterministic fallback while keeping any other LLM
        # narrative fields that are still valid.
        _est_str = str(impact.get("currentRevenueEstimate") or "")
        _baseline_val = _safe_float(impact.get("currentRevenueEstimateValue"))
        if _baseline_val is None:
            _baseline_val = _safe_float(_est_str) or 0.0
        if _baseline_val < 100:
            logger.warning(
                "[LLM] financialImpact baseline revenue looks broken (%s) -> "
                "transplanting revenueTable from deterministic fallback",
                _est_str,
            )
            impact["revenueTable"] = fallback_sections["financialImpact"]["revenueTable"]
            impact["currentRevenueEstimate"] = fallback_sections["financialImpact"]["currentRevenueEstimate"]
            impact["improvementPotential"] = fallback_sections["financialImpact"]["improvementPotential"]
            impact["projectedRevenueIncrease"] = fallback_sections["financialImpact"]["projectedRevenueIncrease"]
            impact["summary"] = fallback_sections["financialImpact"].get("summary", impact.get("summary", ""))

    # Backfill scenarios from deterministic fallback when LLM omits them
    # (LLM prompts no longer request scenarios to reduce token usage)
    for section, fallback_key in ((cost, "costOptimization"), (target, "targetMarket"), (impact, "financialImpact")):
        if isinstance(section, dict) and not section.get("scenarios"):
            fb_scenarios = fallback_sections[fallback_key].get("scenarios", [])
            if fb_scenarios:
                section["scenarios"] = fb_scenarios

    if isinstance(target, dict):
        segs = target.get("segments") or target.get("currentTargetSegments") or target.get("detectedSegments") or []
        target["segments"] = segs
        target.setdefault("currentTargetSegments", segs)
        target.setdefault("detectedSegments", segs)

    if isinstance(cost, dict):
        cost.setdefault("actionCandidates", fallback_sections["costOptimization"].get("actionCandidates", []))
        # Backfill full disclaimer text from fallback
        if not cost.get("estimationDisclaimer") or len(str(cost.get("estimationDisclaimer", ""))) < 20:
            cost["estimationDisclaimer"] = fallback_sections["costOptimization"].get("estimationDisclaimer", "")

    if isinstance(target, dict):
        target.setdefault("actionCandidates", fallback_sections["targetMarket"].get("actionCandidates", []))
        if not target.get("estimationDisclaimer") or len(str(target.get("estimationDisclaimer", ""))) < 20:
            target["estimationDisclaimer"] = fallback_sections["targetMarket"].get("estimationDisclaimer", "")

    if isinstance(impact, dict):
        impact.setdefault("profitabilityLevers", impact.get("revenueOpportunities") or fallback_sections["financialImpact"].get("profitabilityLevers", []))
        impact.setdefault("revenueOpportunities", impact.get("profitabilityLevers") or fallback_sections["financialImpact"].get("revenueOpportunities", []))
        impact.setdefault("actionCandidates", fallback_sections["financialImpact"].get("actionCandidates", []))
        if not impact.get("estimationDisclaimer") or len(str(impact.get("estimationDisclaimer", ""))) < 20:
            impact["estimationDisclaimer"] = fallback_sections["financialImpact"].get("estimationDisclaimer", "")

    logger.warning("[LLM_DEBUG] sections_8_10 mapped cost=%s target=%s financial=%s", bool(cost), bool(target), bool(impact))
    logger.info("[LLM] build_sections_8_10_with_llm ok")
    return {"costOptimization": cost, "targetMarket": target, "financialImpact": impact}


def build_final_synthesis_with_llm(
    final_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    reconcile_patch: Dict[str, Any] | None = None,
    sections_8_10: Dict[str, Any] | None = None,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    logger.info("[LLM] build_final_synthesis_with_llm start")
    logger.warning("[LLM_DEBUG] entering final_synthesis effective_llm_mode=%s", get_effective_llm_mode())
    final_report = normalize_llm_output(final_report)
    final_report = validate_with_fallback(BusinessGrowthReport, final_report, section_name="final_report_input").model_dump()

    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping final synthesis; returning final_report")
        return validate_with_fallback(BusinessGrowthReport, final_report, section_name="final_report").model_dump()

    stage_context = _build_stage_context_with_currency(
        llm_context,
        stage_name="final_synthesis",
        base_report=final_report,
        reconcile_patch=reconcile_patch,
        sections_8_10=sections_8_10,
        final_report=final_report,
    )

    exec_patch = _call_final_patch_section(
        stage_name="final_exec_summary",
        final_report=final_report,
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINAL_EXEC_SUMMARY,
        user_prompt_builder=build_user_prompt_final_exec_summary,
        expected_keys=FINAL_EXEC_SUMMARY_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    visibility_patch = _call_final_patch_section(
        stage_name="final_visibility_patch",
        final_report=final_report,
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINAL_VISIBILITY_PATCH,
        user_prompt_builder=build_user_prompt_final_visibility_patch,
        expected_keys=FINAL_VISIBILITY_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    growth_patch = _call_final_patch_section(
        stage_name="final_growth_patch",
        final_report=final_report,
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINAL_GROWTH_PATCH,
        user_prompt_builder=build_user_prompt_final_growth_patch,
        expected_keys=FINAL_GROWTH_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    growth_commercial_patch = _call_final_patch_section(
        stage_name="final_growth_commercial_patch",
        final_report=final_report,
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINAL_GROWTH_COMMERCIAL_PATCH,
        user_prompt_builder=build_user_prompt_final_growth_commercial_patch,
        expected_keys=FINAL_GROWTH_COMMERCIAL_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )
    action_patch = _call_final_patch_section(
        stage_name="final_actionplan_patch",
        final_report=final_report,
        llm_context=stage_context,
        system_prompt=SYSTEM_PROMPT_FINAL_ACTIONPLAN_PATCH,
        user_prompt_builder=build_user_prompt_final_actionplan_patch,
        expected_keys=FINAL_ACTIONPLAN_EXPECTED_KEYS,
        cache_repo=cache_repo,
        cache_key=cache_key,
    )

    patch: Dict[str, Any] = {}
    for part in (exec_patch, visibility_patch, growth_patch, growth_commercial_patch, action_patch):
        if isinstance(part, dict) and part:
            patch = _deep_merge(patch, part)

    if not isinstance(patch, dict):
        patch = {}

    # Scrub any placeholder junk strings that slipped through
    if has_junk_output(patch, threshold=2):
        logger.warning("[LLM] final_synthesis patch contains junk strings; scrubbing before merge")
        patch = _scrub_junk_strings(patch)

    logger.warning("[LLM_DEBUG] final_synthesis split raw keys=%s", list(patch.keys()) if isinstance(patch, dict) else None)
    patch = _normalize_final_synthesis_shapes(patch if isinstance(patch, dict) else {})
    combined = _deep_merge(final_report, patch)
    if isinstance(combined, dict):
        es = combined.get("executiveSummary")
        if isinstance(es, dict):
            es["mentorSnapshot"] = _coerce_mentor_snapshot(es.get("mentorSnapshot"))
    combined = _normalize_final_synthesis_shapes(combined)
    combined = validate_with_fallback(
        BusinessGrowthReport,
        combined,
        fallback_data=final_report,
        section_name="final_synthesis_report",
    ).model_dump()
    logger.info("[LLM] build_final_synthesis_with_llm ok")
    return combined


def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")
