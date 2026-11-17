from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, Iterable, List, Sequence
import re

from app.signals.detection_utils import is_reportable_service_name


_PUNCT_RE = re.compile(r"[^a-z0-9]+")


def _clamp_score(value: Any) -> int:
    try:
        return max(0, min(100, int(round(float(value)))))
    except Exception:
        return 0


def clamp_score(value: Any) -> int:
    """Public score clamp used by the deterministic scorecard helpers."""
    return _clamp_score(value)


def _coerce_score(value: Any) -> float | None:
    try:
        if value is None or value == "":
            return None
        return max(0.0, min(100.0, float(value)))
    except Exception:
        return None


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value).strip()
    return re.sub(r"\s+", " ", str(value)).strip()


def _text_key(value: Any) -> str:
    text = _clean_text(value).lower()
    return _PUNCT_RE.sub(" ", text).strip()


def _has_text(value: Any) -> bool:
    return bool(_clean_text(value))


def _has_meaningful_content(value: Any) -> bool:
    if isinstance(value, dict):
        return any(_has_meaningful_content(v) for v in value.values())
    if isinstance(value, list):
        return any(_has_meaningful_content(v) for v in value)
    if isinstance(value, str):
        return bool(_clean_text(value))
    if isinstance(value, (int, float)):
        return True
    return value is not None


def _get_path(root: Dict[str, Any], path: Sequence[str]) -> Any:
    current: Any = root
    for key in path:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _as_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def dedupe_findings_preserve_order(
    items: Iterable[Any],
    *,
    text_keys: Sequence[str] | None = None,
) -> List[Any]:
    """Remove duplicate findings while preserving order.

    Safe for both string bullet lists and lightweight dict rows. Dicts are deduped
    using the first meaningful text field from `text_keys`.
    """
    out: List[Any] = []
    seen: set[str] = set()

    for item in items or []:
        if item is None:
            continue

        if isinstance(item, str):
            cleaned = _clean_text(item)
            if not cleaned:
                continue
            key = _text_key(cleaned)
            value: Any = cleaned
        elif isinstance(item, dict):
            picked = ""
            if text_keys:
                for text_key in text_keys:
                    candidate = item.get(text_key)
                    if _has_text(candidate):
                        picked = _clean_text(candidate)
                        break
            if not picked:
                for candidate in item.values():
                    if _has_text(candidate):
                        picked = _clean_text(candidate)
                        break
            if not picked:
                if _has_meaningful_content(item):
                    picked = repr(sorted(item.items()))
                else:
                    continue
            key = _text_key(picked)
            value = item
        else:
            cleaned = _clean_text(item)
            if not cleaned:
                continue
            key = _text_key(cleaned)
            value = item

        if not key or key in seen:
            continue
        seen.add(key)
        out.append(value)

    return out


def _section_has_substance(section: Any) -> bool:
    if not isinstance(section, dict):
        return False
    ignored = {"score", "confidenceScore", "opportunityScore", "riskScore", "notes", "mentorNotes"}
    for key, value in section.items():
        if key in ignored:
            continue
        if _has_meaningful_content(value):
            return True
    return False


def _count_meaningful_items(value: Any) -> int:
    if isinstance(value, list):
        return sum(1 for item in value if _has_meaningful_content(item))
    if isinstance(value, dict):
        return sum(1 for item in value.values() if _has_meaningful_content(item))
    return 1 if _has_meaningful_content(value) else 0


def _fallback_section_count(report: Dict[str, Any]) -> int:
    placeholders = (
        "not available",
        "currently unavailable",
        "limited data",
        "could not be structurally extracted",
        "could not fully structure",
        "no data available",
        "no data generated",
    )
    count = 0
    for key in (
        "competitiveAnalysis",
        "costOptimization",
        "targetMarket",
        "financialImpact",
    ):
        section = _as_dict(report.get(key))
        notes = _clean_text(section.get("notes"))
        if notes and any(token in notes.lower() for token in placeholders):
            count += 1
    return count


