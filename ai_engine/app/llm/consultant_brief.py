"""Compact, evidence-led context for the final consultant synthesis pass."""
from __future__ import annotations

from typing import Any, Dict, List


def _text(value: Any) -> str:
    return str(value or "").strip()


def _names(items: Any, limit: int = 5) -> List[str]:
    out: List[str] = []
    for item in items if isinstance(items, list) else []:
        value = item.get("name") if isinstance(item, dict) else item
        text = _text(value)
        if text and text not in out:
            out.append(text)
    return out[:limit]


def build_consultant_brief(*, business_profile: Dict[str, Any], services: Dict[str, Any],
                           data_sources: List[Any], data_gaps: List[Any], user_inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Return a small, model-ready brief without inventing evidence."""
    profile = business_profile if isinstance(business_profile, dict) else {}
    model = _text(profile.get("businessModel")) or "service_business"
    target = _text(user_inputs.get("targetMarket")) or _text(profile.get("targetMarket"))
    goal = _text(user_inputs.get("businessGoal"))
    offers = _names((services if isinstance(services, dict) else {}).get("services"))
    gaps = []
    for gap in data_gaps if isinstance(data_gaps, list) else []:
        if isinstance(gap, dict):
            area = _text(gap.get("area"))
            missing = ", ".join(str(x) for x in gap.get("missing", [])[:2]) if isinstance(gap.get("missing"), list) else ""
            if area:
                gaps.append(f"{area}: {missing}".strip(": "))
    strategic_lens = (
        "Win and retain agency partners through confidential delivery, proof, turnaround clarity, and partner-safe reporting."
        if model == "white_label_agency_partner"
        else "Improve offer clarity, proof, demand capture, and conversion before scaling acquisition."
    )
    return {
        "businessModel": model,
        "buyer": _text(profile.get("buyerType")) or "unknown",
        "deliveryModel": _text(profile.get("serviceDeliveryModel")) or "direct",
        "operatingLocation": _text(profile.get("location")) or _text(user_inputs.get("location")),
        "statedTargetMarket": target or "not supplied",
        "primaryGoal": goal or "improve qualified growth",
        "coreOffers": offers,
        "strategicLens": strategic_lens,
        "verifiedSources": [str(item.get("source")) for item in data_sources if isinstance(item, dict) and item.get("source")][:6],
        "missingEvidence": gaps[:6],
        "rules": [
            "Use verified sources for factual claims.",
            "Label recommendations as directional when evidence is missing.",
            "Do not convert a service name into an ICP or a ranking claim.",
        ],
    }
