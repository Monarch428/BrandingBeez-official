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
from app.llm.client import call_openai_json, call_llm_json
from app.llm.client import get_effective_llm_mode, downgrade_llm_mode
from app.llm.context_compactor import compact_llm_context, compact_base_report
from app.llm.prompts import (
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    SYSTEM_PROMPT_FINALIZE,
    build_user_prompt_reconcile,
    build_user_prompt_estimation_8_10,
    build_user_prompt_finalize,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


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


def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")


def _safe_int(x: Any, default: int = 0) -> int:
    try:
        if x is None:
            return default
        return int(float(x))
    except Exception:
        return default


def compute_scorecard(report: Dict[str, Any]) -> Dict[str, Any]:
    """Compute explainable overall/subscores from collected signals.

    This avoids the LLM inventing scores and keeps scoring consistent.
    """
    r = report or {}

    tech = _safe_int(((r.get("websiteDigitalPresence") or {}).get("technicalSEO") or {}).get("score"), 0)
    content = _safe_int(((r.get("websiteDigitalPresence") or {}).get("contentQuality") or {}).get("score"), 0)
    ux = _safe_int(((r.get("websiteDigitalPresence") or {}).get("uxConversion") or {}).get("score"), 0)
    website_score = round((0.4 * tech) + (0.3 * content) + (0.3 * ux))

    da = _safe_int(((r.get("seoVisibility") or {}).get("domainAuthority") or {}).get("score"), 0)
    lq = _safe_int(((r.get("seoVisibility") or {}).get("backlinks") or {}).get("linkQualityScore"), 0)
    seo_score = round((0.6 * da) + (0.4 * lq)) if (da or lq) else round(0.6 * tech + 0.4 * content)

    rep_score = _safe_int(((r.get("reputation") or {}).get("reviewScore")), 0)
    if rep_score <= 5 and rep_score > 0:
        rep_score = round(rep_score * 20)  # normalize 0-5 to 0-100

    lead_magnets = ((r.get("leadGeneration") or {}).get("leadMagnets") or [])
    channels = ((r.get("leadGeneration") or {}).get("channels") or [])
    lead_score = 20
    if isinstance(channels, list) and len(channels) >= 3:
        lead_score += 40
    elif isinstance(channels, list) and len(channels) >= 1:
        lead_score += 25
    if isinstance(lead_magnets, list) and len(lead_magnets) >= 1:
        lead_score += 25
    lead_score = min(100, lead_score)

    services = ((r.get("servicesPositioning") or {}).get("services") or [])
    services_score = 25
    if isinstance(services, list) and len(services) >= 6:
        services_score = 85
    elif isinstance(services, list) and len(services) >= 3:
        services_score = 65
    elif isinstance(services, list) and len(services) >= 1:
        services_score = 50

    subs = {
        "website": int(website_score),
        "seo": int(seo_score),
        "reputation": int(rep_score) if rep_score else None,
        "leadGen": int(lead_score),
        "services": int(services_score),
    }

    # Weighted overall: website 35, seo 25, reputation 15, leadgen 15, services 10
    rep_w = 0.15 if subs.get("reputation") is not None else 0.0
    total_w = 0.35 + 0.25 + rep_w + 0.15 + 0.10
    overall = (
        0.35 * subs["website"]
        + 0.25 * subs["seo"]
        + (rep_w * (subs.get("reputation") or 0))
        + 0.15 * subs["leadGen"]
        + 0.10 * subs["services"]
    ) / max(0.01, total_w)
    overall = int(round(min(100, max(1, overall))))
    return {"overallScore": overall, "subScores": subs}


def finalize_exec_summary_and_action_plan_with_llm(
    merged_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any | None = None,
    cache_key: str | None = None,
) -> Dict[str, Any]:
    """Generate executiveSummary + actionPlan90Days AFTER all data is merged.

    This makes summary + 90-day plan consistent with ALL collected signals.
    """
    logger.info("[LLM] finalize_exec_summary_and_action_plan_with_llm start")

    # Always compute scorecard deterministically first
    scorecard = compute_scorecard(merged_report)
    try:
        merged_report.setdefault("reportMetadata", {})
        merged_report["reportMetadata"]["overallScore"] = scorecard["overallScore"]
        merged_report["reportMetadata"].setdefault("subScores", {})
        for k, v in scorecard["subScores"].items():
            if v is None:
                continue
            merged_report["reportMetadata"]["subScores"][k] = v
    except Exception:
        pass

    # If mode 1, skip extra finalize LLM calls (avoid token/rate issues)
    if int(get_effective_llm_mode()) <= 1:
        logger.warning("[LLM] LLM_MODE=1 -> skipping finalize; returning merged_report")
        _ = BusinessGrowthReport.model_validate(merged_report)
        return merged_report

    # Compact inputs
    rep_c = compact_base_report(merged_report)
    ctx_c = compact_llm_context(llm_context)
    prompt = build_user_prompt_finalize(rep_c, ctx_c)

    cache_ttl = int(getattr(settings, "LLM_CACHE_TTL_DAYS", 30))
    use_cache = bool(getattr(settings, "LLM_CACHE_ENABLED", True)) and bool(cache_repo) and bool(cache_key)
    cache_section = None

    if use_cache:
        cache_section = f"llm_finalize:{settings.OPENAI_MODEL}:{_prompt_hash(SYSTEM_PROMPT_FINALIZE, prompt)}"
        cached = cache_repo.get_section_if_fresh(cache_key, cache_section, ttl_days=cache_ttl)
        if isinstance(cached, dict) and cached:
            logger.info("[LLM] finalize cache HIT")
            llm_patch = cached
        else:
            try:
                llm_patch = call_openai_json(SYSTEM_PROMPT_FINALIZE, prompt, max_tokens=1800)
            except Exception as e:
                downgrade_llm_mode(f"finalize failed: {e}")
                _ = BusinessGrowthReport.model_validate(merged_report)
                return merged_report
            if isinstance(llm_patch, dict) and llm_patch:
                cache_repo.upsert_section(cache_key, cache_section, llm_patch)
    else:
        try:
            llm_patch = call_openai_json(SYSTEM_PROMPT_FINALIZE, prompt, max_tokens=1800)
        except Exception as e:
            downgrade_llm_mode(f"finalize failed: {e}")
            _ = BusinessGrowthReport.model_validate(merged_report)
            return merged_report

    if not isinstance(llm_patch, dict):
        raise RuntimeError("LLM finalize returned non-object JSON")

    combined = _deep_merge(merged_report, llm_patch)
    _ = BusinessGrowthReport.model_validate(combined)
    logger.info("[LLM] finalize_exec_summary_and_action_plan_with_llm ok")
    return combined
