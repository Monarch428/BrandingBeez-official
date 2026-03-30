"""Deterministic SEO intelligence engine for the business growth report.

This module upgrades the existing SEO section without changing the current
workflow. It consumes already collected evidence from the pipeline and returns
schema-safe SEO blocks for ``seoVisibility``.
"""

from __future__ import annotations

import math
import re
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple
from urllib.parse import urlparse


_DIRECTORY_DOMAINS = {
    "google.com": "Google Business Profile",
    "maps.apple.com": "Apple Maps",
    "apple.com": "Apple Maps",
    "bing.com": "Bing Places",
    "yelp.com": "Yelp",
    "yellowpages.com": "Yellow Pages",
    "trustpilot.com": "Trustpilot",
    "justdial.com": "Justdial",
    "clutch.co": "Clutch",
    "goodfirms.co": "GoodFirms",
    "sortlist.com": "Sortlist",
    "designrush.com": "DesignRush",
    "upcity.com": "UpCity",
}

_DISCOVERY_PLATFORM_DOMAINS = {
    "clutch.co",
    "designrush.com",
    "goodfirms.co",
    "sortlist.com",
    "themanifest.com",
    "upcity.com",
}

_NON_DIRECT_COMPETITOR_DOMAINS = {
    "reddit.com",
    "indeed.com",
    "glassdoor.com",
    "linkedin.com",
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "x.com",
    "twitter.com",
    "yelp.com",
    "yellowpages.com",
    "justdial.com",
    "mapquest.com",
    "wikipedia.org",
    "f6s.com",
}

_STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "best",
    "by",
    "for",
    "from",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "our",
    "the",
    "to",
    "with",
    "your",
}

_COMMERCIAL_TERMS = {
    "agency",
    "company",
    "consulting",
    "design",
    "developer",
    "development",
    "expert",
    "hire",
    "marketing",
    "outsourcing",
    "pricing",
    "service",
    "services",
    "solutions",
    "studio",
    "seo",
    "ppc",
}

_INFORMATIONAL_TERMS = {
    "best way",
    "checklist",
    "example",
    "guide",
    "how",
    "ideas",
    "learn",
    "tips",
    "what",
    "why",
}

_NAVIGATIONAL_TERMS = {
    "about",
    "blog",
    "careers",
    "contact",
    "faq",
    "login",
    "portfolio",
    "pricing",
    "reviews",
}


def _ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _int(value: Any) -> Optional[int]:
    if value in (None, "", "null", "None"):
        return None
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(round(value))
    match = re.search(r"-?\d+(?:\.\d+)?", _text(value).replace(",", ""))
    if not match:
        return None
    try:
        return int(round(float(match.group(0))))
    except Exception:
        return None


def _float(value: Any) -> Optional[float]:
    if value in (None, "", "null", "None"):
        return None
    if isinstance(value, bool):
        return float(int(value))
    if isinstance(value, (int, float)):
        return float(value)
    match = re.search(r"-?\d+(?:\.\d+)?", _text(value).replace(",", ""))
    if not match:
        return None
    try:
        return float(match.group(0))
    except Exception:
        return None


def _domain(value: Any) -> str:
    raw = _text(value).lower()
    if not raw:
        return ""
    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    host = parsed.netloc or parsed.path
    host = host.lower().strip()
    if host.startswith("www."):
        host = host[4:]
    return host.strip("/")


def _dedupe_strings(values: Iterable[str], *, limit: Optional[int] = None) -> List[str]:
    out: List[str] = []
    seen: set[str] = set()
    for value in values:
        item = _text(value)
        if not item:
            continue
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
        if limit and len(out) >= limit:
            break
    return out


def _slug_to_phrase(url: str) -> str:
    path = urlparse(url if "://" in url else f"https://{url}").path
    slug = path.strip("/").split("/")[-1] if path else ""
    slug = slug.replace("-", " ").replace("_", " ")
    slug = re.sub(r"\s+", " ", slug).strip()
    return slug


def _brand_terms(company_name: str, website_url: str) -> List[str]:
    company = _text(company_name)
    domain = _domain(website_url)
    brand: List[str] = []
    if company:
        brand.append(company)
        stripped = re.sub(r"[^a-z0-9]+", " ", company.lower()).strip()
        if stripped:
            brand.append(stripped)
    if domain:
        root = domain.split(".")[0]
        if root and root not in {"www"}:
            brand.append(root)
            brand.append(root.replace("-", " "))
    return _dedupe_strings(brand, limit=6)


def _matches_domain_group(domain: str, candidates: Sequence[str]) -> bool:
    normalized = _domain(domain)
    return any(normalized == item or normalized.endswith("." + item) for item in candidates)


def is_direct_competitor(domain: str) -> bool:
    """Return False for forums, job boards, and generic discovery platforms."""

    normalized = _domain(domain)
    if not normalized:
        return False
    if _matches_domain_group(normalized, tuple(_NON_DIRECT_COMPETITOR_DOMAINS)):
        return False
    return True


def score_competitor_relevance(
    competitor: Dict[str, Any],
    *,
    site_type: str,
    services: Sequence[str] | None,
) -> float:
    """Score competitor relevance for SEO benchmarking."""

    domain = _text(competitor.get("domain") or competitor.get("website"))
    if not is_direct_competitor(domain):
        return -100.0

    metrics = _ensure_dict(competitor.get("metrics"))
    score = float((_int(metrics.get("intersections")) or 0) * 2 + (_int(metrics.get("keywords")) or 0))
    normalized = _domain(domain)

    if _matches_domain_group(normalized, tuple(_DISCOVERY_PLATFORM_DOMAINS)):
        score -= 25.0

    service_tokens = {
        token
        for service in (services or [])
        for token in re.findall(r"[a-z0-9]+", _text(service).lower())
        if len(token) >= 4 and token not in _STOP_WORDS
    }
    if service_tokens and any(token in normalized for token in service_tokens):
        score += 4.0

    if _text(site_type).lower() == "content_site" and any(token in normalized for token in ("blog", "news", "media", "magazine")):
        score += 2.0

    return score


