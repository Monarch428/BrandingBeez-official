import logging
import hashlib
import time
from datetime import datetime
from typing import Any, Dict

from app.models.report_schema import (
    BusinessGrowthReport,
    CostOptimization,
    TargetMarket,
    FinancialImpact,
)
from app.llm.client import call_llm_json, get_effective_llm_mode, downgrade_llm_mode
from app.llm.context_compactor import compact_llm_context, compact_base_report
from app.llm.report_validation import normalize_llm_output, validate_stage_response_with_fallback, validate_with_fallback
from app.llm.prompts import (
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    SYSTEM_PROMPT_FINAL_SYNTHESIS,
    build_user_prompt_reconcile,
    build_user_prompt_estimation_8_10,
    build_user_prompt_final_synthesis,
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
from app.core.config import settings
from app.utils.currency import build_currency_guidance

logger = logging.getLogger(__name__)

def _ensure_list(x):
    if x is None:
        return []
    if isinstance(x, list):
        return x
    return [x]

def _coerce_mentor_snapshot(v: Any) -> str | None:
    """Ensure executiveSummary.mentorSnapshot is a string (or None).

    LLMs sometimes return an object like {"summary": "..."}; this coerces it.
    """
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
    """Coerce common LLM patch shape mistakes into schema-compliant shapes."""
    if not isinstance(report, dict):
        return report

    report = normalize_llm_output(report)

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

    ap = report.get("actionPlan90Days")
    if isinstance(ap, dict):
        if isinstance(ap.get("weekByWeek"), list):
            report["actionPlan90Days"] = ap["weekByWeek"]
        elif isinstance(ap.get("weeks"), list):
            report["actionPlan90Days"] = ap["weeks"]

    if isinstance(report.get("actionPlan90Days"), list):
        fixed_weeks = []
        for w in report["actionPlan90Days"]:
            if not isinstance(w, dict):
                continue

            if "weekRange" not in w and isinstance(w.get("week"), str):
                w["weekRange"] = w.get("week")
            if "title" not in w and isinstance(w.get("focus"), str):
                w["title"] = w.get("focus")

            if isinstance(w.get("actions"), str):
                w["actions"] = [w["actions"]]
            elif w.get("actions") is None:
                w["actions"] = []

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
                    if isinstance(k, str):
                        fixed_kpis.append({"kpi": k, "current": "N/A", "target": "N/A"})
                    elif isinstance(k, dict):
                        kk = k.get("kpi") or k.get("name") or k.get("metric") or k.get("label") or str(k)
                        fixed_kpis.append({"kpi": str(kk), "current": k.get("current", "N/A"), "target": k.get("target", "N/A")})
                w["kpis"] = fixed_kpis
            else:
                w["kpis"] = []

            fixed_weeks.append(w)

        report["actionPlan90Days"] = fixed_weeks

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
                    advantage_text = (
                        item.get("advantage")
                        or item.get("title")
                        or item.get("text")
                        or item.get("name")
                    )
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
                        if "name" in normalized and isinstance(normalized["name"], str):
                            normalized["channel"] = normalized.pop("name")
                        elif "title" in normalized and isinstance(normalized["title"], str):
                            normalized["channel"] = normalized.pop("title")
                    if isinstance(normalized.get("channel"), str) and normalized["channel"].strip():
                        normalized["channel"] = normalized["channel"].strip()
                        fixed_mh.append(normalized)
            lg["missingHighROIChannels"] = fixed_mh

    return report

def _log_stage_metrics(stage_name: str, started_at: float, metadata: Dict[str, Any] | None) -> None:
    duration_ms = int((time.perf_counter() - started_at) * 1000)
    meta = metadata or {}
    logger.info(
        "[LLM] stage=%s provider=%s model=%s attempts=%s retries=%s duration_ms=%s",
        stage_name,
        meta.get("provider", "unknown"),
        meta.get("model", "unknown"),
        meta.get("attempts", 0),
        meta.get("retries", 0),
        duration_ms,
    )


def _prompt_hash(*parts: str) -> str:
    """Stable hash for caching LLM outputs."""
    joined = "\n\n".join([(p or "").strip() for p in parts])
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()[:16]


def _deep_merge(base: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:
    """Deep merge dict->dict only. Lists/scalars overwrite.

    We use this to apply a JSON PATCH-like object returned by the LLM without
    destroying the existing base report structure.
    """
    out: Dict[str, Any] = dict(base or {})
    for k, v in (patch or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_merge(out[k], v)  # type: ignore[arg-type]
        else:
            out[k] = v
    return out


def _default_estimation_sections() -> Dict[str, Any]:
    return {
        "costOptimization": validate_with_fallback(CostOptimization, {}, section_name="costOptimization_default").model_dump(),
        "targetMarket": validate_with_fallback(TargetMarket, {}, section_name="targetMarket_default").model_dump(),
        "financialImpact": validate_with_fallback(FinancialImpact, {}, section_name="financialImpact_default").model_dump(),
    }


def build_report_with_llm(
    base_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    """Option B: Multi-step LLM enrichment.

    Step 1) Reconcile contradictions + strengthen narrative in Sections 1–7.
            (Keeps base metrics; fixes false negatives using pageRegistry)

    NOTE: Sections 8–10 are handled separately by build_sections_8_10_with_llm
          when estimationMode=true.
    """
    logger.info("[LLM] build_report_with_llm (reconcile) start")
    base_report = normalize_llm_output(base_report)
    base_report = validate_with_fallback(
        BusinessGrowthReport,
        base_report,
        section_name="base_report_input",
    ).model_dump()

    # Mode 1: safe/minimal LLM usage. We skip the reconcile step to avoid
    # request-size / rate-limit issues and continue with the base report.
    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping reconcile; returning base_report")
        return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()

    base_report_c = compact_base_report(base_report)
    llm_context_c = compact_llm_context(llm_context)

    prompt = build_user_prompt_reconcile(base_report_c, llm_context_c)

    # LLM cache (prompt-hash)
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
                llm_patch = call_llm_json(
                    "openai",
                    SYSTEM_PROMPT_RECONCILE,
                    prompt,
                    max_tokens=2200,
                    metadata_out=call_meta,
                )
                _log_stage_metrics("reconcile", stage_started, call_meta)
            except Exception as e:
                _log_stage_metrics("reconcile", stage_started, call_meta)
                downgrade_llm_mode(f"reconcile failed: {e}")
                logger.warning("[LLM] reconcile failed -> returning base_report")
                return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()
            if isinstance(llm_patch, dict) and llm_patch:
                cache_repo.upsert_section(cache_key, cache_section, llm_patch)
    else:
        call_meta = {}
        stage_started = time.perf_counter()
        try:
            llm_patch = call_llm_json(
                "openai",
                SYSTEM_PROMPT_RECONCILE,
                prompt,
                max_tokens=2200,
                metadata_out=call_meta,
            )
            _log_stage_metrics("reconcile", stage_started, call_meta)
        except Exception as e:
            _log_stage_metrics("reconcile", stage_started, call_meta)
            downgrade_llm_mode(f"reconcile failed: {e}")
            logger.warning("[LLM] reconcile failed -> returning base_report")
            return validate_with_fallback(BusinessGrowthReport, base_report, section_name="base_report").model_dump()

    if not isinstance(llm_patch, dict):
        logger.warning("[LLM] reconcile returned non-object JSON; using empty patch")
        llm_patch = {}

    stage_response = validate_stage_response_with_fallback(
        LLMReconcileResponse,
        llm_patch,
        stage_name="reconcile_response",
    )
    llm_patch = map_reconcile_response_to_report_patch(stage_response)
    combined = _normalize_final_synthesis_shapes(_deep_merge(base_report, llm_patch))
    combined = validate_with_fallback(
        BusinessGrowthReport,
        combined,
        fallback_data=base_report,
        section_name="reconciled_report",
    ).model_dump()
    logger.info("[LLM] build_report_with_llm (reconcile) ok")
    return combined


def build_sections_8_10_with_llm(
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    """Generate ONLY Sections 8–10 when estimationMode=true.

    Returns a dict with keys: costOptimization, targetMarket, financialImpact.
    """
    logger.info("[LLM] build_sections_8_10_with_llm start")


    # Inject deterministic currency guidance for Sections 8–10 (no FX conversions).
    # This is scoped to estimation mode only, and does not affect other sections.
    try:
        if isinstance(llm_context, dict) and "currencyGuidance" not in llm_context:
            ui = llm_context.get("userInputs") if isinstance(llm_context.get("userInputs"), dict) else {}
            company_loc = ui.get("location")
            target_market = ui.get("targetMarket")
            llm_context["currencyGuidance"] = build_currency_guidance(company_loc, target_market)
    except Exception:
        logger.exception("[LLM] Failed to build currency guidance; continuing")

    llm_context_c = compact_llm_context(llm_context)
    prompt = build_user_prompt_estimation_8_10(llm_context_c)

    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None
    if use_cache:
        cache_section = f"llm_estimation_8_10:any:{_prompt_hash(SYSTEM_PROMPT_ESTIMATION_8_10, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] build_sections_8_10_with_llm cache HIT")
            llm_json = cached
        else:
            call_meta: Dict[str, Any] = {}
            stage_started = time.perf_counter()
            try:
                provider = 'openai' if int(get_effective_llm_mode()) >= 2 else 'gemini'
                llm_json = call_llm_json(
                    provider,
                    SYSTEM_PROMPT_ESTIMATION_8_10,
                    prompt,
                    max_tokens=1200,
                    metadata_out=call_meta,
                )
                _log_stage_metrics("estimation_8_10", stage_started, call_meta)
            except Exception as e:
                _log_stage_metrics("estimation_8_10", stage_started, call_meta)
                downgrade_llm_mode(f"estimation failed: {e}")
                fallback_meta: Dict[str, Any] = {}
                fallback_started = time.perf_counter()
                try:
                    llm_json = call_llm_json(
                        "gemini",
                        SYSTEM_PROMPT_ESTIMATION_8_10,
                        prompt,
                        max_tokens=900,
                        metadata_out=fallback_meta,
                    )
                    _log_stage_metrics("estimation_8_10:fallback", fallback_started, fallback_meta)
                except Exception as fallback_error:
                    _log_stage_metrics("estimation_8_10:fallback", fallback_started, fallback_meta)
                    logger.warning("[LLM] estimation fallback failed -> returning default sections err=%s", fallback_error)
                    return _default_estimation_sections()
            if isinstance(llm_json, dict) and llm_json:
                cache_repo.upsert_section(cache_key, cache_section, llm_json)
    else:
        call_meta = {}
        stage_started = time.perf_counter()
        try:
            provider = 'openai' if int(get_effective_llm_mode()) >= 2 else 'gemini'
            llm_json = call_llm_json(
                provider,
                SYSTEM_PROMPT_ESTIMATION_8_10,
                prompt,
                max_tokens=1200,
                metadata_out=call_meta,
            )
            _log_stage_metrics("estimation_8_10", stage_started, call_meta)
        except Exception as e:
            _log_stage_metrics("estimation_8_10", stage_started, call_meta)
            downgrade_llm_mode(f"estimation failed: {e}")
            fallback_meta = {}
            fallback_started = time.perf_counter()
            try:
                llm_json = call_llm_json(
                    "gemini",
                    SYSTEM_PROMPT_ESTIMATION_8_10,
                    prompt,
                    max_tokens=900,
                    metadata_out=fallback_meta,
                )
                _log_stage_metrics("estimation_8_10:fallback", fallback_started, fallback_meta)
            except Exception as fallback_error:
                _log_stage_metrics("estimation_8_10:fallback", fallback_started, fallback_meta)
                logger.warning("[LLM] estimation fallback failed -> returning default sections err=%s", fallback_error)
                return _default_estimation_sections()

    if not isinstance(llm_json, dict):
        logger.warning("[LLM] estimation returned non-object JSON; using empty payload")
        llm_json = {}

    stage_response = validate_stage_response_with_fallback(
        LLMSections810Response,
        llm_json,
        stage_name="estimation_8_10_response",
    )
    llm_json = map_sections_8_10_response_to_internal_sections(stage_response)
    cost = validate_with_fallback(
        CostOptimization,
        llm_json.get("costOptimization", {}),
        section_name="costOptimization",
    ).model_dump()
    target = validate_with_fallback(
        TargetMarket,
        llm_json.get("targetMarket", {}),
        section_name="targetMarket",
    ).model_dump()
    impact = validate_with_fallback(
        FinancialImpact,
        llm_json.get("financialImpact", {}),
        section_name="financialImpact",
    ).model_dump()

    logger.info("[LLM] build_sections_8_10_with_llm ok")
    return {
        "costOptimization": cost,
        "targetMarket": target,
        "financialImpact": impact,
    }




def build_final_synthesis_with_llm(
    final_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    """Premium mentor synthesis pass.

    Runs AFTER the report is merged (including Sections 8–10 when enabled),
    to produce sample-like mentor tone for:
    - Section 1 executiveSummary + (optional) score calibration
    - Section 11 actionPlan90Days
    - Notes fields across sections (SEO, cost, market, impact, etc.)
    """
    logger.info("[LLM] build_final_synthesis_with_llm start")
    final_report = normalize_llm_output(final_report)
    final_report = validate_with_fallback(
        BusinessGrowthReport,
        final_report,
        section_name="final_report_input",
    ).model_dump()

    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping final synthesis; returning final_report")
        return validate_with_fallback(BusinessGrowthReport, final_report, section_name="final_report").model_dump()

    rep_c = compact_base_report(final_report)
    ctx_c = compact_llm_context(llm_context)
    prompt = build_user_prompt_final_synthesis(rep_c, ctx_c)

    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None

    if use_cache:
        cache_section = f"llm_final_synthesis:any:{_prompt_hash(SYSTEM_PROMPT_FINAL_SYNTHESIS, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] build_final_synthesis_with_llm cache HIT")
            patch = cached
        else:
            call_meta: Dict[str, Any] = {}
            stage_started = time.perf_counter()
            try:
                patch = call_llm_json(
                    "openai",
                    SYSTEM_PROMPT_FINAL_SYNTHESIS,
                    prompt,
                    max_tokens=2600,
                    metadata_out=call_meta,
                )
                _log_stage_metrics("final_synthesis", stage_started, call_meta)
            except Exception as e:
                _log_stage_metrics("final_synthesis", stage_started, call_meta)
                downgrade_llm_mode(f"final synthesis failed: {e}")
                logger.warning("[LLM] final synthesis failed -> returning final_report")
                return validate_with_fallback(BusinessGrowthReport, final_report, section_name="final_report").model_dump()
            if isinstance(patch, dict) and patch:
                cache_repo.upsert_section(cache_key, cache_section, patch)
    else:
        call_meta = {}
        stage_started = time.perf_counter()
        try:
            patch = call_llm_json(
                "openai",
                SYSTEM_PROMPT_FINAL_SYNTHESIS,
                prompt,
                max_tokens=2600,
                metadata_out=call_meta,
            )
            _log_stage_metrics("final_synthesis", stage_started, call_meta)
        except Exception as e:
            _log_stage_metrics("final_synthesis", stage_started, call_meta)
            downgrade_llm_mode(f"final synthesis failed: {e}")
            logger.warning("[LLM] final synthesis failed -> returning final_report")
            return validate_with_fallback(BusinessGrowthReport, final_report, section_name="final_report").model_dump()

    if not isinstance(patch, dict):
        logger.warning("[LLM] final synthesis returned non-object JSON; using empty patch")
        patch = {}

    stage_response = validate_stage_response_with_fallback(
        LLMFinalSynthesisResponse,
        patch,
        stage_name="final_synthesis_response",
    )
    patch = map_final_synthesis_response_to_report_patch(stage_response)
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
