from __future__ import annotations
import json
from typing import Any, Dict

ESTIMATION_DISCLAIMER = (
    "Estimation Mode ON: numbers are directional models, not audited financials."
)

ESTIMATION_DISCLAIMER_FULL = (
    "Estimation Mode is ON: Sections 8-10 include modeled estimates based on the information "
    "you provided plus publicly available signals (website + listings). These numbers are "
    "directional, not audited financials, and should not be used as the sole basis for "
    "budgeting or investment decisions. For higher accuracy, provide real spend/revenue inputs "
    "or connect Ads/Analytics/CRM."
)

_UNIVERSAL_RULES = """Rules: single valid JSON object, double-quoted keys/strings, no markdown/fences/commentary.
Null → omit the field. Numbers must come from context. No invented facts."""

_ESTIMATION_MINI = f"""Include: estimationDisclaimer="{ESTIMATION_DISCLAIMER}", confidenceScore (int 0-100),
mentorNotes (1-2 sentences), scenarios=[Conservative,Base,Aggressive] each with
name, assumptions (2 items max), modeledOutcomes (2 items max)."""

_PATCH_RULE = "Return a JSON patch object. Include only keys you are updating. No full report."

BASE_SYSTEM_PROMPT = f"""You are BrandingBeez AI, a senior growth consultant for service businesses.
{_UNIVERSAL_RULES}
Unknown strings → "Not available". Unknown arrays/objects → [] or {{}}.
Write like a commercially sharp consultant: specific, direct, implementation-oriented.
Connect visibility→traffic→leads→revenue where supported. No filler or generic placeholders.
Estimates only in sections 8-10 when estimationMode=true."""

STYLE_GUIDANCE_BLOCK = """Commercial writing: explain finding, business impact, recommended action, expected outcome.
Use funnel thinking. Tie recommendations to evidence. No vague filler."""