def filter_competitors_by_site_type(
    competitors: Sequence[Dict[str, Any]],
    *,
    site_type: str,
    services: Sequence[str] | None,
) -> List[Dict[str, Any]]:
    """Filter out irrelevant competitor candidates for SEO benchmarking."""

    ranked: List[Tuple[float, Dict[str, Any]]] = []
    discovery_rows: List[Dict[str, Any]] = []
    for competitor in competitors:
        domain = _text(competitor.get("domain") or competitor.get("website"))
        normalized = _domain(domain)
        if not normalized:
            continue
        if _matches_domain_group(normalized, tuple(_DISCOVERY_PLATFORM_DOMAINS)):
            row = dict(competitor)
            row["competitorType"] = "discovery_platform"
            discovery_rows.append(row)
            continue
        relevance = score_competitor_relevance(competitor, site_type=site_type, services=services)
        if relevance <= 0:
            continue
        ranked.append((relevance, competitor))

    ranked.sort(key=lambda item: item[0], reverse=True)
    direct_rows = [item[1] for item in ranked[:4]]
    return direct_rows or discovery_rows[:2]


def extract_keyword_candidates_from_site(
    text_blocks: Sequence[str] | None,
    titles: Sequence[str] | None,
    headings: Sequence[str] | None,
    urls: Sequence[str] | None,
) -> List[str]:
    """Extract conservative keyword candidates from observed site content."""

    candidates: List[str] = []
    for raw in list(titles or []) + list(headings or []) + list(text_blocks or []):
        text = _text(raw)
        if not text:
            continue
        text = re.sub(r"\s+", " ", text)
        parts = re.split(r"[|,:;/\-()\[\]]+", text)
        for part in parts:
            cleaned = _text(part)
            if not cleaned or len(cleaned) < 4 or len(cleaned) > 70:
                continue
            tokens = [t for t in re.findall(r"[a-z0-9]+", cleaned.lower()) if t not in _STOP_WORDS]
            if 1 <= len(tokens) <= 5:
                candidates.append(" ".join(tokens))

    for url in urls or []:
        phrase = _slug_to_phrase(_text(url))
        if phrase and 2 <= len(phrase) <= 70:
            tokens = [t for t in re.findall(r"[a-z0-9]+", phrase.lower()) if t not in _STOP_WORDS]
            if 1 <= len(tokens) <= 5:
                candidates.append(" ".join(tokens))

    return _dedupe_strings(candidates, limit=24)


def classify_keyword_type(keyword: str, company_name: str = "", location: str | None = None) -> str:
    """Classify a keyword into a business-safe intent/type bucket."""

    value = _text(keyword).lower()
    if not value:
        return "commercial"

    brand_terms = {_text(item).lower() for item in _brand_terms(company_name, "")}
    if any(term and term in value for term in brand_terms):
        return "brand"

    location_tokens = {
        token
        for token in re.findall(r"[a-z0-9]+", _text(location).lower())
        if len(token) >= 3
    }
    if "near me" in value or any(token in value for token in location_tokens):
        return "local"

    if any(term in value for term in _NAVIGATIONAL_TERMS):
        return "navigational"

    if any(term in value for term in _INFORMATIONAL_TERMS) or value.startswith(("how ", "what ", "why ", "best ")):
        return "informational"

    return "commercial"


def extract_keyword_priority(keyword: str, site_type: str, company_name: str = "", location: str | None = None) -> str:
    """Assign a safe priority tier based on site type and keyword type."""

    kind = classify_keyword_type(keyword, company_name, location)
    normalized_site = _text(site_type).lower() or "mixed"

    if normalized_site == "service_business":
        if kind in {"commercial", "local"}:
            return "high"
        if kind == "brand":
            return "medium"
        return "low"
    if normalized_site == "content_site":
        if kind == "informational":
            return "high"
        if kind == "brand":
            return "medium"
        return "low"
    if normalized_site == "ecommerce":
        if kind in {"commercial", "navigational"}:
            return "high"
        return "medium" if kind == "brand" else "low"
    if kind in {"commercial", "informational", "local"}:
        return "high"
    return "medium"


def build_target_keyword_list(
    site_type: str,
    services: Sequence[str] | None,
    positioning: Dict[str, Any] | None,
    industries: Sequence[str] | None = None,
    *,
    company_name: str = "",
    location: str | None = None,
    target_market: str | None = None,
    existing_keywords: Sequence[str] | None = None,
    text_blocks: Sequence[str] | None = None,
    titles: Sequence[str] | None = None,
    headings: Sequence[str] | None = None,
    urls: Sequence[str] | None = None,
    competitor_service_keywords: Sequence[str] | None = None,
) -> Dict[str, Any]:
    """Build target keywords grouped by priority and intent."""

    pool: List[str] = []
    location_text = _text(location)
    market_text = _text(target_market)
    position = _ensure_dict(positioning)

    for svc in services or []:
        service = _text(svc)
        if not service:
            continue
        pool.append(service)
        if location_text:
            pool.append(f"{service} {location_text}")
        if market_text and market_text.lower() != location_text.lower():
            pool.append(f"{service} {market_text}")
        for industry in industries or []:
            industry_text = _text(industry)
            if industry_text:
                pool.append(f"{service} for {industry_text}")

    for item in existing_keywords or []:
        pool.append(_text(item))
    for item in competitor_service_keywords or []:
        pool.append(_text(item))

    current_statement = _text(position.get("currentStatement"))
    if current_statement:
        pool.append(current_statement)

    pool.extend(extract_keyword_candidates_from_site(text_blocks, titles, headings, urls))
    pool.extend(_brand_terms(company_name, ""))

    normalized = _dedupe_strings(pool, limit=36)
    by_priority: Dict[str, List[str]] = {"high": [], "medium": [], "low": []}
    by_intent: Dict[str, List[str]] = {
        "brand": [],
        "commercial": [],
        "informational": [],
        "local": [],
        "navigational": [],
    }

    for keyword in normalized:
        kind = classify_keyword_type(keyword, company_name, location)
        priority = extract_keyword_priority(keyword, site_type, company_name, location)
        by_priority.setdefault(priority, []).append(keyword)
        by_intent.setdefault(kind, []).append(keyword)

    ordered = by_priority["high"] + by_priority["medium"] + by_priority["low"]
    return {
        "keywords": ordered[:18],
        "byPriority": {key: values[:8] for key, values in by_priority.items()},
        "byIntent": {key: values[:8] for key, values in by_intent.items() if values},
    }


def _search_volume_for(keyword: str, d4s_enrichment: Dict[str, Any], market_demand: Dict[str, Any]) -> Any:
    normalized = _text(keyword).lower()
    if not normalized:
        return "Unavailable"

    for source_key, field in (("search_volume", "search_volume"), ("keywords_for_site", "search_volume")):
        for item in _ensure_list(d4s_enrichment.get(source_key)):
            if isinstance(item, dict) and _text(item.get("keyword")).lower() == normalized:
                value = _int(item.get(field))
                return value if value is not None else "Unavailable"

    for item in _ensure_list(market_demand.get("keywords")):
        if isinstance(item, dict) and _text(item.get("keyword")).lower() == normalized:
            value = _int(item.get("searchVolume") or item.get("search_volume"))
            return value if value is not None else "Unavailable"

    return "Unavailable"


