from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Sequence, Tuple
import re
import unicodedata

from app.signals.detection_utils import deduplicate_list_preserve_order
from app.pipeline.report_post_processing import dedupe_findings_preserve_order
from app.utils.currency import infer_currency_from_text


PLACEHOLDER_TEXT = {
    "",
    "n/a",
    "na",
    "none",
    "null",    
    "unknown",
    "not available",
    "no data available",
    "no data generated",
    "0",
    "0.0",
}
 
SECTION_FALLBACKS = {
    "competitiveAnalysis": "This section is currently unavailable due to limited market and competitor data.",
    "costOptimization": "This section is currently unavailable due to limited data sources.",
    "targetMarket": "This section is currently unavailable due to limited data sources.",
    "financialImpact": "This section is currently unavailable due to limited data sources.",
}

STRING_LIST_PATHS: Sequence[Tuple[str, ...]] = (
    ("executiveSummary", "strengths"),
    ("executiveSummary", "weaknesses"),
    ("executiveSummary", "highPriorityRecommendations"),
    ("websiteDigitalPresence", "technicalSEO", "issues"),
    ("websiteDigitalPresence", "technicalSEO", "strengths"),
    ("websiteDigitalPresence", "contentQuality", "strengths"),
    ("websiteDigitalPresence", "contentQuality", "gaps"),
    ("websiteDigitalPresence", "contentQuality", "recommendations"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "strengths"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "gaps"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "recommendations"),
    ("websiteDigitalPresence", "websiteKeywordAnalysis", "keywordCandidates"),
    ("websiteDigitalPresence", "uxConversion", "highlights"),
    ("websiteDigitalPresence", "uxConversion", "issues"),
    ("websiteDigitalPresence", "uxConversion", "recommendations"),
    ("leadGeneration", "missingHighROIChannels"),
    ("competitiveAdvantages", "advantages"),
)

BROKEN_TEXT_REPLACEMENTS = {
    "â€”": "-",
    "â€“": "-",
    "â€¢": "-",
    "â†’": "->",
    "âœ…": "",
    "âœ”:": "",
    "ðŸ“‹": "",
    "ðŸ‘¥": "",
    "ðŸ”": "",
    "ðŸŽ¯": "",
    "ðŸ¤–": "",
    "ðŸ”§": "",
    "ðŸ’°": "",
    "â°": "",
    "ðŸ“¢": "",
    "ðŸ“ˆ": "",
}

BROKEN_TEXT_REPLACEMENTS["\ufffd"] = ""
BROKEN_TEXT_REPLACEMENTS["&\x05"] = "&"

CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")

ESTIMATION_DISCLAIMER = (
    "Estimation Mode is ON: Sections 8-10 include modeled estimates based on the information you provided plus publicly "
    "available signals (website + listings). These numbers are directional, not audited financials, and should not be used "
    "as the sole basis for budgeting or investment decisions. For higher accuracy, provide real spend/revenue inputs or "
    "connect Ads/Analytics/CRM."
)

_CURRENCY_SYMBOLS = {
    "$": "$",
    "USD": "$",
    "US$": "$",
    "CAD": "$",
    "AUD": "$",
    "£": "£",
    "GBP": "£",
    "€": "€",
    "EUR": "€",
    "₹": "₹",
    "INR": "₹",
}


