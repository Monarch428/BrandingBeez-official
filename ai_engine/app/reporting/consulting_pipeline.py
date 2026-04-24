from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Optional, Tuple
import logging
import re
import time

from app.core.config import settings
from app.llm.client import call_llm_json, get_effective_llm_mode
from app.reporting.sanitizer import contains_blocked_text, sanitize_for_pdf, sanitize_text
from app.reporting.structured_schema import (
    ActionPlanSection,
    AppendicesSection,
    CompetitiveAdvantageSection,
    CompetitiveAnalysisSection,
    CostOptimizationSection,
    ExecutiveSummarySection, 
    FinancialImpactSection,
    IssueInsight,
    LeadGenerationSection,
    ProfessionalBusinessReport,
    ReputationAnalysisSection,
    RiskAssessmentSection,
    SEOAnalysisSection,
    ServiceOfferingsSection,
    StrategicAction,
    TargetMarketSection,
    WebsiteAnalysisSection,
)

logger = logging.getLogger(__name__)

DEFAULT_COMPETITORS: List[Dict[str, Any]] = [
    {
        "name": "ColorWhistle",
        "location": "Coimbatore",
        "seo_visibility": "High",
        "reviews": "Strong third-party footprint",
        "services": ["White-label web development", "SEO", "eCommerce", "Content"],
        "differentiation": "Broader enterprise-style delivery and larger proof portfolio.",
    },
    {
        "name": "ClickBox Agency",
        "location": "Coimbatore",
        "seo_visibility": "Medium-High",
        "reviews": "Active public review collection",
        "services": ["SEO", "Performance marketing", "Web development", "Social media"],
        "differentiation": "Aggressive full-funnel acquisition positioning for SMB and growth-stage clients.",
    },
    {
        "name": "Swiftpropel",
        "location": "Coimbatore",
        "seo_visibility": "Medium",
        "reviews": "Credible proof-led positioning",
        "services": ["White-label SEO", "Paid media", "Web development", "Funnels"],
        "differentiation": "More explicit white-label and execution-partner messaging.",
    },
]

SPAM_TOKENS = (
    "casino",
    "bet",
    "loan",
    "pills",
    "adult",
    "escort",
    "free-for-all",
    "profile backlink",
    "directory submission",
)

REQUIRED_SECTION_MINIMUMS = {
    "website_analysis.technical_seo": 3,
    "website_analysis.content_quality": 3,
    "website_analysis.ux_conversion": 3,
    "seo_analysis.opportunities": 3,
    "reputation_analysis.issues": 2,
    "service_offerings_analysis.issues": 2, 
    "lead_gen_analysis.issues": 3,
    "competitive_analysis.issues": 2,
    "cost_optimization.issues": 2,
    "target_market_client_intelligence.issues": 2,
    "financial_impact.issues": 2,
}

LLM_STRUCTURED_PROMPT = """
You refine consulting-style report summaries. Do not change facts. Do not invent metrics.
Return valid JSON with only these keys when you have meaningful improvements:
{
  "executive_summary": {"overview": "...", "biggest_opportunity": "..."},
  "website_analysis": {"summary": "..."},
  "seo_analysis": {"authority_summary": "...", "keyword_visibility": "..."},
  "reputation_analysis": {"summary": "..."},
  "lead_gen_analysis": {"summary": "..."},
  "competitive_analysis": {"summary": "..."},
  "financial_impact": {"summary": "..."},
  "risk_assessment": {"summary": "..."}
}
Keep the tone direct, commercial, and evidence-led.
""".strip()


def ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def safe_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    if isinstance(value, str):
        return sanitize_text(value)
    if isinstance(value, (int, float, bool)):
        return sanitize_text(str(value))
    return default


def safe_int(value: Any, default: Optional[int] = None) -> Optional[int]:
    try:
        if value in (None, "", "N/A"):
            return default
        if isinstance(value, bool):
            return int(value)
        if isinstance(value, (int, float)):
            return int(value)
        digits = "".join(ch for ch in str(value) if ch.isdigit())
        return int(digits) if digits else default
    except Exception:
        return default


def safe_float(value: Any, default: Optional[float] = None) -> Optional[float]:
    try:
        if value in (None, "", "N/A"):
            return default
        if isinstance(value, (int, float)):
            return float(value)
        cleaned = str(value).replace(",", "").strip()
        return float(cleaned)
    except Exception:
        return default


def model_dump_compat(obj: Any) -> Any:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "dict"):
        return obj.dict()   
    return obj


def _flatten_strings(*values: Any) -> List[str]:
    out: List[str] = []
    for value in values:
        if isinstance(value, str):
            text = safe_text(value)
            if text:
                out.append(text)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    text = safe_text(item)
                    if text:
                        out.append(text)
                elif isinstance(item, dict):
                    joined = " | ".join(safe_text(v) for v in item.values() if safe_text(v))
                    if joined:
                        out.append(joined)
        elif isinstance(value, dict):
            for item in value.values():
                out.extend(_flatten_strings(item))
    return out


def _clean_outcome_text(value: str) -> str:
    text = sanitize_text(value or "")
    text = re.sub(r"(?i)^expected outcome:\s*", "", text).strip()
    return text


def make_issue(
    finding: str,
    why_it_matters: str,
    business_impact: str,
    recommended_action: str,
    expected_outcome: Optional[str] = None,
    *,
    evidence: Optional[List[str]] = None,
    severity: str = "medium",
    scope: str = "sitewide",
) -> IssueInsight:
    outcome = _clean_outcome_text(expected_outcome or f"Improved execution against: {sanitize_text(recommended_action)}")
    return IssueInsight(
        finding=sanitize_text(finding),
        why_it_matters=sanitize_text(why_it_matters),
        business_impact=sanitize_text(business_impact),
        recommended_action=sanitize_text(recommended_action),
        expected_outcome=outcome,
        evidence=[sanitize_text(item) for item in (evidence or []) if safe_text(item)],
        severity=severity,
        scope=scope,
    )


def format_issue_for_pdf(item: Dict[str, Any] | IssueInsight) -> str:
    issue = model_dump_compat(item)
    evidence = "; ".join(issue.get("evidence") or [])
    suffix = f" Evidence: {evidence}" if evidence else ""
    return (
        f"Finding: {safe_text(issue.get('finding'))}. "
        f"Why it matters: {safe_text(issue.get('why_it_matters'))}. "
        f"Business impact: {safe_text(issue.get('business_impact'))}. "
        f"Recommended action: {safe_text(issue.get('recommended_action'))}. "
        f"Expected outcome: {safe_text(issue.get('expected_outcome'))}.{suffix}"
    ).strip()


def _collect_registry_urls(page_registry: Dict[str, Any], pages_crawled: List[str]) -> List[str]:
    urls: List[str] = []
    urls.extend([safe_text(url) for url in pages_crawled if safe_text(url)])
    sources_by_url = ensure_dict(page_registry.get("sourcesByUrl"))
    urls.extend([safe_text(url) for url in sources_by_url.keys() if safe_text(url)])

    pages = ensure_dict(page_registry.get("pages"))
    for payload in pages.values():
        if isinstance(payload, dict):
            primary = safe_text(payload.get("primary"))
            if primary:
                urls.append(primary)
            for candidate in ensure_list(payload.get("candidates")):
                if safe_text(candidate):
                    urls.append(safe_text(candidate))
        elif isinstance(payload, str) and safe_text(payload):
            urls.append(safe_text(payload))

    seen: set[str] = set()
    ordered: List[str] = []
    for url in urls:
        key = url.lower().rstrip("/")
        if key and key not in seen:
            seen.add(key)
            ordered.append(url)
    return ordered


def _looks_like_case_study(url: str) -> bool:
    u = url.lower()
    return any(token in u for token in ("case-study", "case-studies", "portfolio", "work/", "projects", "success-story"))


def _looks_like_conversion_url(url: str) -> bool:
    u = url.lower()
    return any(token in u for token in ("contact", "book", "pricing", "quote", "audit", "consult", "proposal", "schedule"))


def _detect_homepage_trust_presentation(homepage: Dict[str, Any]) -> bool:
    text = " ".join(_flatten_strings(homepage)).lower()
    return any(token in text for token in ("testimonial", "review", "trusted by", "client logos", "clutch", "google review", "case study"))


def _detect_homepage_cta(homepage: Dict[str, Any]) -> bool:
    text = " ".join(_flatten_strings(homepage)).lower()
    return any(token in text for token in ("book a call", "get proposal", "contact us", "schedule", "free audit", "get started", "request a quote"))


def _extract_backlink_snapshot(
    seo_section: Dict[str, Any],
    dataforseo: Dict[str, Any],
    appendices: Dict[str, Any],
) -> Dict[str, Any]:
    backlinks = ensure_dict(seo_section.get("backlinks"))
    backlink_blocks = ensure_list(appendices.get("backlinks"))
    bundle_summary = ensure_dict(dataforseo.get("backlinks") or dataforseo.get("backlinks_bundle") or dataforseo.get("summary"))

    total_backlinks = safe_int(backlinks.get("totalBacklinks"))
    referring_domains = safe_int(backlinks.get("referringDomains"))
    quality_score = safe_int(backlinks.get("linkQualityScore"))

    if not total_backlinks or not referring_domains:
        for block in backlink_blocks:
            if safe_text(block.get("tier")).lower().startswith("backlinks summary"):
                row = ensure_dict((block.get("items") or [{}])[0])
                total_backlinks = total_backlinks or safe_int(row.get("backlinks") or row.get("total_backlinks"))
                referring_domains = referring_domains or safe_int(row.get("referring_domains") or row.get("refDomains"))
                quality_score = quality_score or safe_int(row.get("rank") or row.get("domain_rank"))

    total_backlinks = total_backlinks or safe_int(bundle_summary.get("backlinks") or bundle_summary.get("total_backlinks")) or 0
    referring_domains = referring_domains or safe_int(bundle_summary.get("referring_domains") or bundle_summary.get("refDomains")) or 0
    quality_score = quality_score or safe_int(bundle_summary.get("rank") or bundle_summary.get("domain_rank") or bundle_summary.get("domainRating"))

    anchors: List[str] = []
    if isinstance(dataforseo.get("anchors"), list):
        anchors.extend([safe_text((a or {}).get("anchor_text") or (a or {}).get("anchor")) for a in ensure_list(dataforseo.get("anchors"))])
    for block in backlink_blocks:
        if "anchor" in safe_text(block.get("tier")).lower():
            for row in ensure_list(block.get("items")):
                if isinstance(row, dict):
                    anchors.append(safe_text(row.get("anchor_text") or row.get("anchor")))

    anchors = [a for a in anchors if a]
    low_quality_anchor_count = sum(1 for anchor in anchors if any(token in anchor.lower() for token in SPAM_TOKENS))
    repeated_exact_match = [anchor for anchor in set(anchors) if anchor and anchors.count(anchor) >= 3 and len(anchor.split()) >= 2]
    pbn_like_anchors = [anchor for anchor in anchors if any(token in anchor.lower() for token in SPAM_TOKENS) or anchor in repeated_exact_match][:10]

    if total_backlinks == 0 or referring_domains == 0:
        classification = "low"
        risk = "Limited authority footprint constrains category rankings."
    elif low_quality_anchor_count > 0 or pbn_like_anchors or (quality_score is not None and quality_score < 65):
        classification = "mixed"
        risk = "Anchor mix and referring-domain quality indicate possible low-trust or PBN-like signals that can cap ranking gains and increase cleanup risk."
    elif referring_domains < max(10, total_backlinks * 0.15):
        classification = "mixed"
        risk = "Backlink volume is concentrated across too few domains, which weakens diversity and durability."
    else:
        classification = "high"
        risk = "Backlink base is directionally healthy, but still needs more topic-relevant authority links to compete for commercial terms."

    recommendation = (
        "Audit anchors and referring domains, disavow obviously toxic links only when corroborated, and shift acquisition toward editorial, agency-partner, and proof-led mentions."
        if classification != "high"
        else "Maintain link quality with editorial outreach tied to service pages, case studies, and market commentary."
    )

    return {
        "total_backlinks": total_backlinks,
        "referring_domains": referring_domains,
        "quality_score": quality_score,
        "anchors": anchors[:20],
        "low_quality_anchor_count": low_quality_anchor_count,
        "pbn_like_anchors": pbn_like_anchors,
        "classification": classification,
        "risk": risk,
        "recommendation": recommendation,
    }


def _extract_keyword_snapshot(seo_signals: Dict[str, Any], appendices: Dict[str, Any], dataforseo: Dict[str, Any]) -> Dict[str, Any]:
    del seo_signals
    keywords: List[Dict[str, Any]] = []
    for tier in ensure_list(appendices.get("keywords")):
        items = ensure_list(ensure_dict(tier).get("items"))
        for item in items:
            if isinstance(item, dict):
                keywords.append(item)
    for item in ensure_list(dataforseo.get("search_volume")):
        if isinstance(item, dict):
            keywords.append(item)

    ranked_brand_only = True
    commercial_terms: List[Dict[str, Any]] = []
    for keyword in keywords:
        key = safe_text(keyword.get("keyword") or keyword.get("key"))
        if not key:
            continue
        rank = safe_int(keyword.get("rank") or keyword.get("position") or keyword.get("current_rank"))
        is_brand = "brand" in safe_text(keyword.get("intent")).lower() or "brandingbeez" in key.lower()
        if not is_brand:
            commercial_terms.append(
                {
                    "keyword": key,
                    "rank": rank,
                    "search_volume": safe_int(keyword.get("searchVolume") or keyword.get("search_volume") or keyword.get("volume")) or 0,
                    "difficulty": safe_int(keyword.get("difficulty") or keyword.get("keywordDifficulty")),
                }
            )
            if rank and rank <= 50:
                ranked_brand_only = False

    return {
        "all_keywords": keywords,
        "commercial_terms": commercial_terms,
        "ranked_brand_only": ranked_brand_only,
    }


