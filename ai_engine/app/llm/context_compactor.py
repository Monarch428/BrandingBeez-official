"""
context_compactor.py — v2 (anti-truncation edition)

Every public function that feeds a stage must produce context small enough
that prompt + context + expected output comfortably fits within Gemini's
3200-token output limit.

Target budgets (chars):
  system_prompt      ≤ 800
  user_prompt_prefix ≤ 400
  context_json       ≤ 3500   ← this file controls this
  report_slice_json  ≤ 3000   ← this file controls this
  ─────────────────────────
  Total              ≤ 7700 chars  (~1900 tokens input, leaving ≥1300 for output)

For estimation stages (cost_optimization / target_market / financial_impact)
the context budget is even tighter: ≤ 3000 chars total prompt.
"""
from __future__ import annotations

from typing import Any, Dict, List

# Keys that are always dropped (binary/HTML blobs)
_DROP_KEYS = {
    "html", "raw_html", "rawHtml", "raw", "body", "document", "dom", "nodes",
    "screenshot", "screenshots", "screenshotBase64", "imageBase64", "base64",
    "fullText", "pageText", "innerText", "markdown", "contentHtml",
    "content_html", "renderedHtml", "rendered_html", "page_content", "pageContent",
}

_TRIM_TEXT_KEYS = {
    "text", "content", "excerpt", "summary", "description",
    "metaDescription", "meta_description", "h1", "title",
}


# ─────────────────────────────────────────────────────────────────────────────
# Core shrink helpers
# ─────────────────────────────────────────────────────────────────────────────

def _cap_list(items: Any, limit: int) -> Any:
    return items[:limit] if isinstance(items, list) else items


def _cap_str(s: Any, limit: int) -> Any:
    if isinstance(s, str) and len(s) > limit:
        return s[:limit] + "…"
    return s


def _pick(obj: Any, keys: List[str]) -> Dict[str, Any]:
    if not isinstance(obj, dict):
        return {}
    return {k: obj[k] for k in keys if k in obj}


def _shrink(
    obj: Any,
    *,
    max_str: int = 200,
    max_list: int = 6,
    max_dict_keys: int = 20,
    depth: int = 0,
    max_depth: int = 4,
) -> Any:
    if depth > max_depth:
        if isinstance(obj, str):
            return _cap_str(obj, min(120, max_str))
        if isinstance(obj, (int, float, bool)) or obj is None:
            return obj
        if isinstance(obj, list):
            return [_shrink(v, max_str=max_str, max_list=2, max_dict_keys=6,
                            depth=depth + 1, max_depth=max_depth) for v in obj[:2]]
        if isinstance(obj, dict):
            out: Dict[str, Any] = {}
            for i, (k, v) in enumerate(obj.items()):
                if i >= 4:
                    break
                if k in _DROP_KEYS:
                    continue
                out[k] = _shrink(v, max_str=max_str, max_list=2, max_dict_keys=6,
                                  depth=depth + 1, max_depth=max_depth)
            return out
        return str(obj)[:100]

    if isinstance(obj, str):
        return _cap_str(obj, max_str)
    if isinstance(obj, list):
        return [_shrink(v, max_str=max_str, max_list=max_list,
                        max_dict_keys=max_dict_keys, depth=depth + 1,
                        max_depth=max_depth) for v in obj[:max_list]]
    if isinstance(obj, dict):
        out = {}
        for i, k in enumerate(list(obj.keys())[:max_dict_keys]):
            if k in _DROP_KEYS:
                continue
            v = obj.get(k)
            if k in _TRIM_TEXT_KEYS:
                v = _cap_str(v, min(max_str, 160))
            out[k] = _shrink(v, max_str=max_str, max_list=max_list,
                              max_dict_keys=max_dict_keys, depth=depth + 1,
                              max_depth=max_depth)
        return out
    return obj


# ─────────────────────────────────────────────────────────────────────────────
# Domain-object summarisers  (each deliberately tiny)
# ─────────────────────────────────────────────────────────────────────────────

def _summarize_homepage(home: Any) -> Any:
    return _shrink(
        _pick(home, ["url", "title", "metaDescription", "h1", "summary"]),
        max_str=120, max_list=4, max_dict_keys=8,
    )