def fetch_serp_snapshot(
    keyword: str,
    location: str | None,
    language: str | None,
    d4s_enrichment: Dict[str, Any],
) -> Dict[str, Any]:
    """Return the cached SERP snapshot for a keyword."""

    del location, language
    normalized = _text(keyword).lower()
    for item in _ensure_list(d4s_enrichment.get("serp_snapshots")):
        if isinstance(item, dict) and _text(item.get("keyword")).lower() == normalized:
            return item
    return {}


def detect_site_rank_in_serp(domain: str, serp_results: Dict[str, Any]) -> Tuple[Any, Optional[str]]:
    """Detect the site's rank and observed ranking URL from a SERP snapshot."""

    company_domain = _domain(domain)
    found_position = _int(serp_results.get("foundPosition"))
    top_urls = [_text(item) for item in _ensure_list(serp_results.get("topUrls")) if _text(item)]

    if found_position is not None:
        ranking_url = top_urls[found_position - 1] if 0 < found_position <= len(top_urls) else None
        return found_position, ranking_url

    for index, url in enumerate(top_urls, start=1):
        if _domain(url) == company_domain:
            return index, url
    return "Not ranking", None


def detect_top_competitor_rank(
    serp_results: Dict[str, Any],
    domain: str,
    known_competitors: Sequence[str] | None = None,
) -> Dict[str, Any]:
    """Find the strongest competitor ranking observed in a SERP snapshot."""

    company_domain = _domain(domain)
    competitor_domains = {_domain(item) for item in (known_competitors or []) if _domain(item)}
    top_urls = [_text(item) for item in _ensure_list(serp_results.get("topUrls")) if _text(item)]

    preferred: Optional[Dict[str, Any]] = None
    fallback: Optional[Dict[str, Any]] = None
    for index, url in enumerate(top_urls, start=1):
        url_domain = _domain(url)
        if not url_domain or url_domain == company_domain:
            continue
        record = {"name": url_domain, "rank": index, "url": url}
        if url_domain in competitor_domains:
            preferred = record
            break
        if fallback is None:
            fallback = record

    return preferred or fallback or {"name": "Unavailable", "rank": "Unavailable", "url": None}


def _ranking_status(rank: Any) -> str:
    value = _int(rank)
    if value is None:
        return "not ranking"
    if value <= 3:
        return "strong ranking"
    if value <= 10:
        return "ranking"
    if value <= 30:
        return "weak ranking"
    return "not ranking"


def fetch_serp_rankings(
    keywords: Sequence[str],
    location: str | None,
    language: str | None,
    *,
    website_url: str,
    company_name: str,
    site_type: str,
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
    known_competitors: Sequence[str] | None = None,
) -> List[Dict[str, Any]]:
    """Build ranking rows from cached SERP evidence."""

    rows: List[Dict[str, Any]] = []
    for keyword in keywords:
        snapshot = fetch_serp_snapshot(keyword, location, language, d4s_enrichment)
        your_rank, your_url = detect_site_rank_in_serp(website_url, snapshot)
        competitor = detect_top_competitor_rank(snapshot, website_url, known_competitors)
        kind = classify_keyword_type(keyword, company_name, location)
        rows.append(
            {
                "keyword": keyword,
                "rank": your_rank if isinstance(your_rank, int) else None,
                "yourRank": your_rank,
                "yourUrl": your_url,
                "type": kind,
                "intent": kind,
                "priority": extract_keyword_priority(keyword, site_type, company_name, location),
                "monthlySearches": _search_volume_for(keyword, d4s_enrichment, market_demand),
                "topCompetitor": (
                    f"{competitor['name']} (#{competitor['rank']})"
                    if competitor.get("name") not in {"", "Unavailable"}
                    else "Unavailable"
                ),
                "topCompetitorRank": competitor.get("rank"),
                "rankingStatus": _ranking_status(your_rank),
            }
        )
    return rows


def extract_anchor_mix(backlinks_data: Dict[str, Any], company_name: str, website_url: str) -> Dict[str, int]:
    """Summarize anchor categories from backlink anchor data."""

    brand_terms = {item.lower() for item in _brand_terms(company_name, website_url)}
    buckets = {"brand": 0, "commercial": 0, "generic": 0, "url": 0, "other": 0}
    for item in _ensure_list(backlinks_data.get("anchors"))[:30]:
        anchor = _text(item.get("anchor") if isinstance(item, dict) else item).lower()
        backlinks = _int(item.get("backlinks")) if isinstance(item, dict) else None
        weight = backlinks if backlinks is not None and backlinks > 0 else 1
        if not anchor:
            continue
        if anchor.startswith("http") or "." in anchor:
            buckets["url"] += weight
        elif any(term and term in anchor for term in brand_terms):
            buckets["brand"] += weight
        elif any(term in anchor for term in _COMMERCIAL_TERMS):
            buckets["commercial"] += weight
        elif anchor in {"click here", "website", "visit site", "learn more"}:
            buckets["generic"] += weight
        else:
            buckets["other"] += weight
    return buckets


def detect_backlink_risk(backlinks_data: Dict[str, Any], anchor_mix: Dict[str, int]) -> List[str]:
    """Detect backlink concentration and quality risks conservatively."""

    summary = _ensure_dict(backlinks_data.get("summary"))
    total_backlinks = _int(summary.get("backlinks"))
    referring_domains = _int(summary.get("referring_domains"))
    spam_score = _float(summary.get("spam_score"))
    ratio = (float(total_backlinks or 0) / max(float(referring_domains or 1), 1.0)) if total_backlinks else 0.0

    risks: List[str] = []
    if referring_domains is not None and referring_domains < 20:
        risks.append("Referring-domain diversity is still thin.")
    if ratio >= 20:
        risks.append("Backlink volume is concentrated into too few domains.")
    total_anchor_weight = sum(anchor_mix.values()) or 1
    if (anchor_mix.get("commercial", 0) / total_anchor_weight) > 0.45:
        risks.append("Anchor profile leans heavily on commercial phrasing, which can look manipulative if unsupported by stronger branded links.")
    if spam_score is not None and spam_score >= 30:
        risks.append("Provider spam/toxicity indicators suggest link quality should be reviewed before scaling acquisition.")
    return risks