def _detect_missing_signals(report: Dict[str, Any]) -> List[str]:
    missing: List[str] = []

    if not _section_has_substance(_as_dict(report.get("websiteDigitalPresence"))):
        missing.append("website_analysis")
    if not _section_has_substance(_as_dict(report.get("seoVisibility"))):
        missing.append("seo_analysis")

    reputation = _as_dict(report.get("reputation"))
    has_reputation = (
        _coerce_score(reputation.get("overallScore")) is not None
        or _count_meaningful_items(reputation.get("reviews")) > 0
        or _count_meaningful_items(reputation.get("strengths")) > 0
    )
    if not has_reputation:
        missing.append("review_data")

    appendices = _as_dict(report.get("appendices"))
    if not _count_meaningful_items(appendices.get("backlinks")):
        missing.append("backlinks_data")

    services = _as_dict(report.get("servicesPositioning"))
    service_list = _as_list(services.get("services"))
    service_gaps = _as_list(services.get("serviceGaps"))
    if not service_list and not service_gaps:
        missing.append("service_detection")

    lead = _as_dict(report.get("leadGeneration"))
    channels = _as_list(lead.get("channels"))
    lead_magnets = _as_list(lead.get("leadMagnets"))
    if not channels and not lead_magnets:
        missing.append("cta_detection")

    evidence = _as_dict(appendices.get("evidence"))
    screenshots = _as_dict(evidence.get("screenshots"))
    if not screenshots:
        missing.append("screenshots")

    data_sources = _as_list(appendices.get("dataSources"))
    if not data_sources:
        missing.append("data_sources")

    pages_crawled = _as_list(appendices.get("pagesCrawled"))
    if not pages_crawled:
        missing.append("pages_crawled")

    return missing


def _compute_detection_reliability(report: Dict[str, Any]) -> tuple[int, List[str]]:
    penalties: List[str] = []
    ux = _as_dict(_get_path(report, ("websiteDigitalPresence", "uxConversion")))
    services = _as_dict(report.get("servicesPositioning"))
    appendices = _as_dict(report.get("appendices"))

    penalty_score = 0

    ux_score = _coerce_score(ux.get("score"))
    ux_highlights = _as_list(ux.get("highlights"))
    ux_issues = _as_list(ux.get("issues"))
    if ux_score is not None and ux_score >= 80 and not ux_highlights:
        penalties.append("high_ux_with_weak_positive_evidence")
        penalty_score += 6
    if ux_issues and not ux_highlights:
        penalties.append("ux_detection_unbalanced")
        penalty_score += 5

    service_notes = _clean_text(services.get("notes") or services.get("summary") or "")
    if service_notes and "could not" in service_notes.lower():
        penalties.append("service_detection_uncertain")
        penalty_score += 6

    fallback_sections = _fallback_section_count(report)
    if fallback_sections:
        penalties.append(f"fallback_sections:{fallback_sections}")
        penalty_score += min(12, fallback_sections * 3)

    if not _as_list(appendices.get("dataSources")):
        penalties.append("missing_source_listing")
        penalty_score += 6

    reliability = clamp_score(100 - penalty_score)
    return reliability, penalties


def _derive_section_scores(report: Dict[str, Any]) -> Dict[str, int]:
    metadata = _as_dict(report.get("reportMetadata"))
    metadata_scores = _as_dict(metadata.get("subScores"))
    website = _as_dict(report.get("websiteDigitalPresence"))
    seo = _as_dict(report.get("seoVisibility"))
    reputation = _as_dict(report.get("reputation"))
    services = _as_dict(report.get("servicesPositioning"))
    lead = _as_dict(report.get("leadGeneration"))

    review_score = reputation.get("reviewScore")
    has_verified_reputation = isinstance(review_score, (int, float)) and review_score > 0
    if not has_verified_reputation:
        has_verified_reputation = any(
            isinstance(item, dict) and isinstance(item.get("rating"), (int, float)) and item.get("rating") > 0
            for item in _as_list(reputation.get("platforms") or reputation.get("summaryTable"))
        )

    section_inputs = {
        "website": (
            metadata_scores.get("website"),
            _get_path(report, ("websiteDigitalPresence", "technicalSEO", "score")),
            _get_path(report, ("websiteDigitalPresence", "uxConversion", "score")),
            _section_has_substance(website),
        ),
        "seo": (
            metadata_scores.get("seo"),
            _get_path(report, ("seoVisibility", "domainAuthority", "score")),
            _get_path(report, ("seoVisibility", "technicalSeo", "score")),
            _section_has_substance(seo),
        ),
        "reputation": (
            metadata_scores.get("reputation") if has_verified_reputation else None,
            reputation.get("overallScore"),
            None,
            has_verified_reputation,
        ),
        "leadGen": (
            metadata_scores.get("leadGen"),
            _get_path(report, ("websiteDigitalPresence", "uxConversion", "score")),
            None,
            bool(_as_list(lead.get("channels")) or _as_list(lead.get("leadMagnets")) or _as_list(lead.get("missingHighROIChannels"))),
        ),
        "services": (
            metadata_scores.get("services"),
            None,
            None,
            bool(_as_list(services.get("services")) or _as_list(services.get("serviceGaps"))),
        ),
    }

    out: Dict[str, int] = {}
    for key, (primary, fallback_a, fallback_b, has_substance) in section_inputs.items():
        if primary is not None and (has_substance or _clamp_score(primary) > 0):
            out[key] = _clamp_score(primary)
            continue
        if fallback_a is not None and (has_substance or _clamp_score(fallback_a) > 0):
            out[key] = _clamp_score(fallback_a)
            continue
        if fallback_b is not None and (has_substance or _clamp_score(fallback_b) > 0):
            out[key] = _clamp_score(fallback_b)
            continue
        if key == "services" and has_substance:
            out[key] = min(100, 40 + (len(_as_list(services.get("services"))) * 12))
        elif key == "leadGen" and has_substance:
            out[key] = min(100, 45 + (len(_as_list(lead.get("channels"))) * 10) + (len(_as_list(lead.get("leadMagnets"))) * 8))
    return out