def _json(value: Dict[str, Any] | None) -> str:
    try:
        return json.dumps(value or {}, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    except Exception:
        return "{}"

def _business_prompt_suffix(ctx: dict) -> str:
    guidance = ctx.get("businessModelPromptGuidance") if isinstance(ctx, dict) else {}
    profile = ctx.get("businessProfile") if isinstance(ctx, dict) else {}
    if not isinstance(guidance, dict):
        guidance = {}
    if not isinstance(profile, dict):
        profile = {}

    business_model = guidance.get("businessModel") or profile.get("businessModel") or "service_business"
    buyer_type = profile.get("buyerType") or guidance.get("buyerType") or "unknown"
    target_market = profile.get("targetMarket") or ""
    services = profile.get("serviceNames") if isinstance(profile.get("serviceNames"), list) else []

    lines = [f"Biz: model={business_model} buyer={buyer_type}"]
    if target_market:
        lines.append(f"target={target_market}")
    if services:
        lines.append(f"services={', '.join(map(str, services[:5]))}")

    focus = guidance.get("focus")
    if isinstance(focus, list) and focus:
        lines.append(f"emphasise={', '.join(map(str, focus[:4]))}")

    avoid = guidance.get("avoid")
    if isinstance(avoid, list) and avoid:
        lines.append(f"avoid={', '.join(map(str, avoid[:4]))}")

    lines.append("Be conservative when evidence is weak. No ad-spend expansion unless supported.")
    return " | ".join(lines)

SYSTEM_PROMPT = f"""{BASE_SYSTEM_PROMPT}

Role: BrandingBeez AI Business Growth Analyzer.
Task: Generate a client-ready business growth report as a single strict JSON object.
Evidence rules: sections 1-7 use only provided evidence. Cite numbers only from context.
Estimation rules: only sections 8-10 may model estimates when estimationMode=true.
{STYLE_GUIDANCE_BLOCK}"""

SYSTEM_PROMPT_RECONCILE = f"""{BASE_SYSTEM_PROMPT}

Role: BrandingBeez AI Report Reconciler.
Task: Return a minimal JSON patch fixing clear contradictions supported by evidence.
{_PATCH_RULE}
Fix only: executiveSummary consistency, page-existence contradictions, service descriptions,
missing-channel contradictions, target-market consistency.
servicesPositioning.serviceGaps = list of {{service,reason,impact}}.
competitiveAdvantages.advantages = list of plain strings."""

SYSTEM_PROMPT_ESTIMATION_8_10 = f"""{BASE_SYSTEM_PROMPT}

Role: BrandingBeez AI Estimation Engine.
Task: Return ONLY costOptimization, targetMarket, financialImpact as strict JSON.
{_ESTIMATION_MINI}
costOptimization.opportunities: 3 items. targetMarket.segments: 2 items.
financialImpact should stay narrative-first. All arrays: max 3 items, strings ≤120 chars."""

SYSTEM_PROMPT_FINAL_SYNTHESIS = f"""{BASE_SYSTEM_PROMPT}

Role: BrandingBeez AI Senior Growth Consultant.
Task: Return a compact JSON patch improving executive quality and actionability.
{_PATCH_RULE}
Keep all strings ≤150 chars. Arrays max 4 items each. Numeric values from context only."""

SYSTEM_PROMPT_COST_OPTIMIZATION = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure:
{"costOptimization":{"mentorNotes":"<1 sentence>","confidenceScore":<0-100>,"estimationDisclaimer":"Estimation Mode ON: directional only.","opportunities":[{"title":"<str>","impact":"<str>","effort":"low|medium|high"},{"title":"<str>","impact":"<str>","effort":"low|medium|high"},{"title":"<str>","impact":"<str>","effort":"low|medium|high"}],"actionCandidates":[{"title":"<str>","impact":"high|medium|low","effort":"low|medium|high"},{"title":"<str>","impact":"high|medium|low","effort":"low|medium|high"}]}}

STRICT RULES:
- Ground every item in the provided business model, services, target market, and financial inputs.
- For white-label / agency contexts, prefer fulfilment margin, proposal conversion, retained packaging, partner onboarding, qualification efficiency, and delivery utilisation.
- Do NOT use generic ops language like vendor relationships, operational overhead, internal processes, automation tools, software audit, tool subscriptions unless explicitly tied to agency fulfilment.
- Exactly 3 opportunities and 2 actionCandidates.
- All strings under 90 chars. No extra keys.
"""

SYSTEM_PROMPT_TARGET_MARKET = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure:
{"targetMarket":{"mentorNotes":"<1 sentence>","confidenceScore":<0-100>,"estimationDisclaimer":"Estimation Mode ON: directional only.","segments":[{"segment":"<str>","notes":"<str>","painPoints":["<str>","<str>"]},{"segment":"<str>","notes":"<str>","painPoints":["<str>","<str>"]}],"actionCandidates":[{"title":"<str>","impact":"high|medium|low","effort":"low|medium|high"}]}}

STRICT RULES:
- Exactly 2 segments only.
- Segments MUST be grounded in provided target market, customer segments, services, countries served, or buyer type.
- Prefer agency / partner / white-label / retained-service segments when supported.
- DO NOT use generic buckets like Small Businesses, Entrepreneurs, Local Businesses, SMBs, Marketing Managers.
- DO NOT include scenarios, budgets, currency values, disclaimers beyond estimationDisclaimer, or extra keys.
- All strings under 90 chars.
"""

SYSTEM_PROMPT_FINANCIAL_IMPACT = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure:
{"financialImpact":{"mentorNotes":"<1 sentence>","confidenceScore":<0-100>,"notes":"<short explanation>","actionCandidates":[{"title":"<str>","impact":"high|medium|low","effort":"low|medium|high"}]}}

STRICT RULES:
- DO NOT generate revenue tables, scenarios, or numbers.
- Focus only on narrative levers: pricing, conversion, retainers, packaging, proposal efficiency.
- All strings under 100 chars.
- No extra keys.
"""

SYSTEM_PROMPT_FINAL_EXEC_SUMMARY = f"""{BASE_SYSTEM_PROMPT}

Task: Return ONLY {{"executiveSummary":{{...}}}} as a compact JSON patch.
Required fields ONLY:
  biggestOpportunity: 1 sentence (≤140 chars)
  mentorSnapshot: 2 sentences ending with "The Bottom Line:" (≤220 chars)
  strengths: array of 3 strings (≤80 chars each)
  weaknesses: array of 3 strings (≤80 chars each)
  quickWins: array of 3 objects, each: {{title,impact,time}} (strings ≤80 chars)
No other keys. Total output ≤600 tokens."""

SYSTEM_PROMPT_FINAL_VISIBILITY_PATCH = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure (omit any key you have no evidence for):
{"websiteDigitalPresence":{"contentGaps":["<gap1>","<gap2>"]},"seoVisibility":{"priorityActions":["<action1>","<action2>"]},"reputation":{"mentorNotes":"<1 sentence>"}}

All strings under 100 chars. No extra keys. No nested objects."""

SYSTEM_PROMPT_FINAL_GROWTH_PATCH = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure (omit any key you have no evidence for):
{"servicesPositioning":{"mentorNotes":"<1 sentence>"},"leadGeneration":{"mentorNotes":"<1 sentence>"},"competitiveAdvantages":{"advantages":["<advantage1>","<advantage2>","<advantage3>"]}}

All strings under 120 chars. No extra keys. No nested objects."""

SYSTEM_PROMPT_FINAL_GROWTH_COMMERCIAL_PATCH = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure:
{"costOptimization":{"notes":"<1-2 sentences>"},"targetMarket":{"notes":"<1-2 sentences>"},"financialImpact":{"notes":"<1-2 sentences>"}}

Each notes value under 180 chars. No extra keys."""

SYSTEM_PROMPT_FINAL_ACTIONPLAN_PATCH = """You are BrandingBeez AI. Return ONLY valid JSON. No markdown. No commentary.

Return exactly this structure with exactly 4 blocks:
{"actionPlan90Days":[{"weekRange":"Week 1-2","title":"<str>","actions":["<action1>","<action2>"],"expectedOutcome":"<str>","kpis":["<kpi1>","<kpi2>"]},{"weekRange":"Week 3-4","title":"<str>","actions":["<action1>","<action2>"],"expectedOutcome":"<str>","kpis":["<kpi1>","<kpi2>"]},{"weekRange":"Week 5-8","title":"<str>","actions":["<action1>","<action2>"],"expectedOutcome":"<str>","kpis":["<kpi1>","<kpi2>"]},{"weekRange":"Week 9-13","title":"<str>","actions":["<action1>","<action2>"],"expectedOutcome":"<str>","kpis":["<kpi1>","<kpi2>"]}]}

kpis MUST be plain strings. All strings under 90 chars. No extra keys."""

def _ctx_block(ctx: dict, label: str = "context", max_chars: int = 2000) -> str:
    raw = _json(ctx)
    if len(raw) > max_chars:
        raw = raw[:max_chars] + "}"
    return f"{label}:{raw}"

def _report_block(report: dict, label: str = "report", max_chars: int = 1500) -> str:
    raw = _json(report)
    if len(raw) > max_chars:
        raw = raw[:max_chars] + "}"
    return f"{label}:{raw}"

def _mini_ctx(ctx: dict) -> str:
    if not isinstance(ctx, dict):
        return "{}"
    ei = ctx.get("estimationInputs") or {}
    ui = ctx.get("userInputs") or {}
    uf = ctx.get("userFinancials") or {}
    bp = ctx.get("businessProfile") or {}
    financials = {
        "monthlyRevenue": uf.get("monthlyRevenue") or ei.get("monthlyRevenue") or ui.get("monthlyRevenue"),
        "monthlyLeads": uf.get("monthlyLeads") or ei.get("monthlyLeads") or ui.get("monthlyLeads"),
        "closeRate": uf.get("closeRate") or ei.get("closeRate") or ui.get("closeRate"),
        "avgDealValue": uf.get("avgDealValue") or ei.get("avgDealValue") or ui.get("avgDealValue"),
        "monthlyAdSpend": uf.get("monthlyAdSpend") or ei.get("monthlyAdSpend") or ui.get("monthlyAdSpend"),
        "teamSize": uf.get("teamSize") or ei.get("teamSize") or ui.get("teamSize"),
        "targetMarket": bp.get("targetMarket") or ui.get("targetMarket"),
        "countriesServed": uf.get("countriesServed"),
        "customerSegments": uf.get("customerSegments"),
        "painPoints": uf.get("painPoints"),
    }
    mini = {
        "company": ctx.get("companyName", ""),
        "model": (ctx.get("businessModelPromptGuidance") or {}).get("businessModel") or bp.get("businessModel", "service_business"),
        "services": bp.get("serviceNames", [])[:5],
        "financials": financials,
    }
    raw = _json(mini)
    return raw[:1200] if len(raw) > 1200 else raw

def build_user_prompt(context: dict) -> str:
    return (
        "Generate the full Business Growth Report JSON with these top-level keys:\n"
        "reportMetadata,executiveSummary,websiteDigitalPresence,seoVisibility,reputation,"
        "servicesPositioning,leadGeneration,competitiveAnalysis,costOptimization,targetMarket,"
        "financialImpact,actionPlan90Days,competitiveAdvantages,riskAssessment,appendices\n\n"
        f"Estimation disclaimer to embed verbatim: {ESTIMATION_DISCLAIMER_FULL}\n\n"
        f"{_ctx_block(context)}"
    )

def build_user_prompt_reconcile(base_report: dict, llm_context: dict) -> str:
    suffix = _business_prompt_suffix(llm_context if isinstance(llm_context, dict) else {})
    return (
        "Return a small JSON patch for clear contradictions only. Return {} if nothing needs fixing.\n\n"
        f"{_report_block(base_report or {}, 'report')}\n\n"
        f"{_ctx_block(llm_context or {}, 'evidence')}\n"
        f"{suffix}"
    )

def build_user_prompt_final_synthesis(final_report: dict, llm_context: dict) -> str:
    suffix = _business_prompt_suffix(llm_context if isinstance(llm_context, dict) else {})
    return (
        "Return a compact JSON patch improving consulting quality.\n\n"
        f"{_report_block(final_report, 'report')}\n\n"
        f"{_ctx_block(llm_context or {}, 'context')}\n"
        f"{suffix}"
    )

def build_user_prompt_cost_optimization(llm_context: dict) -> str:
    ctx = llm_context or {}
    mini = _mini_ctx(ctx)
    suffix = _business_prompt_suffix(ctx)
    return (
        f"Business data: {mini}\n"
        f"{suffix}\n"
        "Generate realistic cost optimization for this business. "
        "Every item must clearly reflect the business context above."
    )

def build_user_prompt_target_market(llm_context: dict) -> str:
    ctx = llm_context or {}
    bp = ctx.get("businessProfile", {}) if isinstance(ctx, dict) else {}
    ui = ctx.get("userInputs", {}) if isinstance(ctx, dict) else {}
    uf = ctx.get("userFinancials", {}) if isinstance(ctx, dict) else {}

    payload = {
        "targetMarket": ui.get("targetMarket") or bp.get("targetMarket"),
        "countriesServed": (uf.get("countriesServed") or [])[:4] if isinstance(uf, dict) else [],
        "customerSegments": (uf.get("customerSegments") or ui.get("customerSegments") or [])[:4],
        "painPoints": (uf.get("painPoints") or [])[:4] if isinstance(uf, dict) else [],
        "services": (bp.get("serviceNames") or [])[:5] if isinstance(bp, dict) else [],
        "buyerType": bp.get("buyerType") if isinstance(bp, dict) else None,
    }

    return (
        f"Business data: {_json(payload)}\n"
        "Generate ONLY grounded target-market output.\n"
        "Rules:\n"
        "- Use only segments supported by target market, geography, service mix, or customer-segment inputs.\n"
        "- Prefer agency, partner, startup, retained-service, or white-label buyer segments when supported.\n"
        "- Exactly 2 segments.\n"
        "- No scenarios, budgets, currency values, or generic SMB labels."
    )

def build_user_prompt_financial_impact(llm_context: dict) -> str:
    ctx = llm_context or {}
    bp = ctx.get("businessProfile", {}) if isinstance(ctx, dict) else {}
    uf = ctx.get("userFinancials", {}) if isinstance(ctx, dict) else {}
    payload = {
        "businessModel": bp.get("businessModel"),
        "buyerType": bp.get("buyerType"),
        "targetMarket": bp.get("targetMarket") or (ctx.get("userInputs") or {}).get("targetMarket"),
        "services": (bp.get("serviceNames") or [])[:4],
        "monthlyRevenue": uf.get("monthlyRevenue"),
        "monthlyLeads": uf.get("monthlyLeads"),
        "closeRate": uf.get("closeRate"),
        "avgDealValue": uf.get("avgDealValue"),
    }
    return (
        f"Business data: {_json(payload)}\n"
        "Return one short financial mentor note and one short note only.\n"
        "Use pricing, conversion, retained revenue, packaging, proposal efficiency.\n"
        "Do not output tables, scenarios, or any new numbers."
    )

def build_user_prompt_final_exec_summary(final_report: dict, llm_context: dict) -> str:
    ctx = llm_context if isinstance(llm_context, dict) else {}
    report = final_report if isinstance(final_report, dict) else {}
    es = report.get("executiveSummary") or {}
    rep = report.get("reputation") or {}
    website = report.get("websiteDigitalPresence") or {}
    services = report.get("servicesPositioning") or {}
    evidence = {
        "company": ctx.get("companyName", ""),
        "businessModel": ((ctx.get("businessModelPromptGuidance") or {}).get("businessModel") or (ctx.get("businessProfile") or {}).get("businessModel") or ""),
        "targetMarket": ((ctx.get("businessProfile") or {}).get("targetMarket") or ""),
        "biggestOpportunity": es.get("biggestOpportunity"),
        "strengths": (es.get("strengths") or [])[:3],
        "weaknesses": (es.get("weaknesses") or [])[:3],
        "seoScore": (report.get("reportMetadata") or {}).get("subScores", {}).get("seo"),
        "websiteScore": (report.get("reportMetadata") or {}).get("subScores", {}).get("website"),
        "reviewScore": rep.get("reviewScore"),
        "totalReviews": rep.get("totalReviews"),
        "contentGaps": (website.get("contentGaps") or (website.get("contentQuality") or {}).get("gaps") or [])[:3],
        "services": [s.get("name") for s in (services.get("services") or [])[:3] if isinstance(s, dict) and s.get("name")],
    }
    return (
        "Return ONLY executiveSummary patch with biggestOpportunity, mentorSnapshot, strengths, weaknesses, quickWins.\n"
        "Use short business-specific language. No filler.\n"
        f"evidence:{_json(evidence)[:1800]}"
    )

def build_user_prompt_final_visibility_patch(final_report: dict, llm_context: dict) -> str:
    ctx = llm_context if isinstance(llm_context, dict) else {}
    seo_da = 0
    kw_gaps: list = []
    review_score = None
    total_reviews = 0
    content_gaps: list = []
    if isinstance(final_report, dict):
        seo = final_report.get("seoVisibility") or {}
        if isinstance(seo, dict):
            da = seo.get("domainAuthority")
            seo_da = da.get("score", 0) if isinstance(da, dict) else (da or 0)
            kr = seo.get("keywordRankings") or {}
            kw_gaps = (kr.get("missingHighValueKeywords") or [])[:2] if isinstance(kr, dict) else []
        rep = final_report.get("reputation") or {}
        if isinstance(rep, dict):
            review_score = rep.get("reviewScore")
            total_reviews = rep.get("totalReviews") or 0
        wdp = final_report.get("websiteDigitalPresence") or {}
        if isinstance(wdp, dict):
            content_gaps = (wdp.get("contentGaps") or [])[:3]
    evidence = _json({
        "company": ctx.get("companyName", ""),
        "seoDA": seo_da,
        "keywordGaps": kw_gaps[:2],
        "reviewScore": review_score,
        "totalReviews": total_reviews,
        "existingContentGaps": content_gaps[:2],
    })
    suffix = _business_prompt_suffix(ctx)
    return (
        f"Evidence: {evidence[:600]}\n"
        f"{suffix}\n"
        "Using the evidence above, fill in the JSON template with specific, evidence-based content."
    )

def build_user_prompt_final_growth_patch(final_report: dict, llm_context: dict) -> str:
    ctx = llm_context if isinstance(llm_context, dict) else {}
    services: list = []
    missing_channels: list = []
    advantages: list = []
    if isinstance(final_report, dict):
        sp = final_report.get("servicesPositioning") or {}
        if isinstance(sp, dict):
            for svc in (sp.get("services") or [])[:3]:
                if isinstance(svc, dict) and svc.get("name"):
                    services.append(svc["name"])
        lg = final_report.get("leadGeneration") or {}
        if isinstance(lg, dict):
            for ch in (lg.get("missingHighROIChannels") or [])[:2]:
                if isinstance(ch, dict):
                    missing_channels.append(ch.get("channel", ""))
                elif isinstance(ch, str):
                    missing_channels.append(ch)
        ca = final_report.get("competitiveAdvantages") or {}
        if isinstance(ca, dict):
            advantages = (ca.get("advantages") or [])[:3]
    evidence = _json({
        "company": ctx.get("companyName", ""),
        "services": services,
        "missingChannels": missing_channels,
        "currentAdvantages": [a for a in advantages if isinstance(a, str)][:2],
    })
    suffix = _business_prompt_suffix(ctx)
    return (
        f"Evidence: {evidence[:500]}\n"
        f"{suffix}\n"
        "Using the evidence above, add growth insights for this business."
    )

def build_user_prompt_final_actionplan_patch(final_report: dict, llm_context: dict) -> str:
    ctx = llm_context if isinstance(llm_context, dict) else {}
    top_issues: list = []
    if isinstance(final_report, dict):
        es = final_report.get("executiveSummary") or {}
        if isinstance(es, dict):
            qw = es.get("quickWins") or []
            for q in qw[:3]:
                if isinstance(q, dict):
                    top_issues.append(q.get("title", ""))
                elif isinstance(q, str):
                    top_issues.append(q)
        co = final_report.get("costOptimization") or {}
        if isinstance(co, dict):
            for ac in (co.get("actionCandidates") or [])[:2]:
                if isinstance(ac, dict):
                    top_issues.append(ac.get("title", ""))
    evidence = _json({
        "company": ctx.get("companyName", ""),
        "businessModel": (ctx.get("businessProfile") or {}).get("businessModel", ""),
        "topPriorityItems": [t for t in top_issues if t][:4],
    })
    suffix = _business_prompt_suffix(ctx)
    return (
        f"Evidence: {evidence[:500]}\n"
        f"{suffix}\n"
        "Using the priority items above, build a practical 90-day action plan."
    )

def build_user_prompt_final_growth_commercial_patch(final_report: dict, llm_context: dict) -> str:
    ctx = llm_context if isinstance(llm_context, dict) else {}
    profile = (ctx.get("businessProfile") or {}) if isinstance(ctx, dict) else {}
    target = profile.get("targetMarket") or ""
    services = (profile.get("serviceNames") or [])[:4] if isinstance(profile, dict) else []
    existing = {
        "cost": str(((final_report.get("costOptimization") or {}) if isinstance(final_report, dict) else {}).get("mentorNotes") or "")[:140],
        "target": str(((final_report.get("targetMarket") or {}) if isinstance(final_report, dict) else {}).get("mentorNotes") or "")[:140],
        "financial": str(((final_report.get("financialImpact") or {}) if isinstance(final_report, dict) else {}).get("mentorNotes") or "")[:140],
    }
    payload = {
        "businessModel": ((ctx.get("businessModelPromptGuidance") or {}).get("businessModel") or profile.get("businessModel") or ""),
        "targetMarket": target,
        "services": services,
        "existing": existing,
    }
    return (
        "Return notes upgrades only when they make the sections more specific.\n"
        "For white-label / agency businesses, use partner delivery, proposal conversion, retained packaging, fulfilment margin.\n"
        "Do not write generic operations language. Return {} if no upgrade is needed.\n"
        f"mini_context:{_json(payload)[:900]}"
    )

def build_user_prompt_estimation_8_10(llm_context: dict) -> str:
    ctx = llm_context or {}
    est = ctx.get("estimationInputs") if isinstance(ctx, dict) and isinstance(ctx.get("estimationInputs"), dict) else {}
    fin = ctx.get("userFinancials") if isinstance(ctx, dict) and isinstance(ctx.get("userFinancials"), dict) else {}
    bp = ctx.get("businessProfile") if isinstance(ctx, dict) and isinstance(ctx.get("businessProfile"), dict) else {}
    suffix = _business_prompt_suffix(ctx)
    return (
        "Generate ONLY costOptimization (3 opportunities), targetMarket (2 segments), "
        "financialImpact (narrative only) as strict JSON. All strings ≤120 chars. "
        "No long prose.\n\n"
        f"financials:{_json(fin)}\n"
        f"estimation:{_json(est)}\n"
        f"profile:{_json(bp)}\n"
        f"{suffix}\n"
        f'disclaimer:"{ESTIMATION_DISCLAIMER}"'
    )