def summarize_backlink_quality(
    backlinks_data: Dict[str, Any],
    anchor_mix: Dict[str, int],
    risk_signals: Sequence[str],
) -> str:
    """Produce a benchmark-driven backlink quality summary."""

    summary = _ensure_dict(backlinks_data.get("summary"))
    total_backlinks = _int(summary.get("backlinks"))
    referring_domains = _int(summary.get("referring_domains"))
    domain_rank = _int(summary.get("domain_rank"))

    if not total_backlinks and not referring_domains:
        return "Backlink evidence was limited in this run, so authority is being assessed conservatively."
    if (referring_domains or 0) < 20:
        return "The backlink footprint is still thin. The main constraint is domain diversity, not raw link count."
    if risk_signals:
        return "The profile has usable authority signals, but concentration and anchor-mix risks reduce how safely that authority can compound."
    if domain_rank is not None and domain_rank >= 40:
        return "The backlink base is reasonably healthy. The next growth lever is directing that authority into better-targeted commercial and local pages."
    if anchor_mix.get("brand", 0) >= anchor_mix.get("commercial", 0):
        return "Anchor distribution is relatively natural, but more relevant editorial domains are still needed to strengthen non-brand rankings."
    return "The profile is usable, though it still needs better domain quality and relevance before competitive terms will move consistently."