def compute_data_completeness(report: Dict[str, Any]) -> int:
    """Estimate how complete the report inputs are without forcing missing data to zero."""
    report = _as_dict(report)
    appendices = _as_dict(report.get("appendices"))
    evidence = _as_dict(appendices.get("evidence"))
    screenshots = _as_dict(evidence.get("screenshots"))

    checks = [
        _section_has_substance(_as_dict(report.get("websiteDigitalPresence"))),
        _section_has_substance(_as_dict(report.get("seoVisibility"))),
        _section_has_substance(_as_dict(report.get("reputation"))),
        _section_has_substance(_as_dict(report.get("servicesPositioning"))),
        _section_has_substance(_as_dict(report.get("leadGeneration"))),
        _coerce_score(_get_path(report, ("websiteDigitalPresence", "websiteKeywordAnalysis", "score"))) is not None,
        _count_meaningful_items(appendices.get("dataSources")) > 0,
        _count_meaningful_items(appendices.get("pagesCrawled")) > 0,
        _count_meaningful_items(screenshots) > 0,
        _count_meaningful_items(appendices.get("backlinks")) > 0,
        _count_meaningful_items(_get_path(report, ("competitiveAnalysis", "competitors"))) > 0,
        _coerce_score(_get_path(report, ("websiteDigitalPresence", "technicalSEO", "score"))) is not None,
        _coerce_score(_get_path(report, ("websiteDigitalPresence", "contentQuality", "score"))) is not None,
        _coerce_score(_get_path(report, ("websiteDigitalPresence", "uxConversion", "score"))) is not None,
    ]

    if not checks:
        return 0

    completeness = (sum(1 for item in checks if item) / len(checks)) * 100
    fallback_penalty = min(15, _fallback_section_count(report) * 3)
    # A populated section can still be directional when a source was not
    # connected.  Surface that uncertainty instead of reporting 100% simply
    # because placeholder sections were generated.
    data_gaps = _as_list(appendices.get("dataGaps"))
    unresolved_gaps = 0
    for gap in data_gaps:
        text = str(gap or "").lower()
        if any(marker in text for marker in ("missing", "not connected", "unavailable", "not available", "not configured", "requires")):
            unresolved_gaps += 1
    evidence_gap_penalty = min(20, unresolved_gaps * 5)
    return clamp_score(completeness - fallback_penalty - evidence_gap_penalty)


def compute_core_score(report: Dict[str, Any]) -> int:
    """Weighted business-health score from the five primary visible categories."""
    report = _as_dict(report)
    section_scores = _derive_section_scores(report)
    weights = {
        "website": 0.25,
        "seo": 0.20,
        "reputation": 0.15,
        "leadGen": 0.20,
        "services": 0.20,
    }

    weighted_total = 0.0
    available_weight = 0.0
    for key, weight in weights.items():
        score = _coerce_score(section_scores.get(key))
        if score is None:
            continue
        weighted_total += score * weight
        available_weight += weight

    if available_weight <= 0:
        existing_overall = _coerce_score(_as_dict(report.get("reportMetadata")).get("overallScore"))
        return clamp_score(existing_overall) if existing_overall is not None else 0

    return clamp_score(weighted_total / available_weight)


