from datetime import datetime
from typing import Any, Dict, List

from app.models.report_schema import BusinessGrowthReport
from app.llm.client import call_openai_json
from app.llm.prompts import SYSTEM_PROMPT, build_user_prompt

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

def merge_fallback_report(base: Dict[str, Any], llm_json: Dict[str, Any]) -> Dict[str, Any]:
    # Keep llm sections if present; otherwise fallback
    out = dict(base)
    for k, v in llm_json.items():
        out[k] = v
    return out

def build_report_with_llm(base_report: Dict[str, Any], llm_context: Dict[str, Any]) -> Dict[str, Any]:
    prompt = build_user_prompt(llm_context)
    llm_json = call_openai_json(SYSTEM_PROMPT, prompt)

    combined = merge_fallback_report(base_report, llm_json)

    # Validate with Pydantic (ensures PDF generator shape)
    _ = BusinessGrowthReport.model_validate(combined)
    return combined

def now_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%d")