def compare_backlinks_to_competitors(
    domain_data: Dict[str, Any],
    competitor_data: Sequence[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Compare backlink benchmarks against selected competitors."""

    del domain_data
    rows: List[Dict[str, Any]] = []
    for competitor in competitor_data[:4]:
        metrics = _ensure_dict(competitor.get("metrics"))
        competitor_type = _text(competitor.get("competitorType"))
        rows.append(
            {
                "name": _text(competitor.get("domain") or competitor.get("website")) or "Competitor",
                "backlinks": _int(metrics.get("backlinks")),
                "domains": _int(metrics.get("referring_domains") or metrics.get("keywords")),
                "note": (
                    "Discovery platform benchmark only; not a direct operating competitor."
                    if competitor_type == "discovery_platform"
                    else
                    "Benchmark is based on the current provider signals available for this competitor."
                    if metrics
                    else "Competitor backlink totals were unavailable in this run."
                ),
            }
        )
    return rows


def build_backlink_profile(
    backlinks_data: Dict[str, Any],
    *,
    company_name: str,
    website_url: str,
    competitor_data: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    """Build the backlink intelligence block used by the report."""

    summary = _ensure_dict(backlinks_data.get("summary"))
    total_backlinks = _int(summary.get("backlinks"))
    referring_domains = _int(summary.get("referring_domains"))
    link_quality = _int(summary.get("domain_rank"))
    backlinks = _ensure_list(backlinks_data.get("backlinks"))
    dofollow_links = sum(1 for item in backlinks if isinstance(item, dict) and bool(item.get("dofollow")))
    dofollow_ratio = int(round((dofollow_links / max(len(backlinks), 1)) * 100)) if backlinks else None

    anchor_mix = extract_anchor_mix(backlinks_data, company_name, website_url)
    risk_signals = detect_backlink_risk(backlinks_data, anchor_mix)
    quality_summary = summarize_backlink_quality(backlinks_data, anchor_mix, risk_signals)

    total_anchor_weight = sum(anchor_mix.values()) or 1
    anchor_mix_summary = (
        f"Anchor mix is roughly {int(round(anchor_mix.get('brand', 0) / total_anchor_weight * 100))}% brand, "
        f"{int(round(anchor_mix.get('commercial', 0) / total_anchor_weight * 100))}% commercial, and "
        f"{int(round((anchor_mix.get('generic', 0) + anchor_mix.get('url', 0)) / total_anchor_weight * 100))}% generic/URL anchors."
        if total_anchor_weight > 0
        else "Anchor mix data was unavailable."
    )

    return {
        "totalBacklinks": total_backlinks,
        "referringDomains": referring_domains,
        "linkQualityScore": link_quality,
        "qualitySummary": quality_summary,
        "anchorMixSummary": anchor_mix_summary,
        "dofollowRatio": dofollow_ratio,
        "riskSignals": risk_signals,
        "profileCommentary": (
            f"The site currently shows {total_backlinks or 0} backlinks across {referring_domains or 0} referring domains. "
            "That creates a baseline trust signal, but commercial SEO value depends on relevance, domain diversity, and where the links point."
        ),
        "competitorComparison": compare_backlinks_to_competitors(summary, competitor_data),
        "recommendation": "Recommendation: focus link building on relevant publications, partner sites, trusted directories, and proof-led PR so new authority supports service and comparison pages rather than only the homepage.",
        "notes": quality_summary,
    }


def build_authority_score(backlink_data: Dict[str, Any], domain_metrics: Dict[str, Any]) -> int:
    """Build a conservative authority score from provider metrics."""

    provider_score = _int(domain_metrics.get("domain_rank")) or _int(backlink_data.get("domain_rank"))
    if provider_score is not None:
        return max(0, min(100, provider_score))

    backlinks = _int(backlink_data.get("backlinks")) or 0
    referring_domains = _int(backlink_data.get("referring_domains")) or 0
    if backlinks <= 0 and referring_domains <= 0:
        return 0

    score = int(round(min(100.0, (math.log10(backlinks + 1) * 18.0) + (math.log10(referring_domains + 1) * 28.0))))
    return max(0, min(100, score))


def apply_authority_penalties(
    raw_score: int,
    *,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
    site_type: str,
) -> int:
    """Apply conservative penalties so authority is not overstated."""

    score = int(raw_score)
    referring_domains = _int(backlink_profile.get("referringDomains")) or 0
    risk_signals = _ensure_list(backlink_profile.get("riskSignals"))
    top10 = _int(keyword_rankings.get("top10")) or 0
    missing_keywords = len(_ensure_list(keyword_rankings.get("missingHighValueKeywords")))

    if referring_domains < 20:
        score -= 12
    elif referring_domains < 50:
        score -= 6

    score -= min(16, len(risk_signals) * 5)

    if _text(site_type).lower() in {"service_business", "content_site"} and top10 == 0:
        score -= 10
    elif top10 <= 2:
        score -= 5

    if missing_keywords >= 5:
        score -= 6
    elif missing_keywords >= 3:
        score -= 3

    return max(0, score)


def build_authority_confidence(
    *,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
) -> str:
    """Describe how reliable the authority interpretation is."""

    referring_domains = _int(backlink_profile.get("referringDomains")) or 0
    tracked_keywords = _int(keyword_rankings.get("totalRankingKeywords")) or 0
    risk_signals = _ensure_list(backlink_profile.get("riskSignals"))

    if referring_domains >= 50 and tracked_keywords >= 5 and not risk_signals:
        return "high"
    if referring_domains >= 20 and tracked_keywords >= 2:
        return "medium"
    return "conservative"


def calibrate_authority_score(
    *,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
    raw_score: int,
    site_type: str,
) -> Tuple[int, str]:
    """Calibrate authority into a safer business-facing score and note."""

    penalized = apply_authority_penalties(
        raw_score,
        backlink_profile=backlink_profile,
        keyword_rankings=keyword_rankings,
        site_type=site_type,
    )
    confidence = build_authority_confidence(
        backlink_profile=backlink_profile,
        keyword_rankings=keyword_rankings,
    )

    max_cap = 88 if confidence == "high" else 78 if confidence == "medium" else 68
    calibrated = min(penalized, max_cap)
    return calibrated, f"Authority confidence is {confidence}; score is calibrated to avoid overstating trust from backlink totals alone."


def _authority_benchmark_range(site_type: str) -> Tuple[int, int]:
    normalized = _text(site_type).lower()
    if normalized == "service_business":
        return 25, 35
    if normalized == "content_site":
        return 35, 50
    if normalized == "ecommerce":
        return 30, 45
    return 28, 40


def select_seo_relevant_competitors(
    competitor_list: Sequence[Dict[str, Any]],
    site_type: str,
    services: Sequence[str] | None,
) -> List[Dict[str, Any]]:
    """Select the most SEO-relevant competitors from existing evidence."""
    return filter_competitors_by_site_type(
        competitor_list,
        site_type=site_type,
        services=services,
    )


def benchmark_authority_against_competitors(
    authority_score: int,
    competitors: Sequence[Dict[str, Any]],
    site_type: str,
) -> Dict[str, Any]:
    """Build competitor benchmark rows for authority analysis."""

    low, high = _authority_benchmark_range(site_type)
    rows: List[Dict[str, Any]] = []
    for competitor in competitors:
        metrics = _ensure_dict(competitor.get("metrics"))
        competitor_type = _text(competitor.get("competitorType"))
        score = _int(metrics.get("domain_rank"))
        note = None
        if score is None:
            proxy = _int(metrics.get("keywords") or metrics.get("intersections"))
            score = proxy
            note = (
                f"Visibility proxy derived from common-keyword overlap ({proxy})."
                if proxy is not None
                else "Authority benchmark unavailable in this run."
            )
        rows.append(
            {
                "name": _text(competitor.get("domain") or competitor.get("website")) or "Competitor",
                "score": score if score is not None else "Unavailable",
                "note": (
                    "Discovery platform benchmark only; not a direct operating competitor."
                    if competitor_type == "discovery_platform"
                    else note
                ),
            }
        )

    return {
        "you": authority_score,
        "industryAvg": int(round((low + high) / 2)),
        "industryAverageRange": f"{low}-{high}",
        "competitors": rows,
    }


def build_authority_narrative(score: int, benchmark: Dict[str, Any]) -> Tuple[str, str]:
    """Return why-it-matters and benchmark narrative text."""

    low, high = _authority_benchmark_range("")
    range_text = _text(benchmark.get("industryAverageRange"))
    match = re.match(r"(\d+)-(\d+)", range_text)
    if match:
        low = int(match.group(1))
        high = int(match.group(2))

    why_it_matters = "Sites with stronger authority tend to rank new pages faster, sustain visibility on more competitive SERPs, and rely less on branded search to generate pipeline."
    benchmark_summary = f"Current authority is {score}/100 against a working benchmark of {low}-{high}/100 for this business model. "
    if score < low:
        benchmark_summary += "That usually means the site needs more trusted referring domains before non-brand SEO can scale predictably."
    elif score > high:
        benchmark_summary += "Authority looks healthy enough that content depth, keyword targeting, and page quality are likely bigger bottlenecks than trust."
    else:
        benchmark_summary += "Authority is in a workable range, but it still needs better page targeting and supporting content to convert trust into qualified organic traffic."
    return why_it_matters, benchmark_summary


def build_local_keyword_list(location: str | None, services: Sequence[str] | None) -> List[str]:
    """Build local-intent keyword combinations from services and location."""

    location_text = _text(location)
    if not location_text:
        return []
    rows = []
    for service in services or []:
        svc = _text(service)
        if not svc:
            continue
        rows.append(f"{svc} {location_text}")
        rows.append(f"{svc} near me")
    return _dedupe_strings(rows, limit=10)


def detect_google_business_profile(signals: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluate whether a GBP record was found."""

    company = _ensure_dict(signals.get("company"))
    if not company:
        return {"status": "Not detected", "found": False}
    return {
        "status": "Detected",
        "found": True,
        "rating": _float(company.get("rating")),
        "reviewCount": _int(company.get("user_ratings_total")),
    }


def detect_local_directory_presence(signals: Dict[str, Any]) -> Dict[str, List[str]]:
    """Infer directory coverage from backlink and listings signals."""

    current: List[str] = []
    missing: List[str] = []

    referring_domains = _ensure_list(signals.get("referring_domains"))
    backlinks = _ensure_list(signals.get("backlinks"))
    observed_domains = {
        _domain(item.get("domain") if isinstance(item, dict) else item)
        for item in referring_domains
    }
    observed_domains.update(
        _domain(item.get("referring_domain"))
        for item in backlinks
        if isinstance(item, dict)
    )

    for domain, label in _DIRECTORY_DOMAINS.items():
        if any(observed == domain or observed.endswith("." + domain) for observed in observed_domains if observed):
            current.append(label)

    for label in ("Google Business Profile", "Bing Places", "Apple Maps", "Relevant local/niche directories"):
        if label not in current:
            missing.append(label)

    return {"current": _dedupe_strings(current), "missing": _dedupe_strings(missing)}


def evaluate_local_visibility(
    local_serp_data: Sequence[Dict[str, Any]],
    directory_data: Dict[str, List[str]],
    gbp_data: Dict[str, Any],
    *,
    site_type: str,
    location: str | None,
    target_market: str | None,
    homepage: Dict[str, Any],
) -> Dict[str, Any]:
    """Combine local signals into a concise local SEO assessment."""

    target_market_text = _text(target_market).lower()
    local_channel_primary = bool(_text(location)) or _text(site_type).lower() == "service_business"
    if any(token in target_market_text for token in ("global", "international", "nationwide")) and _text(site_type).lower() != "service_business":
        local_channel_primary = False

    issues: List[str] = []
    if not gbp_data.get("found"):
        issues.append("Google Business Profile was not confidently detected.")

    homepage_blob = " ".join(
        [
            _text(homepage.get("title")),
            _text(homepage.get("metaDescription")),
            _text(homepage.get("h1")),
            _text(homepage.get("text")),
        ]
    ).lower()
    location_text = _text(location).lower()
    if location_text and location_text not in homepage_blob:
        issues.append("Core location terms are not strongly reinforced in homepage messaging or metadata.")

    local_rankings = [row for row in local_serp_data if _text(row.get("type")).lower() == "local" and isinstance(_int(row.get("yourRank")), int)]
    if local_channel_primary and not local_rankings:
        issues.append("Local-intent keyword visibility appears weak in the sampled SERP data.")

    if not directory_data.get("current"):
        issues.append("Citation and directory coverage looks light for local discovery.")

    score = 45
    if local_channel_primary:
        score += 10
    if gbp_data.get("found"):
        score += 20
    if local_rankings:
        score += 15
    score -= min(20, len(issues) * 5)
    score = max(20, min(90, score))

    impact = (
        "Missing local SEO coverage is likely suppressing map-pack visibility and nearby-intent enquiries."
        if local_channel_primary
        else "Local search looks like a secondary channel here. It still matters for trust, but broad non-brand visibility is the bigger growth lever."
    )

    return {
        "score": score,
        "isPrimaryChannel": local_channel_primary,
        "currentListings": directory_data.get("current", []),
        "missingListings": directory_data.get("missing", []),
        "reviewsSummary": (
            f"Google profile detected with rating {gbp_data['rating']:.1f} from {gbp_data['reviewCount']} reviews."
            if gbp_data.get("found") and gbp_data.get("rating") is not None and gbp_data.get("reviewCount") is not None
            else ("Google profile detected, but review detail was limited." if gbp_data.get("found") else "Google profile details were unavailable.")
        ),
        "issues": issues,
        "gbpStatus": gbp_data.get("status"),
        "localRankingGaps": ["Map-pack visibility is weak for service + location queries."] if local_channel_primary and not local_rankings else [],
        "citationGap": (
            "Directory/citation coverage is thin compared with what a locally discoverable service business normally needs."
            if not directory_data.get("current")
            else None
        ),
        "directoryGapSummary": (
            "Core directories are incomplete and should be cleaned up before scaling local page SEO."
            if directory_data.get("missing")
            else "Core directory coverage is present in the sampled evidence."
        ),
        "impact": impact,
        "businessImpact": impact,
        "notes": (
            "Local search is being treated as a primary acquisition channel."
            if local_channel_primary
            else "Local search is being treated as a secondary support channel."
        ),
    }


def compare_keyword_rankings_to_competitors(
    ranking_rows: Sequence[Dict[str, Any]],
    missing_rows: Sequence[Dict[str, Any]],
    competitors: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    """Build a keyword benchmark summary against competitors."""

    competitor_names = [_text(item.get("domain") or item.get("website")) for item in competitors[:4]]
    visible_keywords = sum(1 for row in ranking_rows if isinstance(_int(row.get("yourRank")), int) and (_int(row.get("yourRank")) or 999) <= 20)
    competitor_mentions = sum(1 for row in missing_rows if _text(row.get("topCompetitor")) not in {"", "Unavailable"})
    gap_summary = (
        "Competitors appear ahead on more high-intent terms than the site currently covers, especially across missing commercial/local keywords."
        if competitor_mentions > max(1, visible_keywords)
        else "The site has some live ranking coverage, but competitors still hold more of the visible commercial SERP real estate."
    )
    return {
        "selectedCompetitors": competitor_names,
        "visibleKeywordCount": visible_keywords,
        "competitorOwnedGaps": competitor_mentions,
        "gapSummary": gap_summary,
    }


def build_competitor_seo_benchmark(
    domain: str,
    competitors: Sequence[Dict[str, Any]],
    *,
    ranking_rows: Sequence[Dict[str, Any]],
    missing_rows: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    """Build the cross-competitor SEO benchmark block."""

    del domain
    selected = [_text(item.get("domain") or item.get("website")) for item in competitors[:4]]
    strongest = selected[0] if selected else "Unavailable"
    keyword_gap = compare_keyword_rankings_to_competitors(ranking_rows, missing_rows, competitors)
    return {
        "selectedCompetitors": selected,
        "strongestSeoCompetitor": strongest,
        "gapSummary": keyword_gap.get("gapSummary"),
    }


def build_company_competitor_comparison(
    competitors: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    """Split direct competitors from discovery platforms for reporting."""

    direct_rows: List[Dict[str, Any]] = []
    discovery_rows: List[Dict[str, Any]] = []
    for competitor in competitors:
        domain = _text(competitor.get("domain") or competitor.get("website"))
        if not domain:
            continue
        metrics = _ensure_dict(competitor.get("metrics"))
        normalized_domain = _domain(domain)
        competitor_type = _text(competitor.get("competitorType"))
        if not competitor_type:
            competitor_type = "directory" if _matches_domain_group(normalized_domain, tuple(_DISCOVERY_PLATFORM_DOMAINS)) else "direct"
        if not is_direct_competitor(normalized_domain) and competitor_type == "direct":
            continue
        row = {
            "domain": normalized_domain or domain,
            "overlapScore": round(
                min(1.0, max(0.0, ((_int(metrics.get("intersections")) or 0) + (_int(metrics.get("keywords")) or 0)) / 100.0)),
                2,
            ),
            "type": competitor_type,
        }
        if row["type"] in {"discovery_platform", "directory"}:
            row["type"] = "directory"
            discovery_rows.append(row)
        else:
            direct_rows.append(row)

    return {
        "directCompetitors": direct_rows[:4],
        "discoveryPlatforms": discovery_rows[:3],
    }


def build_top_ranking_keywords_block(ranking_rows: Sequence[Dict[str, Any]]) -> Dict[str, Any]:
    """Summarize top ranking keywords and common distribution counts."""

    sorted_rows = sorted(ranking_rows, key=lambda item: (_int(item.get("yourRank")) or 999))
    branded = [row for row in sorted_rows if _text(row.get("type")).lower() == "brand"][:5]
    non_branded = [row for row in sorted_rows if _text(row.get("type")).lower() != "brand"][:8]
    return {
        "totalRankingKeywords": len(sorted_rows),
        "top3": sum(1 for row in sorted_rows if (_int(row.get("yourRank")) or 999) <= 3),
        "top10": sum(1 for row in sorted_rows if (_int(row.get("yourRank")) or 999) <= 10),
        "top100": sum(1 for row in sorted_rows if (_int(row.get("yourRank")) or 999) <= 100),
        "topRankingKeywords": sorted_rows[:8],
        "brandedKeywords": branded,
        "nonBrandedKeywords": non_branded,
    }


def build_missing_high_value_keywords_block(
    target_keywords: Sequence[str],
    ranking_rows: Sequence[Dict[str, Any]],
    *,
    site_type: str,
    company_name: str,
    location: str | None,
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Build a prioritized missing-keyword opportunity table."""

    ranked_map = {
        _text(item.get("keyword")).lower(): item
        for item in ranking_rows
        if isinstance(item, dict) and _text(item.get("keyword"))
    }
    rows: List[Dict[str, Any]] = []
    for keyword in target_keywords:
        normalized = _text(keyword).lower()
        row = ranked_map.get(normalized, {})
        rank = _int(row.get("yourRank"))
        if rank is not None and rank <= 10:
            continue
        kind = classify_keyword_type(keyword, company_name, location)
        priority = extract_keyword_priority(keyword, site_type, company_name, location)
        rows.append(
            {
                "keyword": keyword,
                "monthlySearches": _search_volume_for(keyword, d4s_enrichment, market_demand),
                "yourRank": f"#{rank}" if rank is not None else "Not ranking",
                "topCompetitor": _text(row.get("topCompetitor")) or "Unavailable",
                "topCompetitorRank": row.get("topCompetitorRank") if row else "Unavailable",
                "type": kind,
                "intent": kind,
                "priority": priority,
            }
        )

    rows.sort(
        key=lambda item: (
            0 if item.get("priority") == "high" else 1,
            0 if item.get("intent") in {"commercial", "local"} else 1,
            -(_int(item.get("monthlySearches")) or 0),
        )
    )
    return rows[:8]


def build_keyword_opportunity_summary(
    missing_rows: Sequence[Dict[str, Any]],
    *,
    site_type: str,
) -> str:
    """Build the opportunity narrative for missing keyword coverage."""

    search_total = sum(_int(item.get("monthlySearches")) or 0 for item in missing_rows)
    if search_total > 0:
        lead_low = max(3, int(round(search_total * (0.0012 if _text(site_type).lower() == "content_site" else 0.0018))))
        lead_high = max(lead_low + 3, int(round(search_total * (0.003 if _text(site_type).lower() == "content_site" else 0.004))))
        return f"Targeting the highest-value missing terms could directionally unlock about {lead_low}-{lead_high} qualified leads per month within 4-6 months, assuming the right pages, internal links, and backlinks are added."
    return "The immediate SEO opportunity is to build out a clearer non-brand keyword map, then support those pages with stronger authority and internal linking before expecting steady lead flow."


def determine_local_seo_priority(local_seo: Dict[str, Any], site_type: str) -> str:
    """Return whether local SEO is primary, secondary, or low priority."""

    normalized = _text(site_type).lower()
    if bool(local_seo.get("isPrimaryChannel")):
        return "primary"
    if normalized == "content_site":
        return "low"
    if normalized == "service_business":
        return "secondary"
    if normalized == "mixed" and (_int(local_seo.get("score")) or 0) >= 45:
        return "secondary"
    return "low"


def build_seo_recommendations_by_site_type(
    *,
    site_type: str,
    authority_score: int,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
) -> List[str]:
    """Return site-type-specific SEO actions."""

    normalized = _text(site_type).lower() or "mixed"
    actions: List[str] = []

    if normalized == "content_site":
        actions.extend(
            [
                "Build topic clusters and internal links around editorial themes that already show some ranking traction.",
                "Refresh top articles for search intent alignment, clearer headings, and better monetization/CTA paths.",
            ]
        )
    elif normalized == "ecommerce":
        actions.extend(
            [
                "Strengthen category and product-page SEO with clearer taxonomy, structured data, and supporting collection content.",
                "Improve internal linking between categories, products, and buying guides so authority reaches conversion pages.",
            ]
        )
    elif normalized == "service_business":
        actions.extend(
            [
                "Build a service-page and comparison-page keyword map around high-intent commercial terms.",
                "Add more proof, case studies, and CTA clarity on pages expected to rank for commercial search.",
            ]
        )
    else:
        actions.extend(
            [
                "Split SEO execution between commercial pages and editorial/supporting content so mixed intent is handled deliberately.",
                "Map one primary keyword theme to each major page type instead of blending service and informational intent on the same page.",
            ]
        )

    if authority_score < 25:
        actions.append("Build higher-trust referring domains through partner links, editorial placements, and proof-led PR assets.")
    if (_int(backlink_profile.get("referringDomains")) or 0) < 20:
        actions.append("Improve referring-domain diversity before chasing more raw backlink volume.")
    if (_int(keyword_rankings.get("top10")) or 0) == 0:
        actions.append("Prioritize pages that can win non-brand rankings before expanding lower-priority keyword coverage.")

    return _dedupe_strings(actions, limit=6)


def build_context_aware_seo_actions(
    *,
    site_type: str,
    authority_score: int,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
    local_seo: Dict[str, Any],
) -> List[str]:
    """Build recommendations that respect site type and local-channel relevance."""

    actions = build_seo_recommendations_by_site_type(
        site_type=site_type,
        authority_score=authority_score,
        backlink_profile=backlink_profile,
        keyword_rankings=keyword_rankings,
    )

    local_priority = determine_local_seo_priority(local_seo, site_type)
    if local_priority == "primary":
        actions.append("Tighten Google Business Profile, local landing pages, and citation coverage so city-intent demand is not left on the table.")
    elif local_priority == "secondary":
        actions.append("Maintain basic local SEO hygiene, but keep the main SEO investment focused on the broader acquisition channel.")

    if _ensure_list(backlink_profile.get("riskSignals")):
        actions.append("Clean up anchor concentration and lower-quality link patterns before scaling acquisition.")

    return _dedupe_strings(actions, limit=5)


def build_seo_priority_actions(
    *,
    site_type: str,
    authority_score: int,
    backlink_profile: Dict[str, Any],
    keyword_rankings: Dict[str, Any],
    local_seo: Dict[str, Any],
) -> List[str]:
    """Build a concise action list for the SEO section."""
    actions = build_context_aware_seo_actions(
        site_type=site_type,
        authority_score=authority_score,
        backlink_profile=backlink_profile,
        keyword_rankings=keyword_rankings,
        local_seo=local_seo,
    )
    return actions or ["Expand topic depth around proven ranking terms and direct authority into the pages already showing visibility."]


def build_seo_summary_report(
    *,
    seo_section: Dict[str, Any],
    website_url: str,
    company_name: str,
    site_type: str,
    services: Sequence[str] | None,
    positioning: Dict[str, Any] | None,
    keyword_analysis: Dict[str, Any],
    d4s_enrichment: Dict[str, Any],
    backlinks_bundle: Dict[str, Any],
    competitor_evidence: Dict[str, Any],
    google_places_bundle: Dict[str, Any],
    market_demand: Dict[str, Any],
    homepage: Dict[str, Any],
    criteria: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Build the full SEO engine output for ``seoVisibility``."""

    criteria = _ensure_dict(criteria)
    location = _text(criteria.get("location") or criteria.get("city") or criteria.get("region"))
    target_market = _text(criteria.get("targetMarket") or criteria.get("primaryTargetMarket"))
    language = _text(criteria.get("language") or criteria.get("lang")) or None
    services_list = [_text(item) for item in (services or []) if _text(item)]
    industries = [
        _text(item.get("industry") if isinstance(item, dict) else item)
        for item in _ensure_list(_ensure_dict(positioning).get("industries"))
    ]
    raw_competitor_candidates = _ensure_list(competitor_evidence.get("selected"))
    competitor_candidates = select_seo_relevant_competitors(
        raw_competitor_candidates,
        site_type,
        services_list,
    )

    target_keywords = build_target_keyword_list(
        site_type,
        services_list,
        positioning,
        industries=industries,
        company_name=company_name,
        location=location,
        target_market=target_market,
        existing_keywords=_ensure_list(keyword_analysis.get("keywordCandidates")),
        text_blocks=[_text(homepage.get("text")), _text(homepage.get("metaDescription"))],
        titles=[_text(homepage.get("title"))],
        headings=[_text(homepage.get("h1"))],
        urls=[website_url],
        competitor_service_keywords=_ensure_list(d4s_enrichment.get("keywords_top_10")),
    )
    ranking_rows = fetch_serp_rankings(
        target_keywords.get("keywords", []),
        location or None,
        language,
        website_url=website_url,
        company_name=company_name,
        site_type=site_type,
        d4s_enrichment=d4s_enrichment,
        market_demand=market_demand,
        known_competitors=[_text(item.get("domain") or item.get("website")) for item in competitor_candidates],
    )
    top_rankings = build_top_ranking_keywords_block(ranking_rows)
    missing_rows = build_missing_high_value_keywords_block(
        target_keywords.get("keywords", []),
        ranking_rows,
        site_type=site_type,
        company_name=company_name,
        location=location or None,
        d4s_enrichment=d4s_enrichment,
        market_demand=market_demand,
    )
    keyword_competitor_benchmark = compare_keyword_rankings_to_competitors(ranking_rows, missing_rows, competitor_candidates)
    keyword_opportunity_summary = build_keyword_opportunity_summary(missing_rows, site_type=site_type)

    backlink_profile = build_backlink_profile(
        backlinks_bundle,
        company_name=company_name,
        website_url=website_url,
        competitor_data=competitor_candidates,
    )
    raw_authority_score = build_authority_score(
        _ensure_dict(backlinks_bundle.get("summary")),
        {"domain_rank": _ensure_dict(d4s_enrichment).get("domain_rank")},
    )
    authority_score, authority_confidence_note = calibrate_authority_score(
        backlink_profile=backlink_profile,
        keyword_rankings={
            **top_rankings,
            "missingHighValueKeywords": missing_rows,
        },
        raw_score=raw_authority_score,
        site_type=site_type,
    )
    authority_benchmark = benchmark_authority_against_competitors(authority_score, competitor_candidates, site_type)
    why_it_matters, benchmark_summary = build_authority_narrative(authority_score, authority_benchmark)

    local_keywords = build_local_keyword_list(location or None, services_list)
    local_keyword_set = {kw.lower() for kw in local_keywords}
    local_rows = [row for row in ranking_rows if _text(row.get("keyword")).lower() in local_keyword_set]
    gbp_data = detect_google_business_profile(google_places_bundle)
    directory_data = detect_local_directory_presence(backlinks_bundle)
    local_seo = evaluate_local_visibility(
        local_rows,
        directory_data,
        gbp_data,
        site_type=site_type,
        location=location or None,
        target_market=target_market or None,
        homepage=homepage,
    )
    local_priority = determine_local_seo_priority(local_seo, site_type)
    local_seo["priority"] = local_priority

    competitor_benchmark = build_competitor_seo_benchmark(
        website_url,
        competitor_candidates,
        ranking_rows=ranking_rows,
        missing_rows=missing_rows,
    )
    competitor_comparison = build_company_competitor_comparison(raw_competitor_candidates)

    keyword_rankings = {
        **top_rankings,
        "targetKeywords": target_keywords.get("keywords", []),
        "byPriority": target_keywords.get("byPriority", {}),
        "byIntent": target_keywords.get("byIntent", {}),
        "competitorBenchmark": {
            **keyword_competitor_benchmark,
            "strongestSeoCompetitor": competitor_benchmark.get("strongestSeoCompetitor"),
        },
        "missingHighValueKeywords": missing_rows,
        "gapSummary": keyword_competitor_benchmark.get("gapSummary"),
        "opportunitySummary": keyword_opportunity_summary,
        "notes": "Keyword visibility is based on the DataForSEO SERP and keyword evidence available in this run. When live ranking or search-volume evidence is missing, the engine uses conservative placeholders instead of guessing.",
    }

    priority_actions = build_seo_priority_actions(
        site_type=site_type,
        authority_score=authority_score,
        backlink_profile=backlink_profile,
        keyword_rankings=keyword_rankings,
        local_seo=local_seo,
    )

    opportunity_summary = keyword_opportunity_summary
    if local_priority == "primary" and (_int(local_seo.get("score")) or 0) < 55:
        opportunity_summary += " Local SEO cleanup should run in parallel so map-pack and city-intent demand are not left behind."

    return {
        **seo_section,
        "mentorNotes": "This SEO section now combines authority, backlink quality, keyword coverage, competitor pressure, and local demand into one benchmark-driven view of organic growth.",
        "siteType": site_type,
        "domainAuthority": {
            "score": authority_score,
            "benchmark": authority_benchmark,
            "whyItMatters": why_it_matters,
            "benchmarkSummary": benchmark_summary,
            "notes": f"{benchmark_summary} {authority_confidence_note}".strip(),
        },
        "backlinks": backlink_profile,
        "backlinkProfile": backlink_profile,
        "competitorComparison": competitor_comparison,
        "keywordRankings": keyword_rankings,
        "localSeo": local_seo,
        "localSEO": local_seo,
        "opportunitySummary": opportunity_summary,
        "priorityActions": priority_actions,
    }