def compute_confidence_score(report: Dict[str, Any]) -> int:
    report = _as_dict(report)
    section_scores = _derive_section_scores(report)
    evidence = _as_dict(_as_dict(report.get("appendices")).get("evidence"))
    screenshots = _as_dict(evidence.get("screenshots"))
    pages_crawled = _as_list(_as_dict(report.get("appendices")).get("pagesCrawled"))
    data_sources = _as_list(_as_dict(report.get("appendices")).get("dataSources"))

    tech_score = _get_path(report, ("websiteDigitalPresence", "technicalSEO", "score"))
    content_score = _get_path(report, ("websiteDigitalPresence", "contentQuality", "score"))
    ux_score = _get_path(report, ("websiteDigitalPresence", "uxConversion", "score"))
    data_completeness = compute_data_completeness(report)
    missing_signals = _detect_missing_signals(report)
    data_gaps = _as_list(_as_dict(report.get("appendices")).get("dataGaps"))
    unavailable_sources = sum(
        1 for gap in data_gaps
        if any(marker in str(gap or "").lower() for marker in ("missing", "not connected", "unavailable", "not available", "not configured", "requires"))
    )
    detection_reliability, reliability_penalties = _compute_detection_reliability(report)

    evidence_score = min(
        100,
        (len(section_scores) * 10)
        + min(20, len(pages_crawled))
        + min(15, len(data_sources) * 3)
        + min(15, len(_as_list(_get_path(report, ("servicesPositioning", "services")))) * 5)
        + min(10, len(_as_list(_get_path(report, ("leadGeneration", "channels")))) * 5)
        + min(10, len(_as_list(_get_path(report, ("competitiveAnalysis", "competitors")))) * 3)
        + (10 if screenshots else 0),
    )

    if data_completeness == 0 and evidence_score == 0:
        return 0

    missing_penalty = min(18, len(missing_signals) * 3)
    unavailable_source_penalty = min(24, unavailable_sources * 8)
    reliability_penalty = min(12, len(reliability_penalties) * 2)
    return clamp_score(
        (data_completeness * 0.55)
        + (evidence_score * 0.30)
        + (detection_reliability * 0.15)
        - missing_penalty
        - unavailable_source_penalty
        - reliability_penalty
    )


def _label_keyword_evidence(report: Dict[str, Any]) -> None:
    """Keep keyword opportunities distinct from verified live rankings."""
    seo = _as_dict(report.get("seoVisibility"))
    rankings = _as_dict(seo.get("keywordRankings"))
    if not rankings:
        return
    rows = _as_list(rankings.get("topRankingKeywords"))
    has_verified_rank = any(
        isinstance(row, dict) and isinstance(row.get("rank"), (int, float)) and row.get("rank") > 0
        for row in rows
    )
    if has_verified_rank:
        return
    candidates = _as_list(rankings.get("targetKeywords"))
    rankings["keywordOpportunityCount"] = len(candidates)
    rankings["totalRankingKeywords"] = 0
    rankings["rankingEvidenceStatus"] = "No verified live ranking positions returned in this run; listed terms are keyword opportunities."
    seo["keywordRankings"] = rankings
    report["seoVisibility"] = seo


_NON_OFFER_TITLE_MARKERS = (
    "case stud", "portfolio", "frequently asked", "faq", "choose your",
    "what's included", "what’s included", "tips", "challenges", "approach",
    "top-rated", "trusted platform", "stay on top", "drive high-quality",
    "technical seo, content", "performance-first",
)


def _is_final_service_offer(name: Any) -> bool:
    text = _clean_text(name)
    lowered = text.lower()
    return bool(text) and is_reportable_service_name(text) and not any(marker in lowered for marker in _NON_OFFER_TITLE_MARKERS)