def _summarize_reviews(rep: Any) -> Any:
    if not isinstance(rep, dict):
        return rep
    keep = _pick(rep, ["averageRating", "avgRating", "rating", "reviewCount",
                        "totalReviews", "source", "sources", "platforms", "summary"])
    snippets = rep.get("snippets") or rep.get("topReviews") or rep.get("reviews")
    if isinstance(snippets, list):
        keep["snippets"] = [_cap_str(x, 80) for x in snippets[:3]]
    return _shrink(keep, max_str=100, max_list=4, max_dict_keys=12)


def _summarize_dataforseo(dfs: Any) -> Any:
    if not isinstance(dfs, dict):
        return dfs
    keep = _pick(dfs, ["domain", "visibility", "summary", "topKeywords", "topCompetitors"])
    if isinstance(keep.get("topKeywords"), list):
        keep["topKeywords"] = keep["topKeywords"][:5]
    if isinstance(keep.get("topCompetitors"), list):
        keep["topCompetitors"] = keep["topCompetitors"][:4]
    return _shrink(keep, max_str=100, max_list=5, max_dict_keys=12)


def _summarize_page_registry(pr: Any) -> Dict[str, Any]:
    if not isinstance(pr, dict):
        return {}
    pages = pr.get("pages") if isinstance(pr.get("pages"), dict) else {}
    all_urls = pr.get("allUrls") if isinstance(pr.get("allUrls"), list) else []
    return _shrink(
        {
            "missing": _cap_list(pr.get("missing"), 5),
            "pages": _pick(pages, ["about", "contact", "services", "pricing"]),
            "urlCount": len(all_urls),
        },
        max_str=100, max_list=5, max_dict_keys=10,
    )


def _summarize_market_demand(md: Any) -> Any:
    if not isinstance(md, dict):
        return md
    keep = _pick(md, ["summary", "topQueries", "topServices", "keywords"])
    if isinstance(keep.get("keywords"), list):
        keep["keywords"] = keep["keywords"][:5]
    return _shrink(keep, max_str=100, max_list=5, max_dict_keys=12)


def _summarize_business_profile(bp: Any) -> Any:
    if not isinstance(bp, dict):
        return bp
    return _shrink(
        _pick(bp, ["businessModel", "buyerType", "salesMotion", "primaryGrowthMotion",
                   "offerType", "serviceNames", "countriesServed"]),
        max_str=100, max_list=5, max_dict_keys=12,
    )


def _summarize_section_contexts(sc: Any, keys: List[str] | None = None) -> Any:
    if not isinstance(sc, dict):
        return {}
    target_keys = keys or list(sc.keys())
    out: Dict[str, Any] = {}
    for key in target_keys:
        value = sc.get(key)
        if not isinstance(value, dict):
            continue
        out[key] = _pick(value, ["businessLens", "relevance"])
    return _shrink(out, max_str=80, max_list=3, max_dict_keys=12)