def _clean_text(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    text = " ".join(value.split()).strip()
    if not text:
        return None
    return text


def sanitize_text_for_pdf(value: Any) -> str:
    """Normalize mojibake/control characters before Node/PDF rendering."""
    text = _clean_text(value)
    if not text:
        return ""
    for broken, fixed in BROKEN_TEXT_REPLACEMENTS.items():
        text = text.replace(broken, fixed)
    text = unicodedata.normalize("NFKC", text)
    text = CONTROL_CHAR_RE.sub("", text)
    text = text.replace("\u200b", "").replace("\ufeff", "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _is_meaningful_text(value: Any) -> bool:
    text = sanitize_text_for_pdf(value)
    if not text:
        return False
    return text.lower() not in PLACEHOLDER_TEXT


def _has_meaningful_content(value: Any, *, count_numbers: bool = True) -> bool:
    if isinstance(value, dict):
        for nested in value.values():
            if _has_meaningful_content(nested, count_numbers=count_numbers):
                return True
        return False
    if isinstance(value, list):
        for nested in value:
            if _has_meaningful_content(nested, count_numbers=count_numbers):
                return True
        return False
    if isinstance(value, str):
        return _is_meaningful_text(value)
    if isinstance(value, (int, float)):
        return count_numbers
    return value is not None


def _section_has_substance(section: Any) -> bool:
    if not isinstance(section, dict):
        return False
    ignored = {
        "score",
        "overallScore",
        "confidenceScore",
        "opportunityScore",
        "riskScore",
        "breakdown",
    }
    for key, value in section.items():
        if key in ignored:
            continue
        if _has_meaningful_content(value, count_numbers=False):
            return True
    return False


def _get_path(root: Dict[str, Any], path: Sequence[str]) -> Any:
    cursor: Any = root
    for key in path:
        if not isinstance(cursor, dict):
            return None
        cursor = cursor.get(key)
    return cursor


def _set_path(root: Dict[str, Any], path: Sequence[str], value: Any) -> None:
    cursor: Dict[str, Any] = root
    for key in path[:-1]:
        child = cursor.get(key)
        if not isinstance(child, dict):
            child = {}
            cursor[key] = child
        cursor = child
    cursor[path[-1]] = value


def _clean_string_list(values: Any) -> List[str]:
    if not isinstance(values, list):
        return []
    cleaned: List[str] = []
    for value in values:
        text = _clean_text(value)
        if text and _is_meaningful_text(text):
            cleaned.append(text)
    return dedupe_findings_preserve_order(deduplicate_list_preserve_order(cleaned))


def _clean_dict_list(values: Any) -> List[Dict[str, Any]]:
    if not isinstance(values, list):
        return []
    cleaned: List[Dict[str, Any]] = []
    for value in values:
        if not isinstance(value, dict):
            continue
        if _has_meaningful_content(value, count_numbers=False):
            cleaned.append(value)
    return cleaned


def _dedupe_dict_list(values: Any, text_keys: Sequence[str]) -> List[Dict[str, Any]]:
    return [
        item for item in dedupe_findings_preserve_order(_clean_dict_list(values), text_keys=text_keys)
        if isinstance(item, dict)
    ]


def _normalize_keyword_entry(item: Any) -> Dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    keyword = _clean_text(item.get("keyword") or item.get("term") or item.get("query"))
    if not keyword:
        return None
    return {
        "keyword": keyword,
        "monthlySearches": item.get("monthlySearches", item.get("searchVolume")),
        "difficulty": item.get("difficulty", item.get("competitionIntensity")),
        "intent": item.get("intent", item.get("label")),
        "currentRank": item.get("currentRank", item.get("rank")),
    }


def _sanitize_nested_strings(value: Any) -> Any:
    if isinstance(value, dict):
        out: Dict[str, Any] = {}
        for key, item in value.items():
            if key in {"b64", "url", "website", "pdfUrl", "reportId", "token"}:
                out[key] = item
            else:
                out[key] = _sanitize_nested_strings(item)
        return out
    if isinstance(value, list):
        return [_sanitize_nested_strings(item) for item in value]
    if isinstance(value, str):
        return sanitize_text_for_pdf(value)
    return value


def _has_signal(items: Any, *tokens: str) -> bool:
    hay = str(items or "").lower()
    return any(token in hay for token in tokens)


def sync_cross_section_signals(report: Dict[str, Any]) -> Dict[str, Any]:
    """Align soft detections across sections so the final report does not contradict itself.

    Also syncs page-registry truth into appendix A (keyPagesDetected) so the
    appendix never shows 'No' for a page that the crawl or content-quality
    section already confirmed as present.
    """
    cleaned = deepcopy(report) if isinstance(report, dict) else {}

    website = cleaned.get("websiteDigitalPresence")
    services = cleaned.get("servicesPositioning")
    lead = cleaned.get("leadGeneration")
    appendices = cleaned.get("appendices")

    if not all(isinstance(section, dict) for section in (website, services, lead, appendices)):
        return cleaned

    content = website.get("contentQuality")
    ux = website.get("uxConversion")
    if not isinstance(content, dict):
        content = {}
        website["contentQuality"] = content
    if not isinstance(ux, dict):
        ux = {}
        website["uxConversion"] = ux

    strengths = _clean_string_list(content.get("strengths"))
    gaps = _clean_string_list(content.get("gaps"))
    recommendations = _clean_string_list(content.get("recommendations"))
    channels = _clean_dict_list(lead.get("channels"))
    missing_channels = _clean_string_list(lead.get("missingHighROIChannels"))
    service_rows = _clean_dict_list(services.get("services"))

    proof_detected = (
        _has_signal(content.get("meta"), "case", "testimonial", "trust")
        or _has_signal(strengths, "case-study", "portfolio", "testimonial", "review", "trusted by")
        or _has_signal(services.get("mentorNotes"), "trust signals detected", "proof/case-study")
    )
    cta_detected = any(str((row.get("status") or "")).lower() == "detected" for row in channels) or _has_signal(
        ux.get("highlights"), "cta", "conversion"
    )
    services_detected = bool(service_rows) or _has_signal(services.get("mentorNotes"), "services are clearly present")

    if proof_detected:
        gaps = [
            item
            for item in gaps
            if "case studies" not in item.lower() and "testimonials" not in item.lower()
        ]
        if not _has_signal(strengths, "case-study", "testimonial", "review", "trusted by"):
            strengths.append("Proof and trust signals are present, though some are only partially structured.")

    if cta_detected:
        ux["issues"] = [
            item
            for item in _clean_string_list(ux.get("issues"))
            if "no conversion positives detected" not in item.lower()
            and "could not be structurally confirmed" not in item.lower()
        ]
        missing_channels = [
            item for item in missing_channels if "cta signals" not in item.lower()
        ]
        if not _clean_string_list(ux.get("highlights")):
            ux["highlights"] = ["Conversion intent signals are present, though CTA extraction is not fully structured."]

    if services_detected:
        appendices["dataGaps"] = [
            item
            for item in _clean_dict_list(appendices.get("dataGaps"))
            if "service" not in str(item.get("area") or "").lower()
        ]

    content["strengths"] = dedupe_findings_preserve_order(strengths)
    content["gaps"] = dedupe_findings_preserve_order(gaps)
    content["recommendations"] = dedupe_findings_preserve_order(recommendations)
    lead["missingHighROIChannels"] = dedupe_findings_preserve_order(missing_channels)

    # ── Appendix A: sync keyPagesDetected from multiple sources so it never ──
    # shows "No" for a page the crawl or content-quality section already confirmed.
    _sync_key_pages_detected(cleaned)

    return cleaned


def _sync_key_pages_detected(report: Dict[str, Any]) -> None:
    """Ensure appendix A keyPagesDetected reflects reality from crawl + content signals.

    Sources (in priority order):
    1. appendices.evidence.pageRegistry.pages  (from page_registry builder)
    2. appendices.keyPagesDetected             (already populated from registry in orchestrator)
    3. websiteDigitalPresence.contentQuality.strengths signal text
    4. websiteDigitalPresence.contentGaps text
    """
    appendices = report.get("appendices")
    if not isinstance(appendices, dict):
        return

    # Build truth table from existing keyPagesDetected
    key_pages = _clean_dict_list(appendices.get("keyPagesDetected"))
    if not key_pages:
        return

    # Build a mapping of page-type → present signal from evidence
    evidence = appendices.get("evidence") or {}
    page_registry = evidence.get("pageRegistry") or {} if isinstance(evidence, dict) else {}
    registry_pages = page_registry.get("pages") or {} if isinstance(page_registry, dict) else {}

    # Read presence signals from content quality strengths
    website = report.get("websiteDigitalPresence") or {}
    content = website.get("contentQuality") or {} if isinstance(website, dict) else {}
    strengths_text = " ".join(_clean_string_list(content.get("strengths"))).lower()
    content_gaps_text = " ".join(_clean_string_list(website.get("contentGaps") or [])).lower()

    # Page-type → signals that prove it exists
    _page_signals: dict[str, list[str]] = {
        "about":    ["about/company content appears present", "about page", "/about"],
        "contact":  ["contact page appears present", "/contact", "contact page"],
        "services": ["service information pages are present", "/services", "service page"],
        "proof":    ["case-study or portfolio signal", "testimonial or review signal", "/portfolio", "/case-stud"],
        "pricing":  ["pricing/package signals found", "/pricing", "/packages"],
        "faq":      ["faq content appears present", "/faq"],
        "blog":     ["blog/insights content appears present", "/blog", "/insights"],
    }

    updated_pages = []
    for row in key_pages:
        if not isinstance(row, dict):
            updated_pages.append(row)
            continue

        page_type = _clean_text(row.get("page", "")).lower()
        current_present = _clean_text(row.get("present", "")).lower() == "yes"

        if current_present:
            updated_pages.append(row)
            continue

        # Check registry
        registry_info = registry_pages.get(page_type) or {}
        if isinstance(registry_info, dict):
            reg_present = bool(
                registry_info.get("present")
                or registry_info.get("servicesPagePresent")
                or registry_info.get("primary")
            )
            if reg_present:
                primary_url = _clean_text(
                    registry_info.get("primary") or registry_info.get("primaryUrl") or ""
                )
                updated_pages.append({
                    **row,
                    "present": "Yes",
                    "primaryUrl": primary_url or row.get("primaryUrl", "-"),
                })
                continue

        # Check content signals
        signals = _page_signals.get(page_type, [])
        signal_hit = any(sig in strengths_text for sig in signals)
        if not signal_hit:
            # Check if the page is mentioned as present in content gaps (negation = was missing)
            # If a gap says "No X page detected" it means absent → keep as No
            signal_hit = any(sig in strengths_text for sig in signals)

        if signal_hit:
            updated_pages.append({**row, "present": "Yes"})
            continue

        updated_pages.append(row)

    appendices["keyPagesDetected"] = updated_pages


def estimate_leads(traffic: float | int | None, conversion_rate: float | None) -> int:
    try:
        if traffic is None or conversion_rate is None:
            return 0
        return max(0, int(round(float(traffic) * float(conversion_rate))))
    except Exception:
        return 0


def estimate_revenue(leads: int | float | None, close_rate: float | None, avg_deal_size: float | None) -> float:
    try:
        if leads is None or close_rate is None or avg_deal_size is None:
            return 0.0
        return max(0.0, float(leads) * float(close_rate) * float(avg_deal_size))
    except Exception:
        return 0.0


def _extract_keyword_volume(report: Dict[str, Any]) -> int:
    total = 0
    appendices = report.get("appendices")
    if not isinstance(appendices, dict):
        return 0
    for tier in appendices.get("keywords") or []:
        if not isinstance(tier, dict):
            continue
        items = tier.get("keywords") if isinstance(tier.get("keywords"), list) else tier.get("items")
        if not isinstance(items, list):
            continue
        for item in items[:20]:
            if not isinstance(item, dict):
                continue
            volume = item.get("monthlySearches", item.get("searchVolume", item.get("search_volume")))
            try:
                if volume is not None:
                    total += max(0, int(float(volume)))
            except Exception:
                continue
    return total


def build_financial_assumptions(report: Dict[str, Any]) -> Dict[str, Any]:
    metadata = report.get("reportMetadata") if isinstance(report.get("reportMetadata"), dict) else {}
    subs = metadata.get("subScores") if isinstance(metadata.get("subScores"), dict) else {}
    appendices = report.get("appendices") if isinstance(report.get("appendices"), dict) else {}
    extraction = appendices.get("evidence", {}).get("extraction", {}) if isinstance(appendices.get("evidence"), dict) else {}

    site_type = extraction.get("businessModelSiteType") or "mixed"
    website_score = int(subs.get("website") or 0)
    seo_score = int(subs.get("seo") or 0)
    reputation_score = int(subs.get("reputation") or 0)
    lead_score = int(subs.get("leadGen") or 0)
    services_score = int(subs.get("services") or 0)
    services_section = report.get("servicesPositioning") if isinstance(report.get("servicesPositioning"), dict) else {}
    lead_section = report.get("leadGeneration") if isinstance(report.get("leadGeneration"), dict) else {}
    keyword_section = report.get("websiteDigitalPresence", {}).get("websiteKeywordAnalysis") if isinstance(report.get("websiteDigitalPresence"), dict) else {}
    services_count = len(_clean_dict_list(services_section.get("services"))) if isinstance(services_section, dict) else 0
    keyword_volume = _extract_keyword_volume(report)
    keyword_candidates = len(_clean_string_list(keyword_section.get("keywordCandidates"))) if isinstance(keyword_section, dict) else 0
    target_market = report.get("targetMarket") if isinstance(report.get("targetMarket"), dict) else {}
    segments = _clean_dict_list(target_market.get("segments")) if isinstance(target_market, dict) else []
    industries = services_section.get("industriesServed") if isinstance(services_section, dict) and isinstance(services_section.get("industriesServed"), dict) else {}
    segment_count = max(len(segments), len(_clean_dict_list(industries.get("highValueIndustries"))))
    cta_detected = bool(_clean_dict_list(lead_section.get("channels")) or _clean_dict_list(lead_section.get("leadMagnets")))
    pricing_detected = any(_is_meaningful_text(row.get("startingPrice")) for row in _clean_dict_list(services_section.get("services")))
    reputation = report.get("reputation") if isinstance(report.get("reputation"), dict) else {}
    trust_detected = bool(
        (reputation.get("totalReviews") or 0)
        or _clean_dict_list(reputation.get("summaryTable"))
        or _clean_string_list(reputation.get("sentimentThemes", {}).get("positive") if isinstance(reputation.get("sentimentThemes"), dict) else [])
    )

    if site_type == "service_business":
        visibility_capture_rate = 0.03 if seo_score < 50 else 0.05 if seo_score < 70 else 0.07
        conversion_rate = 0.018 if lead_score < 50 else 0.028 if lead_score < 70 else 0.04
        close_rate = 0.15 if lead_score < 50 else 0.2 if lead_score < 70 else 0.25
        avg_deal_size = 1500 + (services_count * 350)
    elif site_type == "content_site":
        visibility_capture_rate = 0.04 if seo_score < 50 else 0.06
        conversion_rate = 0.01 if lead_score < 50 else 0.015
        close_rate = 0.04 if lead_score < 50 else 0.07
        avg_deal_size = 600
    elif site_type == "ecommerce":
        visibility_capture_rate = 0.02 if seo_score < 50 else 0.035
        conversion_rate = 0.012 if lead_score < 50 else 0.02
        close_rate = 0.12
        avg_deal_size = 180
    else:
        visibility_capture_rate = 0.03
        conversion_rate = 0.02
        close_rate = 0.12
        avg_deal_size = 1000

    evidence_mode = "keyword_model"
    if keyword_volume > 0:
        modeled_traffic = max(0, int(round(keyword_volume * visibility_capture_rate)))
    else:
        evidence_mode = "heuristic_model"
        base_demand = {
            "service_business": 320,
            "content_site": 650,
            "ecommerce": 1200,
            "mixed": 420,
        }.get(site_type, 420)
        demand_multiplier = (
            0.9
            + min(0.45, services_count * 0.08)
            + min(0.2, keyword_candidates * 0.03)
            + min(0.18, segment_count * 0.06)
        )
        seo_multiplier = 0.85 + ((100 - max(seo_score, 40)) / 100.0) * 0.25
        modeled_traffic = max(120, int(round(base_demand * demand_multiplier * seo_multiplier)))
    modeled_leads = estimate_leads(modeled_traffic, conversion_rate)
    modeled_revenue = estimate_revenue(modeled_leads, close_rate, avg_deal_size)

    confidence = 52
    if keyword_volume > 0:
        confidence += 10
    if services_count > 0:
        confidence += 4
    if segment_count > 0:
        confidence += 4
    if cta_detected:
        confidence += 4
    if trust_detected:
        confidence += 3
    if seo_score > 0:
        confidence += 3
    if lead_score > 0:
        confidence += 3

    return {
        "usable": True,
        "confidence": min(80, confidence),
        "siteType": site_type,
        "evidenceMode": evidence_mode,
        "websiteScore": website_score,
        "seoScore": seo_score,
        "leadScore": lead_score,
        "reputationScore": reputation_score,
        "servicesScore": services_score,
        "servicesCount": services_count,
        "segmentCount": max(segment_count, 1 if _is_meaningful_text(report.get("meta", {}).get("targetMarket") if isinstance(report.get("meta"), dict) else None) else 0),
        "ctaDetected": cta_detected,
        "pricingDetected": pricing_detected,
        "trustDetected": trust_detected,
        "keywordDemand": keyword_volume,
        "visibilityCaptureRate": visibility_capture_rate,
        "traffic": modeled_traffic,
        "conversionRate": conversion_rate,
        "leads": modeled_leads,
        "closeRate": close_rate,
        "avgDealSize": avg_deal_size,
        "revenue": modeled_revenue,
        "notes": [
            (
                f"Modeled organic traffic = keyword demand ({keyword_volume:,}) x visibility capture rate ({visibility_capture_rate:.1%})."
                if keyword_volume > 0
                else f"Keyword demand was not available, so traffic was estimated conservatively from site type ({site_type}), service breadth, and SEO evidence."
            ),
            f"Modeled leads = traffic ({modeled_traffic:,}) x conversion rate ({conversion_rate:.1%}).",
            f"Modeled revenue = leads ({modeled_leads:,}) x close rate ({close_rate:.1%}) x average deal size ({avg_deal_size:,.0f}).",
        ],
    }


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def _parse_compact_numeric_token(value: Any) -> float | None:
    if value is None or value == "" or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = sanitize_text_for_pdf(value)
    if not text:
        return None
    normalized = (
        text.replace(",", "")
        .replace("₹", "")
        .replace("$", "")
        .replace("£", "")
        .replace("€", "")
        .replace("%", "")
        .strip()
        .lower()
    )
    normalized = re.sub(r"(?:/|\bper\b)\s*(mo|month|yr|year|annum)\b", "", normalized).strip()
    match = re.search(r"-?\d+(?:\.\d+)?\s*(k|m|l|lac|lakh|cr|crore)?", normalized)
    if not match:
        return None
    try:
        base_match = re.search(r"-?\d+(?:\.\d+)?", match.group(0))
        if not base_match:
            return None
        base = float(base_match.group(0))
    except Exception:
        return None
    suffix_match = re.search(r"(k|m|l|lac|lakh|cr|crore)$", match.group(0).strip())
    if not suffix_match:
        return base
    suffix = suffix_match.group(1)
    if suffix == "k":
        return base * 1_000.0
    if suffix == "m":
        return base * 1_000_000.0
    if suffix in ("l", "lac", "lakh"):
        return base * 100_000.0
    if suffix in ("cr", "crore"):
        return base * 10_000_000.0
    return base


def _safe_float(value: Any) -> float | None:
    return _parse_compact_numeric_token(value)


def _first_value(source: Dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in source and source.get(key) not in (None, ""):
            return source.get(key)
    return None


def _as_non_negative(value: Any) -> float | None:
    parsed = _safe_float(value)
    if parsed is None:
        return None
    return max(0.0, parsed)


def _as_ratio(value: Any) -> float | None:
    parsed = _safe_float(value)
    if parsed is None:
        return None
    if parsed > 1:
        parsed = parsed / 100.0
    return _clamp(parsed, 0.0, 1.0)


def _money_symbol_for(code_or_symbol: Any) -> str | None:
    if not code_or_symbol:
        return None
    text = sanitize_text_for_pdf(code_or_symbol).upper()
    if not text:
        return None
    return _CURRENCY_SYMBOLS.get(text) or (str(code_or_symbol) if str(code_or_symbol) in _CURRENCY_SYMBOLS.values() else None)


def _resolve_currency_symbol(report: Dict[str, Any], user_financials: Dict[str, Any] | None = None) -> str:
    user_financials = user_financials if isinstance(user_financials, dict) else {}
    direct = _money_symbol_for(
        _first_value(user_financials, "currencySymbol", "currency_symbol", "currencyCode", "currency")
    )
    if direct:
        return str(direct)

    for section_name in ("financialImpact", "costOptimization", "targetMarket"):
        section = report.get(section_name)
        if not isinstance(section, dict):
            continue
        currency_context = section.get("currencyContext")
        if not isinstance(currency_context, dict):
            continue
        company_currency = currency_context.get("companyCurrency")
        if isinstance(company_currency, dict) and company_currency.get("symbol"):
            return sanitize_text_for_pdf(company_currency.get("symbol")) or "$"
        if currency_context.get("symbol"):
            return sanitize_text_for_pdf(currency_context.get("symbol")) or "$"

    meta = report.get("meta") if isinstance(report.get("meta"), dict) else {}
    for hint in (meta.get("location"), meta.get("targetMarket")):
        info = infer_currency_from_text(sanitize_text_for_pdf(hint))
        if getattr(info, "symbol", None):
            return info.symbol
    return "$"


def _format_percent(value: float) -> str:
    pct = max(0.0, value) * 100.0
    if pct >= 10:
        return f"{pct:.0f}%"
    if pct >= 1:
        return f"{pct:.1f}%".replace(".0%", "%")
    return f"{pct:.2f}%".replace(".00%", "%")


def _format_money(value: float, symbol: str = "$") -> str:
    raw_amount = float(value or 0.0)
    sign = "-" if raw_amount < 0 else ""
    amount = abs(raw_amount)
    if amount >= 1_000_000:
        text = f"{amount / 1_000_000:.2f}".rstrip("0").rstrip(".")
        return f"{sign}{symbol}{text}M"
    if amount >= 1_000:
        text = f"{amount / 1_000:.1f}".rstrip("0").rstrip(".")
        return f"{sign}{symbol}{text}K"
    return f"{sign}{symbol}{amount:,.0f}"


def _format_money_range(low: float, high: float, symbol: str = "$") -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if abs(high - low) <= max(1.0, high * 0.05):
        return _format_money(high, symbol)
    return f"{_format_money(low, symbol)}-{_format_money(high, symbol)}"


def _format_money_precise(value: float, symbol: str = "$") -> str:
    raw_amount = float(value or 0.0)
    sign = "-" if raw_amount < 0 else ""
    amount = abs(raw_amount)
    return f"{sign}{symbol}{amount:,.0f}"


def _format_money_range_precise(low: float, high: float, symbol: str = "$") -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if abs(high - low) <= max(1.0, high * 0.05):
        return _format_money_precise(high, symbol)
    return f"{_format_money_precise(low, symbol)} - {_format_money_precise(high, symbol)}"


def _format_number_range(low: float, high: float, digits: int = 0) -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if digits <= 0:
        low_text = f"{int(round(low)):,}"
        high_text = f"{int(round(high)):,}"
    else:
        low_text = f"{low:.{digits}f}".rstrip("0").rstrip(".")
        high_text = f"{high:.{digits}f}".rstrip("0").rstrip(".")
    return low_text if low_text == high_text else f"{low_text}-{high_text}"


def _format_percent_range(low: float, high: float) -> str:
    low_text = _format_percent(low)
    high_text = _format_percent(high)
    return low_text if low_text == high_text else f"{low_text}-{high_text}"


def _format_roi(low: float, high: float) -> str:
    low = max(0.0, float(low or 0.0))
    high = max(low, float(high or 0.0))
    if abs(high - low) <= 0.15:
        return f"{high:.1f}x".replace(".0x", "x")
    return f"{low:.1f}x-{high:.1f}x".replace(".0x", "x")


def _sum_present(values: Sequence[float | None]) -> float:
    return float(sum(value for value in values if value is not None))


def _normalize_user_financials(user_financials: Dict[str, Any] | None) -> Dict[str, Any]:
    raw = user_financials if isinstance(user_financials, dict) else {}
    improvement_factors = raw.get("improvement_factors")
    if not isinstance(improvement_factors, dict):
        improvement_factors = raw.get("improvementFactors") if isinstance(raw.get("improvementFactors"), dict) else {}

    return {
        "currency": _first_value(raw, "currency", "currencyCode", "currency_code"),
        "monthly_payroll": _as_non_negative(_first_value(raw, "monthly_payroll", "monthlyPayroll", "monthlyPayrollCost", "monthly_payroll_cost")),
        "monthly_overhead": _as_non_negative(_first_value(raw, "monthly_overhead", "monthlyOverhead", "monthlyOverheadCost", "monthly_overhead_cost")),
        "monthly_tools_cost": _as_non_negative(_first_value(raw, "monthly_tools_cost", "monthlyToolsCost", "monthly_tools")),
        "monthly_marketing_cost": _as_non_negative(_first_value(raw, "monthly_marketing_cost", "monthlyMarketingCost", "monthlyAdSpend", "monthly_ad_spend")),
        "current_monthly_revenue": _as_non_negative(_first_value(raw, "current_monthly_revenue", "currentMonthlyRevenue", "monthlyRevenue", "monthlyRecurringRevenue", "current_revenue")),
        "current_monthly_revenue_range": _first_value(raw, "current_monthly_revenue_range", "currentMonthlyRevenueRange", "monthlyRevenueRange", "monthlyRevenue", "currentMonthlyRevenue"),
        "avg_deal_size": _as_non_negative(_first_value(raw, "avg_deal_size", "avgDealSize", "avgDealValue", "avg_deal_value")),
        "avg_deal_size_range": _first_value(raw, "avg_deal_size_range", "avgDealSizeRange", "avgDealValueRange", "avgDealValue", "avgDealSize"),
        "close_rate": _as_ratio(_first_value(raw, "close_rate", "closeRate")),
        "close_rate_range": _first_value(raw, "close_rate_range", "closeRateRange", "closeRate"),
        "monthly_traffic": _as_non_negative(_first_value(raw, "monthly_traffic", "monthlyTraffic", "currentTrafficPerMonth", "current_monthly_traffic")),
        "site_conversion_rate": _as_ratio(_first_value(raw, "site_conversion_rate", "siteConversionRate", "conversionRate", "visitorToLeadRate")),
        "monthly_leads": _as_non_negative(_first_value(raw, "monthly_leads", "monthlyLeads", "qualifiedLeadsPerMonth", "qualifiedLeads")),
        "monthly_leads_range": _first_value(raw, "monthly_leads_range", "monthlyLeadsRange", "qualifiedLeadsPerMonthRange", "qualifiedLeadsRange", "leadsPerMonthRange", "monthlyLeads", "qualifiedLeadsPerMonth", "qualifiedLeads"),
        "implementation_cost": _as_non_negative(_first_value(raw, "implementation_cost", "implementationCost")),
        "improvement_factors": {
            "seo_growth_pct": _as_ratio(_first_value(improvement_factors, "seo_growth_pct", "seoGrowthPct")),
            "conversion_rate_lift_pct": _as_ratio(_first_value(improvement_factors, "conversion_rate_lift_pct", "conversionRateLiftPct")),
            "price_increase_pct": _as_ratio(_first_value(improvement_factors, "price_increase_pct", "priceIncreasePct")),
            "cost_savings_pct": _as_ratio(_first_value(improvement_factors, "cost_savings_pct", "costSavingsPct")),
        },
    }


def _extract_user_financials(report: Dict[str, Any]) -> Dict[str, Any]:
    meta = report.get("meta") if isinstance(report.get("meta"), dict) else {}
    merged: Dict[str, Any] = {}
    for key in ("userFinancials", "businessInputs", "optionalBusinessInputs"):
        candidate = meta.get(key)
        if isinstance(candidate, dict) and candidate:
            merged.update(candidate)
    estimation_inputs = meta.get("estimationInputs")
    if isinstance(estimation_inputs, dict) and estimation_inputs:
        merged.update({k: v for k, v in estimation_inputs.items() if v not in (None, "", [])})
    return merged


def _has_actual_company_data(user_financials: Dict[str, Any]) -> bool:
    numeric_fields = [
        "monthly_payroll",
        "monthly_overhead",
        "monthly_tools_cost",
        "monthly_marketing_cost",
        "current_monthly_revenue",
        "avg_deal_size",
        "close_rate",
        "monthly_traffic",
        "site_conversion_rate",
        "monthly_leads",
        "implementation_cost",
    ]
    present = sum(1 for key in numeric_fields if user_financials.get(key) is not None)
    cost_present = any(user_financials.get(key) is not None for key in ("monthly_payroll", "monthly_overhead", "monthly_tools_cost", "monthly_marketing_cost"))
    revenue_present = user_financials.get("current_monthly_revenue") is not None
    funnel_present = sum(
        1
        for key in ("monthly_traffic", "site_conversion_rate", "avg_deal_size", "close_rate", "monthly_leads")
        if user_financials.get(key) is not None
    )
    return present >= 3 or (cost_present and revenue_present) or funnel_present >= 3


def _extract_keyword_count(report_data: Dict[str, Any]) -> int:
    seo = report_data.get("seoVisibility") if isinstance(report_data.get("seoVisibility"), dict) else {}
    keyword_rankings = seo.get("keywordRankings") if isinstance(seo.get("keywordRankings"), dict) else {}
    direct_total = _safe_float(
        keyword_rankings.get("totalRankingKeywords")
        or keyword_rankings.get("total_keywords")
        or keyword_rankings.get("keywordCount")
    )
    if direct_total is not None and direct_total > 0:
        return int(direct_total)

    counts = [
        len(_clean_dict_list(keyword_rankings.get("topRankingKeywords"))),
        len(_clean_dict_list(keyword_rankings.get("nonBrandedKeywords"))),
        len(_clean_dict_list(keyword_rankings.get("missingHighValueKeywords"))),
    ]
    website_keyword_analysis = (
        report_data.get("websiteDigitalPresence", {}).get("websiteKeywordAnalysis")
        if isinstance(report_data.get("websiteDigitalPresence"), dict)
        else {}
    )
    if isinstance(website_keyword_analysis, dict):
        counts.append(len(_clean_string_list(website_keyword_analysis.get("keywordCandidates"))))
        counts.append(len(_clean_dict_list(website_keyword_analysis.get("opportunities"))))

    appendices = report_data.get("appendices") if isinstance(report_data.get("appendices"), dict) else {}
    for tier in _clean_dict_list(appendices.get("keywords")):
        items = tier.get("keywords") if isinstance(tier.get("keywords"), list) else tier.get("items")
        if isinstance(items, list):
            counts.append(len(_clean_dict_list(items)))
    return max([count for count in counts if count > 0], default=0)


def _extract_domain_authority(report_data: Dict[str, Any]) -> float:
    seo = report_data.get("seoVisibility") if isinstance(report_data.get("seoVisibility"), dict) else {}
    domain_authority = seo.get("domainAuthority") if isinstance(seo.get("domainAuthority"), dict) else {}
    return max(0.0, float(_safe_float(domain_authority.get("score")) or 0.0))


def _extract_total_backlinks(report_data: Dict[str, Any]) -> float:
    seo = report_data.get("seoVisibility") if isinstance(report_data.get("seoVisibility"), dict) else {}
    backlinks = seo.get("backlinks") if isinstance(seo.get("backlinks"), dict) else {}
    referring_domains = _safe_float(backlinks.get("referringDomains"))
    total_backlinks = _safe_float(backlinks.get("totalBacklinks"))
    return max(0.0, float(total_backlinks or referring_domains or 0.0))


def _default_avg_service_price(report_data: Dict[str, Any], symbol: str) -> float:
    services = (
        report_data.get("servicesPositioning", {}).get("services")
        if isinstance(report_data.get("servicesPositioning"), dict)
        else []
    )
    parsed_prices = []
    for service in _clean_dict_list(services):
        price = _safe_float(service.get("startingPrice"))
        if price is not None and price > 0:
            parsed_prices.append(price)
    if parsed_prices:
        parsed_prices.sort()
        return float(parsed_prices[len(parsed_prices) // 2])

    appendices = report_data.get("appendices") if isinstance(report_data.get("appendices"), dict) else {}
    extraction = appendices.get("evidence", {}).get("extraction", {}) if isinstance(appendices.get("evidence"), dict) else {}
    site_type = sanitize_text_for_pdf(extraction.get("businessModelSiteType") or extraction.get("siteType") or "mixed").lower()
    is_inr = symbol == "₹"
    if site_type == "ecommerce":
        return 2500.0 if is_inr else 180.0
    if site_type == "content_site":
        return 12000.0 if is_inr else 900.0
    if site_type == "local_service_business":
        return 15000.0 if is_inr else 1200.0
    return 20000.0 if is_inr else 2500.0


def _parse_numeric_value(value: Any, *, percent_hint: bool = False) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        number = float(value)
        if percent_hint and number > 1:
            number /= 100.0
        return number if number > 0 else None
    text = sanitize_text_for_pdf(value)
    if not text:
        return None
    text = text.lower().strip()
    text = text.replace(",", "").replace(" ", "")
    text = text.replace("₹", "").replace("$", "").replace("£", "").replace("€", "")
    text = text.replace("/month", "").replace("/mo", "").replace("/year", "").replace("/yr", "")
    text = re.sub(r"per(month|mo|year|yr)\b", "", text)
    text = text.strip()
    match = re.fullmatch(r"(-?\d+(?:\.\d+)?)(k|m|l|lac|lakh|cr|crore)?", text)
    if not match:
        return None
    number = float(match.group(1))
    suffix = (match.group(2) or "").lower()
    multipliers = {
        "k": 1_000.0,
        "m": 1_000_000.0,
        "l": 100_000.0,
        "lac": 100_000.0,
        "lakh": 100_000.0,
        "cr": 10_000_000.0,
        "crore": 10_000_000.0,
    }
    number *= multipliers.get(suffix, 1.0)
    if percent_hint and number > 1:
        number /= 100.0
    return number if number > 0 else None


def _parse_numeric_range(value: Any, *, percent_hint: bool = False) -> Tuple[float, float] | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        parsed = _parse_numeric_value(value, percent_hint=percent_hint)
        return (parsed, parsed) if parsed is not None else None

    text = sanitize_text_for_pdf(value)
    if not text:
        return None
    percent_mode = percent_hint or ("%" in text)
    normalized = (
        text.lower()
        .replace("₹", "")
        .replace("$", "")
        .replace("£", "")
        .replace("€", "")
        .replace(",", "")
    )
    normalized = re.sub(r"\bto\b", "-", normalized)
    normalized = normalized.replace("–", "-").replace("—", "-")
    normalized = normalized.replace("/month", "").replace("/mo", "").replace("/year", "").replace("/yr", "")
    normalized = re.sub(r"per\s+(month|mo|year|yr)\b", "", normalized)
    normalized = normalized.replace(" ", "").strip()

    matches = re.findall(r"\d+(?:\.\d+)?(?:k|m|l|lac|lakh|cr|crore)?", normalized)
    if not matches:
        parsed = _parse_numeric_value(normalized, percent_hint=percent_mode)
        return (parsed, parsed) if parsed is not None else None

    parsed_numbers = [
        _parse_numeric_value(match, percent_hint=percent_mode)
        for match in matches[:2]
    ]
    parsed_numbers = [number for number in parsed_numbers if number is not None]
    if not parsed_numbers:
        return None
    if len(parsed_numbers) == 1:
        return (parsed_numbers[0], parsed_numbers[0])
    low, high = sorted((float(parsed_numbers[0]), float(parsed_numbers[1])))
    return (low, high)


def _resolve_numeric_range(
    normalized: Dict[str, Any],
    *,
    value_key: str,
    range_key: str,
    percent_hint: bool = False,
) -> Tuple[float, float] | None:
    raw_range_value = normalized.get(range_key)
    if isinstance(raw_range_value, str) and any(token in raw_range_value for token in ("-", "–", "—", "to", "%")):
        parsed_range = _parse_numeric_range(raw_range_value, percent_hint=percent_hint)
        if parsed_range is not None:
            return parsed_range
    numeric_value = _parse_numeric_value(normalized.get(value_key), percent_hint=percent_hint)
    if numeric_value is not None:
        return (numeric_value, numeric_value)
    return _parse_numeric_range(normalized.get(range_key), percent_hint=percent_hint)


def _round_financial_value(value: float) -> float:
    if value <= 0:
        return 0.0
    rounded = float(int(round(value / 1000.0) * 1000))
    return rounded if rounded > 0 else 1000.0


def _format_revenue_band(low: float, high: float, symbol: str) -> str:
    if abs(high - low) < 1.0:
        return f"{_format_money_precise(high, symbol)} / month"
    return f"{_format_money_precise(low, symbol)} - {_format_money_precise(high, symbol)} / month"


def _format_revenue_band_year(low: float, high: float, symbol: str) -> str:
    if abs(high - low) < 1.0:
        return f"{_format_money_precise(high, symbol)} / year"
    return f"{_format_money_precise(low, symbol)} - {_format_money_precise(high, symbol)} / year"


def _build_monthly_revenue_estimate(normalized: Dict[str, Any], symbol: str) -> Dict[str, Any]:
    monthly_revenue_range = _resolve_numeric_range(
        normalized,
        value_key="current_monthly_revenue",
        range_key="current_monthly_revenue_range",
    )
    if monthly_revenue_range is not None and monthly_revenue_range[0] > 0 and monthly_revenue_range[1] > 0:
        monthly_low = _round_financial_value(monthly_revenue_range[0])
        monthly_high = _round_financial_value(monthly_revenue_range[1])
        if monthly_high < monthly_low:
            monthly_high = monthly_low
        yearly_low = _round_financial_value(monthly_low * 12.0)
        yearly_high = _round_financial_value(monthly_high * 12.0)
        return {
            "monthlyRevenueEstimate": {
                "min": monthly_low,
                "max": monthly_high,
                "formatted": _format_revenue_band(monthly_low, monthly_high, symbol),
                "source": "user_input",
            },
            "yearlyRevenueEstimate": {
                "min": yearly_low,
                "max": yearly_high,
                "formatted": _format_revenue_band_year(yearly_low, yearly_high, symbol),
            },
        }

    leads_range = _resolve_numeric_range(
        normalized,
        value_key="monthly_leads",
        range_key="monthly_leads_range",
    )
    close_rate_range = _resolve_numeric_range(
        normalized,
        value_key="close_rate",
        range_key="close_rate_range",
        percent_hint=True,
    )
    avg_deal_range = _resolve_numeric_range(
        normalized,
        value_key="avg_deal_size",
        range_key="avg_deal_size_range",
    )

    if not (leads_range and close_rate_range and avg_deal_range):
        return {
            "error": "Invalid financial calculation",
            "reason": "Check input parsing or missing data",
        }

    min_revenue = leads_range[0] * close_rate_range[0] * avg_deal_range[0]
    max_revenue = leads_range[1] * close_rate_range[1] * avg_deal_range[1]

    if (
        min_revenue <= 0
        or max_revenue <= 0
        or max_revenue < min_revenue
        or max_revenue < 10_000
    ):
        return {
            "error": "Invalid financial calculation",
            "reason": "Check input parsing or missing data",
        }

    monthly_low = _round_financial_value(min_revenue)
    monthly_high = _round_financial_value(max_revenue)
    yearly_low = _round_financial_value(monthly_low * 12.0)
    yearly_high = _round_financial_value(monthly_high * 12.0)

    return {
        "monthlyRevenueEstimate": {
            "min": monthly_low,
            "max": monthly_high,
            "formatted": _format_revenue_band(monthly_low, monthly_high, symbol),
            "source": "calculated",
        },
        "yearlyRevenueEstimate": {
            "min": yearly_low,
            "max": yearly_high,
            "formatted": _format_revenue_band_year(yearly_low, yearly_high, symbol),
        },
    }


def _extract_market_cpc_stats(report_data: Dict[str, Any]) -> Dict[str, float | int | None]:
    market_demand = report_data.get("marketDemand") if isinstance(report_data.get("marketDemand"), dict) else {}
    keywords = _clean_dict_list(market_demand.get("keywords"))
    cpc_values: List[float] = []
    for item in keywords[:20]:
        cpc = _safe_float(item.get("cpc") or item.get("keywordValue") or item.get("value"))
        if cpc is not None and cpc > 0:
            cpc_values.append(float(cpc))
    if not cpc_values:
        return {"average": None, "median": None, "count": 0}
    cpc_values.sort()
    mid = len(cpc_values) // 2
    if len(cpc_values) % 2 == 1:
        median = cpc_values[mid]
    else:
        median = (cpc_values[mid - 1] + cpc_values[mid]) / 2.0
    average = sum(cpc_values) / len(cpc_values)
    return {"average": average, "median": median, "count": len(cpc_values)}


def _engagement_signal_score(report_data: Dict[str, Any], assumptions: Dict[str, Any]) -> float:
    metadata = report_data.get("reportMetadata") if isinstance(report_data.get("reportMetadata"), dict) else {}
    subs = metadata.get("subScores") if isinstance(metadata.get("subScores"), dict) else {}
    values = [
        float(subs.get("website") or 0.0),
        float(subs.get("leadGen") or 0.0),
        float(subs.get("reputation") or 0.0),
    ]
    non_zero = [value / 100.0 for value in values if value > 0]
    base = sum(non_zero) / len(non_zero) if non_zero else 0.48
    if assumptions.get("ctaDetected"):
        base += 0.05
    if assumptions.get("trustDetected"):
        base += 0.05
    return _clamp(base, 0.25, 0.90)


def _build_current_revenue_range(
    *,
    symbol: str,
    monthly_traffic: float,
    conversion_rate: float,
    avg_deal_value: float,
    signal_strength: int,
    engagement_score: float,
    explicit_revenue: float | None = None,
    explicit_traffic: bool = False,
    explicit_conversion: bool = False,
    explicit_deal_value: bool = False,
    avg_cpc: float | None = None,
) -> Dict[str, float]:
    cpc_anchor = 120.0 if symbol == "₹" else 4.0 if symbol == "$" else 3.5
    adjusted_avg_deal = float(avg_deal_value)
    if avg_cpc is not None and avg_cpc > 0 and not explicit_deal_value:
        intent_ratio = avg_cpc / max(cpc_anchor, 1.0)
        intent_multiplier = _clamp(0.92 + min(0.24, intent_ratio * 0.08), 0.90, 1.24)
        adjusted_avg_deal *= intent_multiplier

    traffic_spread = 0.12 if explicit_traffic else max(0.18, 0.34 - (signal_strength * 0.03))
    conversion_spread = 0.10 if explicit_conversion else max(0.18, 0.30 - (engagement_score * 0.10))
    deal_spread = 0.10 if explicit_deal_value else max(0.16, 0.26 - (signal_strength * 0.02))

    traffic_low = max(1.0, monthly_traffic * (1.0 - traffic_spread))
    traffic_high = max(traffic_low, monthly_traffic * (1.0 + traffic_spread))
    conversion_low = _clamp(conversion_rate * (1.0 - conversion_spread), 0.003, 0.12)
    conversion_high = _clamp(
        conversion_rate * (1.0 + conversion_spread + (engagement_score * 0.04)),
        max(conversion_low, 0.005),
        0.18,
    )
    floor_value = 1_000.0 if symbol == "₹" else 100.0
    deal_low = max(floor_value, adjusted_avg_deal * (1.0 - deal_spread))
    deal_high = max(deal_low, adjusted_avg_deal * (1.0 + deal_spread))

    modeled_low = traffic_low * conversion_low * deal_low
    modeled_high = traffic_high * conversion_high * deal_high
    baseline = monthly_traffic * conversion_rate * adjusted_avg_deal

    if explicit_revenue is not None and explicit_revenue > 0:
        explicit_spread = 0.08 if signal_strength >= 4 else 0.14
        explicit_low = explicit_revenue * (1.0 - explicit_spread)
        explicit_high = explicit_revenue * (1.0 + explicit_spread)
        modeled_low = max(modeled_low, explicit_revenue * 0.55)
        modeled_high = min(modeled_high, explicit_revenue * (1.45 if signal_strength >= 4 else 1.65))
        low = min(explicit_low, modeled_low if modeled_low > 0 else explicit_low)
        high = max(explicit_high, modeled_high if modeled_high > 0 else explicit_high)
        low = max(low, explicit_revenue * (0.70 if signal_strength >= 2 else 0.60))
    else:
        low = modeled_low
        high = max(modeled_high, baseline * 1.10)

    band_floor = 1_250.0 if symbol == "₹" else 125.0
    range_anchor = explicit_revenue if explicit_revenue is not None and explicit_revenue > 0 else baseline
    if high - low < max(band_floor, range_anchor * 0.08):
        padding = max(band_floor, range_anchor * 0.06)
        low = max(0.0, low - padding)
        high = high + padding

    midpoint = (low + high) / 2.0
    return {
        "low": max(0.0, low),
        "high": max(low, high),
        "mid": midpoint,
        "conversion_low": conversion_low,
        "conversion_high": conversion_high,
        "deal_low": deal_low,
        "deal_high": deal_high,
    }


def _build_projected_revenue_range(
    current_low: float,
    current_high: float,
    projected_mid: float,
    signal_strength: int,
) -> Dict[str, float]:
    projection_spread = 0.10 if signal_strength >= 4 else 0.18
    projected_low = max(current_high, projected_mid * (1.0 - projection_spread))
    projected_high = max(projected_low, projected_mid * (1.0 + projection_spread))
    annual_growth_low = max(0.0, (projected_low - current_high) * 12.0)
    annual_growth_high = max(annual_growth_low, (projected_high - current_low) * 12.0)
    return {
        "projected_low": projected_low,
        "projected_high": projected_high,
        "annual_growth_low": annual_growth_low,
        "annual_growth_high": annual_growth_high,
    }


def build_financial_impact_general(
    report_data: Dict[str, Any],
    user_financials: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    normalized = _normalize_user_financials(user_financials)
    return _build_financial_impact_model(report_data, normalized, has_actual_inputs=False)
    assumptions = build_financial_assumptions(report_data)
    normalized = _normalize_user_financials(user_financials)
    symbol = _resolve_currency_symbol(report_data, normalized)

    keyword_count = max(_extract_keyword_count(report_data), int(assumptions.get("keywordDemand") or 0))
    domain_authority = _extract_domain_authority(report_data)
    total_backlinks = _extract_total_backlinks(report_data)
    traffic_estimate = max(float(assumptions.get("traffic") or 0.0), float(normalized.get("monthly_traffic") or 0.0))
    cpc_stats = _extract_market_cpc_stats(report_data)
    avg_cpc = cpc_stats.get("median") or cpc_stats.get("average")
    engagement_score = _engagement_signal_score(report_data, assumptions)

    authority_factor = 0.85 + min(0.25, domain_authority / 200.0)
    backlink_factor = 0.90 + min(0.25, total_backlinks / 4000.0)
    signal_traffic = max(0.0, keyword_count * 20.0 * authority_factor * backlink_factor)
    estimated_traffic = max(traffic_estimate, signal_traffic, 120.0 if keyword_count == 0 and traffic_estimate <= 0 else 0.0)

    conversion_rate = normalized.get("site_conversion_rate")
    if conversion_rate is None:
        conversion_rate = assumptions.get("conversionRate") or 0.02
    conversion_rate = _clamp(float(conversion_rate), 0.005, 0.08)

    avg_deal_value = normalized.get("avg_deal_size")
    if avg_deal_value is None:
        avg_deal_value = assumptions.get("avgDealSize") or _default_avg_service_price(report_data, symbol)
    avg_deal_value = max(float(avg_deal_value), 250.0 if symbol != "₹" else 2500.0)

    current_revenue_numeric = normalized.get("current_monthly_revenue")
    if current_revenue_numeric is None:
        current_revenue_numeric = estimated_traffic * conversion_rate * avg_deal_value
    current_revenue_numeric = max(float(current_revenue_numeric), 0.0)

    seo_growth_factor = 1.3
    conversion_improvement = 1.2
    projected_revenue_numeric = current_revenue_numeric * seo_growth_factor * conversion_improvement
    annual_growth_numeric = max(0.0, (projected_revenue_numeric - current_revenue_numeric) * 12.0)

    signal_count = sum(
        1
        for value in (
            keyword_count > 0,
            domain_authority > 0,
            total_backlinks > 0,
            traffic_estimate > 0,
            normalized.get("current_monthly_revenue") is not None,
            normalized.get("avg_deal_size") is not None,
            (cpc_stats.get("count") or 0) > 0,
        )
        if value
    )
    confidence = 48 + (signal_count * 7)
    if assumptions.get("evidenceMode") == "keyword_model":
        confidence += 6
    if normalized.get("current_monthly_revenue") is not None:
        confidence += 12
    if normalized.get("avg_deal_size") is not None:
        confidence += 8
    confidence = int(_clamp(float(confidence), 45, 88))
    current_range = _build_current_revenue_range(
        symbol=symbol,
        monthly_traffic=estimated_traffic,
        conversion_rate=conversion_rate,
        avg_deal_value=avg_deal_value,
        signal_strength=signal_count,
        engagement_score=engagement_score,
        explicit_revenue=normalized.get("current_monthly_revenue"),
        explicit_traffic=normalized.get("monthly_traffic") is not None,
        explicit_conversion=normalized.get("site_conversion_rate") is not None,
        explicit_deal_value=normalized.get("avg_deal_size") is not None,
        avg_cpc=float(avg_cpc) if avg_cpc is not None else None,
    )
    projected_range = _build_projected_revenue_range(
        current_range["low"],
        current_range["high"],
        projected_revenue_numeric,
        signal_count,
    )
    monthly_growth_low = max(0.0, projected_range["projected_low"] - current_range["high"])
    monthly_growth_high = max(monthly_growth_low, projected_range["projected_high"] - current_range["low"])

    revenue_opportunities = [
        {
            "opportunity": "SEO growth",
            "monthlyImpact": _format_money_range_precise(monthly_growth_low * 0.58, monthly_growth_high * 0.58, symbol),
            "annualImpact": _format_money_range_precise((monthly_growth_low * 0.58) * 12.0, (monthly_growth_high * 0.58) * 12.0, symbol),
            "effortLevel": "High",
        },
        {
            "opportunity": "Conversion optimization",
            "monthlyImpact": _format_money_range_precise(monthly_growth_low * 0.27, monthly_growth_high * 0.27, symbol),
            "annualImpact": _format_money_range_precise((monthly_growth_low * 0.27) * 12.0, (monthly_growth_high * 0.27) * 12.0, symbol),
            "effortLevel": "Medium",
        },
        {
            "opportunity": "Offer packaging and pricing",
            "monthlyImpact": _format_money_range_precise(monthly_growth_low * 0.15, monthly_growth_high * 0.15, symbol),
            "annualImpact": _format_money_range_precise((monthly_growth_low * 0.15) * 12.0, (monthly_growth_high * 0.15) * 12.0, symbol),
            "effortLevel": "Medium",
        },
    ]
    financial_levers = [
        {
            "lever": "SEO growth",
            "impact": _format_money_range_precise(monthly_growth_low, monthly_growth_high, symbol) + "/month upside",
            "effort": "High",
            "confidence": "medium",
            "notes": f"Modeled from {keyword_count} ranking keywords, DA {int(round(domain_authority))}, and {int(round(total_backlinks))} backlinks.",
        },
        {
            "lever": "Conversion optimization",
            "impact": _format_percent_range(current_range["conversion_low"], current_range["conversion_high"]) + " visitor-to-sale range",
            "effort": "Medium",
            "confidence": "medium",
            "notes": "Range widens or narrows based on engagement evidence, CTA strength, and whether a real conversion baseline was provided.",
        },
        {
            "lever": "Average deal value",
            "impact": _format_money_range_precise(current_range["deal_low"], current_range["deal_high"], symbol) + " per sale",
            "effort": "Medium",
            "confidence": "medium",
            "notes": "Uses visible pricing, market defaults, user-supplied values, and CPC-intent weighting when no explicit deal value is available.",
        },
    ]
    assumptions_list = [
        f"Estimated traffic = max(signal traffic, observed estimate) = {int(round(estimated_traffic)):,} visits/month.",
        f"Signal traffic uses keyword count x 20, adjusted by domain authority ({domain_authority:.0f}) and backlinks ({int(round(total_backlinks)):,}).",
        f"Current revenue range = traffic x conversion-rate range x deal-value range = {int(round(estimated_traffic)):,} x {_format_percent_range(current_range['conversion_low'], current_range['conversion_high'])} x {_format_money_range_precise(current_range['deal_low'], current_range['deal_high'], symbol)}.",
        "Improvement model applies SEO growth factor 1.3 and conversion improvement factor 1.2.",
    ]
    if avg_cpc is not None:
        assumptions_list.append(f"Median keyword CPC ({_format_money_precise(float(avg_cpc), symbol)}) is used as a commercial-intent signal when explicit deal value data is missing.")

    return {
        "mode": "signal_estimation",
        "mentorNotes": (
            f"Current revenue is modeled from live SEO visibility signals instead of a template baseline. "
            f"With {keyword_count} ranking keywords and DA {int(round(domain_authority))}, the current run-rate is better represented as "
            f"{_format_money_range_precise(current_range['low'], current_range['high'], symbol)}/month."
        ),
        "notes": "Financial impact is calculated from traffic, conversion, keyword CPC intent, and engagement evidence. Fallback heuristics are only used for inputs that were not available from the report data.",
        "confidenceScore": confidence,
        "assumptions": assumptions_list,
        "revenueOpportunities": revenue_opportunities,
        "financialLevers": financial_levers,
        "profitabilityLevers": financial_levers,
        "revenueTable": [
            {"metric": "Keyword Count", "value": f"{keyword_count:,}"},
            {"metric": "Estimated Traffic", "value": f"{int(round(estimated_traffic)):,}/month"},
            {"metric": "Conversion Rate Range", "value": _format_percent_range(current_range["conversion_low"], current_range["conversion_high"])},
            {"metric": "Average Deal Value Range", "value": _format_money_range_precise(current_range["deal_low"], current_range["deal_high"], symbol)},
            {"metric": "Current Revenue Estimate", "value": _format_money_range_precise(current_range["low"], current_range["high"], symbol) + "/month"},
            {"metric": "Projected Monthly Revenue", "value": _format_money_range_precise(projected_range["projected_low"], projected_range["projected_high"], symbol) + "/month"},
            {"metric": "Annual Revenue Upside", "value": _format_money_range_precise(projected_range["annual_growth_low"], projected_range["annual_growth_high"], symbol)},
        ],
        "currentRevenueEstimate": _format_money_range_precise(current_range["low"], current_range["high"], symbol) + "/month",
        "improvementPotential": _format_money_range_precise(projected_range["annual_growth_low"], projected_range["annual_growth_high"], symbol) + "/year upside",
        "projectedRevenueIncrease": _format_money_range_precise(projected_range["projected_low"], projected_range["projected_high"], symbol) + "/month projected revenue",
        "currentRevenueEstimateValue": round(current_range["mid"], 2),
        "projectedRevenueValue": round((projected_range["projected_low"] + projected_range["projected_high"]) / 2.0, 2),
        "annualGrowthValue": round((projected_range["annual_growth_low"] + projected_range["annual_growth_high"]) / 2.0, 2),
        "estimatedTrafficValue": round(estimated_traffic, 2),
        "conversionRateValue": round(conversion_rate, 4),
        "avgDealValueValue": round(avg_deal_value, 2),
        "keywordCountValue": int(keyword_count),
        "domainAuthorityValue": round(domain_authority, 2),
        "totalBacklinksValue": round(total_backlinks, 2),
    }


def build_financial_impact_from_actuals(report_data: Dict[str, Any], user_financials: Dict[str, Any]) -> Dict[str, Any]:
    normalized = _normalize_user_financials(user_financials)
    return _build_financial_impact_model(report_data, normalized, has_actual_inputs=True)
    assumptions = build_financial_assumptions(report_data)
    symbol = _resolve_currency_symbol(report_data, normalized)
    keyword_count = max(_extract_keyword_count(report_data), int(assumptions.get("keywordDemand") or 0))
    domain_authority = _extract_domain_authority(report_data)
    total_backlinks = _extract_total_backlinks(report_data)
    cpc_stats = _extract_market_cpc_stats(report_data)
    avg_cpc = cpc_stats.get("median") or cpc_stats.get("average")
    engagement_score = _engagement_signal_score(report_data, assumptions)

    current_total_monthly_cost = _sum_present(
        [
            normalized.get("monthly_payroll"),
            normalized.get("monthly_overhead"),
            normalized.get("monthly_tools_cost"),
            normalized.get("monthly_marketing_cost"),
        ]
    )

    close_rate = normalized.get("close_rate") if normalized.get("close_rate") is not None else (assumptions.get("closeRate") or 0.15)
    site_conversion_rate = normalized.get("site_conversion_rate")
    avg_deal_size = normalized.get("avg_deal_size") if normalized.get("avg_deal_size") is not None else (assumptions.get("avgDealSize") or _default_avg_service_price(report_data, symbol))

    monthly_traffic = normalized.get("monthly_traffic")
    monthly_leads_input = normalized.get("monthly_leads")
    signal_traffic = max(float(assumptions.get("traffic") or 0.0), float(keyword_count) * 20.0)
    if monthly_traffic is None and monthly_leads_input is not None and site_conversion_rate is not None:
        monthly_traffic = monthly_leads_input / max(site_conversion_rate, 0.01)
    if monthly_traffic is None:
        monthly_traffic = signal_traffic or 250.0

    if site_conversion_rate is None:
        derived_conversion = None
        if monthly_leads_input is not None and monthly_traffic:
            derived_conversion = monthly_leads_input / max(monthly_traffic, 1.0)
            if close_rate is not None:
                derived_conversion *= close_rate
        site_conversion_rate = derived_conversion if derived_conversion is not None else (assumptions.get("conversionRate") or 0.02)
    site_conversion_rate = _clamp(float(site_conversion_rate), 0.005, 0.08)
    avg_deal_size = max(float(avg_deal_size), 250.0 if symbol != "₹" else 2500.0)

    current_leads = monthly_leads_input if monthly_leads_input is not None else monthly_traffic * site_conversion_rate
    current_customers = current_leads * close_rate
    modeled_current_revenue = monthly_traffic * site_conversion_rate * avg_deal_size
    current_monthly_revenue = normalized.get("current_monthly_revenue") if normalized.get("current_monthly_revenue") is not None else modeled_current_revenue

    factors = normalized.get("improvement_factors") if isinstance(normalized.get("improvement_factors"), dict) else {}
    seo_growth_factor = factors.get("seo_growth_pct")
    if seo_growth_factor is None:
        seo_growth_factor = 1.3
    else:
        seo_growth_factor = 1.0 + float(seo_growth_factor)
    conversion_improvement = factors.get("conversion_rate_lift_pct")
    if conversion_improvement is None:
        conversion_improvement = 1.2
    else:
        conversion_improvement = 1.0 + float(conversion_improvement)
    price_factor = factors.get("price_increase_pct")
    if price_factor is None:
        price_factor = 1.0
    else:
        price_factor = 1.0 + float(price_factor)
    cost_savings_pct = factors.get("cost_savings_pct")
    if cost_savings_pct is None:
        cost_savings_pct = 0.05

    improved_traffic = monthly_traffic * float(seo_growth_factor)
    improved_conversion_rate = _clamp(site_conversion_rate * float(conversion_improvement), 0.005, 0.12)
    improved_avg_deal_size = avg_deal_size * float(price_factor)
    improved_monthly_revenue = improved_traffic * improved_conversion_rate * improved_avg_deal_size
    improved_leads = improved_traffic * improved_conversion_rate

    baseline_revenue = max(current_monthly_revenue, modeled_current_revenue)
    monthly_revenue_growth = max(0.0, improved_monthly_revenue - baseline_revenue)
    annual_revenue_growth = monthly_revenue_growth * 12.0
    monthly_cost_savings = current_total_monthly_cost * cost_savings_pct
    annual_cost_savings = monthly_cost_savings * 12.0
    total_annual_financial_impact = annual_revenue_growth + annual_cost_savings

    implementation_cost = normalized.get("implementation_cost")
    if implementation_cost is None:
        implementation_cost = max(7500.0, min(25000.0, max(current_total_monthly_cost * 0.9, current_monthly_revenue * 0.18)))
    roi = total_annual_financial_impact / max(implementation_cost, 1.0)
    current_monthly_profit = current_monthly_revenue - current_total_monthly_cost

    component_traffic = max(0.0, (improved_traffic * site_conversion_rate * avg_deal_size) - modeled_current_revenue)
    component_conversion = max(0.0, (improved_traffic * improved_conversion_rate * avg_deal_size) - (improved_traffic * site_conversion_rate * avg_deal_size))
    component_pricing = max(0.0, improved_monthly_revenue - (improved_traffic * improved_conversion_rate * avg_deal_size))
    component_total = component_traffic + component_conversion + component_pricing
    if component_total > 0 and monthly_revenue_growth > 0:
        scale = monthly_revenue_growth / component_total
        component_traffic *= scale
        component_conversion *= scale
        component_pricing *= scale

    revenue_opportunities: List[Dict[str, str]] = []
    if component_traffic > 0:
        revenue_opportunities.append({"opportunity": "SEO growth", "monthlyImpact": _format_money(component_traffic, symbol), "annualImpact": _format_money(component_traffic * 12.0, symbol), "effortLevel": "High"})
    if component_conversion > 0:
        revenue_opportunities.append({"opportunity": "Conversion optimization", "monthlyImpact": _format_money(component_conversion, symbol), "annualImpact": _format_money(component_conversion * 12.0, symbol), "effortLevel": "Medium"})
    if component_pricing > 0:
        revenue_opportunities.append({"opportunity": "Price increase + packaging", "monthlyImpact": _format_money(component_pricing, symbol), "annualImpact": _format_money(component_pricing * 12.0, symbol), "effortLevel": "Low"})
    if not revenue_opportunities:
        revenue_opportunities.append({"opportunity": "Revenue optimization", "monthlyImpact": _format_money(monthly_revenue_growth, symbol), "annualImpact": _format_money(annual_revenue_growth, symbol), "effortLevel": "Medium"})

    tool_and_marketing = _sum_present([normalized.get("monthly_tools_cost"), normalized.get("monthly_marketing_cost")]) * cost_savings_pct * 12.0
    payroll_and_overhead = _sum_present([normalized.get("monthly_payroll"), normalized.get("monthly_overhead")]) * cost_savings_pct * 12.0
    cost_savings: List[Dict[str, str]] = []
    if tool_and_marketing > 0:
        cost_savings.append({"initiative": "Tool stack and media-spend efficiency", "annualSavings": _format_money(tool_and_marketing, symbol)})
    if payroll_and_overhead > 0:
        cost_savings.append({"initiative": "Automation and process standardization", "annualSavings": _format_money(payroll_and_overhead, symbol)})
    if not cost_savings:
        cost_savings.append({"initiative": "Operational cost optimization", "annualSavings": _format_money(annual_cost_savings, symbol)})

    explicit_fields = [
        normalized.get("monthly_payroll"),
        normalized.get("monthly_overhead"),
        normalized.get("monthly_tools_cost"),
        normalized.get("monthly_marketing_cost"),
        normalized.get("current_monthly_revenue"),
        normalized.get("avg_deal_size"),
        normalized.get("close_rate"),
        normalized.get("monthly_traffic"),
        normalized.get("site_conversion_rate"),
        normalized.get("monthly_leads"),
        normalized.get("implementation_cost"),
    ]
    provided_count = sum(1 for value in explicit_fields if value is not None)
    signal_count = provided_count + sum(
        1
        for value in (
            keyword_count > 0,
            domain_authority > 0,
            total_backlinks > 0,
            (cpc_stats.get("count") or 0) > 0,
        )
        if value
    )
    current_range = _build_current_revenue_range(
        symbol=symbol,
        monthly_traffic=monthly_traffic,
        conversion_rate=site_conversion_rate,
        avg_deal_value=avg_deal_size,
        signal_strength=signal_count,
        engagement_score=engagement_score,
        explicit_revenue=normalized.get("current_monthly_revenue") or current_monthly_revenue,
        explicit_traffic=normalized.get("monthly_traffic") is not None,
        explicit_conversion=normalized.get("site_conversion_rate") is not None,
        explicit_deal_value=normalized.get("avg_deal_size") is not None,
        avg_cpc=float(avg_cpc) if avg_cpc is not None else None,
    )
    projected_range = _build_projected_revenue_range(
        current_range["low"],
        current_range["high"],
        improved_monthly_revenue,
        signal_count,
    )
    current_profit_low = current_range["low"] - current_total_monthly_cost
    current_profit_high = current_range["high"] - current_total_monthly_cost

    assumption_strings = [
        f"Current monthly cost baseline = {_format_money(current_total_monthly_cost, symbol)} from payroll, overhead, tools, and marketing inputs.",
        f"Improvement factors applied: SEO x{float(seo_growth_factor):.2f}, conversion x{float(conversion_improvement):.2f}, pricing x{float(price_factor):.2f}, cost savings {_format_percent(cost_savings_pct)}.",
        f"ROI uses an implementation cost of {_format_money(implementation_cost, symbol)}.",
        f"Baseline traffic source = {int(round(monthly_traffic)):,} visits/month from user input or SEO signal model ({keyword_count} keywords, DA {int(round(domain_authority))}, backlinks {int(round(total_backlinks)):,}).",
        f"Current revenue range = traffic x conversion-rate range x deal-value range = {int(round(monthly_traffic)):,} x {_format_percent_range(current_range['conversion_low'], current_range['conversion_high'])} x {_format_money_range_precise(current_range['deal_low'], current_range['deal_high'], symbol)}.",
    ]
    if normalized.get("current_monthly_revenue") is None or normalized.get("monthly_traffic") is None or normalized.get("site_conversion_rate") is None:
        assumption_strings.append("Missing company inputs were filled with conservative defaults inferred from the report evidence.")
    if avg_cpc is not None:
        assumption_strings.append(f"Median keyword CPC ({_format_money_precise(float(avg_cpc), symbol)}) is used as a commercial-intent cross-check when explicit deal value data is incomplete.")

    return {
        "mode": "actual_company_data",
        "mentorNotes": (
            f"Using company-provided revenue or deal-value inputs, the model ties Section 10 to your live baseline instead of a template. "
            f"Projected monthly revenue improves from {_format_money_range_precise(current_range['low'], current_range['high'], symbol)} to "
            f"{_format_money_range_precise(projected_range['projected_low'], projected_range['projected_high'], symbol)} as SEO and conversion lift compound."
        ),
        "notes": "Financial impact uses company-provided inputs plus explicit improvement assumptions, then expresses the baseline and upside as ranges instead of a single-point estimate.",
        "confidenceScore": int(_clamp(75 + (provided_count / max(len(explicit_fields), 1)) * 20, 75, 95)),
        "assumptions": assumption_strings,
        "revenueOpportunities": revenue_opportunities,
        "financialLevers": [
            {"lever": "SEO growth", "impact": _format_money_range_precise(component_traffic * 0.85, component_traffic * 1.15, symbol) + "/month", "effort": "High", "notes": f"Signal support: {keyword_count} keywords, DA {int(round(domain_authority))}, backlinks {int(round(total_backlinks)):,}."},
            {"lever": "Conversion optimization", "impact": _format_percent_range(current_range['conversion_low'], current_range['conversion_high']) + " baseline", "effort": "Medium", "notes": f"Current sale conversion baseline centers on {_format_percent(site_conversion_rate)}."},
            {"lever": "Pricing / packaging", "impact": _format_money_range_precise(current_range['deal_low'], current_range['deal_high'], symbol) + " per sale", "effort": "Medium", "notes": f"Average deal value baseline centers on {_format_money(avg_deal_size, symbol)}."},
        ],
        "costSavings": cost_savings,
        "netImpact": {
            "revenueGrowth": _format_money_range_precise(projected_range["annual_growth_low"], projected_range["annual_growth_high"], symbol),
            "costSavings": _format_money(annual_cost_savings, symbol),
            "totalFinancialImpact": _format_money_range_precise(projected_range["annual_growth_low"] + annual_cost_savings, projected_range["annual_growth_high"] + annual_cost_savings, symbol),
            "roi": _format_roi(roi, roi),
        },
        "revenueTable": [
            {"metric": "Current Revenue Estimate", "value": _format_money_range_precise(current_range["low"], current_range["high"], symbol) + "/month"},
            {"metric": "Current Monthly Cost", "value": _format_money(current_total_monthly_cost, symbol)},
            {"metric": "Current Monthly Profit", "value": _format_money_range_precise(current_profit_low, current_profit_high, symbol)},
            {"metric": "Current Leads per Month", "value": _format_number_range(current_leads, current_leads)},
            {"metric": "Improved Leads per Month", "value": _format_number_range(improved_leads, improved_leads)},
            {"metric": "Projected Monthly Revenue", "value": _format_money_range_precise(projected_range["projected_low"], projected_range["projected_high"], symbol) + "/month"},
            {"metric": "Annual Revenue Growth", "value": _format_money_range_precise(projected_range["annual_growth_low"], projected_range["annual_growth_high"], symbol)},
            {"metric": "Annual Financial Impact", "value": _format_money_range_precise(projected_range["annual_growth_low"] + annual_cost_savings, projected_range["annual_growth_high"] + annual_cost_savings, symbol)},
        ],
        "currentRevenueEstimate": _format_money_range_precise(current_range["low"], current_range["high"], symbol) + "/month",
        "improvementPotential": _format_money_range_precise(projected_range["annual_growth_low"], projected_range["annual_growth_high"], symbol) + "/year revenue upside",
        "projectedRevenueIncrease": _format_money_range_precise(projected_range["projected_low"], projected_range["projected_high"], symbol) + "/month projected revenue",
        "currentRevenueEstimateValue": round(current_range["mid"], 2),
        "projectedRevenueValue": round((projected_range["projected_low"] + projected_range["projected_high"]) / 2.0, 2),
        "annualGrowthValue": round((projected_range["annual_growth_low"] + projected_range["annual_growth_high"]) / 2.0, 2),
        "estimatedTrafficValue": round(monthly_traffic, 2),
        "conversionRateValue": round(site_conversion_rate, 4),
        "avgDealValueValue": round(avg_deal_size, 2),
        "keywordCountValue": int(keyword_count),
        "domainAuthorityValue": round(domain_authority, 2),
        "totalBacklinksValue": round(total_backlinks, 2),
    }


def _build_financial_impact_model(
    report_data: Dict[str, Any],
    normalized: Dict[str, Any],
    *,
    has_actual_inputs: bool,
) -> Dict[str, Any]:
    assumptions = build_financial_assumptions(report_data)
    symbol = _resolve_currency_symbol(report_data, normalized)
    revenue_estimate = _build_monthly_revenue_estimate(normalized, symbol)
    if revenue_estimate.get("error"):
        return revenue_estimate

    monthly_estimate = revenue_estimate["monthlyRevenueEstimate"]
    yearly_estimate = revenue_estimate["yearlyRevenueEstimate"]
    current_low = float(monthly_estimate["min"])
    current_high = float(monthly_estimate["max"])
    current_mid = (current_low + current_high) / 2.0

    factors = normalized.get("improvement_factors") if isinstance(normalized.get("improvement_factors"), dict) else {}
    seo_growth_factor = 1.0 + float(factors.get("seo_growth_pct")) if factors.get("seo_growth_pct") is not None else 1.3
    conversion_improvement = 1.0 + float(factors.get("conversion_rate_lift_pct")) if factors.get("conversion_rate_lift_pct") is not None else 1.2
    price_factor = 1.0 + float(factors.get("price_increase_pct")) if factors.get("price_increase_pct") is not None else 1.0
    cost_savings_pct = float(factors.get("cost_savings_pct")) if factors.get("cost_savings_pct") is not None else 0.05

    projected_multiplier = seo_growth_factor * conversion_improvement * price_factor
    projected_low = _round_financial_value(current_low * projected_multiplier)
    projected_high = _round_financial_value(current_high * projected_multiplier)
    if projected_high < projected_low:
        projected_high = projected_low
    projected_mid = (projected_low + projected_high) / 2.0

    annual_growth_low = _round_financial_value((projected_low - current_low) * 12.0)
    annual_growth_high = _round_financial_value((projected_high - current_high) * 12.0)
    if annual_growth_high < annual_growth_low:
        annual_growth_high = annual_growth_low
    annual_growth_mid = (annual_growth_low + annual_growth_high) / 2.0

    keyword_count = max(_extract_keyword_count(report_data), int(assumptions.get("keywordDemand") or 0))
    domain_authority = _extract_domain_authority(report_data)
    total_backlinks = _extract_total_backlinks(report_data)
    monthly_traffic = float(normalized.get("monthly_traffic") or assumptions.get("traffic") or 0.0)
    if monthly_traffic <= 0:
        monthly_traffic = float(keyword_count) * 20.0

    leads_range = _resolve_numeric_range(normalized, value_key="monthly_leads", range_key="monthly_leads_range")
    close_rate_range = _resolve_numeric_range(normalized, value_key="close_rate", range_key="close_rate_range", percent_hint=True)
    avg_deal_range = _resolve_numeric_range(normalized, value_key="avg_deal_size", range_key="avg_deal_size_range")

    current_total_monthly_cost = _sum_present(
        [
            normalized.get("monthly_payroll"),
            normalized.get("monthly_overhead"),
            normalized.get("monthly_tools_cost"),
            normalized.get("monthly_marketing_cost"),
        ]
    )
    annual_cost_savings = _round_financial_value(current_total_monthly_cost * cost_savings_pct * 12.0)
    implementation_cost = normalized.get("implementation_cost")
    if implementation_cost is None and has_actual_inputs:
        implementation_cost = max(10_000.0, current_total_monthly_cost * 1.5 if current_total_monthly_cost > 0 else current_mid * 0.15)
    roi = ((annual_growth_mid + annual_cost_savings) / max(float(implementation_cost or 1.0), 1.0)) if has_actual_inputs else None

    confidence_base = 72 if has_actual_inputs else 58
    signal_count = sum(
        1
        for value in (
            monthly_estimate["source"] == "user_input",
            leads_range is not None,
            close_rate_range is not None,
            avg_deal_range is not None,
            keyword_count > 0,
            domain_authority > 0,
            total_backlinks > 0,
            current_total_monthly_cost > 0,
        )
        if value
    )
    confidence_score = int(_clamp(float(confidence_base + (signal_count * 4)), 55, 95))

    revenue_opportunities = [
        {
            "opportunity": "SEO growth",
            "monthlyImpact": _format_money_range_precise((annual_growth_low / 12.0) * 0.58, (annual_growth_high / 12.0) * 0.58, symbol),
            "annualImpact": _format_money_range_precise(annual_growth_low * 0.58, annual_growth_high * 0.58, symbol),
            "effortLevel": "High",
        },
        {
            "opportunity": "Conversion optimization",
            "monthlyImpact": _format_money_range_precise((annual_growth_low / 12.0) * 0.27, (annual_growth_high / 12.0) * 0.27, symbol),
            "annualImpact": _format_money_range_precise(annual_growth_low * 0.27, annual_growth_high * 0.27, symbol),
            "effortLevel": "Medium",
        },
        {
            "opportunity": "Offer packaging and pricing",
            "monthlyImpact": _format_money_range_precise((annual_growth_low / 12.0) * 0.15, (annual_growth_high / 12.0) * 0.15, symbol),
            "annualImpact": _format_money_range_precise(annual_growth_low * 0.15, annual_growth_high * 0.15, symbol),
            "effortLevel": "Medium",
        },
    ]
    financial_levers = [
        {
            "lever": "SEO growth",
            "impact": _format_money_range_precise(projected_low - current_low, projected_high - current_high, symbol) + "/month upside",
            "effort": "High",
            "confidence": "medium",
            "notes": f"Improvement assumes SEO growth factor {seo_growth_factor:.2f} with context from {keyword_count} keywords, DA {int(round(domain_authority))}, and {int(round(total_backlinks)):,} backlinks.",
        },
        {
            "lever": "Conversion optimization",
            "impact": _format_percent_range(close_rate_range[0], close_rate_range[1]) if close_rate_range else "Input required",
            "effort": "Medium",
            "confidence": "medium",
            "notes": "Uses parsed close-rate input directly. Percentage parsing converts strings like 20-30% into 0.20-0.30.",
        },
        {
            "lever": "Average deal value",
            "impact": _format_money_range_precise(avg_deal_range[0], avg_deal_range[1], symbol) + " per sale" if avg_deal_range else "Input required",
            "effort": "Medium",
            "confidence": "medium",
            "notes": "Uses parsed average deal value directly with no template pricing fallback.",
        },
    ]

    assumptions_list = [
        f"Monthly revenue source = {monthly_estimate['source']}.",
        f"Monthly revenue baseline = {monthly_estimate['formatted']}.",
        f"Yearly revenue baseline = {yearly_estimate['formatted']}.",
        "If explicit monthly revenue exists and parses cleanly, it overrides all calculated baselines.",
        "If revenue is not provided, baseline revenue = qualified leads x close rate x average deal value.",
        f"Improvement model uses SEO factor {seo_growth_factor:.2f}, conversion factor {conversion_improvement:.2f}, and price factor {price_factor:.2f}.",
    ]
    if leads_range and close_rate_range and avg_deal_range:
        assumptions_list.append(
            f"Calculated baseline range = {_format_number_range(leads_range[0], leads_range[1])} leads x {_format_percent_range(close_rate_range[0], close_rate_range[1])} x {_format_money_range_precise(avg_deal_range[0], avg_deal_range[1], symbol)}."
        )
    assumptions_list.append(f"SEO visibility context = {keyword_count} keywords, DA {int(round(domain_authority))}, backlinks {int(round(total_backlinks)):,}.")

    revenue_table = [
        {"metric": "Keyword Count", "value": f"{keyword_count:,}"},
        {"metric": "Estimated Traffic", "value": f"{int(round(monthly_traffic)):,}/month"},
        {"metric": "Qualified Leads Range", "value": _format_number_range(leads_range[0], leads_range[1]) if leads_range else "Input required"},
        {"metric": "Close Rate Range", "value": _format_percent_range(close_rate_range[0], close_rate_range[1]) if close_rate_range else "Input required"},
        {"metric": "Average Deal Value Range", "value": _format_money_range_precise(avg_deal_range[0], avg_deal_range[1], symbol) if avg_deal_range else "Input required"},
        {"metric": "Current Revenue Estimate", "value": monthly_estimate["formatted"]},
        {"metric": "Projected Monthly Revenue", "value": _format_revenue_band(projected_low, projected_high, symbol)},
        {"metric": "Annual Revenue Growth", "value": _format_money_range_precise(annual_growth_low, annual_growth_high, symbol)},
    ]
    if current_total_monthly_cost > 0:
        revenue_table.append({"metric": "Current Monthly Cost", "value": _format_money(current_total_monthly_cost, symbol)})
    if annual_cost_savings > 0:
        revenue_table.append({"metric": "Annual Cost Savings", "value": _format_money(annual_cost_savings, symbol)})

    result: Dict[str, Any] = {
        "mode": "actual_company_data" if has_actual_inputs else "signal_estimation",
        "mentorNotes": f"Section 10 is using parsed financial inputs and strict revenue math. Current monthly revenue is {monthly_estimate['formatted']}.",
        "notes": "Financial impact now prioritizes explicit monthly revenue. Without that input, it calculates revenue strictly from qualified leads, close rate, and average deal value.",
        "confidenceScore": confidence_score,
        "assumptions": assumptions_list,
        "revenueOpportunities": revenue_opportunities,
        "financialLevers": financial_levers,
        "profitabilityLevers": financial_levers,
        "revenueTable": revenue_table,
        "monthlyRevenueEstimate": monthly_estimate,
        "yearlyRevenueEstimate": yearly_estimate,
        "currentRevenueEstimate": monthly_estimate["formatted"],
        "improvementPotential": _format_money_range_precise(annual_growth_low, annual_growth_high, symbol) + "/year upside",
        "projectedRevenueIncrease": _format_revenue_band(projected_low, projected_high, symbol),
        "currentRevenueEstimateValue": round(current_mid, 2),
        "projectedRevenueValue": round(projected_mid, 2),
        "annualGrowthValue": round(annual_growth_mid, 2),
        "estimatedTrafficValue": round(monthly_traffic, 2),
        "conversionRateValue": round(close_rate_range[0], 4) if close_rate_range else None,
        "avgDealValueValue": round(avg_deal_range[0], 2) if avg_deal_range else None,
        "keywordCountValue": int(keyword_count),
        "domainAuthorityValue": round(domain_authority, 2),
        "totalBacklinksValue": round(total_backlinks, 2),
        "currentRevenueMin": current_low,
        "currentRevenueMax": current_high,
        "projectedRevenueMin": projected_low,
        "projectedRevenueMax": projected_high,
        "annualGrowthMin": annual_growth_low,
        "annualGrowthMax": annual_growth_high,
    }
    if has_actual_inputs:
        result["costSavings"] = [{"initiative": "Operational cost optimization", "annualSavings": _format_money(annual_cost_savings, symbol)}] if annual_cost_savings > 0 else []
        if roi is not None:
            result["netImpact"] = {
                "revenueGrowth": _format_money_range_precise(annual_growth_low, annual_growth_high, symbol),
                "costSavings": _format_money(annual_cost_savings, symbol),
                "totalFinancialImpact": _format_money_range_precise(annual_growth_low + annual_cost_savings, annual_growth_high + annual_cost_savings, symbol),
                "roi": _format_roi(roi, roi),
            }
    return result


def ensure_financial_impact_section(
    financial_section: Dict[str, Any] | None,
    report_data: Dict[str, Any],
    user_financials: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    section = deepcopy(financial_section) if isinstance(financial_section, dict) else {}
    normalized_user_financials = _normalize_user_financials(user_financials or _extract_user_financials(report_data))

    modeled = (
        build_financial_impact_from_actuals(report_data, normalized_user_financials)
        if _has_actual_company_data(normalized_user_financials)
        else build_financial_impact_general(report_data, normalized_user_financials)
    )
    if modeled.get("error"):
        raise ValueError(f"{modeled.get('error')}: {modeled.get('reason')}")

    scenarios = _clean_dict_list(section.get("scenarios"))
    profitability_levers = _clean_dict_list(section.get("profitabilityLevers"))

    section.update(modeled)
    section["revenueTable"] = _dedupe_dict_list(section.get("revenueTable"), ("metric", "value"))
    section["revenueOpportunities"] = _dedupe_dict_list(section.get("revenueOpportunities"), ("opportunity", "monthlyImpact", "annualImpact"))
    section["costSavings"] = _dedupe_dict_list(section.get("costSavings"), ("initiative", "annualSavings"))
    section["assumptions"] = _clean_string_list(section.get("assumptions"))
    section["confidenceScore"] = int(_clamp(float(section.get("confidenceScore") or 0), 0, 100))
    section["financialLevers"] = _dedupe_dict_list(
        section.get("financialLevers") or section.get("profitabilityLevers") or section.get("revenueOpportunities"),
        ("lever", "impact", "notes"),
    )
    if section["financialLevers"] and not section.get("profitabilityLevers"):
        section["profitabilityLevers"] = deepcopy(section["financialLevers"])
    estimation_enabled = bool(
        (isinstance(report_data.get("meta"), dict) and report_data.get("meta", {}).get("estimationMode"))
    )
    section["estimationDisclaimer"] = (
        sanitize_text_for_pdf(section.get("estimationDisclaimer")) or ESTIMATION_DISCLAIMER
        if estimation_enabled
        else None
    )
    if scenarios:
        section["scenarios"] = scenarios
    if profitability_levers:
        section["profitabilityLevers"] = profitability_levers
    assert section.get("monthlyRevenueEstimate") is not None
    assert section.get("yearlyRevenueEstimate") is not None
    print("Financial Section:", section)
    return section


def _normalize_appendices(report: Dict[str, Any]) -> None:
    appendices = report.get("appendices")
    if not isinstance(appendices, dict):
        appendices = {}
        report["appendices"] = appendices

    keyword_tiers = appendices.get("keywords")
    normalized_tiers: List[Dict[str, Any]] = []
    if isinstance(keyword_tiers, list):
        for tier in keyword_tiers:
            if not isinstance(tier, dict):
                continue
            normalized_keywords = _clean_dict_list(tier.get("keywords"))
            if not normalized_keywords and isinstance(tier.get("items"), list):
                converted = [_normalize_keyword_entry(item) for item in tier.get("items", [])]
                normalized_keywords = [item for item in converted if isinstance(item, dict)]
            cleaned_items = _clean_dict_list(tier.get("items"))
            if not normalized_keywords and not cleaned_items:
                continue
            tier_copy = deepcopy(tier)
            if normalized_keywords:
                tier_copy["keywords"] = normalized_keywords
            if cleaned_items:
                tier_copy["items"] = cleaned_items
            normalized_tiers.append(tier_copy)
    appendices["keywords"] = normalized_tiers

    appendices["dataSources"] = _dedupe_dict_list(appendices.get("dataSources"), ("source", "use", "label"))
    appendices["dataGaps"] = _clean_dict_list(appendices.get("dataGaps"))
    appendices["scoreSummary"] = _clean_dict_list(appendices.get("scoreSummary"))
    appendices["growthForecastTables"] = _clean_dict_list(appendices.get("growthForecastTables"))
    appendices["serp"] = [
        tier
        for tier in _clean_dict_list(appendices.get("serp"))
        if _has_meaningful_content(tier.get("items"), count_numbers=False)
    ]
    appendices["backlinks"] = [
        tier
        for tier in _clean_dict_list(appendices.get("backlinks"))
        if _has_meaningful_content(tier.get("items"), count_numbers=False)
    ]
    seo_section = report.get("seoVisibility") or {}
    seo_backlinks = seo_section.get("backlinks") if isinstance(seo_section, dict) else {}
    if not appendices["backlinks"] and isinstance(seo_backlinks, dict) and _has_meaningful_content(seo_backlinks, count_numbers=True):
        appendices["backlinks"] = [{"tier": "Backlinks Summary", "items": [seo_backlinks]}]
    appendices["evidenceScreenshots"] = _clean_dict_list(appendices.get("evidenceScreenshots") or appendices.get("screenshots"))
    evidence = appendices.get("evidence")
    if isinstance(evidence, dict):
        screenshots = evidence.get("screenshots")
        synthesized_shots = []
        if isinstance(screenshots, dict):
            for variant in ("desktop", "mobile"):
                shot = screenshots.get(variant)
                if not isinstance(shot, dict):
                    continue
                if _is_meaningful_text(shot.get("b64")):
                    synthesized_shots.append(
                        {
                            "label": sanitize_text_for_pdf(shot.get("title")) or f"{variant.title()} Screenshot",
                            "format": sanitize_text_for_pdf(shot.get("format")) or "png",
                            "b64": shot.get("b64"),
                            "width": shot.get("width"),
                            "height": shot.get("height"),
                            "fullPage": shot.get("fullPage", True),
                        }
                    )
                slices = shot.get("slices")
                if isinstance(slices, list):
                    shot["slices"] = [
                        slice_item
                        for slice_item in slices
                        if isinstance(slice_item, dict) and _is_meaningful_text(slice_item.get("b64"))
                    ]
                    for slice_item in shot["slices"]:
                        synthesized_shots.append(
                            {
                                "label": sanitize_text_for_pdf(slice_item.get("title") or shot.get("title")) or f"{variant.title()} Screenshot",
                                "format": sanitize_text_for_pdf(slice_item.get("format") or shot.get("format")) or "png",
                                "b64": slice_item.get("b64"),
                                "width": slice_item.get("width"),
                                "height": slice_item.get("height"),
                                "fullPage": shot.get("fullPage", True),
                            }
                        )
        if synthesized_shots and not appendices["evidenceScreenshots"]:
            appendices["evidenceScreenshots"] = _clean_dict_list(synthesized_shots)
        if appendices.get("evidenceScreenshots") and not appendices.get("screenshots"):
            appendices["screenshots"] = appendices.get("evidenceScreenshots")

        key_pages = evidence.get("keyPagesDetected")
        if isinstance(key_pages, dict):
            normalized_key_pages = []
            for page_name, info in key_pages.items():
                if not isinstance(info, dict):
                    continue
                normalized_key_pages.append(
                    {
                        "page": sanitize_text_for_pdf(page_name),
                        "present": "Yes" if info.get("present") or info.get("servicesPagePresent") or info.get("primary") else "No",
                        "primaryUrl": sanitize_text_for_pdf(info.get("primaryUrl") or info.get("url") or info.get("primary")) or "-",
                    }
                )
            if normalized_key_pages and not appendices.get("keyPagesDetected"):
                appendices["keyPagesDetected"] = normalized_key_pages

        crawl_summary = evidence.get("crawlRegistrySummary")
        if isinstance(crawl_summary, dict) and not appendices.get("crawlRegistrySummary"):
            appendices["crawlRegistrySummary"] = crawl_summary
        extraction_snapshot = evidence.get("extractionSnapshot")
        if isinstance(extraction_snapshot, dict) and not appendices.get("extractionSnapshot"):
            appendices["extractionSnapshot"] = extraction_snapshot

    pages_crawled = appendices.get("pagesCrawled")
    if isinstance(pages_crawled, list):
        appendices["pagesCrawled"] = _clean_string_list(pages_crawled)

    evidence = appendices.get("evidence")
    if isinstance(evidence, dict):
        screenshots = evidence.get("screenshots")
        if isinstance(screenshots, dict):
            for variant in ("desktop", "mobile"):
                shot = screenshots.get(variant)
                if not isinstance(shot, dict):
                    continue
                slices = shot.get("slices")
                if isinstance(slices, list):
                    shot["slices"] = [
                        slice_item
                        for slice_item in slices
                        if isinstance(slice_item, dict) and _is_meaningful_text(slice_item.get("b64"))
                    ]

    # -------------------------------------------------------------------
    # Appendix presence flags — used by the PDF renderer to decide whether
    # to show "No data available" vs actual content in Appendix E and G.
    # These must be set AFTER all backlink / screenshot normalization above.
    # -------------------------------------------------------------------
    backlinks_tiers = appendices.get("backlinks")
    has_backlink_data = bool(
        isinstance(backlinks_tiers, list)
        and any(
            isinstance(t, dict) and _has_meaningful_content(t.get("items"), count_numbers=True)
            for t in backlinks_tiers
        )
    )
    # Also check the seoVisibility backlinks section for totalBacklinks > 0
    seo_section = report.get("seoVisibility") or {}
    seo_backlinks = seo_section.get("backlinks") if isinstance(seo_section, dict) else {}
    if isinstance(seo_backlinks, dict):
        total_bl = seo_backlinks.get("totalBacklinks")
        if isinstance(total_bl, (int, float)) and total_bl > 0:
            has_backlink_data = True
    appendices["backlinkDataAvailable"] = has_backlink_data

    evidence_screenshots = appendices.get("evidenceScreenshots")
    has_screenshots = bool(
        isinstance(evidence_screenshots, list) and len(evidence_screenshots) > 0
    )
    # Also check evidence.screenshots
    ev = appendices.get("evidence") or {}
    ev_shots = ev.get("screenshots") if isinstance(ev, dict) else None
    if isinstance(ev_shots, dict) and (ev_shots.get("desktop") or ev_shots.get("mobile")):
        has_screenshots = True
    appendices["screenshotsAvailable"] = has_screenshots
    if has_screenshots and not appendices.get("evidenceScreenshots"):
        synthesized = []
        if isinstance(ev_shots, dict):
            for variant in ("desktop", "mobile"):
                shot = ev_shots.get(variant)
                if not isinstance(shot, dict):
                    continue
                if isinstance(shot.get("b64"), str) and shot.get("b64"):
                    synthesized.append({
                        "label": shot.get("title") or f"{variant.title()} Screenshot",
                        "format": shot.get("format") or "png",
                        "b64": shot.get("b64"),
                        "width": shot.get("width"),
                        "height": shot.get("height"),
                        "fullPage": bool(shot.get("fullPage", True)),
                    })
        if synthesized:
            appendices["evidenceScreenshots"] = synthesized
            appendices["screenshots"] = synthesized


def _dedupe_known_lists(report: Dict[str, Any]) -> None:
    for path in STRING_LIST_PATHS:
        current = _get_path(report, path)
        if isinstance(current, list):
            _set_path(report, path, _clean_string_list(current))


def _ensure_services_section(report: Dict[str, Any]) -> None:
    section = report.get("servicesPositioning")
    if not isinstance(section, dict):
        return
    section["services"] = _dedupe_dict_list(section.get("services"), ("name", "description"))
    current_industries = section.get("industriesServed")
    if isinstance(current_industries, dict):
        current_industries["current"] = _clean_string_list(current_industries.get("current"))
        current_industries["highValueIndustries"] = _clean_dict_list(current_industries.get("highValueIndustries"))
    if not section["services"] and not _is_meaningful_text(section.get("mentorNotes")):
        section["mentorNotes"] = "Services are clearly present, but the extraction layer could not fully structure them."


def _ensure_lead_generation_section(report: Dict[str, Any]) -> None:
    section = report.get("leadGeneration")
    if not isinstance(section, dict):
        return
    section["channels"] = _clean_dict_list(section.get("channels"))
    section["leadMagnets"] = _clean_dict_list(section.get("leadMagnets"))
    section["missingHighROIChannels"] = _clean_string_list(section.get("missingHighROIChannels"))
    if (
        not section["channels"]
        and not section["leadMagnets"]
        and not section["missingHighROIChannels"]
        and not _is_meaningful_text(section.get("mentorNotes"))
    ):
        section["mentorNotes"] = "CTA signals are likely present but could not be structurally extracted."


def _ensure_content_quality(report: Dict[str, Any]) -> None:
    section = report.get("websiteDigitalPresence")
    if not isinstance(section, dict):
        return
    content_quality = section.get("contentQuality")
    if not isinstance(content_quality, dict):
        return
    content_quality["strengths"] = _clean_string_list(content_quality.get("strengths"))
    content_quality["gaps"] = _clean_string_list(content_quality.get("gaps"))
    content_quality["recommendations"] = _clean_string_list(content_quality.get("recommendations"))
    if (
        not content_quality["strengths"]
        and not content_quality["gaps"]
        and not content_quality["recommendations"]
    ):
        content_quality["gaps"] = ["This section is currently unavailable due to limited data sources."]

    keyword_analysis = section.get("websiteKeywordAnalysis")
    if isinstance(keyword_analysis, dict):
        keyword_analysis["strengths"] = _clean_string_list(keyword_analysis.get("strengths"))
        keyword_analysis["gaps"] = _clean_string_list(keyword_analysis.get("gaps"))
        keyword_analysis["recommendations"] = _clean_string_list(keyword_analysis.get("recommendations"))
        keyword_analysis["keywordCandidates"] = _clean_string_list(keyword_analysis.get("keywordCandidates"))
        keyword_analysis["opportunities"] = _dedupe_dict_list(keyword_analysis.get("opportunities"), ("keyword", "intent", "currentCoverage"))


def _ensure_executive_summary(report: Dict[str, Any]) -> None:
    section = report.get("executiveSummary")
    if not isinstance(section, dict):
        return
    quick_wins = section.get("quickWins")
    if isinstance(quick_wins, list):
        section["quickWins"] = _dedupe_dict_list(quick_wins, ("title", "details"))


def _ensure_competitive_section(report: Dict[str, Any]) -> None:
    section = report.get("competitiveAnalysis")
    if not isinstance(section, dict):
        return
    section["competitors"] = _dedupe_dict_list(section.get("competitors"), ("website", "domain", "name"))
    section["positioningMatrix"] = _clean_dict_list(section.get("positioningMatrix"))
    section["opportunities"] = _clean_string_list(section.get("opportunities"))
    section["threats"] = _clean_string_list(section.get("threats"))


def _ensure_competitive_advantages_section(report: Dict[str, Any]) -> None:
    """Normalize competitiveAdvantages into clean structured rows for the PDF table.

    The PDF renderer needs a `structuredAdvantages` list where each row has:
        { advantage: str, whyItMatters: str, howToLeverage: str }

    The `advantages` flat string list is also kept for backward compatibility.
    Any note text that was previously jammed into `notes` as a fallback is
    now extracted into the proper columns.
    """
    section = report.get("competitiveAdvantages")
    if not isinstance(section, dict):
        return

    raw_advantages = section.get("advantages") or []
    existing_structured = section.get("structuredAdvantages") or []

    # Build a lookup from already-structured rows
    structured_index: dict[str, dict] = {}
    for row in existing_structured:
        if not isinstance(row, dict):
            continue
        key = _clean_text(row.get("advantage", "")).lower()
        if key:
            structured_index[key] = row

    # Rebuild a clean, deduplicated structured list
    structured_rows: list[dict] = []
    seen_keys: set[str] = set()

    for item in raw_advantages:
        if not isinstance(item, str):
            continue
        text = _clean_text(item)
        if not text:
            continue
        key = text.lower()
        if key in seen_keys:
            continue
        seen_keys.add(key)

        # Reuse existing structured data if available for this advantage
        existing = structured_index.get(key, {})
        structured_rows.append({
            "advantage": text,
            "whyItMatters": _clean_text(existing.get("whyItMatters", "")),
            "howToLeverage": _clean_text(existing.get("howToLeverage", "")),
        })

    # If only structured rows exist (no flat list), rebuild from them
    if not structured_rows and existing_structured:
        for row in existing_structured:
            if not isinstance(row, dict):
                continue
            adv = _clean_text(row.get("advantage", ""))
            if not adv or adv.lower() in seen_keys:
                continue
            seen_keys.add(adv.lower())
            structured_rows.append({
                "advantage": adv,
                "whyItMatters": _clean_text(row.get("whyItMatters", "")),
                "howToLeverage": _clean_text(row.get("howToLeverage", "")),
            })

    # Write back both formats
    section["structuredAdvantages"] = structured_rows
    section["advantages"] = [row["advantage"] for row in structured_rows]

    # Clean notes field — strip any jammed "Why it matters: ... How to leverage: ..." text
    # that was previously crammed in there by the old mapper.
    # _clean_text() can return None for null/non-string notes, so always coerce
    # membership checks against a real string to avoid TypeError.
    notes = _clean_text(section.get("notes", "")) or ""
    if "How to leverage:" in notes or "Why it matters:" in notes:
        # These are now in structuredAdvantages — clear the jammed notes
        section["notes"] = _clean_text(section.get("mentorNotes", "")) or None
    elif section.get("notes") is not None:
        section["notes"] = notes or None


def _ensure_risk_section(report: Dict[str, Any]) -> None:
    section = report.get("riskAssessment")
    if not isinstance(section, dict):
        return
    section["risks"] = _dedupe_dict_list(section.get("risks"), ("risk", "mitigation", "notes"))
    section["compliance"] = _clean_string_list(section.get("compliance"))


def normalize_seo_visibility_object(section: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize SEO aliases into one validated object shape."""

    out = dict(section) if isinstance(section, dict) else {}
    backlinks = out.get("backlinks") if isinstance(out.get("backlinks"), dict) else {}
    backlink_profile = out.get("backlinkProfile") if isinstance(out.get("backlinkProfile"), dict) else {}
    local_seo = out.get("localSeo") if isinstance(out.get("localSeo"), dict) else {}
    local_alias = out.get("localSEO") if isinstance(out.get("localSEO"), dict) else {}

    if backlink_profile and not backlinks:
        backlinks = backlink_profile
    if backlinks:
        out["backlinks"] = backlinks
        out["backlinkProfile"] = backlinks

    if local_alias and not local_seo:
        local_seo = local_alias
    if local_seo:
        out["localSeo"] = local_seo
        out["localSEO"] = local_seo

    site_type = sanitize_text_for_pdf(out.get("siteType"))
    if site_type in {"content_site", "service_business", "ecommerce", "mixed"}:
        out["siteType"] = site_type
    elif "siteType" in out:
        out["siteType"] = "mixed"

    return out


def validate_seo_render_payload(section: Dict[str, Any]) -> Dict[str, Any]:
    """Drop half-built SEO subsections so PDF rendering stays truthful."""

    out = normalize_seo_visibility_object(section)
    for key in ("domainAuthority", "backlinks", "keywordRankings", "localSeo"):
        value = out.get(key)
        if isinstance(value, dict) and not _section_has_substance(value):
            out[key] = {}

    if isinstance(out.get("backlinks"), dict):
        out["backlinkProfile"] = out["backlinks"]
    if isinstance(out.get("localSeo"), dict):
        out["localSEO"] = out["localSeo"]

    return out


def has_meaningful_competitor_benchmark(section: Dict[str, Any]) -> bool:
    comparison = section.get("competitorComparison")
    if not isinstance(comparison, dict):
        return False
    return bool(_clean_dict_list(comparison.get("directCompetitors")))


def has_meaningful_local_seo(section: Dict[str, Any]) -> bool:
    local_seo = section.get("localSeo")
    if not isinstance(local_seo, dict):
        return False
    if local_seo.get("priority") == "low":
        return bool(
            _clean_string_list(local_seo.get("issues"))
            or _is_meaningful_text(local_seo.get("impact"))
            or _is_meaningful_text(local_seo.get("businessImpact"))
        )
    return _section_has_substance(local_seo)


def clean_authority_benchmark_rows(benchmark: Dict[str, Any]) -> Dict[str, Any]:
    """Remove empty authority benchmark competitor rows."""

    out = dict(benchmark) if isinstance(benchmark, dict) else {}
    out["competitors"] = [
        item
        for item in _clean_dict_list(out.get("competitors"))
        if _is_meaningful_text(item.get("score")) or _is_meaningful_text(item.get("note"))
    ]
    for key in ("competitorA", "competitorB", "competitorC"):
        if not _is_meaningful_text(out.get(key)):
            out.pop(key, None)
    return out


def validate_benchmark_payload(section: Dict[str, Any]) -> None:
    """Normalize authority benchmark payload before persistence/rendering."""

    domain_authority = section.get("domainAuthority")
    if not isinstance(domain_authority, dict):
        return
    benchmark = domain_authority.get("benchmark")
    if isinstance(benchmark, dict):
        domain_authority["benchmark"] = clean_authority_benchmark_rows(benchmark)


def _ensure_seo_section(report: Dict[str, Any]) -> None:
    section = report.get("seoVisibility")
    if not isinstance(section, dict):
        return
    section = validate_seo_render_payload(section)
    report["seoVisibility"] = section

    backlink_profile = section.get("backlinkProfile")
    backlinks = section.get("backlinks")
    if isinstance(backlink_profile, dict) and not isinstance(backlinks, dict):
        section["backlinks"] = backlink_profile
        backlinks = backlink_profile
    elif isinstance(backlinks, dict) and not isinstance(backlink_profile, dict):
        section["backlinkProfile"] = backlinks

    local_alias = section.get("localSEO")
    local_seo = section.get("localSeo")
    if isinstance(local_alias, dict) and not isinstance(local_seo, dict):
        section["localSeo"] = local_alias
        local_seo = local_alias
    elif isinstance(local_seo, dict) and not isinstance(local_alias, dict):
        section["localSEO"] = local_seo

    domain_authority = section.get("domainAuthority")
    if isinstance(domain_authority, dict):
        validate_benchmark_payload(section)

    if isinstance(backlinks, dict):
        backlinks["competitorComparison"] = _clean_dict_list(backlinks.get("competitorComparison"))
        backlinks["riskSignals"] = _clean_string_list(backlinks.get("riskSignals"))
        if not _is_meaningful_text(backlinks.get("anchorMixSummary")):
            backlinks["anchorMixSummary"] = "Anchor mix detail was limited in this run."
        section["backlinkProfile"] = backlinks

    competitor_comparison = section.get("competitorComparison")
    if isinstance(competitor_comparison, dict):
        competitor_comparison["directCompetitors"] = _clean_dict_list(competitor_comparison.get("directCompetitors"))
        competitor_comparison["discoveryPlatforms"] = _clean_dict_list(competitor_comparison.get("discoveryPlatforms"))
        if not has_meaningful_competitor_benchmark(section) and not competitor_comparison["discoveryPlatforms"]:
            section["competitorComparison"] = {}

    keyword_rankings = section.get("keywordRankings")
    if isinstance(keyword_rankings, dict):
        keyword_rankings["targetKeywords"] = _clean_string_list(keyword_rankings.get("targetKeywords"))
        by_priority = keyword_rankings.get("byPriority")
        if isinstance(by_priority, dict):
            keyword_rankings["byPriority"] = {str(k): _clean_string_list(v) for k, v in by_priority.items()}
        by_intent = keyword_rankings.get("byIntent")
        if isinstance(by_intent, dict):
            keyword_rankings["byIntent"] = {str(k): _clean_string_list(v) for k, v in by_intent.items()}
        keyword_rankings["topRankingKeywords"] = _clean_dict_list(keyword_rankings.get("topRankingKeywords"))
        keyword_rankings["missingHighValueKeywords"] = _clean_dict_list(keyword_rankings.get("missingHighValueKeywords"))
        branded = _clean_dict_list(keyword_rankings.get("brandedKeywords"))
        non_branded = _clean_dict_list(keyword_rankings.get("nonBrandedKeywords"))
        if not branded:
            branded = [
                item
                for item in keyword_rankings["topRankingKeywords"]
                if isinstance(item, dict) and str(item.get("type") or "").lower() == "brand"
            ]
        if not non_branded:
            non_branded = [
                item
                for item in keyword_rankings["topRankingKeywords"]
                if isinstance(item, dict) and str(item.get("type") or "").lower() != "brand"
            ]
        keyword_rankings["brandedKeywords"] = branded
        keyword_rankings["nonBrandedKeywords"] = non_branded

        if not _is_meaningful_text(keyword_rankings.get("notes")):
            keyword_rankings["notes"] = "Keyword visibility is based on the SEO evidence available in this run and falls back to conservative placeholders when rank data is missing."

    if isinstance(local_seo, dict):
        local_priority = sanitize_text_for_pdf(local_seo.get("priority"))
        if local_priority not in {"primary", "secondary", "low"}:
            local_priority = "low"
        local_seo["priority"] = local_priority
        local_seo["currentListings"] = _clean_string_list(local_seo.get("currentListings"))
        local_seo["missingListings"] = _clean_string_list(local_seo.get("missingListings"))
        local_seo["issues"] = _clean_string_list(local_seo.get("issues"))
        local_seo["localRankingGaps"] = _clean_string_list(local_seo.get("localRankingGaps"))
        if not _is_meaningful_text(local_seo.get("businessImpact")) and _is_meaningful_text(local_seo.get("impact")):
            local_seo["businessImpact"] = sanitize_text_for_pdf(local_seo.get("impact"))
        if not _is_meaningful_text(local_seo.get("impact")) and _is_meaningful_text(local_seo.get("businessImpact")):
            local_seo["impact"] = sanitize_text_for_pdf(local_seo.get("businessImpact"))
        if not _is_meaningful_text(local_seo.get("notes")):
            local_seo["notes"] = "Local SEO recommendations are calibrated to whether local search appears to be a primary or secondary channel."
        section["localSEO"] = local_seo
        if not has_meaningful_local_seo(section):
            section["localSeo"] = {}
            section["localSEO"] = {}

    if not _is_meaningful_text(section.get("opportunitySummary")) and isinstance(keyword_rankings, dict):
        section["opportunitySummary"] = sanitize_text_for_pdf(keyword_rankings.get("opportunitySummary"))
    section["priorityActions"] = _clean_string_list(section.get("priorityActions"))


def _ensure_financial_section(report: Dict[str, Any]) -> None:
    section = report.get("financialImpact")
    if not isinstance(section, dict):
        section = {}
        report["financialImpact"] = section

    market_demand = report.get("marketDemand") if isinstance(report.get("marketDemand"), dict) else {}
    has_signal_evidence = bool(
        _extract_keyword_count(report) > 0
        or _extract_domain_authority(report) > 0
        or _extract_total_backlinks(report) > 0
        or _clean_dict_list(market_demand.get("keywords"))
    )
    estimation_enabled = bool(
        (isinstance(report.get("meta"), dict) and report.get("meta", {}).get("estimationMode"))
        or section.get("estimationDisclaimer")
        or _clean_dict_list(section.get("scenarios"))
        or _extract_user_financials(report)
        or has_signal_evidence
    )
    if not estimation_enabled:
        return
    report["financialImpact"] = ensure_financial_impact_section(section, report, _extract_user_financials(report))


def _ensure_generic_section_fallbacks(report: Dict[str, Any]) -> None:
    for section_name, message in SECTION_FALLBACKS.items():
        section = report.get(section_name)
        if not isinstance(section, dict):
            continue
        if _section_has_substance(section):
            continue
        note_key = "mentorNotes" if "mentorNotes" in section or section_name != "competitiveAnalysis" else "notes"
        if not _is_meaningful_text(section.get(note_key)):
            section[note_key] = message


def _ensure_assembled_section_notes(report: Dict[str, Any]) -> None:
    sections = report.get("sections")
    if not isinstance(sections, dict):
        return
    for section_key, section_value in sections.items():
        if not isinstance(section_value, dict):
            continue
        if _section_has_substance(section_value):
            continue
        if not _is_meaningful_text(section_value.get("notes")):
            section_value["notes"] = "This section is currently unavailable due to limited data sources."




def _ensure_business_context_meta(report: Dict[str, Any]) -> Dict[str, Any]:
    cleaned = deepcopy(report) if isinstance(report, dict) else {}
    meta = cleaned.get("meta") if isinstance(cleaned.get("meta"), dict) else {}
    meta.setdefault("businessProfile", {})
    meta.setdefault("sectionContexts", {})
    meta.setdefault("reportToneProfile", {})
    meta.setdefault("businessModelPromptGuidance", {})

    business_profile = meta.get("businessProfile") if isinstance(meta.get("businessProfile"), dict) else {}
    section_contexts = meta.get("sectionContexts") if isinstance(meta.get("sectionContexts"), dict) else {}

    # sync report tone from business profile when available
    tone = business_profile.get("reportToneProfile") if isinstance(business_profile.get("reportToneProfile"), dict) else {}
    if tone and not meta.get("reportToneProfile"):
        meta["reportToneProfile"] = tone

    # copy high-signal section relevance into note fields when absent
    mapping = {
        "websiteDigitalPresence": cleaned.get("websiteDigitalPresence"),
        "seoVisibility": cleaned.get("seoVisibility"),
        "reputation": cleaned.get("reputation"),
        "servicesPositioning": cleaned.get("servicesPositioning"),
        "leadGeneration": cleaned.get("leadGeneration"),
        "competitiveAnalysis": cleaned.get("competitiveAnalysis"),
        "costOptimization": cleaned.get("costOptimization"),
        "targetMarket": cleaned.get("targetMarket"),
        "financialImpact": cleaned.get("financialImpact"),
    }
    for name, section in mapping.items():
        if not isinstance(section, dict):
            continue
        ctx = section_contexts.get(name) if isinstance(section_contexts, dict) else {}
        rel = ctx.get("relevance") if isinstance(ctx, dict) else {}
        if isinstance(rel, dict) and rel.get("level") and not section.get("notes"):
            reason = _clean_text(rel.get("reason"))
            if reason:
                section["notes"] = reason

    # ensure segment/revenue aliases stay populated for PDF mapping
    target = cleaned.get("targetMarket") if isinstance(cleaned.get("targetMarket"), dict) else {}
    segs = target.get("segments") or target.get("currentTargetSegments") or target.get("detectedSegments") or []
    if isinstance(segs, list):
        target.setdefault("segments", deepcopy(segs))
        target.setdefault("currentTargetSegments", deepcopy(segs))
        target.setdefault("detectedSegments", deepcopy(segs))
        cleaned["targetMarket"] = target

    impact = cleaned.get("financialImpact") if isinstance(cleaned.get("financialImpact"), dict) else {}
    levers = impact.get("profitabilityLevers") or impact.get("revenueOpportunities") or []
    if isinstance(levers, list):
        impact.setdefault("profitabilityLevers", deepcopy(levers))
        impact.setdefault("revenueOpportunities", deepcopy(levers))
        cleaned["financialImpact"] = impact

    meta["businessProfile"] = business_profile
    meta["sectionContexts"] = section_contexts
    cleaned["meta"] = meta
    return cleaned
def validate_report_data(report: Dict[str, Any] | None) -> Dict[str, Any]:
    cleaned = _sanitize_nested_strings(deepcopy(report) if isinstance(report, dict) else {})
    cleaned = sync_cross_section_signals(cleaned)
    _dedupe_known_lists(cleaned)
    _normalize_appendices(cleaned)
    _ensure_executive_summary(cleaned)
    _ensure_services_section(cleaned)
    _ensure_lead_generation_section(cleaned)
    _ensure_content_quality(cleaned)
    _ensure_competitive_section(cleaned)
    _ensure_competitive_advantages_section(cleaned)
    _ensure_risk_section(cleaned)
    _ensure_seo_section(cleaned)
    _ensure_financial_section(cleaned)
    _ensure_generic_section_fallbacks(cleaned)
    _ensure_assembled_section_notes(cleaned)
    return cleaned