def _normalise_final_report_content(report: Dict[str, Any]) -> None:
    """Apply report-level guardrails after cache, deterministic, and LLM merges."""
    services_section = _as_dict(report.get("servicesPositioning"))
    cleaned_services: List[Dict[str, Any]] = []
    seen_services: set[str] = set()
    for raw in _as_list(services_section.get("services")):
        item = raw if isinstance(raw, dict) else {"name": raw}
        name = _clean_text(item.get("name"))
        if not _is_final_service_offer(name):
            continue
        key = _text_key(name)
        if key in seen_services:
            continue
        seen_services.add(key)
        cleaned_services.append(item)
    if cleaned_services:
        services_section["services"] = cleaned_services[:12]
        offered = " ".join(_clean_text(item.get("name")).lower() for item in cleaned_services)
        services_section["serviceGaps"] = [
            gap for gap in _as_list(services_section.get("serviceGaps"))
            if _text_key(_as_dict(gap).get("service")) not in _text_key(offered)
        ]
        report["servicesPositioning"] = services_section

    metadata = _as_dict(report.get("reportMetadata"))
    profile = _as_dict(_as_dict(report.get("meta")).get("businessProfile"))
    is_white_label = profile.get("businessModel") == "white_label_agency_partner"
    if is_white_label:
        target = _as_dict(report.get("targetMarket"))
        segments = [
            {
                "segment": "UK digital agencies needing white-label fulfilment",
                "name": "UK digital agencies needing white-label fulfilment",
                "marketCountry": "United Kingdom",
                "currency": "GBP",
                "expectedBudget": {"min": 1200, "max": 4000, "currency": "GBP", "period": "month", "note": "Directional retainer range; validate during discovery."},
                "notes": "Partner agencies needing confidential SEO, PPC, or web delivery without adding permanent headcount.",
            },
            {
                "segment": "US agencies seeking retained delivery capacity",
                "name": "US agencies seeking retained delivery capacity",
                "marketCountry": "United States",
                "currency": "USD",
                "expectedBudget": {"min": 1500, "max": 5000, "currency": "USD", "period": "month", "note": "Directional retainer range; validate during discovery."},
                "notes": "Growing agencies needing dependable partner capacity, clear reporting, and agency-safe handoffs.",
            },
        ]
        target["segments"] = segments
        target["currentTargetSegments"] = deepcopy(segments)
        target["detectedSegments"] = deepcopy(segments)
        target["mentorNotes"] = "Prioritise UK and US agencies that need confidential, retained white-label delivery rather than targeting services as if they were customer segments."
        for action in _as_list(target.get("actionCandidates")):
            if isinstance(action, dict):
                details = _as_dict(action.get("details"))
                if action.get("sourceSection") == "targetMarket" or "landing pages" in _clean_text(action.get("title")).lower():
                    details["recommendation"] = "Create dedicated UK and US agency-partner pages with delivery model, turnaround expectations, proof, and an agency-safe CTA."
                    details["expectedOutcome"] = "Higher agency-fit enquiry quality and clearer white-label positioning."
                    action["details"] = details
        report["targetMarket"] = target
        report["targetMarket"] = target

        seo = _as_dict(report.get("seoVisibility"))
        rankings = _as_dict(seo.get("keywordRankings"))
        if rankings and not any(isinstance(row, dict) and isinstance(row.get("rank"), (int, float)) and row.get("rank") > 0 for row in _as_list(rankings.get("topRankingKeywords"))):
            opportunities = [
                "white label SEO services for agencies",
                "white label Google Ads management",
                "white label web development for agencies",
                "dedicated development team for agencies",
            ]
            rankings["targetKeywords"] = opportunities
            rankings["keywordOpportunityCount"] = len(opportunities)
            rankings["topRankingKeywords"] = [
                {"keyword": keyword, "rank": None, "yourRank": "Not ranking", "type": "commercial", "intent": "commercial", "priority": "high", "rankingStatus": "not ranking"}
                for keyword in opportunities
            ]
            rankings["byPriority"] = {"high": opportunities, "medium": [], "low": []}
            rankings["byIntent"] = {"commercial": opportunities, "local": []}
            rankings["nonBrandedKeywords"] = deepcopy(rankings["topRankingKeywords"])
            rankings["missingHighValueKeywords"] = deepcopy(rankings["topRankingKeywords"])
            seo["keywordRankings"] = rankings
            report["seoVisibility"] = seo

    reputation = _as_dict(report.get("reputation"))
    if _clean_text(reputation.get("reviewScore")) in {"", "—", "N/A", "-"}:
        for phase in _as_list(report.get("actionPlan90Days")):
            if not isinstance(phase, dict):
                continue
            actions = [str(action) for action in _as_list(phase.get("actions"))]
            phase["actions"] = [action for action in actions if "merchandise review proof" not in action.lower()]
            if "trust" in _clean_text(phase.get("title")).lower() and not phase["actions"]:
                phase["actions"] = ["Verify and connect public review profiles, then implement a post-delivery review-request workflow."]

    if is_white_label:
        for phase in _as_list(report.get("actionPlan90Days")):
            if not isinstance(phase, dict):
                continue
            actions = [str(action) for action in _as_list(phase.get("actions"))]
            replacement = "Build UK/US agency-partner landing pages with delivery scope, turnaround, proof, and confidential handoff messaging."
            phase["actions"] = [replacement if ("google business profile" in action.lower() or "local landing pages" in action.lower() or "citation coverage" in action.lower()) else action for action in actions]

    subscores = _as_dict(metadata.get("subScores"))
    if _clean_text(reputation.get("reviewScore")) in {"", "—", "N/A", "-"}:
        subscores.pop("reputation", None)
    # No connected spend/tooling source means cost efficiency is unmeasured,
    # not a zero-quality category.
    subscores.pop("costEfficiency", None)
    if subscores:
        metadata["subScores"] = subscores
    report["reportMetadata"] = metadata