def _limit_items_with_selected_fields(
    items: Any, *, max_items: int, allowed_fields: List[str], max_str: int = 100
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    if not isinstance(items, list):
        return out
    for item in items[:max_items]:
        if not isinstance(item, dict):
            continue
        row = {f: _cap_str(item.get(f), max_str)
               for f in allowed_fields if f in item and item.get(f) not in (None, "", [], {})}
        if row:
            out.append(row)
    return out


def _compact_section_context(value: Any) -> Dict[str, Any]:
    value = value if isinstance(value, dict) else {}
    return _shrink(
        _pick(value, ["businessLens", "relevance"]),
        max_str=80, max_list=2, max_dict_keys=6, max_depth=2,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Stage-specific report slices  (what gets sent as "current report" context)
# Each slice is kept to the minimum fields each stage actually needs.
# ─────────────────────────────────────────────────────────────────────────────

def _compact_report_subset_for_stage(report: Dict[str, Any], stage_name: str) -> Dict[str, Any]:
    report = report if isinstance(report, dict) else {}

    if stage_name == "reconcile":
        subset = {
            "reportMetadata": _pick(report.get("reportMetadata"), ["overallScore", "companyName", "website"]),
            "executiveSummary": _pick(report.get("executiveSummary"), ["biggestOpportunity", "strengths", "weaknesses"]),
            "servicesPositioning": _pick(report.get("servicesPositioning"), ["services", "serviceGaps"]),
            "leadGeneration": _pick(report.get("leadGeneration"), ["channels", "missingHighROIChannels"]),
            "competitiveAdvantages": _pick(report.get("competitiveAdvantages"), ["advantages"]),
        }
        return _shrink(subset, max_str=90, max_list=3, max_dict_keys=8, max_depth=3)

    if stage_name == "final_exec_summary":
        subset = {
            "executiveSummary": _pick(report.get("executiveSummary"),
                                      ["biggestOpportunity", "mentorSnapshot", "strengths", "weaknesses", "quickWins"]),
            "seoVisibility": _pick(report.get("seoVisibility"), ["domainAuthority", "keywordGaps"]),
            "reputation": _pick(report.get("reputation"), ["reviewScore", "totalReviews"]),
            "financialImpact": _pick(report.get("financialImpact"), ["summary", "currentRevenueEstimate"]),
        }
        return _shrink(subset, max_str=90, max_list=3, max_dict_keys=8, max_depth=3)

    if stage_name == "final_visibility_patch":
        subset = {
            "websiteDigitalPresence": _pick(report.get("websiteDigitalPresence"),
                                            ["contentGaps", "highPriorityFixes"]),
            "seoVisibility": _pick(report.get("seoVisibility"),
                                   ["domainAuthority", "keywordGaps", "opportunities"]),
            "reputation": _pick(report.get("reputation"),
                                ["reviewScore", "totalReviews", "platforms"]),
        }
        return _shrink(subset, max_str=90, max_list=3, max_dict_keys=8, max_depth=3)

    if stage_name == "final_growth_patch":
        subset = {
            "servicesPositioning": _pick(report.get("servicesPositioning"),
                                         ["services", "serviceGaps"]),
            "leadGeneration": _pick(report.get("leadGeneration"),
                                    ["channels", "missingHighROIChannels"]),
            "competitiveAdvantages": _pick(report.get("competitiveAdvantages"), ["advantages"]),
        }
        return _shrink(subset, max_str=90, max_list=3, max_dict_keys=8, max_depth=3)

    if stage_name == "final_growth_commercial_patch":
        # Minimal slice — this stage only writes notes strings
        subset = {
            "costOptimization": _pick(report.get("costOptimization"), ["mentorNotes"]),
            "targetMarket": _pick(report.get("targetMarket"), ["mentorNotes"]),
            "financialImpact": _pick(report.get("financialImpact"), ["mentorNotes", "summary"]),
        }
        return _shrink(subset, max_str=120, max_list=2, max_dict_keys=6, max_depth=2)

    if stage_name == "final_actionplan_patch":
        subset = {
            "executiveSummary": _pick(report.get("executiveSummary"), ["biggestOpportunity", "quickWins"]),
            "websiteDigitalPresence": _pick(report.get("websiteDigitalPresence"), ["highPriorityFixes"]),
            "servicesPositioning": _pick(report.get("servicesPositioning"), ["serviceGaps"]),
            "leadGeneration": _pick(report.get("leadGeneration"), ["missingHighROIChannels"]),
            "costOptimization": _pick(report.get("costOptimization"), ["actionCandidates"]),
            "targetMarket": _pick(report.get("targetMarket"), ["actionCandidates"]),
        }
        return _shrink(subset, max_str=80, max_list=3, max_dict_keys=8, max_depth=3)

    return compact_base_report(report)


# ─────────────────────────────────────────────────────────────────────────────
# Public stage-context compactors
# ─────────────────────────────────────────────────────────────────────────────

def compact_llm_context(ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Full compact — used as base for all per-stage compactors."""
    if not isinstance(ctx, dict):
        return {}

    out: Dict[str, Any] = {}

    for k in ["companyName", "website", "estimationMode", "currencyGuidance"]:
        if k in ctx:
            out[k] = _shrink(ctx.get(k), max_str=100, max_list=4, max_dict_keys=12)

    # userInputs / estimationInputs — keep but trim aggressively
    for k in ["estimationInputs", "userInputs"]:
        if k in ctx:
            out[k] = _shrink(ctx.get(k), max_str=120, max_list=5, max_dict_keys=16)

    if "homepage" in ctx:
        out["homepage"] = _summarize_homepage(ctx["homepage"])
    if "pagespeed" in ctx:
        out["pagespeed"] = _shrink(
            _pick(ctx["pagespeed"], ["mobile", "desktop", "summary"]),
            max_str=100, max_list=4, max_dict_keys=10,
        )
    if "servicesSignals" in ctx:
        out["servicesSignals"] = _shrink(ctx["servicesSignals"],
                                         max_str=100, max_list=5, max_dict_keys=14)
    if "leadGenSignals" in ctx:
        out["leadGenSignals"] = _shrink(ctx["leadGenSignals"],
                                        max_str=100, max_list=5, max_dict_keys=14)
    if "websiteSignals" in ctx:
        out["websiteSignals"] = _shrink(ctx["websiteSignals"],
                                        max_str=100, max_list=4, max_dict_keys=12)
    if "seoSignals" in ctx:
        out["seoSignals"] = _shrink(ctx["seoSignals"],
                                    max_str=100, max_list=4, max_dict_keys=12)
    if "reputationSignals" in ctx:
        out["reputationSignals"] = _summarize_reviews(ctx["reputationSignals"])
    if "dataforseo" in ctx:
        out["dataforseo"] = _summarize_dataforseo(ctx["dataforseo"])
    if "pageRegistry" in ctx:
        out["pageRegistry"] = _summarize_page_registry(ctx["pageRegistry"])
    if "businessProfile" in ctx:
        out["businessProfile"] = _summarize_business_profile(ctx["businessProfile"])
    if "marketDemand" in ctx:
        out["marketDemand"] = _summarize_market_demand(ctx["marketDemand"])
    if "sectionContexts" in ctx:
        out["sectionContexts"] = _summarize_section_contexts(ctx["sectionContexts"])
    # Drop llmSequentialFlow — too noisy and not needed by LLM
    return out


def compact_base_report(report: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(report, dict):
        return {}
    out = _shrink(report, max_str=140, max_list=4, max_dict_keys=18)
    appx = out.get("appendices")
    if isinstance(appx, dict):
        out["appendices"] = {
            "dataSources": _cap_list(appx.get("dataSources"), 5),
            "dataGaps": _cap_list(appx.get("dataGaps"), 5),
        }
    return out


def compact_reconcile_context(ctx: Dict[str, Any]) -> Dict[str, Any]:
    base = compact_llm_context(ctx)
    out: Dict[str, Any] = {
        "companyName": base.get("companyName"),
        "website": base.get("website"),
        "homepage": _shrink(base.get("homepage"), max_str=70, max_list=3, max_dict_keys=6, max_depth=2),
        "pageRegistry": _shrink(base.get("pageRegistry"), max_str=70, max_list=3, max_dict_keys=6, max_depth=2),
        "servicesSignals": _shrink(
            _pick(base.get("servicesSignals"), ["services", "serviceCandidates"]),
            max_str=70, max_list=3, max_dict_keys=6, max_depth=2,
        ),
        "leadGenSignals": _shrink(
            _pick(base.get("leadGenSignals"), ["channels", "missingHighROIChannels"]),
            max_str=70, max_list=3, max_dict_keys=6, max_depth=2,
        ),
        "seoSignals": _shrink(
            _pick(base.get("seoSignals"), ["domainAuthority", "keywordGaps"]),
            max_str=70, max_list=3, max_dict_keys=6, max_depth=2,
        ),
        "reputationSignals": _shrink(
            _pick(base.get("reputationSignals"), ["reviewScore", "totalReviews", "platforms"]),
            max_str=70, max_list=3, max_dict_keys=6, max_depth=2,
        ),
        "businessProfile": _shrink(base.get("businessProfile"), max_str=70, max_list=3,
                                   max_dict_keys=6, max_depth=2),
    }
    return {k: v for k, v in out.items() if v not in (None, {}, [], "")}


def compact_estimation_context(ctx: Dict[str, Any], section_name: str) -> Dict[str, Any]:
    """
    Estimation stage context — absolute minimum.
    The new prompts use _mini_ctx() directly so this only needs to provide
    the financial anchors + business profile.
    Target: ≤ 800 chars total serialized JSON.
    """
    if not isinstance(ctx, dict):
        return {}

    ei = ctx.get("estimationInputs") or {}
    ui = ctx.get("userInputs") or {}
    bp = ctx.get("businessProfile") or {}

    # Pull financial values from whichever source has them
    fin_keys = ["monthlyRevenue", "monthlyLeads", "closeRate", "avgDealValue",
                "monthlyAdSpend", "teamSize", "currency", "location", "targetMarket",
                "monthlyPayrollCost", "monthlyToolsCost"]
    financials = {}
    for k in fin_keys:
        v = ei.get(k) or ui.get(k)
        if v is not None:
            financials[k] = v

    out: Dict[str, Any] = {
        "companyName": ctx.get("companyName", ""),
        "estimationMode": ctx.get("estimationMode", True),
        "businessModel": bp.get("businessModel", "service_business"),
        "serviceNames": (bp.get("serviceNames") or [])[:3],
        "financials": financials,
    }

    # Add currency only if present
    cg = ctx.get("currencyGuidance")
    if isinstance(cg, dict):
        cc = cg.get("companyCurrency") or {}
        sym = cc.get("symbol") or cg.get("symbol")
        code = cc.get("code") or cg.get("code")
        if sym or code:
            out["currency"] = {"symbol": sym, "code": code}

    # Market demand for target_market and financial_impact
    if section_name in ("targetMarket", "target_market", "financialImpact", "financial_impact"):
        md = ctx.get("marketDemand") or {}
        if isinstance(md, dict):
            summary = md.get("summary")
            if isinstance(summary, dict):
                top_opps = (summary.get("topOpportunities") or [])[:2]
                if top_opps:
                    out["marketOpportunities"] = top_opps
            elif isinstance(summary, str) and summary:
                out["marketSummary"] = summary[:120]

    # Services for cost_optimization
    if section_name in ("costOptimization", "cost_optimization"):
        ss = ctx.get("servicesSignals") or {}
        if isinstance(ss, dict):
            svcs = ss.get("services") or []
            out["services"] = [
                s.get("name", "") if isinstance(s, dict) else str(s)
                for s in svcs[:3]
            ]

    return out


def compact_final_context(ctx: Dict[str, Any], stage_name: str) -> Dict[str, Any]:
    """
    Final synthesis stage context — tight per-stage slices.
    For visibility/actionplan stages we return only the bare minimum
    so that prompt + context stays well under 2000 chars total.
    """
    base = compact_llm_context(ctx)

    # Common minimal fields for all final stages
    common: Dict[str, Any] = {
        "companyName": base.get("companyName"),
        "website": base.get("website"),
        "businessModel": (base.get("businessProfile") or {}).get("businessModel", ""),
    }

    if stage_name == "final_exec_summary":
        common["seoDA"] = (base.get("seoSignals") or {}).get("domainAuthority", 0)
        common["reviewScore"] = (base.get("reputationSignals") or {}).get("averageRating") or (base.get("reputationSignals") or {}).get("rating", 0)
        common["reviewCount"] = (base.get("reputationSignals") or {}).get("totalReviews") or (base.get("reputationSignals") or {}).get("reviewCount", 0)
        common["targetMarket"] = ((base.get("businessProfile") or {}).get("targetMarket") or "")[:80]
        common["buyerType"] = ((base.get("businessProfile") or {}).get("buyerType") or "")[:40]

    elif stage_name == "final_visibility_patch":
        # Only pass scalar signals — no large objects
        seo = base.get("seoSignals") or {}
        rep = base.get("reputationSignals") or {}
        ps = base.get("pagespeed") or {}
        common["seoDA"] = seo.get("domainAuthority", 0)
        kw = seo.get("keywordGaps")
        if isinstance(kw, list):
            common["topKeywordGaps"] = [str(k)[:60] for k in kw[:2]]
        common["reviewScore"] = rep.get("averageRating") or rep.get("rating") or rep.get("reviewScore")
        mobile_score = (ps.get("mobile") or {}).get("performanceScore")
        if mobile_score:
            common["mobileScore"] = mobile_score

    elif stage_name == "final_growth_patch":
        ss = base.get("servicesSignals") or {}
        lg = base.get("leadGenSignals") or {}
        svcs = ss.get("services") or []
        common["services"] = [
            (s.get("name", "") if isinstance(s, dict) else str(s))
            for s in svcs[:3]
        ]
        missing = lg.get("missingHighROIChannels") or []
        common["missingChannels"] = [
            (m.get("channel", "") if isinstance(m, dict) else str(m))
            for m in missing[:2]
        ]

    elif stage_name == "final_growth_commercial_patch":
        pass  # prompt builder handles its own mini context

    elif stage_name == "final_actionplan_patch":
        # Only top priority items — the prompt builder extracts from the report directly
        pass

    return {k: v for k, v in common.items() if v not in (None, {}, [], "", 0)}


# ─────────────────────────────────────────────────────────────────────────────
# Slice helpers (used by report_builder)
# ─────────────────────────────────────────────────────────────────────────────

def slice_report_for_reconcile(report: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(report, dict):
        return {}
    return _compact_report_subset_for_stage(report, "reconcile")


def slice_report_for_final_stage(report: Dict[str, Any], stage_name: str) -> Dict[str, Any]:
    if not isinstance(report, dict):
        return {}
    return _compact_report_subset_for_stage(report, stage_name)
