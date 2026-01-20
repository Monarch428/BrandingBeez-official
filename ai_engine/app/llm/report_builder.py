from datetime import datetime
from typing import Any, Dict, List

# from app.models.report_schema import BusinessGrowthReport
from app.llm.client import call_openai_json
# from app.llm.prompts import SYSTEM_PROMPT, build_user_prompt
from app.models.report_schema import (
    BusinessGrowthReport,
    CostOptimization,
    TargetMarket,
    FinancialImpact,
)
from app.llm.prompts import (
    SYSTEM_PROMPT,
    build_user_prompt,
    ESTIMATION_ONLY_SYSTEM_PROMPT,
    build_estimation_only_prompt,
)

def _normalize_scenarios(section: dict) -> dict:
    """
    Accept both:
      scenarios: [ {...}, {...} ]
    and:
      scenarios: { "Conservative": {...}, "Base": {...} }
    Convert dict -> list with scenarioName.
    """
    if not isinstance(section, dict):
        return section
    sc = section.get("scenarios")
    if isinstance(sc, dict):
        out_list = []
        for name, payload in sc.items():
            item = payload if isinstance(payload, dict) else {"notes": str(payload)}
            item = {**item, "scenarioName": name}
            out_list.append(item)
        section["scenarios"] = out_list
    return section


def build_appendices(context: Dict[str, Any]) -> Dict[str, Any]:
    sources = []
    for s in context.get("dataSources", []):
        sources.append({"source": s.get("source"), "use": s.get("use"), "confidence": s.get("confidence")})

    data_gaps = context.get("dataGaps", [])
    return {
        "keywords": [],
        "dataSources": sources,
        "dataGaps": data_gaps,
    }

# def merge_fallback_report(base: Dict[str, Any], llm_json: Dict[str, Any]) -> Dict[str, Any]:
#     # Keep llm sections if present; otherwise fallback
#     out = dict(base)
#     for k, v in llm_json.items():
#         out[k] = v
#     return out

def merge_fallback_report(base: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:
    """
    Template-safe deep merge:
    - Only accepts patch values if the type matches the base template type.
    - Recursively merges dicts.
    - Lists must remain lists (we do not try to coerce list item schemas here).
    - Prevents LLM from breaking schema by overwriting objects with strings etc.
    """
    def _merge(b: Any, p: Any) -> Any:
        # If base is dict, patch must be dict to merge
        if isinstance(b, dict):
            if not isinstance(p, dict):
                return b
            out = dict(b)
            for k, pv in p.items():
                if k not in b:
                    # Allow new keys only if they are dict/list/scalar; but safest is to allow
                    # (your schema allows some optional keys).
                    out[k] = pv
                else:
                    out[k] = _merge(b[k], pv)
            return out

        # If base is list, patch must be list
        if isinstance(b, list):
            if isinstance(p, list):
                return p
            return b

        # Scalars: accept patch only if same type OR base is None
        if b is None:
            return p
        if type(p) is type(b):
            return p

        # Special case: allow int/float interchange
        if isinstance(b, (int, float)) and isinstance(p, (int, float)):
            return p

        return b

    return _merge(base, patch)

def build_report_with_llm(base_report: Dict[str, Any], llm_context: Dict[str, Any]) -> Dict[str, Any]:
    prompt = build_user_prompt(llm_context)
    # llm_json = call_openai_json(SYSTEM_PROMPT, prompt)
    llm_json = call_openai_json(SYSTEM_PROMPT, prompt, max_tokens=5000)
    for k in ("reportMetadata", "seoVisibility", "appendices"):
        llm_json.pop(k, None)

    combined = merge_fallback_report(base_report, llm_json)

    # Validate with Pydantic (ensures PDF generator shape)
    _ = BusinessGrowthReport.model_validate(combined)
    return combined

def build_sections_8_10_with_llm(llm_context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates ONLY sections 8–10:
      - costOptimization
      - targetMarket
      - financialImpact
    """
    prompt = build_estimation_only_prompt(llm_context)
    llm_json = call_openai_json(ESTIMATION_ONLY_SYSTEM_PROMPT, prompt)

    cost_raw = _normalize_scenarios(llm_json.get("costOptimization", {}) or {})
    targ_raw = _normalize_scenarios(llm_json.get("targetMarket", {}) or {})
    fin_raw = _normalize_scenarios(llm_json.get("financialImpact", {}) or {})

    # Validate each section shape (prevents schema mismatch silently breaking merge)
    # cost = CostOptimization.model_validate(llm_json.get("costOptimization", {})).model_dump()
    # targ = TargetMarket.model_validate(llm_json.get("targetMarket", {})).model_dump()
    # fin = FinancialImpact.model_validate(llm_json.get("financialImpact", {})).model_dump()
    cost = CostOptimization.model_validate(cost_raw).model_dump()
    targ = TargetMarket.model_validate(targ_raw).model_dump()
    fin = FinancialImpact.model_validate(fin_raw).model_dump()

    return {
        "costOptimization": cost,
        "targetMarket": targ,
        "financialImpact": fin,
    }

def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")