def compute_opportunity_score(report: Dict[str, Any]) -> int:
    report = _as_dict(report)
    section_scores = _derive_section_scores(report)

    available_scores = list(section_scores.values())
    if available_scores:
        headroom_score = sum(100 - score for score in available_scores) / len(available_scores)
    else:
        headroom_score = 40

    signal_bonus = min(
        35,
        (len(_as_list(_get_path(report, ("websiteDigitalPresence", "technicalSEO", "issues")))) * 2)
        + (len(_as_list(_get_path(report, ("websiteDigitalPresence", "contentGaps")))) * 3)
        + (len(_as_list(_get_path(report, ("leadGeneration", "missingHighROIChannels")))) * 4)
        + (len(_as_list(_get_path(report, ("servicesPositioning", "serviceGaps")))) * 4)
        + (len(_as_list(_get_path(report, ("competitiveAnalysis", "opportunities")))) * 3)
        + (len(_as_list(_get_path(report, ("seoVisibility", "technicalSeo", "opportunities")))) * 2),
    )

    if not available_scores and signal_bonus == 0:
        return 0
    return _clamp_score(headroom_score + signal_bonus)


def compute_risk_score(report: Dict[str, Any]) -> int:
    report = _as_dict(report)
    section_scores = _derive_section_scores(report)
    core_score = compute_core_score(report)
    baseline_risk = 100 - float(core_score)

    risks = _as_list(_get_path(report, ("riskAssessment", "risks")))
    severity_map = {"low": 4, "medium": 8, "high": 14, "critical": 20}
    severity_bonus = 0
    for item in risks:
        if not isinstance(item, dict):
            continue
        severity_bonus += severity_map.get(_clean_text(item.get("severity")).lower(), 6)
    severity_bonus = min(35, severity_bonus)

    issue_bonus = min(
        25,
        (len(_as_list(_get_path(report, ("websiteDigitalPresence", "technicalSEO", "issues")))) * 2)
        + (len(_as_list(_get_path(report, ("websiteDigitalPresence", "uxConversion", "issues")))) * 2),
    )

    cta_penalty = 0
    ux_highlights = _as_list(_get_path(report, ("websiteDigitalPresence", "uxConversion", "highlights")))
    ux_issues = _as_list(_get_path(report, ("websiteDigitalPresence", "uxConversion", "issues")))
    if not ux_highlights and ux_issues:
        cta_penalty = 8
    if any("cta" in _text_key(item) or "conversion" in _text_key(item) for item in ux_issues):
        cta_penalty += 8

    if not section_scores and not risks and issue_bonus == 0:
        return 0
    return clamp_score((baseline_risk * 0.45) + severity_bonus + issue_bonus + cta_penalty)


def compute_final_overall_score(
    report: Dict[str, Any],
    *,
    core_score: int | None = None,
    confidence_score: int | None = None,
    risk_score: int | None = None,
) -> int:
    """Final overall business-health score using core score plus meta-score adjustments.

    Opportunity stays separate on purpose so high upside does not inflate current health.
    """
    report = _as_dict(report)
    core = compute_core_score(report) if core_score is None else clamp_score(core_score)
    confidence = compute_confidence_score(report) if confidence_score is None else clamp_score(confidence_score)
    risk = compute_risk_score(report) if risk_score is None else clamp_score(risk_score)

    if core == 0 and confidence == 0 and risk == 0:
        existing_overall = _coerce_score(_as_dict(report.get("reportMetadata")).get("overallScore"))
        return clamp_score(existing_overall) if existing_overall is not None else 0

    final_score = (core * 0.90) + (confidence * 0.05) + ((100 - risk) * 0.05)
    return clamp_score(final_score)


