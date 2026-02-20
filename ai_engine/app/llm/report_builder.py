import logging
import hashlib
from datetime import datetime
from typing import Any, Dict

from app.models.report_schema import (
    BusinessGrowthReport,
    CostOptimization,
    TargetMarket,
    FinancialImpact,
)
from app.llm.client import call_openai_json, call_llm_json, get_effective_llm_mode, downgrade_llm_mode
from app.llm.context_compactor import compact_llm_context, compact_base_report
from app.llm.prompts import (
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    SYSTEM_PROMPT_FINAL_SYNTHESIS,
    build_user_prompt_reconcile,
    build_user_prompt_estimation_8_10,
    build_user_prompt_final_synthesis,
)
from app.core.config import settings
from pydantic import ValidationError

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



def _normalize_final_synthesis_shapes(report: dict) -> dict:
    """Coerce common LLM patch shape mistakes into schema-compliant shapes."""
    if not isinstance(report, dict):
        return report

    # 1) servicesPositioning.serviceGaps: allow ["Content Marketing"] -> [{"service":"Content Marketing"}]
    sp = report.get("servicesPositioning")
    if isinstance(sp, dict):
        gaps = sp.get("serviceGaps")
        if isinstance(gaps, list):
            fixed = []
            for row in gaps:
                if isinstance(row, str):
                    fixed.append({"service": row})
                elif isinstance(row, dict):
                    # if model returns {"gap": "..."} etc, try map to service
                    if "service" not in row:
                        if "gap" in row and isinstance(row["gap"], str):
                            row["service"] = row.pop("gap")
                    fixed.append(row)
            sp["serviceGaps"] = fixed

    # 2) actionPlan90Days: allow {"weekByWeek":[...]} -> [...]
    ap = report.get("actionPlan90Days")
    if isinstance(ap, dict):
        if isinstance(ap.get("weekByWeek"), list):
            report["actionPlan90Days"] = ap["weekByWeek"]
        elif isinstance(ap.get("weeks"), list):
            report["actionPlan90Days"] = ap["weeks"]

    # Ensure actionPlan90Days week entries are schema-compliant
    if isinstance(report.get("actionPlan90Days"), list):
        fixed_weeks = []
        for w in report["actionPlan90Days"]:
            if not isinstance(w, dict):
                continue
    
            # Common model aliases
            if "weekRange" not in w and isinstance(w.get("week"), str):
                w["weekRange"] = w.get("week")
            if "title" not in w and isinstance(w.get("focus"), str):
                w["title"] = w.get("focus")
    
            # actions must be a list
            if isinstance(w.get("actions"), str):
                w["actions"] = [w["actions"]]
            elif w.get("actions") is None:
                w["actions"] = []
    
            # kpis must be a list[object]; allow strings -> {kpi,current,target}
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
    # 3) competitiveAdvantages.advantages: allow [{"advantage":"..."}] -> ["..."]
    ca = report.get("competitiveAdvantages")
    if isinstance(ca, dict):
        adv = ca.get("advantages")
        if isinstance(adv, list):
            fixed = []
            for a in adv:
                if isinstance(a, str):
                    fixed.append(a)
                elif isinstance(a, dict):
                    fixed.append(
                        a.get("advantage")
                        or a.get("title")
                        or a.get("text")
                        or str(a)
                    )
            ca["advantages"] = fixed

    # 4) appendices.dataGaps[].missing/howToEnable must be list
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

    # 3) leadGeneration.missingHighROIChannels: allow string/list-of-strings -> list[MissingChannel]
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
                    # accept common aliases
                    if "channel" not in item:
                        if "name" in item and isinstance(item["name"], str):
                            item["channel"] = item.pop("name")
                        elif "title" in item and isinstance(item["title"], str):
                            item["channel"] = item.pop("title")
                    fixed_mh.append(item)
            lg["missingHighROIChannels"] = fixed_mh
        elif mh is None:
            # keep as-is (schema allows empty list / missing)
            pass

    return report

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

    # Mode 1: safe/minimal LLM usage. We skip the reconcile step to avoid
    # request-size / rate-limit issues and continue with the base report.
    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping reconcile; returning base_report")
        _ = BusinessGrowthReport.model_validate(base_report)
        return base_report

    base_report_c = compact_base_report(base_report)
    llm_context_c = compact_llm_context(llm_context)

    prompt = build_user_prompt_reconcile(base_report_c, llm_context_c)

    # LLM cache (prompt-hash)
    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None
    if use_cache:
        cache_section = f"llm_reconcile:{settings.OPENAI_MODEL}:{_prompt_hash(SYSTEM_PROMPT_RECONCILE, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] build_report_with_llm (reconcile) cache HIT")
            llm_patch = cached
        else:
            try:
                llm_patch = call_openai_json(SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=2200)
            except Exception as e:
                # Downgrade and continue (Mode 1)
                downgrade_llm_mode(f"reconcile failed: {e}")
                logger.warning("[LLM] reconcile failed -> returning base_report")
                _ = BusinessGrowthReport.model_validate(base_report)
                return base_report
            if isinstance(llm_patch, dict) and llm_patch:
                cache_repo.upsert_section(cache_key, cache_section, llm_patch)
    else:
        try:
            llm_patch = call_openai_json(SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=2200)
        except Exception as e:
            downgrade_llm_mode(f"reconcile failed: {e}")
            logger.warning("[LLM] reconcile failed -> returning base_report")
            _ = BusinessGrowthReport.model_validate(base_report)
            return base_report

    if not isinstance(llm_patch, dict):
        raise RuntimeError("LLM reconcile returned non-object JSON")

    combined = _deep_merge(base_report, llm_patch)

    # Validate with Pydantic (ensures PDF generator shape)
    _ = BusinessGrowthReport.model_validate(combined)
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
            try:
                provider = 'openai' if int(get_effective_llm_mode()) >= 2 else 'gemini'
                llm_json = call_llm_json(provider, SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=1200)
            except Exception as e:
                # Downgrade and retry once with Gemini in mode 1
                downgrade_llm_mode(f"estimation failed: {e}")
                llm_json = call_llm_json('gemini', SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=900)
            if isinstance(llm_json, dict) and llm_json:
                cache_repo.upsert_section(cache_key, cache_section, llm_json)
    else:
        try:
            provider = 'openai' if int(get_effective_llm_mode()) >= 2 else 'gemini'
            llm_json = call_llm_json(provider, SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=1200)
        except Exception as e:
            downgrade_llm_mode(f"estimation failed: {e}")
            llm_json = call_llm_json('gemini', SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=900)

    if not isinstance(llm_json, dict):
        raise RuntimeError("LLM estimation returned non-object JSON")

    # Validate the three sub-models (helps catch scenarios list/dict mistakes)
    cost = CostOptimization.model_validate(llm_json.get("costOptimization", {})).model_dump()
    target = TargetMarket.model_validate(llm_json.get("targetMarket", {})).model_dump()
    impact = FinancialImpact.model_validate(llm_json.get("financialImpact", {})).model_dump()

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

    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping final synthesis; returning final_report")
        _ = BusinessGrowthReport.model_validate(final_report)
        return final_report

    rep_c = compact_base_report(final_report)
    ctx_c = compact_llm_context(llm_context)
    prompt = build_user_prompt_final_synthesis(rep_c, ctx_c)

    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None

    if use_cache:
        cache_section = f"llm_final_synthesis:{settings.OPENAI_MODEL}:{_prompt_hash(SYSTEM_PROMPT_FINAL_SYNTHESIS, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] build_final_synthesis_with_llm cache HIT")
            patch = cached
        else:
            try:
                patch = call_openai_json(SYSTEM_PROMPT_FINAL_SYNTHESIS, prompt, max_tokens=2600)
            except Exception as e:
                downgrade_llm_mode(f"final synthesis failed: {e}")
                logger.warning("[LLM] final synthesis failed -> returning final_report")
                _ = BusinessGrowthReport.model_validate(final_report)
                return final_report
            if isinstance(patch, dict) and patch:
                cache_repo.upsert_section(cache_key, cache_section, patch)
    else:
        try:
            patch = call_openai_json(SYSTEM_PROMPT_FINAL_SYNTHESIS, prompt, max_tokens=2600)
        except Exception as e:
            downgrade_llm_mode(f"final synthesis failed: {e}")
            logger.warning("[LLM] final synthesis failed -> returning final_report")
            _ = BusinessGrowthReport.model_validate(final_report)
            return final_report

    if not isinstance(patch, dict):
        raise RuntimeError("LLM final synthesis returned non-object JSON")

    combined = _deep_merge(final_report, patch)

    # Coerce mentorSnapshot into a plain string (LLM sometimes returns an object)
    if isinstance(combined, dict):
        es = combined.get("executiveSummary")
        if isinstance(es, dict):
            es["mentorSnapshot"] = _coerce_mentor_snapshot(es.get("mentorSnapshot"))
    try:
        _ = BusinessGrowthReport.model_validate(combined)
    except ValidationError:
        combined = _normalize_final_synthesis_shapes(combined)
        _ = BusinessGrowthReport.model_validate(combined)
    logger.info("[LLM] build_final_synthesis_with_llm ok")
    return combined
def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")