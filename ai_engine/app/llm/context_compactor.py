from __future__ import annotations

from typing import Any, Dict, List


def _cap_list(items: Any, limit: int) -> Any:
    if isinstance(items, list):
        return items[:limit]
    return items


def compact_llm_context(ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Reduce prompt payload size while keeping high-signal evidence.

    This prevents token overflow which often leads to truncated JSON (missing later sections).
    """
    if not isinstance(ctx, dict):
        return {}

    out: Dict[str, Any] = {}

    # keep high-level blocks
    for k in [
        "homepage",
        "robotsSitemap",
        "pagespeed",
        "services",
        "leadgen",
        "websiteSignals",
        "seoSignals",
        "reputationSignals",
        "dataforseo",
        "uiux",
        "estimationMode",
        "estimationInputs",
    ]:
        if k in ctx:
            out[k] = ctx.get(k)

    # pageRegistry can be huge; keep only summaries
    pr = ctx.get("pageRegistry")
    if isinstance(pr, dict):
        out["pageRegistry"] = {
            "summary": pr.get("summary"),
            "byType": _cap_list(pr.get("byType"), 50),
            "keyPages": _cap_list(pr.get("keyPages"), 30),
        }

    # competitors/reviews can be large; cap
    comps = ctx.get("competitors")
    if isinstance(comps, list):
        out["competitors"] = comps[:10]

    return out


def compact_base_report(report: Dict[str, Any]) -> Dict[str, Any]:
    """Trim base_report before sending to reconcile prompt."""
    if not isinstance(report, dict):
        return {}
    out = dict(report)

    # appendices can get huge; keep short
    appx = out.get("appendices")
    if isinstance(appx, dict):
        out["appendices"] = {
            "dataSources": _cap_list(appx.get("dataSources"), 20),
            "dataGaps": _cap_list(appx.get("dataGaps"), 20),
            "evidence": _cap_list(appx.get("evidence"), 20),
        }
    return out