def apply_report_scorecard(report: Dict[str, Any]) -> Dict[str, Any]:
    """Inject deterministic meta scores without changing report structure."""
    if not isinstance(report, dict):
        return {}

    out = deepcopy(report)
    _normalise_final_report_content(out)
    _label_keyword_evidence(out)
    metadata = _as_dict(out.get("reportMetadata"))
    section_scores = _derive_section_scores(out)
    previous_overall = _coerce_score(metadata.get("overallScore"))

    if section_scores:
        merged_scores = {**_as_dict(metadata.get("subScores")), **section_scores}
        metadata["subScores"] = merged_scores

    core_score = compute_core_score(out)
    data_completeness = compute_data_completeness(out)
    confidence_score = compute_confidence_score(out)
    opportunity_score = compute_opportunity_score(out)
    risk_score = compute_risk_score(out)
    final_overall_score = compute_final_overall_score(
        out,
        core_score=core_score,
        confidence_score=confidence_score,
        risk_score=risk_score,
    )

    metadata["overallScore"] = final_overall_score
    metadata["confidenceScore"] = confidence_score
    metadata["opportunityScore"] = opportunity_score
    metadata["riskScore"] = risk_score
    metadata["scoreMeta"] = {
        "computedBy": "deterministic_report_post_processing",
        "sectionScoresUsed": section_scores,
        "coreScore": core_score,
        "dataCompleteness": data_completeness,
        "siteType": _get_path(out, ("appendices", "evidence", "extraction", "businessModelSiteType")),
        "previousOverallScore": previous_overall,
        "overallScoreFormula": "(core_score * 0.90) + (confidence_score * 0.05) + ((100 - risk_score) * 0.05)",
        "coreWeights": {
            "website": 0.25,
            "seo": 0.20,
            "reputation": 0.15,
            "leadGen": 0.20,
            "services": 0.20,
        },
        "opportunityIncludedInOverall": False,
        "missingSignals": _detect_missing_signals(out),
        "detectionReliability": _compute_detection_reliability(out)[0],
        "businessProfile": _as_dict(_as_dict(out.get("meta")).get("businessProfile")),
        "sectionRelevance": _section_relevance_snapshot(out),
        "method": "Recomputes overall score from weighted category health, then adjusts modestly for confidence and downside risk. Missing inputs reduce confidence rather than silently zeroing the business score.",
    }

    out["reportMetadata"] = metadata
    appendices = _as_dict(out.get("appendices"))
    appendices["scoreSummary"] = [
        {"area": "Website", "score": section_scores.get("website"), "notes": "Technical foundation, content quality, and UX readiness."},
        {"area": "Website Keywords", "score": _get_path(out, ("websiteDigitalPresence", "websiteKeywordAnalysis", "score")), "notes": "Keyword presence, coverage, relevance, intent match, and distribution."},
        {"area": "SEO", "score": section_scores.get("seo"), "notes": "Authority, visibility, and search-readiness."},
        {"area": "Reputation", "score": section_scores.get("reputation"), "notes": "Review strength and trust packaging."},
        {"area": "Lead Generation", "score": section_scores.get("leadGen"), "notes": "CTA clarity, channels, and funnel readiness."},
        {"area": "Services", "score": section_scores.get("services"), "notes": "Offer clarity, proof support, and positioning strength."},
    ]
    out["appendices"] = appendices
    return out


def _section_relevance_snapshot(report: Dict[str, Any]) -> Dict[str, Any]:
    meta = _as_dict(report.get("meta"))
    contexts = _as_dict(meta.get("sectionContexts"))
    snapshot: Dict[str, Any] = {}
    for key, value in contexts.items():
        if not isinstance(value, dict):
            continue
        relevance = _as_dict(value.get("relevance"))
        if relevance:
            snapshot[key] = {
                "level": relevance.get("level"),
                "reason": relevance.get("reason"),
            }
    return snapshot
