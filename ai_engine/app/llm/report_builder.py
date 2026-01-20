import logging
from datetime import datetime
from typing import Any, Dict

from app.models.report_schema import (
    BusinessGrowthReport,
    CostOptimization,
    TargetMarket,
    FinancialImpact,
)
from app.llm.client import call_openai_json
from app.llm.prompts import (
    SYSTEM_PROMPT_RECONCILE,
    SYSTEM_PROMPT_ESTIMATION_8_10,
    build_user_prompt_reconcile,
    build_user_prompt_estimation_8_10,
)

logger = logging.getLogger(__name__)


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


def build_report_with_llm(base_report: Dict[str, Any], llm_context: Dict[str, Any]) -> Dict[str, Any]:
    """Option B: Multi-step LLM enrichment.

    Step 1) Reconcile contradictions + strengthen narrative in Sections 1–7.
            (Keeps base metrics; fixes false negatives using pageRegistry)

    NOTE: Sections 8–10 are handled separately by build_sections_8_10_with_llm
          when estimationMode=true.
    """
    logger.info("[LLM] build_report_with_llm (reconcile) start")

    prompt = build_user_prompt_reconcile(base_report, llm_context)
    llm_patch = call_openai_json(SYSTEM_PROMPT_RECONCILE, prompt, max_tokens=2200)

    if not isinstance(llm_patch, dict):
        raise RuntimeError("LLM reconcile returned non-object JSON")

    combined = _deep_merge(base_report, llm_patch)

    # Validate with Pydantic (ensures PDF generator shape)
    _ = BusinessGrowthReport.model_validate(combined)
    logger.info("[LLM] build_report_with_llm (reconcile) ok")
    return combined


def build_sections_8_10_with_llm(llm_context: Dict[str, Any]) -> Dict[str, Any]:
    """Generate ONLY Sections 8–10 when estimationMode=true.

    Returns a dict with keys: costOptimization, targetMarket, financialImpact.
    """
    logger.info("[LLM] build_sections_8_10_with_llm start")

    prompt = build_user_prompt_estimation_8_10(llm_context)
    llm_json = call_openai_json(SYSTEM_PROMPT_ESTIMATION_8_10, prompt, max_tokens=2000)

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
