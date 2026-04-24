from __future__ import annotations

from typing import Any, Dict, List


def _ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _dedupe_actions(actions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    out = []
    for action in actions:
        key = (str(action.get("title", "")).strip().lower(), str(action.get("sourceSection", "")).strip().lower())
        if key in seen:
            continue
        seen.add(key)
        out.append(action)
    return out


def _score_action(action: Dict[str, Any]) -> float:
    impact_map = {"high": 3.0, "medium": 2.0, "low": 1.0}
    effort_map = {"low": 1.0, "medium": 1.5, "high": 2.0}
    urgency_map = {"high": 1.5, "medium": 1.2, "low": 1.0}

    impact = impact_map.get(str(action.get("impact", "medium")).lower(), 2.0)
    effort = effort_map.get(str(action.get("effort", "medium")).lower(), 1.5)
    urgency = urgency_map.get(str(action.get("urgency", "medium")).lower(), 1.2)
    confidence = float(action.get("confidence", 0.75) or 0.75)
    return round((impact * urgency * confidence) / effort, 4)


def build_action_plan_evidence(report: Dict[str, Any]) -> Dict[str, Any]:
    seo = _ensure_dict(report.get("seoVisibility"))
    rep = _ensure_dict(report.get("reputation"))
    lead = _ensure_dict(report.get("leadGeneration"))
    cost = _ensure_dict(report.get("costOptimization"))
    target = _ensure_dict(report.get("targetMarket"))
    fin = _ensure_dict(report.get("financialImpact"))
    web = _ensure_dict(report.get("websiteDigitalPresence"))

    actions: List[Dict[str, Any]] = []

    for issue in _ensure_list(_ensure_dict(web.get("technicalSEO")).get("issues"))[:5]:
        actions.append({
            "title": f"Resolve technical issue: {issue}",
            "sourceSection": "websiteDigitalPresence",
            "impact": "high",
            "effort": "medium",
            "urgency": "high",
            "confidence": 0.9,
            "pillar": "technical",
            "kpis": ["PageSpeed", "crawl health"],
        })

    for item in _ensure_list(seo.get("priorityActions"))[:5]:
        actions.append({
            "title": item,
            "sourceSection": "seoVisibility",
            "impact": "high",
            "effort": "medium",
            "urgency": "high",
            "confidence": 0.85,
            "pillar": "seo",
            "kpis": ["ranking keyword count", "organic visibility"],
        })

    review_score = rep.get("reviewScore")
    total_reviews = rep.get("totalReviews")
    if review_score or total_reviews:
        actions.append({
            "title": f"Merchandise review proof more visibly ({review_score}/5 from {total_reviews} reviews)",
            "sourceSection": "reputation",
            "impact": "medium",
            "effort": "low",
            "urgency": "medium",
            "confidence": 0.8,
            "pillar": "trust",
            "kpis": ["CTA click-through", "lead-to-meeting rate"],
        })

    for item in _ensure_list(lead.get("missingHighROIChannels"))[:4]:
        label = item.get("channel") if isinstance(item, dict) else str(item)
        actions.append({
            "title": f"Implement channel: {label}",
            "sourceSection": "leadGeneration",
            "impact": "medium",
            "effort": "medium",
            "urgency": "medium",
            "confidence": 0.7,
            "pillar": "acquisition",
            "kpis": ["leads/week", "lead quality"],
        })

    for opp in _ensure_list(cost.get("opportunities"))[:5]:
        title = opp.get("title") or opp.get("opportunity") or opp.get("name")
        if not title:
            continue
        actions.append({
            "title": str(title),
            "sourceSection": "costOptimization",
            "impact": "high",
            "effort": str(opp.get("effort", "medium")).lower(),
            "urgency": "medium",
            "confidence": 0.8,
            "pillar": "profitability",
            "kpis": ["gross margin", "delivery efficiency"],
        })

    for seg in _ensure_list(target.get("segments"))[:3]:
        label = seg.get("segment") or seg.get("name")
        if not label:
            continue
        actions.append({
            "title": f"Create messaging and landing-page strategy for segment: {label}",
            "sourceSection": "targetMarket",
            "impact": "high",
            "effort": "medium",
            "urgency": "medium",
            "confidence": 0.75,
            "pillar": "positioning",
            "kpis": ["qualified lead rate", "landing-page conversion rate"],
        })

    for row in _ensure_list(fin.get("revenueTable"))[:6]:
        metric = row.get("metric") if isinstance(row, dict) else None
        if metric and "revenue" in metric.lower():
            actions.append({
                "title": f"Prioritize financial lever tied to: {metric}",
                "sourceSection": "financialImpact",
                "impact": "high",
                "effort": "medium",
                "urgency": "medium",
                "confidence": 0.7,
                "pillar": "financial",
                "kpis": [metric],
            })

    actions = _dedupe_actions(actions)
    for action in actions:
        action["priorityScore"] = _score_action(action)
    actions.sort(key=lambda x: x.get("priorityScore", 0), reverse=True)

    return {
        "actionCandidates": actions,
        "topPriorityActions": actions[:12],
    }


def build_90_day_action_plan_from_evidence(report: Dict[str, Any], evidence: Dict[str, Any]) -> List[Dict[str, Any]]:
    actions = _ensure_list(evidence.get("topPriorityActions"))

    buckets = {
        "Weeks 1–2": {"title": "Measurement, messaging, and quick-win fixes", "actions": []},
        "Weeks 3–4": {"title": "Technical and structural conversion fixes", "actions": []},
        "Weeks 5–6": {"title": "Trust, offers, and service-page improvements", "actions": []},
        "Weeks 7–8": {"title": "SEO expansion and segment-specific content", "actions": []},
        "Weeks 9–10": {"title": "Local proof, CRM, and follow-up systems", "actions": []},
        "Weeks 11–12": {"title": "Acquisition rollout and scale decisions", "actions": []},
    }

    for action in actions:
        pillar = str(action.get("pillar", "")).lower()
        title = str(action.get("title", "")).strip()
        if not title:
            continue

        if pillar in {"technical", "seo"} and len(buckets["Weeks 1–2"]["actions"]) < 4:
            buckets["Weeks 1–2"]["actions"].append(title)
            continue
        if pillar in {"technical", "seo"} and len(buckets["Weeks 3–4"]["actions"]) < 4:
            buckets["Weeks 3–4"]["actions"].append(title)
            continue
        if pillar in {"trust", "profitability"} and len(buckets["Weeks 5–6"]["actions"]) < 4:
            buckets["Weeks 5–6"]["actions"].append(title)
            continue
        if pillar in {"positioning", "seo"} and len(buckets["Weeks 7–8"]["actions"]) < 4:
            buckets["Weeks 7–8"]["actions"].append(title)
            continue
        if pillar in {"trust", "acquisition"} and len(buckets["Weeks 9–10"]["actions"]) < 4:
            buckets["Weeks 9–10"]["actions"].append(title)
            continue
        if len(buckets["Weeks 11–12"]["actions"]) < 4:
            buckets["Weeks 11–12"]["actions"].append(title)

    plan = []
    for week_range, payload in buckets.items():
        actions_for_week = payload["actions"] or ["Confirm KPI baselines and remove blockers for the next stage"]
        plan.append({
            "weekRange": week_range,
            "title": payload["title"],
            "actions": actions_for_week[:5],
            "expectedOutcome": "This stage should remove the biggest blockers and increase commercial readiness before scaling.",
            "kpis": [
                {"kpi": "Lead volume", "current": "N/A", "target": "Improving"},
                {"kpi": "Conversion quality", "current": "N/A", "target": "Improving"},
            ],
        })
    return plan
