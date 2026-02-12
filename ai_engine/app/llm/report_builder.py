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
from app.llm.context_compactor import compact_llm_context, compact_base_report
from app.llm.prompts import (
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    build_user_prompt_reconcile,
    build_user_prompt_estimation_8_10,
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
            llm_patch = call_openai_json(SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=2200)
            if isinstance(llm_patch, dict) and llm_patch:
                cache_repo.upsert_section(cache_key, cache_section, llm_patch)
    else:
        llm_patch = call_openai_json(SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=2200)

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
            llm_json = call_llm_json('openai', SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=1200)
            if isinstance(llm_json, dict) and llm_json:
                cache_repo.upsert_section(cache_key, cache_section, llm_json)
    else:
        llm_json = call_llm_json('openai', SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=1200)

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