def _is_relevant_competitor(row: Dict[str, Any]) -> bool:
    name = safe_text(row.get("name")).lower()
    if not name:
        return False

    service_text = " ".join(
        _flatten_strings(
            row.get("services"),
            row.get("differentiation"),
            row.get("positioning"),
            row.get("categories"),
            row.get("website"),
        )
    ).lower()
    combined = f"{name} {service_text}".strip()

    irrelevant_tokens = ("print", "printing", "label", "labels", "packaging", "signage", "sticker", "offset")
    if any(token in combined for token in irrelevant_tokens):
        return False

    relevance_tokens = (
        "white label",
        "seo",
        "ppc",
        "google ads",
        "web",
        "design",
        "development",
        "digital agency",
        "marketing agency",
        "marketing",
        "lead generation",
        "performance marketing",
    )
    return any(token in combined for token in relevance_tokens)



def _filter_relevant_competitors(raw_competitors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    relevant = [ensure_dict(row) for row in raw_competitors if isinstance(row, dict) and _is_relevant_competitor(ensure_dict(row))]

    seen: set[str] = set()
    out: List[Dict[str, Any]] = []
    for row in relevant:
        key = safe_text(row.get("name")).lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(row)
    return out[:5]


def normalize_evidence(base_report: Dict[str, Any], llm_context: Dict[str, Any]) -> Dict[str, Any]:
    report = ensure_dict(base_report)
    context = ensure_dict(llm_context)

    metadata = ensure_dict(report.get("reportMetadata"))
    website_section = ensure_dict(report.get("websiteDigitalPresence") or context.get("websiteSignals"))
    seo_section = ensure_dict(report.get("seoVisibility") or context.get("seoSignals"))
    reputation_section = ensure_dict(report.get("reputation") or context.get("reputationSignals"))
    services_section = ensure_dict(report.get("servicesPositioning") or context.get("servicesSignals"))
    leadgen_section = ensure_dict(report.get("leadGeneration") or context.get("leadGenSignals"))
    competitive_section = ensure_dict(report.get("competitiveAnalysis") or context.get("competitiveAnalysisSeed"))
    appendices = ensure_dict(report.get("appendices"))
    evidence = ensure_dict(appendices.get("evidence"))
    page_registry = ensure_dict(context.get("pageRegistry") or evidence.get("pageRegistry"))
    homepage = ensure_dict(context.get("homepage"))
    pagespeed = ensure_dict(context.get("pagespeed") or evidence.get("pagespeed"))
    google_places = ensure_dict(context.get("googlePlaces"))
    google_profile = ensure_dict(google_places.get("profile") or google_places.get("company"))
    review_summary = ensure_dict(context.get("reviewSummary"))
    review_statuses = ensure_dict(context.get("reviewStatuses"))
    dataforseo = ensure_dict(context.get("dataforseo"))
    market_demand = ensure_dict(context.get("marketDemand") or report.get("marketDemand"))

    pages_crawled = [safe_text(url) for url in ensure_list(appendices.get("pagesCrawled")) if safe_text(url)]
    registry_urls = _collect_registry_urls(page_registry, pages_crawled)
    case_study_urls = [url for url in registry_urls if _looks_like_case_study(url)]
    conversion_urls = [url for url in registry_urls if _looks_like_conversion_url(url)]

    review_rows = [ensure_dict(row) for row in ensure_list(reputation_section.get("summaryTable")) if isinstance(row, dict)]
    if not review_rows and google_profile:
        review_rows.append(
            {
                "platform": "Google",
                "rating": google_profile.get("rating") or review_summary.get("averageRating"),
                "reviews": google_profile.get("reviewCount") or google_profile.get("user_ratings_total") or review_summary.get("totalReviews"),
            }
        )

    google_reviews = safe_int(google_profile.get("reviewCount") or google_profile.get("user_ratings_total") or review_summary.get("googleReviewCount")) or 0
    google_rating = safe_float(google_profile.get("rating") or review_summary.get("averageRating") or reputation_section.get("reviewScore")) or 0.0
    total_reviews = safe_int(reputation_section.get("totalReviews") or review_summary.get("totalReviews") or google_reviews) or 0

    backlink_snapshot = _extract_backlink_snapshot(seo_section, dataforseo, appendices)
    keyword_snapshot = _extract_keyword_snapshot(seo_section, appendices, dataforseo)

    mobile = ensure_dict(pagespeed.get("mobile"))
    desktop = ensure_dict(pagespeed.get("desktop"))
    technical = ensure_dict(website_section.get("technicalSEO"))
    content = ensure_dict(website_section.get("contentQuality"))
    ux = ensure_dict(website_section.get("uxConversion"))

    return {
        "company": safe_text(metadata.get("companyName") or context.get("companyName")),
        "website": safe_text(metadata.get("website") or context.get("website")),
        "metadata": metadata,
        "sub_scores": ensure_dict(metadata.get("subScores") or context.get("subScores")),
        "homepage": homepage,
        "homepage_text": " ".join(_flatten_strings(homepage)),
        "homepage_has_trust": _detect_homepage_trust_presentation(homepage),
        "homepage_has_cta": _detect_homepage_cta(homepage),
        "page_registry": page_registry,
        "registry_urls": registry_urls,
        "case_study_urls": case_study_urls,
        "conversion_urls": conversion_urls,
        "website_section": website_section,
        "seo_section": seo_section,
        "reputation_section": reputation_section,
        "services_section": services_section,
        "leadgen_section": leadgen_section,
        "competitive_section": competitive_section,
        "appendices": appendices,
        "review_rows": review_rows,
        "review_statuses": review_statuses,
        "google_reviews": google_reviews,
        "google_rating": google_rating,
        "total_reviews": total_reviews,
        "backlinks": backlink_snapshot,
        "keywords": keyword_snapshot,
        "mobile_pagespeed": {
            "performance": safe_int(mobile.get("performanceScore")),
            "lcp_ms": safe_int(ensure_dict(mobile.get("metrics")).get("lcpMs") or mobile.get("lcpMs")),
        },
        "desktop_pagespeed": {
            "performance": safe_int(desktop.get("performanceScore")),
            "lcp_ms": safe_int(ensure_dict(desktop.get("metrics")).get("lcpMs") or desktop.get("lcpMs")),
        },
        "technical_issue_text": " ".join(
            _flatten_strings(
                technical.get("issues"),
                technical.get("strengths"),
                content.get("gaps"),
                content.get("recommendations"),
                ux.get("issues"),
                ensure_dict(report.get("websiteDigitalPresence")).get("contentGaps"),
            )
        ).lower(),
        "services": [ensure_dict(item) for item in ensure_list(services_section.get("services"))],
        "lead_channels": [ensure_dict(item) for item in ensure_list(leadgen_section.get("channels"))],
        "missing_channels": [ensure_dict(item) for item in ensure_list(leadgen_section.get("missingHighROIChannels"))],
        "lead_magnets": [ensure_dict(item) for item in ensure_list(leadgen_section.get("leadMagnets"))],
        "competitors": _filter_relevant_competitors([ensure_dict(item) for item in ensure_list(competitive_section.get("competitors"))]),
        "conversion_page_count": len(conversion_urls),
        "cta_inventory": [{"page": "homepage", "has_primary_cta": bool(_detect_homepage_cta(homepage))}] + [{"page": url, "has_primary_cta": True} for url in conversion_urls[:6]],
        "market_demand": market_demand,
        "ux_score": safe_int(ux.get("score")) or safe_int(ensure_dict(website_section.get("uxConversion")).get("score")),
        "website_score": safe_int(ensure_dict(metadata.get("subScores") or context.get("subScores")).get("website")),
    }


def resolve_contradictions(evidence: Dict[str, Any]) -> Dict[str, Any]:
    resolved = deepcopy(evidence)
    contradictions: List[str] = []

    if resolved.get("case_study_urls"):
        contradictions.append(
            "Case study or portfolio URLs exist. The correct interpretation is that proof assets are present, but they may be under-promoted or not conversion-optimized on high-intent pages."
        )
    else:
        contradictions.append(
            "No case-study-like URLs were detected in the crawl. Proof should be treated as a build priority, not assumed to be absent from all channels."
        )

    if resolved.get("google_reviews", 0) > 0 and not resolved.get("homepage_has_trust"):
        contradictions.append(
            "Off-site trust exists through public reviews, but on-site trust presentation is weak. That is a merchandising problem, not a credibility problem."
        )

    backlinks = ensure_dict(resolved.get("backlinks"))
    backlink_classification = safe_text(backlinks.get("classification") or "low")
    resolved["backlink_classification"] = backlink_classification
    if backlink_classification == "mixed":
        contradictions.append(
            "The backlink footprint is not simply strong because volume exists. It should be classified as mixed-quality until anchor mix, domain relevance, and PBN-like patterns improve."
        )
    elif backlink_classification == "low":
        contradictions.append(
            "Backlink quantity alone is not sufficient today. Authority signals remain thin, so category SEO growth will rely on both content depth and targeted link acquisition."
        )

    if not resolved.get("homepage_has_cta"):
        if resolved.get("conversion_urls"):
            resolved["lead_capture_status"] = "homepage CTA is weak, but sitewide lead capture exists via contact, quote, or booking pages"
            contradictions.append(
                "The homepage may undersell conversion paths, but the site is not lead-capture blind because service, pricing, or contact URLs are present elsewhere in the site architecture."
            )
        else:
            resolved["lead_capture_status"] = "lead capture is weak across both homepage and site architecture"
    else:
        resolved["lead_capture_status"] = "homepage already exposes a conversion path"

    resolved["resolved_contradictions"] = contradictions
    return resolved


def _build_homepage_findings(e: Dict[str, Any]) -> List[IssueInsight]:
    findings: List[IssueInsight] = []

    if not e.get("homepage_has_cta"):
        findings.append(
            make_issue(
                "Homepage CTA hierarchy is weak or absent.",
                "A B2B services homepage needs a clear next step to convert agency buyers while intent is high.",
                "Visitors may continue browsing or drop into comparison mode instead of booking a discovery call.",
                "Add a persistent primary CTA in the hero and top navigation, while routing secondary CTAs to case studies and proof assets.",
                evidence=[e.get("lead_capture_status")],
                severity="high",
                scope="homepage",
            )
        )

    if e.get("google_reviews", 0) > 0 and not e.get("homepage_has_trust"):
        findings.append(
            make_issue(
                "Trust proof is stronger off-site than on the homepage.",
                "Agency buyers often validate capability within seconds by scanning for reviews, proof, and outcomes before they read detailed copy.",
                "BrandingBeez is leaving credibility on third-party platforms instead of using it to improve homepage conversion rate.",
                "Surface review counts, star ratings, and one quantified result block above the fold and again near the primary CTA.",
                evidence=[f"Public reviews detected: {e.get('total_reviews', 0)} total"],
                severity="high",
                scope="homepage",
            )
        )

    if e.get("case_study_urls"):
        findings.append(
            make_issue(
                "Proof assets exist but may not be merchandised from the homepage.",
                "Existing case studies only help pipeline if buyers can find them at the exact moment they need validation.",
                "Under-promoted proof lowers trust transfer and forces prospects to validate BrandingBeez on third-party sites instead.",
                "Link one flagship case study from the hero or first proof band, then route vertical-specific proof from each service page.",
                evidence=e.get("case_study_urls", [])[:3],
                severity="medium",
                scope="homepage",
            )
        )

    if not findings:
        findings.append(
            make_issue(
                "Homepage messaging is present, but commercial clarity can still improve.",
                "White-label agency buyers compare vendors quickly and reward specificity around who you serve, what you deliver, and how fast you execute.",
                "If the value proposition remains broad, more demos will convert into pricing requests than signed retainers.",
                "Sharpen the hero around the target buyer, service promise, and proof of execution speed or margin protection.",
                scope="homepage",
            )
        )

    return findings


def _build_sitewide_technical_findings(e: Dict[str, Any]) -> List[IssueInsight]:
    findings: List[IssueInsight] = []
    issue_text = safe_text(e.get("technical_issue_text")).lower()
    mobile_perf = safe_int(ensure_dict(e.get("mobile_pagespeed")).get("performance"))
    mobile_lcp = safe_int(ensure_dict(e.get("mobile_pagespeed")).get("lcp_ms"))
    desktop_perf = safe_int(ensure_dict(e.get("desktop_pagespeed")).get("performance"))

    if mobile_perf is not None and mobile_perf < 70:
        findings.append(
            make_issue(
                f"Mobile performance is under target at {mobile_perf}/100 with LCP around {mobile_lcp or 'N/A'} ms.",
                "Slow mobile rendering reduces first impressions, hurts Core Web Vitals, and suppresses both paid and organic conversion efficiency.",
                "Higher bounce rate and lower session depth reduce the chance that anonymous visitors ever reach service or proof pages.",
                "Prioritize image compression, script deferral, caching, and template cleanup on the homepage and highest-traffic service pages.",
                evidence=[f"Desktop performance: {desktop_perf or 'N/A'}/100"],
                severity="high",
                scope="sitewide",
            )
        )

    if "h1" in issue_text and "missing" in issue_text:
        findings.append(
            make_issue(
                "Heading hierarchy appears incomplete or inconsistent.",
                "Search engines and buyers both rely on clear page structure to understand topic focus and scanning flow.",
                "Weak heading structure reduces topical relevance and makes service pages feel less authoritative.",
                "Add a single commercial H1 per key page and align supporting H2 sections to buyer intent, deliverables, proof, and FAQs.",
                severity="medium",
            )
        )

    if "canonical" in issue_text and "missing" in issue_text:
        findings.append(
            make_issue(
                "Canonical tags are missing or inconsistent.",
                "Canonical control is basic crawl hygiene for agencies that want to consolidate authority onto priority pages.",
                "Duplicate or conflicting URLs can dilute relevance and slow indexation of the pages that should rank.",
                "Apply self-referencing canonicals to all indexable service, location, and proof pages and validate them in the sitemap.",
                severity="medium",
            )
        )

    if "schema" in issue_text and ("missing" in issue_text or "no schema" in issue_text):
        findings.append(
            make_issue(
                "Structured data coverage is weak or absent.",
                "Schema improves eligibility for richer SERP presentation and helps search engines interpret brand, organization, and review context.",
                "Without it, BrandingBeez looks less established in search results and loses CTR to stronger SERP merchandising.",
                "Implement Organization, Service, FAQ, Breadcrumb, and Review schema on core commercial pages.",
                severity="medium",
            )
        )

    if not findings:
        findings.append(
            make_issue(
                "Sitewide technical hygiene is serviceable but not yet a commercial differentiator.",
                "In white-label markets, technical competence is expected; it does not win deals unless it improves crawl efficiency and conversion speed.",
                "The risk is opportunity cost rather than outright failure: rivals with cleaner technical delivery will rank and convert faster.",
                "Use technical QA as a monthly operating rhythm tied to commercial pages, not as a one-off audit artifact.",
                severity="medium",
            )
        )

    return findings


def _build_content_findings(e: Dict[str, Any]) -> List[IssueInsight]:
    findings: List[IssueInsight] = []
    issue_text = safe_text(e.get("technical_issue_text")).lower()

    if "thin" in issue_text and "content" in issue_text:
        findings.append(
            make_issue(
                "Core service content appears thin relative to commercial search intent.",
                "Thin pages rarely rank for high-intent queries and also fail to answer the buyer objections that block demos.",
                "BrandingBeez risks attracting only branded or referral traffic while missing non-brand demand.",
                "Expand each priority service page with process detail, deliverables, turnaround, team model, FAQs, and proof outcomes.",
                severity="high",
            )
        )

    if not e.get("case_study_urls"):
        findings.append(
            make_issue(
                "Case-study discovery is weak.",
                "B2B buyers need evidence of execution quality, especially when evaluating an offshore or white-label delivery partner.",
                "Without visible proof, more pipeline depends on low-trust discovery calls and price comparison instead of value-based buying.",
                "Publish at least three proof-led case studies by service line and industry, each with baseline, intervention, and measurable result.",
                severity="high",
            )
        )

    findings.append(
        make_issue(
            "Content architecture is too shallow for a strong non-brand acquisition program.",
            "Search-led growth for agencies comes from a network of service, niche, comparison, and proof pages rather than a single brand page.",
            "A shallow content footprint caps traffic growth and makes lead generation overly dependent on direct outreach or referrals.",
            "Build a content cluster around white-label SEO, PPC, design, development, fulfillment process, and agency partnership models.",
            severity="medium",
        )
    )

    return findings[:4]


def _build_ux_findings(e: Dict[str, Any]) -> List[IssueInsight]:
    findings: List[IssueInsight] = []
    ux_score = safe_int(e.get("ux_score")) or 0

    if ux_score > 80:
        findings.append(
            make_issue(
                f"UX foundation is performing well at an estimated {ux_score}/100.",
                "A strong user experience reduces friction and helps buyers move through the site with confidence.",
                "BrandingBeez can build on an already solid journey rather than redesigning the conversion flow from scratch.",
                "Preserve the strongest navigation and page-structure patterns while tightening proof placement and CTA hierarchy.",
                "Higher conversion efficiency without disrupting the parts of the journey that already work.",
                severity="low",
            )
        )

    findings.append(
        make_issue(
            "Conversion flow needs clearer buyer progression from interest to inquiry." if ux_score <= 80 else "Conversion flow is credible, but buyer progression can be more deliberate.",
            "Agency buyers want an efficient path from positioning to proof to action without hunting across the site.",
            "Friction in that journey reduces demo rates and weakens close-rate quality because prospects arrive under-qualified or unconvinced.",
            "Sequence each page with a clear narrative: problem, offer, process, proof, FAQs, and one dominant CTA.",
            "More visitors progress from evaluation into a qualified inquiry instead of bouncing or postponing contact.",
            severity="high" if ux_score <= 80 else "medium",
        )
    )

    if e.get("google_reviews", 0) > 0:
        findings.append(
            make_issue(
                "Trust signals are not fully integrated into conversion UX.",
                "Reviews and proof should reduce anxiety exactly where buyers evaluate commitment risk.",
                "When proof sits off-site, proposal-stage objections increase and sales cycles stretch.",
                "Embed review snapshots, logos, and one short testimonial block beside the main CTA on homepage and service pages.",
                "Trust is transferred earlier in the journey, which improves demo quality and proposal confidence.",
                severity="medium",
            )
        )

    if not e.get("conversion_urls"):
        findings.append(
            make_issue(
                "Lead-capture architecture is thin beyond the homepage.",
                "A services business should provide multiple conversion paths for different intent levels and buying stages.",
                "Fewer entry points mean fewer qualified leads captured from non-homepage sessions.",
                "Create dedicated contact, audit, and proposal pages and connect them through header, footer, and service-page CTAs.",
                "More high-intent visitors can convert from deeper pages without returning to the homepage first.",
                severity="high",
            )
        )
    else:
        findings.append(
            make_issue(
                "Sitewide conversion paths exist but are not tightly orchestrated.",
                "The presence of contact or booking pages alone does not guarantee efficient lead capture if the user journey is fragmented.",
                "Traffic can leak between pages without reaching the highest-value conversion path.",
                "Map each CTA to a specific conversion intent: discovery call, scoped proposal, or audit request, and make that taxonomy consistent sitewide.",
                "The funnel becomes easier to navigate, measure, and optimize across both homepage and service-page traffic.",
                severity="medium",
            )
        )

    return findings[:4]


def _build_seo_section(e: Dict[str, Any]) -> SEOAnalysisSection:
    backlinks = ensure_dict(e.get("backlinks"))
    competitors = ensure_list(e.get("competitors"))
    sub_scores = ensure_dict(e.get("sub_scores"))
    domain_authority = ensure_dict(ensure_dict(e.get("seo_section")).get("domainAuthority"))
    authority_score = safe_int(domain_authority.get("score"))
    referring_domains = safe_int(backlinks.get("referring_domains")) or 0
    authority_estimate = authority_score or max(18, min(72, 18 + int(referring_domains * 0.7)))
    commercial_terms = ensure_list(ensure_dict(e.get("keywords")).get("commercial_terms"))
    ranked_brand_only = bool(ensure_dict(e.get("keywords")).get("ranked_brand_only"))

    classification = safe_text(backlinks.get("classification") or "low")
    classification_label = {"high": "high-quality", "mixed": "mixed-quality", "low": "low-authority"}.get(classification, "mixed-quality")
    backlink_summary = (
        f"The backlink footprint is currently {classification_label}, with {safe_int(backlinks.get('total_backlinks')) or 0} backlinks across "
        f"{referring_domains} referring domains. {safe_text(backlinks.get('risk'))}"
    )

    opportunities: List[IssueInsight] = []
    if ranked_brand_only or not commercial_terms:
        opportunities.append(
            make_issue(
                "Organic visibility is concentrated on branded demand rather than commercial intent.",
                "Branded rankings validate the brand, but they do not create first-touch pipeline from agencies actively comparing white-label partners.",
                "New-logo growth stays capped because search demand is captured late, after the buyer already knows the brand.",
                "Build service, comparison, and niche landing pages around white-label SEO, PPC, development, creative, and fulfillment-partner terms.",
                "More non-brand discovery from category searches and a healthier top-of-funnel search mix.",
                evidence=["Current keyword footprint suggests branded visibility is stronger than non-brand category visibility."],
                severity="high",
                scope="sitewide",
            )
        )

    opportunities.append(
        make_issue(
            "Authority is not yet compounding into category visibility.",
            "Links and authority help only when they reinforce commercial pages built around buyer demand.",
            "BrandingBeez can accumulate trust signals without materially growing category traffic if those signals do not support rankable service and comparison pages.",
            "Pair every authority-building push with a landing-page program focused on buyer-intent service pages, proof pages, and comparison content.",
            "Authority contributes more directly to pipeline-producing pages instead of sitting primarily on the homepage.",
            severity="high",
        )
    )

    opportunities.append(
        make_issue(
            "Backlink quality needs active interpretation, not just volume tracking.",
            "A mixed anchor profile or low-trust referring-domain set can blunt ranking gains even when backlink totals appear healthy.",
            "If quality risk is ignored, the SEO roadmap can overestimate how quickly authority should convert into rankings and leads.",
            safe_text(backlinks.get("recommendation") or "Audit anchors, remove obviously toxic links only when corroborated, and shift acquisition toward editorially relevant mentions."),
            "A cleaner authority profile and a more durable base for commercial keyword growth.",
            evidence=ensure_list(backlinks.get("pbn_like_anchors"))[:4],
            severity="medium",
        )
    )

    monthly_traffic = 0
    if commercial_terms:
        for item in commercial_terms[:12]:
            monthly_traffic += int((safe_int(item.get("search_volume")) or 0) * 0.08)
    if monthly_traffic == 0:
        services_count = len(ensure_list(e.get("services")))
        homepage_cta_bonus = 40 if e.get("homepage_has_cta") else 0
        monthly_traffic = max(0, referring_domains * 8 + services_count * 35 + homepage_cta_bonus)
    lead_low = int(round(monthly_traffic * 0.015))
    lead_high = int(round(monthly_traffic * 0.03))

    comparison_rows: List[Dict[str, Any]] = []
    for competitor in competitors[:3]:
        row = ensure_dict(competitor)
        comparison_rows.append(
            {
                "name": safe_text(row.get("name")),
                "seo_visibility": safe_text(row.get("seoVisibility") or row.get("seo_visibility") or row.get("visibility")),
                "reviews": safe_text(row.get("reviews") or row.get("review_position") or row.get("rating")),
                "services": ", ".join([safe_text(s) for s in ensure_list(row.get("services")) if safe_text(s)]),
                "positioning": safe_text(row.get("differentiation") or row.get("positioning")),
            }
        )

    keyword_visibility = (
        "Brand visibility exists, but non-brand commercial rankings remain underdeveloped, so search is acting more like validation than acquisition."
        if ranked_brand_only or not commercial_terms
        else "Commercial keyword signals exist, but they need stronger landing-page depth and supporting authority to become a consistent acquisition engine."
    )

    return SEOAnalysisSection(
        authority_summary=(
            f"Estimated authority sits around {authority_estimate}/100. That can support brand validation, but it is still below the level typically needed to win non-brand commercial terms consistently. "
            f"Current SEO maturity inputs suggest a {safe_int(sub_scores.get('seo')) or 0}/100 operating baseline."
        ),
        backlink_quality=backlink_summary,
        backlink_interpretation={
            "classification": classification,
            "risk": safe_text(backlinks.get("risk")),
            "growth_potential": "High" if classification != "high" else "Moderate",
            "pbn_like_anchors": ensure_list(backlinks.get("pbn_like_anchors"))[:8],
            "recommendation": safe_text(backlinks.get("recommendation")),
        },
        keyword_visibility=keyword_visibility,
        competitor_comparison=comparison_rows,
        opportunities=opportunities,
        estimated_traffic_potential={
            "monthly_incremental_sessions": monthly_traffic,
            "formula": "sum(priority_keyword_volume x 0.08 expected click share) or authority-led directional proxy when keyword data is thin",
            "assumption": "Directional estimate based on capturing roughly 8% of search demand across a focused set of commercial terms once landing pages and authority improve.",
        },
        estimated_lead_potential={
            "monthly_leads_range": f"{lead_low}-{lead_high}",
            "formula": f"{monthly_traffic} incremental sessions x 1.5%-3.0% conversion",
            "assumption": "Assumes a B2B service site with stronger proof, clearer CTA routing, and higher-intent landing pages.",
        },
    )



def _build_reputation_section(e: Dict[str, Any]) -> ReputationAnalysisSection:
    total_reviews = safe_int(e.get("total_reviews")) or 0
    google_rating = safe_float(e.get("google_rating")) or 0.0
    review_rows = ensure_list(e.get("review_rows"))
    issues: List[IssueInsight] = []

    if total_reviews < 50:
        issues.append(
            make_issue(
                "Public review volume is credible but not yet market-leading.",
                "In B2B services, review count acts as a risk-reduction shortcut for buyers comparing shortlist vendors.",
                "BrandingBeez has enough proof to build trust, but not enough to dominate buyer confidence at first glance.",
                "Run a quarterly review campaign across Google and Clutch, with explicit asks tied to outcomes, responsiveness, and white-label execution quality.",
                evidence=[f"Total public reviews detected: {total_reviews}"],
                severity="medium",
                scope="off_site",
            )
        )

    if total_reviews > 0 and not e.get("homepage_has_trust"):
        issues.append(
            make_issue(
                "The site underuses existing reputation assets.",
                "Strong off-site reviews should lower friction on-site, especially for a delivery partner selling trust and execution quality.",
                "When reviews stay off-site, the sales team has to recreate trust manually in calls and proposals.",
                "Create a reusable trust block that displays star rating, review count, two short quotes, and a platform link across homepage and service pages.",
                severity="high",
                scope="sitewide",
            )
        )

    return ReputationAnalysisSection(
        summary=(
            f"The reputation base is positive with approximately {total_reviews} public reviews and an average Google rating around {google_rating:.1f}. "
            "The commercial issue is not trust absence; it is weak trust packaging across the owned website."
        ),
        reviews=[
            {
                "platform": safe_text(row.get("platform") or row.get("site") or "Unknown"),
                "rating": row.get("rating") or row.get("score") or "N/A",
                "reviews": row.get("reviews") or row.get("count") or "N/A",
            }
            for row in review_rows
        ],
        industry_benchmarks=[
            "B2B agencies with 50+ public reviews typically convert better on directory and branded traffic than peers with light review coverage.",
            "Employee-review sentiment also matters because 78% of B2B buyers say company credibility and operational stability affect shortlist decisions.",
        ],
        trust_signals=[
            "Third-party review presence",
            "Potential case-study/portfolio URLs detected" if e.get("case_study_urls") else "Case-study layer needs expansion",
            "Conversion pages present" if e.get("conversion_urls") else "Lead-capture pages need strengthening",
        ],
        issues=issues,
    )


def _build_services_section(e: Dict[str, Any]) -> ServiceOfferingsSection:
    services = ensure_list(e.get("services"))
    issues: List[IssueInsight] = []

    if not services:
        issues.append(
            make_issue(
                "Service packaging is not explicit enough in the current data model.",
                "A broad agency promise without clearly productized offers makes white-label buying feel risky and custom-heavy.",
                "Prospects delay inquiries or push directly to price without understanding scope or operational fit.",
                "Create productized service cards with deliverables, turnaround, reporting cadence, and margin protection benefits for partner agencies.",
                severity="high",
            )
        )
    else:
        issues.append(
            make_issue(
                "Service clarity exists, but packaging can be sharper.",
                "Buyers comparing fulfillment partners respond better to productized offers than open-ended capability lists.",
                "Stronger packaging improves both qualified lead rate and proposal conversion.",
                "Reframe each service into a partner-ready offer with scope, SLA, reporting, and proof of performance.",
                severity="medium",
            )
        )

    issues.append(
        make_issue(
            "Differentiation is likely execution-led rather than message-led.",
            "Coimbatore-based agencies often overlap on core service menus, so the winner is the firm that explains operating model, speed, and white-label control best.",
            "If BrandingBeez sounds similar to every other performance or web agency, price pressure increases.",
            "Position BrandingBeez as an AI-first white-label execution partner with transparent workflows, QA, and rapid fulfillment for US/UK agencies.",
            severity="high",
            scope="competitive",
        )
    )

    return ServiceOfferingsSection(
        summary="The service base is commercially viable, but it needs clearer packaging and differentiation to win against local white-label competitors.",
        services=[
            {
                "name": safe_text(item.get("name") or item.get("service") or "Unnamed service"),
                "starting_price": safe_text(item.get("startingPrice") or item.get("starting_price")),
                "target_market": safe_text(item.get("targetMarket") or item.get("target_market")),
                "description": safe_text(item.get("description")),
            }
            for item in services
        ],
        differentiation="Operational reliability and fulfillment breadth are likely strengths, but they need a sharper external narrative.",
        market_positioning="Best positioned as a specialist white-label fulfillment partner for agencies that need delivery depth without headcount expansion.",
        issues=issues,
    )


def _build_lead_gen_section(e: Dict[str, Any]) -> LeadGenerationSection:
    lead_channels = ensure_list(e.get("lead_channels"))
    existing = []
    for row in lead_channels:
        row_d = ensure_dict(row)
        existing.append(
            {
                "channel": safe_text(row_d.get("channel") or "Website / referral"),
                "leads_per_month": safe_text(row_d.get("leadsPerMonth") or row_d.get("leads_per_month") or "Directional only"),
                "quality": safe_text(row_d.get("quality") or "Mixed"),
                "status": safe_text(row_d.get("status") or "Active"),
            }
        )

    if not existing:
        existing = [
            {"channel": "Branded search / direct", "leads_per_month": "Directional only", "quality": "High intent", "status": "Active"},
            {"channel": "Referrals", "leads_per_month": "Directional only", "quality": "High", "status": "Likely active"},
        ]

    lead_magnets = ensure_list(e.get("lead_magnets"))
    if not lead_magnets:
        lead_magnets = [
            {"title": "White-Label Delivery Audit", "funnel_stage": "Consideration", "description": "Shows agencies where internal delivery is leaking margin or velocity.", "estimated_conversion_rate": "2%-4%"},
            {"title": "Agency Fulfillment Capacity Calculator", "funnel_stage": "Awareness", "description": "Benchmarks workload, margins, and hidden delivery gaps.", "estimated_conversion_rate": "3%-5%"},
            {"title": "30-Day SEO / PPC takeover plan", "funnel_stage": "Decision", "description": "Demonstrates execution readiness for agencies considering outsourcing.", "estimated_conversion_rate": "4%-6%"},
        ]

    conversion_page_count = safe_int(e.get("conversion_page_count")) or len(ensure_list(e.get("conversion_urls")))
    homepage_has_cta = bool(e.get("homepage_has_cta"))
    cta_mapping = ensure_list(e.get("cta_inventory")) or [{"page": "homepage", "has_primary_cta": homepage_has_cta}]

    funnel_analysis = [
        {"stage": "Top of funnel", "status": "Weak" if not homepage_has_cta else "Moderate", "insight": "Homepage messaging does not yet convert discovery traffic into a guided next step consistently."},
        {"stage": "Mid funnel", "status": "Weak" if not lead_magnets else "Moderate", "insight": "Lead magnets and proof assets need stronger packaging to capture visitors not ready for a call."},
        {"stage": "Bottom funnel", "status": "Moderate" if conversion_page_count > 0 else "Weak", "insight": "Contact or proposal paths exist, but they need clearer routing by buyer intent and offer type."},
    ]

    conversion_gaps = [
        {"gap": "Homepage-to-contact progression", "impact": "High", "recommendation": "Add one dominant hero CTA and a proof-supported CTA block before the fold break."},
        {"gap": "Mid-funnel capture", "impact": "High", "recommendation": "Launch an audit or calculator lead magnet tied to agency margin, fulfillment speed, or capacity."},
        {"gap": "Offer-to-CTA alignment", "impact": "Medium", "recommendation": "Map every service page to one commercial CTA: audit, proposal, or discovery call."},
    ]

    channel_strategy = [
        {"channel": "SEO landing pages", "role": "Acquire category demand", "priority": "High", "expected_outcome": "Increase non-brand discovery."},
        {"channel": "Directories and reviews", "role": "Proof plus lead capture", "priority": "High", "expected_outcome": "Lift branded conversion and shortlist presence."},
        {"channel": "Lead magnets", "role": "Capture mid-funnel visitors", "priority": "High", "expected_outcome": "Create nurture-ready MQL volume."},
        {"channel": "Outbound partner outreach", "role": "Create controlled pipeline", "priority": "Medium", "expected_outcome": "Reduce overdependence on referral flow."},
    ]

    missing = [
        {"channel": "Outbound partner outreach", "estimated_leads": "4-8/month", "setup_time": "2 weeks", "monthly_cost": "$400-$900", "priority": "High"},
        {"channel": "Review-led directories", "estimated_leads": "2-5/month", "setup_time": "1 week", "monthly_cost": "$100-$400", "priority": "Medium"},
        {"channel": "Lead magnet funnels", "estimated_leads": "3-6/month", "setup_time": "2-3 weeks", "monthly_cost": "$200-$800", "priority": "High"},
        {"channel": "Niche SEO landing pages", "estimated_leads": "5-10/month", "setup_time": "4-6 weeks", "monthly_cost": "$800-$1,500", "priority": "High"},
    ]

    issues = [
        make_issue(
            "Lead generation appears overly reliant on branded discovery and referrals.",
            "Those channels are high quality but limited in scale and difficult to forecast.",
            "Pipeline growth stalls when referral flow softens or branded search demand plateaus.",
            "Build repeatable acquisition through SEO landing pages, directories, lead magnets, and targeted outbound to agency principals.",
            "A broader, more forecastable pipeline mix with less dependency on existing awareness.",
            severity="high",
        ),
        make_issue(
            "CTA routing is under-structured across the funnel.",
            "A B2B service site needs a clear progression from discovery to evaluation to inquiry.",
            "Visitors can leak out of the funnel if every page asks for the same action or no action at all.",
            "Map each page to a dominant CTA and align homepage, service, and proof pages to the right conversion intent.",
            "Better visitor progression from homepage and service pages into qualified conversion paths.",
            severity="high",
        ),
        make_issue(
            "Mid-funnel capture is weaker than bottom-funnel capture.",
            "Many buyers are interested before they are ready to book a discovery call, especially in white-label services.",
            "Without a mid-funnel asset, recoverable traffic exits the site without entering nurture.",
            "Launch one diagnostic lead magnet and one calculator-style asset tied to white-label margin improvement or fulfillment speed.",
            "More nurture-ready leads from existing traffic.",
            severity="medium",
        ),
    ]

    return LeadGenerationSection(
        summary="Lead generation needs to operate as a funnel, not a set of disconnected contact points. The immediate opportunity is to tighten CTA routing, add mid-funnel capture, and expand scalable acquisition beyond branded and referral demand.",
        funnel_analysis=funnel_analysis,
        cta_mapping=cta_mapping,
        current_lead_sources=existing,
        missing_channels=missing,
        lead_magnets=[
            {
                "title": safe_text(item.get("title")),
                "funnel_stage": safe_text(item.get("funnelStage") or item.get("funnel_stage")),
                "description": safe_text(item.get("description")),
                "estimated_conversion_rate": safe_text(item.get("estimatedConversionRate") or item.get("estimated_conversion_rate")),
            }
            for item in lead_magnets
        ],
        conversion_gaps=conversion_gaps,
        channel_strategy=channel_strategy,
        issues=issues,
    )


def _build_competitive_section(e: Dict[str, Any]) -> CompetitiveAnalysisSection:
    competitor_rows = ensure_list(e.get("competitors"))
    rows: List[Dict[str, Any]] = []
    for competitor in competitor_rows[:3]:
        source = ensure_dict(competitor)
        rows.append(
            {
                "name": safe_text(source.get("name")),
                "location": safe_text(source.get("location")),
                "seo_visibility": safe_text(source.get("seoVisibility") or source.get("seo_visibility") or source.get("visibility")),
                "reviews": safe_text(source.get("reviews") or source.get("rating")),
                "services": ", ".join([safe_text(s) for s in ensure_list(source.get("services")) if safe_text(s)]),
                "differentiation": safe_text(source.get("differentiation") or source.get("positioning")),
            }
        )

    issues = []
    if rows:
        issues.extend([
            make_issue(
                "Competitors are likely winning earlier shortlist visibility than the site is today.",
                "Search visibility, review presence, and clarity of packaging often shape the shortlist before a sales conversation starts.",
                "If rivals are discovered first, BrandingBeez enters deals later, with more price pressure and less narrative control.",
                "Track competitor keyword share, review growth, proof-page density, and offer packaging monthly, then close the most commercial gaps first.",
                severity="high",
                scope="competitive",
            ),
            make_issue(
                "Market differentiation needs a sharper ownership position.",
                "Service overlap across agencies is high, so the commercial winner is usually the firm that explains operating model, quality control, and speed more clearly.",
                "Weak differentiation compresses margins and makes the business easier to compare on price.",
                "Own a distinct AI-enabled white-label execution position with visible workflows, QA standards, turnaround expectations, and proof-led messaging.",
                severity="high",
                scope="competitive",
            ),
        ])
        summary = "The competitive gap is less about capability and more about discoverability, proof packaging, and a market position that feels meaningfully different before pricing is discussed."
    else:
        issues.append(
            make_issue(
                "No validated competitor set was captured in the current evidence bundle.",
                "Competitive analysis is only decision-useful when the comparison set reflects real SEO, digital marketing, or white-label agency alternatives.",
                "Without a validated set, the business can improve internal execution but still miss the market moves shaping shortlist decisions.",
                "Feed the pipeline with verified SEO, PPC, agency, or digital-marketing competitors only, then benchmark visibility, proof density, and offer packaging against them.",
                severity="medium",
                scope="competitive",
            )
        )
        summary = "Competitive benchmarking remains incomplete because the current crawl did not produce a validated comparison set of relevant SEO, digital marketing, or agency competitors."

    return CompetitiveAnalysisSection(
        summary=summary,
        competitors=rows,
        issues=issues,
    )



def _build_cost_section(e: Dict[str, Any]) -> CostOptimizationSection:
    del e
    issues = [
        make_issue(
            "Manual reporting and proposal work likely consumes senior team time.",
            "Agency margins erode when strategy or delivery leaders spend too much time on repetitive operational tasks.",
            "That raises servicing cost per client and delays turnaround for partners expecting white-label speed.",
            "Standardize reporting, proposal templates, onboarding checklists, and QA workflows using automation and reusable delivery assets.",
            severity="medium",
            scope="financial",
        ),
        make_issue(
            "Pricing power depends on positioning, not just unit cost.",
            "When services are framed as interchangeable fulfillment, buyers compare rates; when framed as margin-protecting execution, they compare outcomes.",
            "A weak narrative can turn a profitable offer into a commodity one.",
            "Package services into tiers with response times, reporting depth, QA, and optional strategic oversight to defend pricing.",
            severity="high",
            scope="financial",
        ),
    ]

    return CostOptimizationSection(
        summary="Profitability can improve through delivery automation, reusable assets, and stronger packaging that protects price realization.",
        tool_stack=[
            {"category": "Analytics", "status": "Expected baseline", "recommendation": "GA4, Search Console, Looker Studio"},
            {"category": "Project delivery", "status": "Directional estimate", "recommendation": "Central tasking, QA checklists, SLA tracker"},
            {"category": "Content and workflow AI", "status": "Opportunity", "recommendation": "Use controlled AI drafting for briefs, outlines, reporting summaries, and QA support"},
        ],
        automation_opportunities=[
            {"area": "Reporting", "impact": "$300-$700/month", "effort": "Low-Medium"},
            {"area": "Proposal generation", "impact": "$200-$500/month", "effort": "Low"},
            {"area": "QA / handoff workflows", "impact": "$250-$600/month", "effort": "Medium"},
        ],
        pricing_positioning=[
            {"offer": "White-label SEO delivery", "position": "Should be packaged, not rate-card only", "margin_note": "Higher perceived value when tied to turnaround and QA"},
            {"offer": "Design / development support", "position": "Bundle with partner retainer options", "margin_note": "Improves predictability and retention"},
        ],
        issues=issues,
    )


def _build_target_market_section(e: Dict[str, Any]) -> TargetMarketSection:
    del e
    issues = [
        make_issue(
            "The most attractive ICP is agencies that have demand but inconsistent delivery capacity.",
            "Those firms value execution reliability, white-label discretion, and the ability to add margin without internal hiring.",
            "Targeting too broadly dilutes messaging and slows conversion because the offer feels generic.",
            "Focus positioning on US and UK digital agencies with recurring client work and fulfillment bottlenecks in SEO, PPC, web, or creative production.",
            severity="high",
        ),
        make_issue(
            "Industry and service segmentation should shape content and proof.",
            "A generalist message forces every buyer to translate relevance manually.",
            "That lowers conversion rate and increases the amount of sales effort needed per deal.",
            "Create verticalized proof and messaging for agencies in home services, healthcare, legal, SaaS, and local multi-location businesses.",
            severity="medium",
        ),
    ]

    return TargetMarketSection(
        summary="BrandingBeez should prioritize agency partners in the US and UK that need dependable white-label delivery capacity more than low-cost freelancer support.",
        client_profile=[
            "Founder-led or sales-led digital agencies with 10-100 active clients",
            "Agencies experiencing delivery bottlenecks, margin squeeze, or unreliable subcontractor quality",
            "Teams that need discreet, repeatable fulfillment across SEO, paid media, web, or design",
        ],
        segments=[
            {"segment": "US boutique agencies", "budget": "$2,000-$6,000 MRR", "fit": "High", "why": "Large market with consistent outsourcing appetite"},
            {"segment": "UK growth agencies", "budget": "$1,500-$4,500 MRR", "fit": "High", "why": "Strong white-label demand and recurring fulfillment needs"},
            {"segment": "Fractional CMOs / consultants", "budget": "$1,000-$3,000 MRR", "fit": "Medium", "why": "Good referral channel but less predictable volume"},
        ],
        issues=issues,
    )


def _build_financial_section(e: Dict[str, Any]) -> FinancialImpactSection:
    services_count = max(1, len(ensure_list(e.get("services"))))
    reviews = safe_int(e.get("total_reviews")) or 0
    referring_domains = safe_int(ensure_dict(e.get("backlinks")).get("referring_domains")) or 0
    seo_lead_range = safe_text(ensure_dict(_build_seo_section(e).estimated_lead_potential).get("monthly_leads_range") or "6-12")
    try:
        seo_lead_low, seo_lead_high = [int(x) for x in seo_lead_range.split("-")]
    except Exception:
        seo_lead_low, seo_lead_high = 6, 12

    avg_mrr_low = 1200 + (services_count * 150)
    avg_mrr_high = 2500 + (services_count * 250)
    close_rate_low = 0.12 if reviews < 20 else 0.18
    close_rate_high = 0.22 if reviews < 20 else 0.30
    proposal_uplift_leads_low = max(1, round((reviews + referring_domains) * 0.02))
    proposal_uplift_leads_high = max(proposal_uplift_leads_low + 1, round((reviews + referring_domains) * 0.04))

    def money_range(low: float, high: float) -> str:
        return f"${int(round(low)):,}-${int(round(high)):,}"

    revenue_opportunities = [
        {
            "channel": "Commercial SEO landing pages",
            "formula": f"({seo_lead_low}-{seo_lead_high} organic leads x {close_rate_low:.0%}-{close_rate_high:.0%} close rate x ${avg_mrr_low:,}-${avg_mrr_high:,} MRR)",
            "monthly_range": money_range(seo_lead_low * close_rate_low * avg_mrr_low, seo_lead_high * close_rate_high * avg_mrr_high),
            "annual_range": money_range(seo_lead_low * close_rate_low * avg_mrr_low * 12, seo_lead_high * close_rate_high * avg_mrr_high * 12),
            "assumption": "Based on estimated incremental organic leads from non-brand SEO visibility.",
        },
        {
            "channel": "Homepage + CTA conversion uplift",
            "formula": f"({proposal_uplift_leads_low}-{proposal_uplift_leads_high} recovered leads x {close_rate_low:.0%}-{close_rate_high:.0%} x ${avg_mrr_low:,}-${avg_mrr_high:,} MRR)",
            "monthly_range": money_range(proposal_uplift_leads_low * close_rate_low * avg_mrr_low, proposal_uplift_leads_high * close_rate_high * avg_mrr_high),
            "annual_range": money_range(proposal_uplift_leads_low * close_rate_low * avg_mrr_low * 12, proposal_uplift_leads_high * close_rate_high * avg_mrr_high * 12),
            "assumption": "Assumes stronger CTA routing and on-site proof convert more existing traffic into inquiries.",
        },
        {
            "channel": "Review-led directory optimization",
            "formula": f"(1-3 additional qualified leads x {close_rate_low:.0%}-{close_rate_high:.0%} x ${avg_mrr_low:,}-${avg_mrr_high:,} MRR)",
            "monthly_range": money_range(1 * close_rate_low * avg_mrr_low, 3 * close_rate_high * avg_mrr_high),
            "annual_range": money_range(1 * close_rate_low * avg_mrr_low * 12, 3 * close_rate_high * avg_mrr_high * 12),
            "assumption": "Assumes directory profiles are proof-led and review volume continues to improve.",
        },
        {
            "channel": "Outbound partner outreach",
            "formula": f"(4-8 SQLs/month x 10%-18% close rate x ${avg_mrr_low:,}-${avg_mrr_high:,} MRR)",
            "monthly_range": money_range(4 * 0.10 * avg_mrr_low, 8 * 0.18 * avg_mrr_high),
            "annual_range": money_range(4 * 0.10 * avg_mrr_low * 12, 8 * 0.18 * avg_mrr_high * 12),
            "assumption": "Assumes targeted outreach to agencies with fulfillment bottlenecks and a proof-backed offer.",
        },
    ]

    cost_savings = [
        {
            "area": "Automated reporting",
            "formula": f"(8-16 hours/month saved x $20-$35 loaded hourly cost)",
            "monthly_range": money_range(8 * 20, 16 * 35),
            "annual_range": money_range(8 * 20 * 12, 16 * 35 * 12),
        },
        {
            "area": "Proposal templates and reuse",
            "formula": f"(4-10 hours/month saved x $25-$40 loaded hourly cost)",
            "monthly_range": money_range(4 * 25, 10 * 40),
            "annual_range": money_range(4 * 25 * 12, 10 * 40 * 12),
        },
        {
            "area": "QA and handoff SOPs",
            "formula": f"(6-12 hours/month saved x $18-$30 loaded hourly cost)",
            "monthly_range": money_range(6 * 18, 12 * 30),
            "annual_range": money_range(6 * 18 * 12, 12 * 30 * 12),
        },
    ]

    issues = [
        make_issue(
            "Financial upside should be presented as assumption-based ranges, not hard commitments.",
            "Consulting-grade estimates must separate observed facts from commercial assumptions.",
            "If estimates are presented as certainty, trust in the report erodes even when the strategy is sound.",
            "Show formulas, assumptions, and value ranges for every opportunity row.",
            "Commercial upside remains credible and decision-useful without overstating certainty.",
            severity="high",
            scope="financial",
        ),
        make_issue(
            "The fastest payback is likely from conversion improvement before full acquisition scale-up.",
            "Existing proof, reviews, and traffic can generate revenue faster if the site converts current demand better.",
            "That shortens payback time compared with relying only on long-cycle SEO growth.",
            "Prioritize homepage proof, CTA flow, case-study merchandising, and productized offers before expanding acquisition spend.",
            "Earlier revenue lift and faster ROI on the growth program.",
            severity="high",
            scope="financial",
        ),
    ]

    return FinancialImpactSection(
        summary="Financial impact is modeled as directional ranges grounded in observed trust, authority, service breadth, and lead-potential signals. Every row should be read as an assumption-based planning estimate rather than a booked forecast.",
        revenue_opportunities=revenue_opportunities,
        cost_savings=cost_savings,
        assumptions=[
            f"Average retained monthly revenue per new client modeled at ${avg_mrr_low:,}-${avg_mrr_high:,} based on service breadth and white-label retainer economics.",
            f"Lead close rate modeled at {close_rate_low:.0%}-{close_rate_high:.0%} depending on channel intent and proof strength.",
            "Savings estimates reflect time and delivery-efficiency gains, not payroll elimination.",
        ],
        issues=issues,
    )


def _build_action_plan() -> ActionPlanSection:
    return ActionPlanSection(
        days_1_30=[
            StrategicAction(title="Fix homepage conversion spine", rationale="Clarify CTA, proof, and trust placement.", expected_outcome="Higher conversion from existing branded and referral traffic.", timeframe="Days 1-7", owner="Marketing"),
            StrategicAction(title="Repair critical technical gaps", rationale="Improve mobile performance and indexation hygiene.", expected_outcome="Lower bounce risk and stronger crawl efficiency.", timeframe="Days 8-14", owner="Web / SEO"),
            StrategicAction(title="Launch trust asset block", rationale="Bring public review proof onto owned pages.", expected_outcome="Stronger perceived credibility and better sales-readiness.", timeframe="Days 15-21", owner="Marketing"),
            StrategicAction(title="Publish first case-study refresh", rationale="Turn proof into a conversion tool.", expected_outcome="Improved proposal support and service-page trust.", timeframe="Days 22-30", owner="Content"),
        ],
        days_31_60=[
            StrategicAction(title="Build service landing-page cluster", rationale="Expand non-brand keyword coverage.", expected_outcome="Improved category visibility and long-term organic pipeline.", timeframe="Days 31-45", owner="SEO / Content"),
            StrategicAction(title="Optimize directory profiles", rationale="Use reviews and case studies for inbound capture.", expected_outcome="More qualified proof-led leads from third-party traffic.", timeframe="Days 46-52", owner="Growth"),
            StrategicAction(title="Productize core white-label offers", rationale="Protect margin and simplify sales.", expected_outcome="Higher close rate and stronger pricing posture.", timeframe="Days 53-60", owner="Leadership"),
        ],
        days_61_90=[
            StrategicAction(title="Launch lead magnet funnel", rationale="Capture mid-funnel demand that is not ready to book immediately.", expected_outcome="Improved lead volume and nurture capacity.", timeframe="Days 61-72", owner="Growth"),
            StrategicAction(title="Start outbound partner campaign", rationale="Create a second scalable pipeline engine beyond SEO and referrals.", expected_outcome="Steadier top-of-funnel partner conversations.", timeframe="Days 73-82", owner="Sales"),
            StrategicAction(title="Codify AI-first positioning", rationale="Own a distinct market narrative versus local peers.", expected_outcome="Stronger differentiation and pricing resilience.", timeframe="Days 83-90", owner="Leadership"),
        ],
    )


def _build_competitive_advantages() -> CompetitiveAdvantageSection:
    return CompetitiveAdvantageSection(
        summary="BrandingBeez can win by turning operational strengths into a differentiated market narrative rather than competing as a generic low-cost fulfillment vendor.",
        advantages=[
            {"advantage": "AI-first white-label agency positioning", "action": "Publish workflow diagrams, automation examples, and QA checkpoints that prove speed with control."},
            {"advantage": "Coimbatore delivery leverage", "action": "Translate cost advantage into margin protection and faster turnaround, not cheaper labor messaging."},
            {"advantage": "Existing off-site trust", "action": "Merchandise reviews and proof directly on commercial pages."},
            {"advantage": "Broad service coverage", "action": "Package into clear partner-ready retainer offers."},
            {"advantage": "White-label fit for US/UK agencies", "action": "Use timezone overlap, communication process, and confidentiality as explicit selling points."},
        ],
    )


def _build_risk_section() -> RiskAssessmentSection:
    return RiskAssessmentSection(
        summary="The main risks are commercial rather than purely technical: weak differentiation, shallow non-brand discovery, and under-leveraged proof can all suppress growth even when delivery quality is strong.",
        risks=[
            {"risk": "Continued dependence on branded and referral traffic", "severity": "high", "likelihood": "high", "mitigation": "Build non-brand SEO, directories, and outbound partner acquisition."},
            {"risk": "Commodity pricing pressure", "severity": "high", "likelihood": "medium", "mitigation": "Productize offers and lead with AI-first white-label positioning."},
            {"risk": "Proof assets remain hidden or generic", "severity": "medium", "likelihood": "high", "mitigation": "Promote case studies and review blocks on homepage and service pages."},
            {"risk": "Technical fixes stay isolated from revenue pages", "severity": "medium", "likelihood": "medium", "mitigation": "Tie performance and indexation work to the highest-intent landing pages first."},
            {"risk": "Estimates are mistaken for hard financial commitments", "severity": "medium", "likelihood": "medium", "mitigation": "Document assumptions in every revenue and savings table."},
        ],
    )


def _build_appendices(e: Dict[str, Any]) -> AppendicesSection:
    keyword_rows = ensure_list(ensure_dict(e.get("market_demand")).get("keywords"))

    return AppendicesSection(
        keyword_opportunities=[
            {
                "tier": safe_text(row.get("tier") or row.get("label") or "Tier 2"),
                "keyword": safe_text(row.get("keyword") or row.get("key")),
                "monthly_search_volume": safe_int(row.get("search_volume") or row.get("searchVolume") or row.get("volume")) or 0,
                "difficulty": safe_int(row.get("difficulty") or row.get("competitionIntensity") or row.get("competition")) or "N/A",
                "current_rank": row.get("current_rank") or row.get("rank") or row.get("position") or "Not ranking",
            }
            for row in keyword_rows[:12]
            if safe_text(row.get("keyword") or row.get("key"))
        ],
        review_request_templates=[
            {"name": "Initial request", "subject": "Quick favor: could you share a review of the engagement?", "body": "Hi [Client Name], thanks again for trusting BrandingBeez with your delivery work. If the engagement has been valuable, would you be open to sharing a short review focused on responsiveness, execution quality, and outcomes? Here is the direct link: [Review Link]."},
            {"name": "Follow-up", "subject": "Following up on the review request", "body": "Hi [Client Name], I wanted to follow up on my earlier note. Even a short review would help other agencies understand how we support white-label delivery. If helpful, you can mention turnaround time, communication, and results. Review link: [Review Link]."},
            {"name": "Video testimonial request", "subject": "Would you be open to a 60-second video testimonial?", "body": "Hi [Client Name], we're updating our proof assets and would value a short video testimonial about your experience working with BrandingBeez. A simple 45-60 second recording covering the challenge, what changed, and the outcome is enough. We can send prompts and make the process easy."},
        ],
        case_study_template={
            "title": "[Client] x BrandingBeez",
            "sections": ["Client background", "Business challenge", "White-label delivery scope", "Execution approach", "Results with metrics", "Client quote", "Why it mattered commercially", "CTA to book a discovery call"],
        },
        evidence_sources=[
            {"source": safe_text(e.get("website")), "use": "Primary website crawl"},
            {"source": "PageSpeed Insights / crawl signals", "use": "Performance and UX evidence"},
            {"source": "Review platforms", "use": "Trust and reputation evidence"},
        ],
    )



def build_structured_report(evidence: Dict[str, Any]) -> ProfessionalBusinessReport:
    homepage_findings = _build_homepage_findings(evidence)
    sitewide_findings = _build_sitewide_technical_findings(evidence)
    technical = _build_sitewide_technical_findings(evidence)
    content = _build_content_findings(evidence)
    ux = _build_ux_findings(evidence)
    seo_section = _build_seo_section(evidence)
    reputation = _build_reputation_section(evidence)
    services = _build_services_section(evidence)
    lead_gen = _build_lead_gen_section(evidence)
    competitive = _build_competitive_section(evidence)
    cost = _build_cost_section(evidence)
    target = _build_target_market_section(evidence)
    financial = _build_financial_section(evidence)
    action_plan = _build_action_plan()
    advantages = _build_competitive_advantages()
    risks = _build_risk_section()
    appendices = _build_appendices(evidence)

    top_actions = [
        action_plan.days_1_30[0],
        action_plan.days_1_30[1],
        action_plan.days_1_30[2],
        action_plan.days_31_60[0],
        action_plan.days_61_90[2],
    ]

    return ProfessionalBusinessReport(
        executive_summary=ExecutiveSummarySection(
            overview=(
                "BrandingBeez has the ingredients of a credible white-label agency, but its website and organic footprint currently validate existing awareness more than they create new demand. "
                "The highest-value work is to turn existing proof, reviews, and service capability into stronger conversion packaging and category visibility."
            ),
            biggest_opportunity="Turn the site from a brand-validation asset into a demand-generation asset by improving conversion proof, category landing pages, and AI-first differentiation.",
            strengths=[
                "Positive public review footprint provides third-party trust.",
                "Service breadth supports an agency-partner model.",
                "Existing case-study or portfolio signals can be merchandised more aggressively." if evidence.get("case_study_urls") else "Proof can be built quickly through case studies and partner outcome pages.",
            ],
            weaknesses=[
                "Homepage trust and CTA structure underuse existing credibility.",
                "Organic visibility is skewed toward branded demand.",
                "Differentiation versus local competitors is not owned strongly enough.",
            ],
            contradictions_resolved=ensure_list(evidence.get("resolved_contradictions")),
        ),
        top_actions=top_actions,
        website_analysis=WebsiteAnalysisSection(
            homepage_findings=homepage_findings,
            sitewide_findings=sitewide_findings,
            technical_seo=technical,
            content_quality=content,
            ux_conversion=ux,
        ),
        seo_analysis=seo_section,
        reputation_analysis=reputation,
        service_offerings_analysis=services,
        lead_gen_analysis=lead_gen,
        competitive_analysis=competitive,
        cost_optimization=cost,
        target_market_client_intelligence=target,
        financial_impact=financial,
        action_plan_90_days=action_plan,
        competitive_advantages=advantages,
        risk_assessment=risks,
        appendices=appendices,
    )


def _fallback_issue(title: str) -> IssueInsight:
    title_key = sanitize_text(title).lower()
    fallback_map = {
        "website analysis technical seo": (
            "Technical priorities are affecting how efficiently the site can convert visibility into qualified traffic.",
            "Even a strong service proposition loses momentum when key pages load slowly or send mixed crawl signals.",
            "Search visibility and buyer confidence both weaken when technical friction sits on commercial pages.",
            "Use a monthly QA cadence tied to revenue pages, starting with speed, crawl control, and schema.",
            "Technical improvements support both ranking stability and conversion efficiency."
        ),
        "website analysis content quality": (
            "Commercial content is not yet carrying enough of the sales conversation on its own.",
            "B2B buyers expect service pages to answer objections, explain process, and prove results before they book time.",
            "If pages stay light, the sales team absorbs too much education and trust-building effort later in the funnel.",
            "Expand commercial pages with deliverables, operating model, proof, and buyer-specific FAQs.",
            "Service pages become stronger acquisition and pre-sales assets."
        ),
        "website analysis ux conversion": (
            "The user journey needs clearer guidance from evaluation into inquiry.",
            "A services site should reduce decision friction rather than forcing buyers to infer the next step.",
            "Unclear progression lowers lead quality and wastes high-intent sessions.",
            "Clarify CTA hierarchy, proof placement, and page-to-page progression around buyer intent.",
            "More visitors advance into qualified contact paths."
        ),
        "seo analysis opportunities": (
            "SEO opportunity exists, but it needs to be tied to category intent rather than brand validation alone.",
            "Agency growth through search depends on ranking for the terms buyers use before they know the brand.",
            "Without that shift, organic search stays defensive instead of generating new pipeline.",
            "Prioritize non-brand landing pages, proof-led content, and authority building around high-intent themes.",
            "Search becomes a stronger acquisition channel."
        ),
        "reputation analysis issues": (
            "Trust assets exist or can be developed, but they need stronger commercial packaging.",
            "Reviews and proof are most valuable when they appear at decision points, not only on third-party sites.",
            "Weak packaging increases sales friction and extends the path to confidence.",
            "Bring reviews, proof, and response quality directly into homepage and service-page trust blocks.",
            "Buyers can validate credibility faster."
        ),
        "financial impact issues": (
            "Financial upside should stay anchored to transparent assumptions.",
            "Decision-makers can use directional estimates when formulas and assumptions are explicit.",
            "Opaque numbers reduce trust even if the strategic logic is sound.",
            "Present each opportunity with formulas, ranges, and channel-level assumptions.",
            "The financial section becomes decision-useful instead of speculative."
        ),
    }
    finding, why_it_matters, business_impact, recommended_action, expected_outcome = fallback_map.get(
        title_key,
        (
            "This section is missing a clear commercial takeaway tied to growth, conversion, or margin.",
            "Decision-makers need to understand not only what the evidence says, but why it changes prioritization.",
            "If the implication remains abstract, the team is less likely to act on it or allocate budget against it.",
            "Translate the evidence into one direct action tied to revenue growth, conversion improvement, trust-building, or acquisition efficiency.",
            "The section becomes specific enough to drive execution and stakeholder alignment."
        ),
    )
    return make_issue(
        finding,
        why_it_matters,
        business_impact,
        recommended_action,
        expected_outcome,
        severity="medium",
    )


def ensure_structured_depth(report: ProfessionalBusinessReport) -> ProfessionalBusinessReport:
    path_to_list = {
        "website_analysis.technical_seo": report.website_analysis.technical_seo,
        "website_analysis.content_quality": report.website_analysis.content_quality,
        "website_analysis.ux_conversion": report.website_analysis.ux_conversion,
        "seo_analysis.opportunities": report.seo_analysis.opportunities,
        "reputation_analysis.issues": report.reputation_analysis.issues,
        "service_offerings_analysis.issues": report.service_offerings_analysis.issues,
        "lead_gen_analysis.issues": report.lead_gen_analysis.issues,
        "competitive_analysis.issues": report.competitive_analysis.issues,
        "cost_optimization.issues": report.cost_optimization.issues,
        "target_market_client_intelligence.issues": report.target_market_client_intelligence.issues,
        "financial_impact.issues": report.financial_impact.issues,
    }
    for path, items in path_to_list.items():
        minimum = REQUIRED_SECTION_MINIMUMS.get(path, 1)
        while len(items) < minimum:
            items.append(_fallback_issue(path.replace("_", " ")))

    if not report.action_plan_90_days.days_1_30:
        report.action_plan_90_days = _build_action_plan()
    if not report.top_actions:
        report.top_actions = report.action_plan_90_days.days_1_30[:3]
    if not report.appendices.review_request_templates:
        report.appendices = _build_appendices({})
    return report


def _normalize_for_dedupe(value: str) -> str:
    return re.sub(r"\s+", " ", sanitize_text(value).strip().lower().rstrip(". "))


def _dedupe_strings(values: List[str]) -> List[str]:
    out: List[str] = []
    seen: set[str] = set()
    for value in values:
        text = safe_text(value, "")
        key = _normalize_for_dedupe(text)
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(text)
    return out


def _dedupe_issues(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    seen: set[str] = set()
    for item in items:
        key = "|".join(
            _normalize_for_dedupe(safe_text(item.get(field), ""))
            for field in ("finding", "why_it_matters", "business_impact", "recommended_action", "expected_outcome")
        )
        if not key or key in seen:
            continue
        seen.add(key)
        item["evidence"] = _dedupe_strings([safe_text(v, "") for v in ensure_list(item.get("evidence"))])
        out.append(item)
    return out


def _quality_rewrite_issue(item: Dict[str, Any]) -> Dict[str, Any]:
    cleaned = dict(item)
    for field in ("finding", "why_it_matters", "business_impact", "recommended_action", "expected_outcome"):
        cleaned[field] = _clean_outcome_text(cleaned[field]) if field == "expected_outcome" else sanitize_text(cleaned.get(field, ""))
    if not cleaned.get("expected_outcome"):
        cleaned["expected_outcome"] = f"Improved performance against: {cleaned.get('recommended_action', '')}".strip()
    return cleaned


def _enforce_content_quality(payload: Dict[str, Any]) -> Dict[str, Any]:
    website = ensure_dict(payload.get("website_analysis"))
    ux_items = [dict(item) for item in ensure_list(website.get("ux_conversion")) if isinstance(item, dict)]
    if ux_items:
        website["ux_conversion"] = _dedupe_issues([_quality_rewrite_issue(item) for item in ux_items])
    for section_key in ("technical_seo", "content_quality", "homepage_findings", "sitewide_findings"):
        items = [dict(item) for item in ensure_list(website.get(section_key)) if isinstance(item, dict)]
        if items:
            website[section_key] = _dedupe_issues([_quality_rewrite_issue(item) for item in items])
    payload["website_analysis"] = website

    for parent_key, child_key in (
        ("seo_analysis", "opportunities"),
        ("reputation_analysis", "issues"),
        ("service_offerings_analysis", "issues"),
        ("lead_gen_analysis", "issues"),
        ("competitive_analysis", "issues"),
        ("cost_optimization", "issues"),
        ("target_market_client_intelligence", "issues"),
        ("financial_impact", "issues"),
    ):
        parent = ensure_dict(payload.get(parent_key))
        items = [dict(item) for item in ensure_list(parent.get(child_key)) if isinstance(item, dict)]
        if items:
            parent[child_key] = _dedupe_issues([_quality_rewrite_issue(item) for item in items])
        payload[parent_key] = parent

    executive = ensure_dict(payload.get("executive_summary"))
    executive["strengths"] = _dedupe_strings([safe_text(v, "") for v in ensure_list(executive.get("strengths"))])
    executive["weaknesses"] = _dedupe_strings([safe_text(v, "") for v in ensure_list(executive.get("weaknesses"))])
    executive["contradictions_resolved"] = _dedupe_strings([safe_text(v, "") for v in ensure_list(executive.get("contradictions_resolved"))])
    payload["executive_summary"] = executive
    return payload


def _scrub_blocked_text(value: Any) -> Any:
    if isinstance(value, str):
        cleaned = sanitize_text(value)
        return "" if contains_blocked_text(cleaned) else cleaned
    if isinstance(value, list):
        return [item for item in (_scrub_blocked_text(item) for item in value) if item not in (None, "", [], {})]
    if isinstance(value, dict):
        cleaned = {key: _scrub_blocked_text(item) for key, item in value.items()}
        return {key: item for key, item in cleaned.items() if item not in (None, "", [], {})}
    return value


def validate_structured_report_payload(report: ProfessionalBusinessReport) -> Dict[str, Any]:
    payload = _scrub_blocked_text(model_dump_compat(report))
    payload = _enforce_content_quality(payload)
    required_paths = {
        "executive_summary.overview": "The business has credible delivery potential, but growth will depend on stronger conversion packaging and broader non-brand discovery.",
        "seo_analysis.authority_summary": "Authority should be interpreted in relation to category visibility, not backlink count alone.",
        "lead_gen_analysis.summary": "Lead generation should explain funnel shape, CTA routing, and the channel mix required to scale beyond referrals.",
        "financial_impact.summary": "Financial impact should explain the planning assumptions behind each revenue and savings range.",
    }
    for dotted_path, default_text in required_paths.items():
        current = payload
        parts = dotted_path.split('.')
        for key in parts[:-1]:
            current = current.setdefault(key, {})
        if not safe_text(current.get(parts[-1])):
            current[parts[-1]] = default_text
    return sanitize_for_pdf(payload)


def maybe_refine_with_llm(report: ProfessionalBusinessReport, evidence: Dict[str, Any]) -> ProfessionalBusinessReport:
    if not bool(getattr(settings, "ENABLE_STRUCTURED_REPORT_LLM_REFINEMENT", False)):
        logger.info("[ConsultingPipeline] stage=structured_refinement skipped enabled=False")
        return report

    try:
        if int(get_effective_llm_mode() or 1) <= 1:
            return report
    except Exception:
        return report

    try:
        started_at = time.perf_counter()
        logger.info("[ConsultingPipeline] stage=structured_refinement start")
        payload = {
            "evidence": {
                "company": evidence.get("company"),
                "website": evidence.get("website"),
                "resolved_contradictions": evidence.get("resolved_contradictions"),
                "mobile_pagespeed": evidence.get("mobile_pagespeed"),
                "desktop_pagespeed": evidence.get("desktop_pagespeed"),
                "backlinks": evidence.get("backlinks"),
                "reviews": evidence.get("review_rows"),
                "lead_capture_status": evidence.get("lead_capture_status"),
            },
            "report": model_dump_compat(report),
        }
        refined = call_llm_json(
            "auto",
            LLM_STRUCTURED_PROMPT,
            sanitize_text(str(payload)),
            temperature=0.1,
            max_tokens=1800,
            timeout_s=90,
        )
        logger.info(
            "[ConsultingPipeline] stage=structured_refinement completed duration_ms=%s",
            int((time.perf_counter() - started_at) * 1000),
        )
        if not isinstance(refined, dict):
            return report

        es = ensure_dict(refined.get("executive_summary"))
        if safe_text(es.get("overview")):
            report.executive_summary.overview = safe_text(es.get("overview"))
        if safe_text(es.get("biggest_opportunity")):
            report.executive_summary.biggest_opportunity = safe_text(es.get("biggest_opportunity"))

        seo = ensure_dict(refined.get("seo_analysis"))
        if safe_text(seo.get("authority_summary")):
            report.seo_analysis.authority_summary = safe_text(seo.get("authority_summary"))
        if safe_text(seo.get("keyword_visibility")):
            report.seo_analysis.keyword_visibility = safe_text(seo.get("keyword_visibility"))

        rep = ensure_dict(refined.get("reputation_analysis"))
        if safe_text(rep.get("summary")):
            report.reputation_analysis.summary = safe_text(rep.get("summary"))

        lead = ensure_dict(refined.get("lead_gen_analysis"))
        if safe_text(lead.get("summary")):
            report.lead_gen_analysis.summary = safe_text(lead.get("summary"))

        comp = ensure_dict(refined.get("competitive_analysis"))
        if safe_text(comp.get("summary")):
            report.competitive_analysis.summary = safe_text(comp.get("summary"))

        fin = ensure_dict(refined.get("financial_impact"))
        if safe_text(fin.get("summary")):
            report.financial_impact.summary = safe_text(fin.get("summary"))

        risk = ensure_dict(refined.get("risk_assessment"))
        if safe_text(risk.get("summary")):
            report.risk_assessment.summary = safe_text(risk.get("summary"))
    except Exception:
        logger.exception("[ConsultingPipeline] stage=structured_refinement failed")

    return report


def _top_action_recommendation(action: StrategicAction) -> str:
    return f"{safe_text(action.title)}: {safe_text(action.rationale)}"


def _to_quick_win(action: StrategicAction) -> Dict[str, Any]:
    return {
        "title": safe_text(action.title),
        "impact": safe_text(action.expected_outcome),
        "time": safe_text(action.timeframe),
        "cost": "Low-Medium",
        "details": safe_text(action.rationale),
    }


def _group_actions_as_weeks(action_plan: ActionPlanSection) -> List[Dict[str, Any]]:
    groups: List[Tuple[str, List[StrategicAction]]] = [
        ("Days 1-30", action_plan.days_1_30),
        ("Days 31-60", action_plan.days_31_60),
        ("Days 61-90", action_plan.days_61_90),
    ]
    weeks: List[Dict[str, Any]] = []
    for range_label, actions in groups:
        for index, action in enumerate(actions, start=1):
            weeks.append(
                {
                    "weekRange": f"{range_label} / Step {index}",
                    "title": safe_text(action.title),
                    "actions": [safe_text(action.rationale), safe_text(action.expected_outcome)],
                    "expectedOutcome": safe_text(action.expected_outcome),
                    "kpis": [],
                }
            )
    return weeks


def convert_structured_to_legacy(structured_report: Dict[str, Any], base_report: Dict[str, Any]) -> Dict[str, Any]:
    report = deepcopy(base_report)
    structured = ensure_dict(structured_report)
    executive = ensure_dict(structured.get("executive_summary"))
    website = ensure_dict(structured.get("website_analysis"))
    seo = ensure_dict(structured.get("seo_analysis"))
    reputation = ensure_dict(structured.get("reputation_analysis"))
    services = ensure_dict(structured.get("service_offerings_analysis"))
    lead_gen = ensure_dict(structured.get("lead_gen_analysis"))
    competitive = ensure_dict(structured.get("competitive_analysis"))
    cost = ensure_dict(structured.get("cost_optimization"))
    target = ensure_dict(structured.get("target_market_client_intelligence"))
    financial = ensure_dict(structured.get("financial_impact"))
    action_plan = ensure_dict(structured.get("action_plan_90_days"))
    advantages = ensure_dict(structured.get("competitive_advantages"))
    risks = ensure_dict(structured.get("risk_assessment"))
    appendices = ensure_dict(structured.get("appendices"))

    report.setdefault("executiveSummary", {})
    top_actions = [StrategicAction(**item) if isinstance(item, dict) else item for item in ensure_list(structured.get("top_actions"))[:5]]
    report["executiveSummary"].update(
        {
            "biggestOpportunity": safe_text(executive.get("biggest_opportunity")),
            "mentorSnapshot": safe_text(executive.get("overview")),
            "strengths": ensure_list(executive.get("strengths")),
            "weaknesses": ensure_list(executive.get("weaknesses")),
            "quickWins": [_to_quick_win(item) for item in top_actions],
            "highPriorityRecommendations": [_top_action_recommendation(item) for item in top_actions],
        }
    )

    report.setdefault("websiteDigitalPresence", {})
    report["websiteDigitalPresence"]["mentorNotes"] = " ".join(ensure_list(executive.get("contradictions_resolved")))
    report["websiteDigitalPresence"].setdefault("technicalSEO", {})
    report["websiteDigitalPresence"]["technicalSEO"]["issues"] = [format_issue_for_pdf(item) for item in ensure_list(website.get("technical_seo"))]
    website_score = safe_int(ensure_dict(ensure_dict(report.get("reportMetadata")).get("subScores")).get("website"))
    report["websiteDigitalPresence"]["technicalSEO"]["strengths"] = (["Core site structure and UX foundation are strong enough to support a commercial optimization sprint."] if isinstance(website_score, int) and website_score >= 70 else [])
    report["websiteDigitalPresence"].setdefault("contentQuality", {})
    report["websiteDigitalPresence"]["contentQuality"]["gaps"] = [format_issue_for_pdf(item) for item in ensure_list(website.get("content_quality"))]
    report["websiteDigitalPresence"]["contentQuality"]["recommendations"] = [safe_text(ensure_dict(item).get("recommended_action")) for item in ensure_list(website.get("content_quality"))]
    report["websiteDigitalPresence"]["contentQuality"]["strengths"] = (["Existing proof and trust assets give the site something real to merchandise once page-level content is strengthened."] if isinstance(website_score, int) and website_score >= 65 else [])
    report["websiteDigitalPresence"].setdefault("uxConversion", {})
    report["websiteDigitalPresence"]["uxConversion"]["issues"] = [format_issue_for_pdf(item) for item in ensure_list(website.get("ux_conversion"))]
    report["websiteDigitalPresence"]["uxConversion"]["recommendations"] = [safe_text(ensure_dict(item).get("recommended_action")) for item in ensure_list(website.get("ux_conversion"))]
    report["websiteDigitalPresence"]["contentGaps"] = [safe_text(ensure_dict(item).get("finding")) for item in ensure_list(website.get("content_quality"))]

    report.setdefault("seoVisibility", {})
    report["seoVisibility"].setdefault("domainAuthority", {})
    report["seoVisibility"]["domainAuthority"]["notes"] = safe_text(seo.get("authority_summary"))
    report["seoVisibility"]["domainAuthority"]["score"] = report["seoVisibility"]["domainAuthority"].get("score")
    report["seoVisibility"].setdefault("backlinks", {})
    report["seoVisibility"]["backlinks"]["notes"] = " ".join([safe_text(seo.get("backlink_quality")), safe_text(ensure_dict(seo.get("backlink_interpretation")).get("risk")), safe_text(ensure_dict(seo.get("backlink_interpretation")).get("recommendation")), safe_text(seo.get("keyword_visibility"))]).strip()

    report.setdefault("reputation", {})
    report["reputation"]["mentorNotes"] = safe_text(reputation.get("summary"))
    report["reputation"]["summaryTable"] = ensure_list(reputation.get("reviews"))
    report["reputation"]["totalReviews"] = report["reputation"].get("totalReviews") or sum(safe_int(ensure_dict(row).get("reviews")) or 0 for row in ensure_list(reputation.get("reviews")))
    report["reputation"].setdefault("sentimentThemes", {})
    report["reputation"]["sentimentThemes"]["positive"] = ensure_list(reputation.get("trust_signals"))
    report["reputation"]["sentimentThemes"]["negative"] = [safe_text(ensure_dict(item).get("finding")) for item in ensure_list(reputation.get("issues"))]

    report.setdefault("servicesPositioning", {})
    report["servicesPositioning"]["mentorNotes"] = safe_text(services.get("summary"))
    report["servicesPositioning"]["services"] = ensure_list(services.get("services"))
    report["servicesPositioning"]["positioning"] = {
        "differentiation": safe_text(services.get("differentiation")),
        "currentStatement": safe_text(services.get("market_positioning")),
        "competitorComparison": safe_text(competitive.get("summary")) or safe_text(services.get("summary")),
    }
    report["servicesPositioning"]["serviceGaps"] = ensure_list(report["servicesPositioning"].get("serviceGaps"))

    report.setdefault("leadGeneration", {})
    report["leadGeneration"]["mentorNotes"] = safe_text(lead_gen.get("summary")) + " Funnel: " + " | ".join(f"{safe_text(ensure_dict(item).get("stage"))}: {safe_text(ensure_dict(item).get("insight"))}" for item in ensure_list(lead_gen.get("funnel_analysis")))
    report["leadGeneration"]["channels"] = ensure_list(lead_gen.get("current_lead_sources"))
    report["leadGeneration"]["missingHighROIChannels"] = ensure_list(lead_gen.get("missing_channels"))
    report["leadGeneration"]["leadMagnets"] = ensure_list(lead_gen.get("lead_magnets"))

    report.setdefault("competitiveAnalysis", {})
    report["competitiveAnalysis"]["mentorNotes"] = safe_text(competitive.get("summary"))
    report["competitiveAnalysis"]["competitors"] = ensure_list(competitive.get("competitors"))
    report["competitiveAnalysis"]["notes"] = " ".join(format_issue_for_pdf(item) for item in ensure_list(competitive.get("issues")))

    report.setdefault("costOptimization", {})
    report["costOptimization"]["mentorNotes"] = safe_text(cost.get("summary"))
    report["costOptimization"]["notes"] = safe_text(cost.get("summary"))
    report["costOptimization"]["opportunities"] = [
        {"title": safe_text(ensure_dict(item).get("area") or ensure_dict(item).get("offer") or "Optimization opportunity"), "description": safe_text(ensure_dict(item).get("impact") or ensure_dict(item).get("margin_note") or "Operational efficiency gain.")}
        for item in ensure_list(cost.get("automation_opportunities")) + ensure_list(cost.get("pricing_positioning"))
    ]

    report.setdefault("targetMarket", {})
    report["targetMarket"]["mentorNotes"] = safe_text(target.get("summary"))
    report["targetMarket"]["notes"] = safe_text(target.get("summary"))
    report["targetMarket"]["segments"] = ensure_list(target.get("segments"))

    report.setdefault("financialImpact", {})
    report["financialImpact"]["mentorNotes"] = safe_text(financial.get("summary"))
    report["financialImpact"]["notes"] = safe_text(financial.get("summary"))
    report["financialImpact"]["revenueTable"] = [
        {"metric": safe_text(item.get("channel") or item.get("area")), "value": " | ".join(part for part in [safe_text(item.get("formula")), safe_text(item.get("monthly_range") or item.get("monthly_impact") or item.get("monthly_savings")), safe_text(item.get("annual_range") or item.get("annual_impact") or item.get("annual_savings"))] if part)}
        for item in ensure_list(financial.get("revenue_opportunities")) + ensure_list(financial.get("cost_savings"))
    ]

    report["actionPlan90Days"] = _group_actions_as_weeks(ActionPlanSection(**action_plan)) if action_plan else _group_actions_as_weeks(_build_action_plan())
    report["competitiveAdvantages"] = {
        "advantages": [safe_text(ensure_dict(item).get("advantage")) for item in ensure_list(advantages.get("advantages"))],
        "mentorNotes": safe_text(advantages.get("summary")),
        "notes": safe_text(advantages.get("summary")),
    }
    report["riskAssessment"] = {
        "risks": [{"risk": safe_text(ensure_dict(item).get("risk")), "severity": safe_text(ensure_dict(item).get("severity")), "mitigation": safe_text(ensure_dict(item).get("mitigation"))} for item in ensure_list(risks.get("risks"))],
        "mentorNotes": safe_text(risks.get("summary")),
    }

    report.setdefault("appendices", {})
    report["appendices"]["keywords"] = [{"tier": "Keyword Opportunities", "items": ensure_list(appendices.get("keyword_opportunities"))}]
    report["appendices"].setdefault("evidence", {})
    report["appendices"]["evidence"]["reviewTemplates"] = ensure_list(appendices.get("review_request_templates"))
    report["appendices"]["evidence"]["caseStudyTemplate"] = ensure_dict(appendices.get("case_study_template"))
    report["appendices"]["evidence"]["structuredReport"] = structured

    return report


def validate_legacy_report(report: Dict[str, Any], base_report: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    validated = deepcopy(base_report) if isinstance(base_report, dict) else {}
    if validated:
        for key, value in report.items():
            validated[key] = value
    else:
        validated = deepcopy(report)

    validated.setdefault("executiveSummary", {})
    validated["executiveSummary"].setdefault("strengths", ["Core delivery capability exists."])
    validated["executiveSummary"].setdefault("weaknesses", ["Commercial packaging needs work."])
    validated["executiveSummary"].setdefault("quickWins", [])
    validated["executiveSummary"].setdefault("highPriorityRecommendations", ["Strengthen CTA, trust, and non-brand visibility."])

    validated.setdefault("websiteDigitalPresence", {})
    validated["websiteDigitalPresence"].setdefault("technicalSEO", {"issues": ["Technical priorities should explain what is blocking visibility or conversion."], "strengths": [], "pageSpeed": None})
    validated["websiteDigitalPresence"].setdefault("contentQuality", {"gaps": ["Content analysis should explain which commercial pages need deeper proof, process detail, or intent coverage."], "recommendations": []})
    validated["websiteDigitalPresence"].setdefault("uxConversion", {"issues": ["UX analysis should explain where buyer progression slows or where trust can be surfaced earlier."], "recommendations": []})
    validated["websiteDigitalPresence"].setdefault("contentGaps", ["Expand commercial proof and service content."])
    validated.setdefault("seoVisibility", {"domainAuthority": {"notes": "Authority analysis is based on observed backlinks and ranking footprint."}, "backlinks": {"notes": "Backlink interpretation should explain quality, risk, and action."}})
    validated.setdefault("reputation", {"summaryTable": [], "sentimentThemes": {"positive": ["Third-party trust exists or should be built intentionally."], "negative": []}})
    validated.setdefault("servicesPositioning", {"services": [], "serviceGaps": [], "positioning": {}})
    validated.setdefault("leadGeneration", {"channels": [], "missingHighROIChannels": [], "leadMagnets": []})
    validated.setdefault("competitiveAnalysis", {"competitors": [], "notes": "Competitive analysis should compare SEO visibility, reviews, service overlap, and positioning."})
    validated.setdefault("costOptimization", {"opportunities": [], "notes": "Cost analysis should focus on automation, reuse, and pricing discipline."})
    validated.setdefault("targetMarket", {"segments": [], "notes": "Target market assumptions should reflect agency ICP, geography, and outsourcing fit."})
    validated.setdefault("financialImpact", {"revenueTable": [], "notes": "Financial impact should be shown as formula-based planning ranges."})

    if not isinstance(validated.get("actionPlan90Days"), list) or not validated.get("actionPlan90Days"):
        validated["actionPlan90Days"] = _group_actions_as_weeks(_build_action_plan())

    validated.setdefault("competitiveAdvantages", {"advantages": [], "notes": "Differentiate with AI-first white-label positioning."})
    if not ensure_list(ensure_dict(validated.get("competitiveAdvantages")).get("advantages")):
        validated["competitiveAdvantages"]["advantages"] = ["AI-first white-label execution", "Review-backed trust", "Partner-ready delivery model"]

    validated.setdefault("riskAssessment", {"risks": [], "mentorNotes": "Growth execution risks remain manageable with phased rollout."})
    if not ensure_list(ensure_dict(validated.get("riskAssessment")).get("risks")):
        validated["riskAssessment"]["risks"] = model_dump_compat(_build_risk_section()).get("risks", [])

    validated.setdefault("appendices", {"keywords": [], "dataSources": [], "dataGaps": [], "pagesCrawled": [], "evidence": {}})
    if not safe_text(ensure_dict(validated.get("executiveSummary")).get("mentorSnapshot")):
        validated["executiveSummary"]["mentorSnapshot"] = (
            "Current evidence suggests the business has delivery potential, but the website and search footprint are not yet converting that capability into enough qualified demand. "
            "The immediate priority is to tighten conversion paths, strengthen proof presentation, and improve non-brand discoverability so more traffic can turn into sales conversations.\n\n"
            "The Bottom Line: better commercial packaging should improve how efficiently existing visibility turns into pipeline."
        )

    return sanitize_for_pdf(validated)




SCORE_WEIGHTS = {
    "website": 25,
    "seo": 20,
    "reputation": 15,
    "leadGen": 20,
    "services": 20,
}


def _clamp_score(value: Any) -> Optional[int]:
    score = safe_float(value)
    if score is None:
        return None
    return max(0, min(100, int(round(score))))



def _average_scores(*values: Any) -> Optional[int]:
    scores = [_clamp_score(v) for v in values]
    nums = [v for v in scores if isinstance(v, int)]
    if not nums:
        return None
    return _clamp_score(sum(nums) / len(nums))



def _severity_counts(structured: Dict[str, Any]) -> Dict[str, int]:
    counts = {"high": 0, "medium": 0, "low": 0}
    section_paths = [
        ("website_analysis", "technical_seo"),
        ("website_analysis", "content_quality"),
        ("website_analysis", "ux_conversion"),
        ("seo_analysis", "opportunities"),
        ("reputation_analysis", "issues"),
        ("service_offerings_analysis", "issues"),
        ("lead_gen_analysis", "issues"),
        ("competitive_analysis", "issues"),
        ("cost_optimization", "issues"),
        ("target_market_client_intelligence", "issues"),
        ("financial_impact", "issues"),
    ]
    for parent_key, child_key in section_paths:
        parent = ensure_dict(structured.get(parent_key))
        for item in ensure_list(parent.get(child_key)):
            severity = safe_text(ensure_dict(item).get("severity") or "medium").lower()
            if severity not in counts:
                severity = "medium"
            counts[severity] += 1
    return counts



def _calculate_scorecard(base_report: Dict[str, Any], evidence: Dict[str, Any], structured: Dict[str, Any]) -> Dict[str, Any]:
    website_section = ensure_dict(base_report.get("websiteDigitalPresence"))
    seo_section = ensure_dict(base_report.get("seoVisibility"))
    services_section = ensure_dict(base_report.get("servicesPositioning"))
    lead_section = ensure_dict(base_report.get("leadGeneration"))

    website_score = _average_scores(
        ensure_dict(website_section.get("technicalSEO")).get("score"),
        ensure_dict(website_section.get("contentQuality")).get("score"),
        ensure_dict(website_section.get("uxConversion")).get("score"),
    )

    backlinks = ensure_dict(evidence.get("backlinks"))
    classification = safe_text(backlinks.get("classification") or "").lower()
    backlink_quality_score = _clamp_score(
        ensure_dict(seo_section.get("backlinks")).get("linkQualityScore")
        or {"high": 80, "mixed": 58, "low": 35}.get(classification)
    )
    commercial_terms = ensure_list(ensure_dict(evidence.get("keywords")).get("commercial_terms"))
    ranked_brand_only = bool(ensure_dict(evidence.get("keywords")).get("ranked_brand_only"))
    if ranked_brand_only:
        keyword_visibility_score = 30
    elif commercial_terms:
        keyword_visibility_score = min(85, 40 + len(commercial_terms) * 6)
    else:
        keyword_visibility_score = None

    seo_score = _average_scores(
        ensure_dict(seo_section.get("technicalSeo")).get("score") or ensure_dict(website_section.get("technicalSEO")).get("score"),
        ensure_dict(seo_section.get("domainAuthority")).get("score"),
        backlink_quality_score,
        keyword_visibility_score,
    )

    total_reviews = safe_int(evidence.get("total_reviews")) or 0
    google_rating = safe_float(evidence.get("google_rating"))
    rating_score = _clamp_score((google_rating or 0) / 5 * 100) if google_rating else None
    review_volume_score = _clamp_score(min(100, total_reviews * 2)) if total_reviews else None
    if rating_score is not None and review_volume_score is not None:
        reputation_score = _clamp_score((rating_score * 0.65) + (review_volume_score * 0.35))
    else:
        reputation_score = rating_score or review_volume_score

    detected_channels = 0
    for item in ensure_list(lead_section.get("channels")):
        status = safe_text(ensure_dict(item).get("status")).lower()
        if "detected" in status or "active" in status:
            detected_channels += 1
    lead_magnets = len(ensure_list(lead_section.get("leadMagnets")))
    conversion_page_count = safe_int(evidence.get("conversion_page_count")) or 0
    lead_points = 0
    lead_points += 30 if evidence.get("homepage_has_cta") else 0
    lead_points += min(25, conversion_page_count * 7)
    lead_points += min(20, lead_magnets * 7)
    lead_points += min(15, detected_channels * 5)
    lead_points += 10 if evidence.get("homepage_has_trust") or ensure_list(evidence.get("case_study_urls")) else 0
    lead_score = _clamp_score(lead_points)

    service_count = len(ensure_list(services_section.get("services")))
    industry_count = len(ensure_list(ensure_dict(services_section.get("industriesServed")).get("current")))
    has_positioning = bool(safe_text(ensure_dict(services_section.get("positioning")).get("currentStatement")) or safe_text(ensure_dict(services_section.get("positioning")).get("differentiation")))
    services_points = 0
    services_points += min(35, service_count * 10)
    services_points += 20 if ensure_list(evidence.get("case_study_urls")) else 0
    services_points += 20 if has_positioning else 0
    services_points += min(15, industry_count * 5)
    services_points += 10 if service_count >= 3 else 0
    services_score = _clamp_score(services_points)

    section_scores = {
        "website": website_score,
        "seo": seo_score,
        "reputation": reputation_score,
        "leadGen": lead_score,
        "services": services_score,
    }

    available_weight = sum(weight for key, weight in SCORE_WEIGHTS.items() if isinstance(section_scores.get(key), int))
    weighted_total = sum((section_scores[key] or 0) * SCORE_WEIGHTS[key] for key in SCORE_WEIGHTS if isinstance(section_scores.get(key), int))
    overall_score = _clamp_score(weighted_total / available_weight) if available_weight else 0

    evidence_checks = [
        bool(evidence.get("homepage")),
        bool(evidence.get("homepage_has_cta") or conversion_page_count),
        bool(total_reviews),
        bool(backlinks.get("total_backlinks") or backlinks.get("referring_domains")),
        bool(service_count),
        bool(ensure_list(evidence.get("competitors"))),
        bool(ensure_dict(ensure_dict(base_report.get("appendices", {})).get("evidence")).get("screenshots")),
        bool(commercial_terms),
    ]
    evidence_score = _clamp_score((sum(1 for item in evidence_checks if item) / len(evidence_checks)) * 100) or 0
    coverage_score = _clamp_score((available_weight / sum(SCORE_WEIGHTS.values())) * 100) or 0
    confidence_score = _clamp_score((coverage_score * 0.6) + (evidence_score * 0.4)) or 0

    severities = _severity_counts(structured)
    opportunity_base = sum((100 - (section_scores[key] or 0)) * SCORE_WEIGHTS[key] for key in SCORE_WEIGHTS if isinstance(section_scores.get(key), int))
    opportunity_score = _clamp_score((opportunity_base / available_weight) + min(15, severities["high"] * 2)) if available_weight else 0
    risk_score = _clamp_score(
        ((100 - overall_score) * 0.45)
        + (severities["high"] * 6)
        + (severities["medium"] * 2)
        + (20 if not evidence.get("homepage_has_cta") else 0)
        + (25 if classification == "low" else 15 if classification == "mixed" else 0)
    ) or 0

    return {
        "overallScore": overall_score,
        "subScores": section_scores,
        "confidenceScore": confidence_score,
        "opportunityScore": opportunity_score,
        "riskScore": risk_score,
        "scoreMeta": {
            "weights": SCORE_WEIGHTS,
            "coverageScore": coverage_score,
            "evidenceScore": evidence_score,
            "sectionScores": section_scores,
            "method": "weighted average across Website 25%, SEO 20%, Reputation 15%, Lead Generation 20%, Services 20%; missing sections reduce confidence rather than defaulting low.",
        },
    }



def _inject_scorecard(legacy: Dict[str, Any], scorecard: Dict[str, Any]) -> Dict[str, Any]:
    report = deepcopy(legacy)
    report.setdefault("reportMetadata", {})
    report["reportMetadata"]["overallScore"] = _clamp_score(scorecard.get("overallScore")) or 0
    report["reportMetadata"]["subScores"] = {
        **ensure_dict(report["reportMetadata"].get("subScores")),
        **ensure_dict(scorecard.get("subScores")),
        "costEfficiency": ensure_dict(report["reportMetadata"].get("subScores")).get("costEfficiency"),
    }
    report["reportMetadata"]["confidenceScore"] = _clamp_score(scorecard.get("confidenceScore")) or 0
    report["reportMetadata"]["opportunityScore"] = _clamp_score(scorecard.get("opportunityScore")) or 0
    report["reportMetadata"]["riskScore"] = _clamp_score(scorecard.get("riskScore")) or 0
    report["reportMetadata"]["scoreMeta"] = ensure_dict(scorecard.get("scoreMeta"))

    report.setdefault("appendices", {})
    report["appendices"]["scoreSummary"] = [
        {"area": "Website", "score": ensure_dict(scorecard.get("subScores")).get("website"), "notes": "Technical foundation, content clarity, and UX/conversion readiness."},
        {"area": "SEO", "score": ensure_dict(scorecard.get("subScores")).get("seo"), "notes": "Authority, keyword coverage, and search-readiness."},
        {"area": "Reputation", "score": ensure_dict(scorecard.get("subScores")).get("reputation"), "notes": "Review strength and trust packaging."},
        {"area": "Lead Generation", "score": ensure_dict(scorecard.get("subScores")).get("leadGen"), "notes": "CTA clarity, lead capture, and funnel readiness."},
        {"area": "Services", "score": ensure_dict(scorecard.get("subScores")).get("services"), "notes": "Offer clarity, proof support, and positioning strength."},
    ]
    return report



def _validate_report_sections(legacy: Dict[str, Any]) -> Dict[str, Any]:
    report = deepcopy(legacy)
    summary = safe_text(ensure_dict(report.get("executiveSummary")).get("mentorSnapshot"))
    if not summary:
        report.setdefault("executiveSummary", {})
        report["executiveSummary"]["mentorSnapshot"] = (
            "The business shows credible delivery capability, but the commercial growth engine is not yet converting trust, proof, and service depth into enough qualified demand. "
            "The next phase should focus on improving discoverability, CTA routing, and proof merchandising so the site produces more sales-ready conversations."
        )

    for section_key in ("websiteDigitalPresence", "seoVisibility", "reputation", "servicesPositioning", "leadGeneration", "competitiveAnalysis", "financialImpact"):
        report.setdefault(section_key, {})

    return report


def build_professional_report(
    base_report: Dict[str, Any],
    llm_context: Dict[str, Any],
    *,
    cache_repo: Any = None,
    cache_key: Optional[str] = None,
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    del cache_repo, cache_key
    evidence = resolve_contradictions(normalize_evidence(base_report, llm_context))
    structured_model = build_structured_report(evidence)
    structured_model = ensure_structured_depth(structured_model)
    structured_model = maybe_refine_with_llm(structured_model, evidence)
    structured = validate_structured_report_payload(structured_model)
    legacy = convert_structured_to_legacy(structured, base_report)
    scorecard = _calculate_scorecard(base_report, evidence, structured)
    legacy = _inject_scorecard(legacy, scorecard)
    legacy = _validate_report_sections(legacy)
    legacy = validate_legacy_report(legacy, base_report)
    legacy["structuredReport"] = structured
    return structured, legacy


def example_structured_report_object() -> Dict[str, Any]:
    example_base = {
        "reportMetadata": {"companyName": "Example Agency", "website": "https://example.com", "subScores": {"seo": 52}},
        "websiteDigitalPresence": {"technicalSEO": {"issues": ["Missing canonical tags", "No schema markup"]}, "contentQuality": {"gaps": ["Thin service content"]}, "uxConversion": {"issues": ["No primary CTA on homepage"]}},
        "seoVisibility": {"backlinks": {"totalBacklinks": 120, "referringDomains": 80}},
        "reputation": {"summaryTable": [{"platform": "Google", "rating": 4.8, "reviews": 32}], "totalReviews": 34},
        "appendices": {"pagesCrawled": ["https://example.com/", "https://example.com/contact", "https://example.com/portfolio"], "evidence": {"pageRegistry": {}}},
    }
    example_context = {
        "companyName": "Example Agency",
        "website": "https://example.com",
        "homepage": {"hero": "White-label growth partner", "cta": "Book a call"},
        "pagespeed": {"mobile": {"performanceScore": 49, "metrics": {"lcpMs": 14901}}, "desktop": {"performanceScore": 54, "metrics": {"lcpMs": 2669}}},
        "reviewSummary": {"totalReviews": 34, "averageRating": 4.8},
        "googlePlaces": {"profile": {"reviewCount": 32, "rating": 4.8}},
        "competitiveAnalysisSeed": {"competitors": deepcopy(DEFAULT_COMPETITORS)},
    }
    structured, _legacy = build_professional_report(example_base, example_context)
    return structured




