"""SEO signals builder.

The orchestrator calls ``build_seo_signals(homepage, robots_sitemap, pagespeed, website_url=...)``.

We keep the output conservative (no third-party provider = N/A) but we *do*
surface on-page hygiene + Lighthouse SEO score (if PageSpeed ran).

Optional enrichments:
- DataForSEO Backlinks API (if DATAFORSEO_BASIC_B64 or DATAFORSEO_LOGIN/PASSWORD is configured)
  - backlinks.totalBacklinks
  - backlinks.referringDomains
- DataForSEO Labs Domain Rank Overview (if available in your plan)
  - domainAuthority.score (authority-like metric)

Note:
- This file also contains SE Ranking helper code you may use elsewhere; it is NOT
  automatically invoked here to avoid changing existing behavior.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from app.core.config import settings
from app.integrations.se_ranking_client import SERankingClient


def _bool(v: Any) -> bool:
    return bool(v) and str(v).strip().lower() not in {"n/a", "na", "-", "—", "none", "null"}


def _safe_num(v: Any) -> Optional[float]:
    try:
        if v is None:
            return None
        if isinstance(v, (int, float)):
            return float(v)
        s = str(v).strip()
        if not s or s.lower() in {"n/a", "na", "-", "—", "none", "null"}:
            return None
        return float(s)
    except Exception:
        return None


def _extract_domain_from_website(homepage: Dict[str, Any], robots_sitemap: Dict[str, Any]) -> Optional[str]:
    # Best effort domain extraction without introducing new dependencies.
    # Prefer explicit "domain" fields if upstream sets them.
    for k in ("domain", "host"):
        if _bool(homepage.get(k)):
            return str(homepage.get(k)).strip()
        if _bool(robots_sitemap.get(k)):
            return str(robots_sitemap.get(k)).strip()

    # Fallback: try "url"/"finalUrl"/"website" keys (if present in either dict)
    for k in ("finalUrl", "url", "website"):
        v = homepage.get(k) or robots_sitemap.get(k)
        if _bool(v):
            s = str(v).strip()
            s = s.replace("https://", "").replace("http://", "")
            s = s.split("/")[0].strip()
            return s or None

    return None


def enrich_seo_visibility_with_se_ranking(website: str, out: dict) -> None:
    """Helper to enrich a *different* schema (seoVisibility.*).

    Keeping for compatibility with your older report schema. Not called by default.
    """
    try:
        domain = website.replace("https://", "").replace("http://", "").rstrip("/")
        client = SERankingClient()

        backlinks_resp = client.backlinks_overview(domain)
        authority_resp = client.domain_authority(domain)

        backlinks_data = backlinks_resp.get("data", {}) if isinstance(backlinks_resp, dict) else {}
        authority_data = authority_resp.get("data", {}) if isinstance(authority_resp, dict) else {}

        total_backlinks = backlinks_data.get("total", 0)
        referring_domains = backlinks_data.get("referring_domains", 0)

        domain_trust = authority_data.get("domain_trust")
        # page_trust kept for future use:
        _ = authority_data.get("page_trust")

        out.setdefault("seoVisibility", {})
        out["seoVisibility"]["backlinks"] = {
            "totalBacklinks": total_backlinks,
            "referringDomains": referring_domains,
            "linkQualityScore": domain_trust,
            "notes": "Fetched from SE Ranking API",
        }
        out["seoVisibility"]["domainAuthority"] = {
            "score": domain_trust,
            "benchmark": None,
            "notes": "Source: SE Ranking Domain Trust",
        }

    except Exception as e:
        out.setdefault("seoVisibility", {})
        out["seoVisibility"].setdefault("backlinks", {})
        out["seoVisibility"].setdefault("domainAuthority", {})
        out["seoVisibility"]["backlinks"]["notes"] = f"SE Ranking failed: {str(e)}"
        out["seoVisibility"]["domainAuthority"]["notes"] = f"SE Ranking failed: {str(e)}"


def build_seo_signals(
    homepage: Optional[Dict[str, Any]] = None,
    robots_sitemap: Optional[Dict[str, Any]] = None,
    pagespeed: Optional[Dict[str, Any]] = None,
    website_url: Optional[str] = None,
) -> Dict[str, Any]:
    homepage = homepage or {}
    robots_sitemap = robots_sitemap or {}
    pagespeed = pagespeed or {}

    # PageSpeed results may be shaped as { mobile: {...}, desktop: {...} } OR a flat dict.
    # Prefer mobile SEO score if present.
    ps_mobile = (pagespeed.get("mobile") or {}) if isinstance(pagespeed, dict) else {}
    seo_score = ps_mobile.get("seoScore") if isinstance(ps_mobile, dict) else None
    if seo_score is None and isinstance(pagespeed, dict):
        seo_score = pagespeed.get("seoScore")

    title = homepage.get("title")
    meta_desc = homepage.get("metaDescription")
    canonical = homepage.get("canonical")
    has_h1 = _bool(homepage.get("h1")) or _bool(homepage.get("h1Text"))

    has_robots = _bool(robots_sitemap.get("robotsTxt")) or _bool(robots_sitemap.get("robots"))
    has_sitemap = _bool(robots_sitemap.get("sitemapXml")) or _bool(robots_sitemap.get("sitemap"))

    out: Dict[str, Any] = {
        "domainAuthority": {
            "score": None,
            "benchmark": None,
            "notes": "Not available: requires an SEO data provider API (Ahrefs/Semrush/Moz).",
        },
        "backlinks": {
            "totalBacklinks": None,
            "referringDomains": None,
            "linkQualityScore": None,
            "notes": "Not available: requires backlink provider integration.",
        },
        "onPage": {
            "hasTitle": _bool(title),
            "hasMetaDescription": _bool(meta_desc),
            "hasCanonical": _bool(canonical),
            "hasH1": bool(has_h1),
            "hasRobotsTxt": bool(has_robots),
            "hasSitemapXml": bool(has_sitemap),
        },
        "lighthouse": {
            "seoScore": seo_score,
        },
    }

    # ----------------------------
    # Optional: DataForSEO enrich
    # ----------------------------
    basic_b64 = (settings.DATAFORSEO_BASIC_B64 or "").strip()
    login = (settings.DATAFORSEO_LOGIN or "").strip()
    password = (settings.DATAFORSEO_PASSWORD or "").strip()

    if basic_b64 or (login and password):
        try:
            from app.integrations.dataforseo_client import DataForSEOClient  # type: ignore

            target = _extract_domain_from_website(homepage, robots_sitemap)
            if not target and website_url:
                target = website_url.replace("https://", "").replace("http://", "").split("/")[0].strip()

            if target:
                client = DataForSEOClient(
                    basic_b64=basic_b64 or None,
                    login=login or None,
                    password=password or None,
                    timeout_s=getattr(settings, "DATAFORSEO_TIMEOUT_SEC", 45),
                )

                # 1) Labs: Domain Rank Overview (preferred for Domain Authority-like score)
                try:
                    if hasattr(client, "labs_domain_rank_overview_live"):
                        loc = getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840)
                        lang = getattr(settings, "DATAFORSEO_DEFAULT_LANGUAGE_CODE", "en")
                        labs = client.labs_domain_rank_overview_live(
                            target, location_code=int(loc), language_code=str(lang), limit=100
                        )

                        # Some client implementations return {"json": <api_json>, ...}
                        labs_json = labs.get("json") if isinstance(labs, dict) and "json" in labs else labs
                        tasks = (labs_json or {}).get("tasks") or []
                        res0 = (tasks[0].get("result") or [])[0] if tasks and isinstance(tasks[0], dict) else {}

                        authority = (
                            _safe_num(res0.get("domain_rank"))
                            or _safe_num(res0.get("rank"))
                            or _safe_num((res0.get("summary") or {}).get("domain_rank"))
                        )
                        if authority is not None:
                            out["domainAuthority"]["score"] = int(round(authority))
                            out["domainAuthority"]["notes"] = "Fetched from DataForSEO Labs: Domain Rank Overview."
                except Exception:
                    # ignore labs errors; backlinks may still work
                    pass

                # 2) Backlinks summary (best-effort)
                resp = client.create_backlinks_summary_task(target)

                result_obj: Dict[str, Any] = {}
                if isinstance(resp, dict):
                    tasks = resp.get("tasks") or []
                    if isinstance(tasks, list) and tasks:
                        t0 = tasks[0] or {}
                        results = t0.get("result") or []
                        if isinstance(results, list) and results:
                            r0 = results[0] or {}
                            if isinstance(r0, dict):
                                result_obj = r0

                total_backlinks = (
                    _safe_num(result_obj.get("backlinks"))
                    or _safe_num(result_obj.get("total_backlinks"))
                    or _safe_num((result_obj.get("summary") or {}).get("backlinks"))
                )
                referring_domains = (
                    _safe_num(result_obj.get("referring_domains"))
                    or _safe_num(result_obj.get("refdomains"))
                    or _safe_num((result_obj.get("summary") or {}).get("referring_domains"))
                )

                if total_backlinks is not None or referring_domains is not None:
                    out["backlinks"]["totalBacklinks"] = int(round(total_backlinks)) if total_backlinks is not None else None
                    out["backlinks"]["referringDomains"] = int(round(referring_domains)) if referring_domains is not None else None
                    out["backlinks"]["notes"] = "Fetched from DataForSEO Backlinks API."

                # If labs didn't fill authority, try deriving from backlinks response
                if out["domainAuthority"]["score"] is None:
                    authority = (
                        _safe_num(result_obj.get("domain_rank"))
                        or _safe_num(result_obj.get("rank"))
                        or _safe_num(result_obj.get("domain_rating"))
                        or _safe_num((result_obj.get("summary") or {}).get("domain_rank"))
                    )
                    if authority is not None:
                        out["domainAuthority"]["score"] = int(round(authority))
                        out["domainAuthority"]["notes"] = (
                            "Derived from DataForSEO backlinks data (metric availability depends on your plan/endpoint)."
                        )

        except Exception as e:
            out["domainAuthority"]["notes"] = f"{out['domainAuthority'].get('notes')} (DataForSEO enrichment failed: {e})"
            out["backlinks"]["notes"] = f"{out['backlinks'].get('notes')} (DataForSEO enrichment failed: {e})"

    return out


def _safe_int(value: Any) -> Optional[int]:
    num = _safe_num(value)
    if num is None:
        return None
    return int(round(num))


def _safe_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def _ensure_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _normalize_domain(value: Any) -> str:
    text = _safe_text(value).lower()
    if not text:
        return ""
    text = text.replace("https://", "").replace("http://", "").split("/", 1)[0]
    if text.startswith("www."):
        text = text[4:]
    return text.strip(".")


def _dedupe_strings(values: List[str]) -> List[str]:
    out: List[str] = []
    seen: set[str] = set()
    for value in values:
        text = _safe_text(value)
        if not text:
            continue
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(text)
    return out


def _brand_terms(company_name: str, website_url: str | None) -> List[str]:
    parts = [part for part in company_name.replace("-", " ").split() if len(part) >= 3]
    domain = _normalize_domain(website_url)
    root = domain.split(".", 1)[0] if domain else ""
    if root:
        parts.extend([root, root.replace("-", " ")])
    return _dedupe_strings(parts)


def classify_keyword_type(keyword: str, company_name: str, location: str | None = None) -> str:
    phrase = _safe_text(keyword).lower()
    if not phrase:
        return "commercial"

    brands = [term.lower() for term in _brand_terms(company_name, None)]
    if any(term and term in phrase for term in brands):
        return "brand"

    location_text = _safe_text(location).lower()
    if location_text and location_text in phrase:
        return "local"
    if any(token in phrase for token in ("near me", " in ", " city ", " local ", " coimbatore", " london", " uk", " usa", " us ")):
        return "local"
    if any(token in phrase for token in ("how", "guide", "tips", "what is", "why", "checklist", "best practices")):
        return "informational"
    return "commercial"


def build_target_keyword_list(
    site_type: str,
    services: List[str],
    positioning: Dict[str, Any] | None,
    keyword_candidates: List[str],
    company_name: str,
    location: str | None,
    target_market: str | None,
    max_items: int = 12,
) -> List[str]:
    candidates: List[str] = []
    candidates.extend(_brand_terms(company_name, None))
    candidates.extend([_safe_text(item) for item in keyword_candidates if _safe_text(item)])

    location_text = _safe_text(location)
    market_text = _safe_text(target_market)

    for service in services[:8]:
        svc = _safe_text(service)
        if not svc:
            continue
        candidates.append(svc)
        if site_type == "service_business":
            candidates.append(f"{svc} agency")
            candidates.append(f"{svc} services")
        elif site_type == "ecommerce":
            candidates.append(f"buy {svc}")
            candidates.append(f"{svc} pricing")
        else:
            candidates.append(f"{svc} guide")
            candidates.append(f"{svc} strategy")
        if location_text:
            candidates.append(f"{svc} {location_text}")
        if market_text and market_text.lower() != location_text.lower():
            candidates.append(f"{svc} {market_text}")

    if positioning and isinstance(positioning.get("currentStatement"), str):
        candidates.append(positioning.get("currentStatement"))

    cleaned = [text for text in (_safe_text(item) for item in candidates) if len(text) >= 3]
    return _dedupe_strings(cleaned)[: max(4, max_items)]


def _find_search_volume(
    keyword: str,
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
) -> Optional[int]:
    kw_norm = _safe_text(keyword).lower()
    if not kw_norm:
        return None

    for item in _ensure_list(d4s_enrichment.get("search_volume")):
        if isinstance(item, dict) and _safe_text(item.get("keyword")).lower() == kw_norm:
            return _safe_int(item.get("search_volume"))

    for item in _ensure_list(d4s_enrichment.get("keywords_for_site")):
        if isinstance(item, dict) and _safe_text(item.get("keyword")).lower() == kw_norm:
            return _safe_int(item.get("search_volume"))

    for item in _ensure_list(market_demand.get("keywords")):
        if isinstance(item, dict) and _safe_text(item.get("keyword")).lower() == kw_norm:
            return _safe_int(item.get("searchVolume") or item.get("search_volume"))

    return None


def _find_serp_snapshot(keyword: str, d4s_enrichment: Dict[str, Any]) -> Dict[str, Any]:
    kw_norm = _safe_text(keyword).lower()
    for item in _ensure_list(d4s_enrichment.get("serp_snapshots")):
        if isinstance(item, dict) and _safe_text(item.get("keyword")).lower() == kw_norm:
            return item
    return {}


def _top_competitor_label(
    keyword: str,
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
    company_domain: str,
) -> str:
    snapshot = _find_serp_snapshot(keyword, d4s_enrichment)
    urls = _ensure_list(snapshot.get("topUrls"))
    for idx, url in enumerate(urls, start=1):
        domain = _normalize_domain(url)
        if domain and domain != company_domain:
            return f"{domain} (#{idx})"

    kw_norm = _safe_text(keyword).lower()
    for item in _ensure_list(market_demand.get("keywords")):
        if not isinstance(item, dict):
            continue
        if _safe_text(item.get("keyword")).lower() != kw_norm:
            continue
        domains = _ensure_list(item.get("serpTopDomains"))
        for idx, domain in enumerate(domains, start=1):
            norm = _normalize_domain(domain)
            if norm and norm != company_domain:
                return f"{norm} (#{idx})"
    return "Unavailable"


def _heuristic_authority_range(site_type: str) -> Tuple[int, int]:
    normalized = _safe_text(site_type).lower() or "mixed"
    if normalized == "content_site":
        return 35, 50
    if normalized == "ecommerce":
        return 30, 45
    if normalized == "service_business":
        return 25, 35
    return 28, 40


def build_domain_authority_block(
    seo_section: Dict[str, Any],
    d4s_enrichment: Dict[str, Any],
    competitor_evidence: Dict[str, Any],
    site_type: str,
) -> Dict[str, Any]:
    domain_authority = seo_section.get("domainAuthority") if isinstance(seo_section.get("domainAuthority"), dict) else {}
    score = _safe_int(domain_authority.get("score"))
    if score is None:
        score = _safe_int(d4s_enrichment.get("domain_rank"))
    score = score if score is not None else 0

    low, high = _heuristic_authority_range(site_type)
    benchmark_summary = (
        f"Estimated authority is {score}/100 versus a heuristic industry benchmark of {low}-{high}/100 "
        f"for this business model."
    )
    if score < low:
        benchmark_summary += " This suggests the site still needs more trust and referring-domain depth before non-brand rankings compound consistently."
    elif score > high:
        benchmark_summary += " This is already a healthy authority base; the bottleneck is more likely keyword targeting and page depth than trust alone."
    else:
        benchmark_summary += " The site is within a workable benchmark range, but still needs better topic/page coverage to turn authority into more non-brand rankings."

    competitors: List[Dict[str, Any]] = []
    for item in _ensure_list(competitor_evidence.get("selected"))[:3]:
        if not isinstance(item, dict):
            continue
        metrics = item.get("metrics") if isinstance(item.get("metrics"), dict) else {}
        visibility_proxy = _safe_int(metrics.get("keywords") or metrics.get("intersections") or metrics.get("rank"))
        competitors.append(
            {
                "name": _safe_text(item.get("domain") or item.get("website")) or "Competitor",
                "score": visibility_proxy,
                "note": (
                    f"Visibility proxy based on common-keyword evidence ({visibility_proxy})."
                    if visibility_proxy is not None
                    else "Authority benchmark unavailable in this run."
                ),
            }
        )

    return {
        "score": score,
        "benchmark": {
            "you": score,
            "industryAvg": int(round((low + high) / 2)),
            "industryAverageRange": f"{low}-{high}",
            "competitors": competitors,
        },
        "whyItMatters": (
            "Authority influences how quickly new pages rank and how resilient the site is in competitive SERPs. "
            "Stronger authority usually means faster indexing, better support for commercial pages, and less dependence on branded demand."
        ),
        "benchmarkSummary": benchmark_summary,
        "notes": _safe_text(domain_authority.get("notes")) or benchmark_summary,
    }


def build_backlink_profile_block(
    seo_section: Dict[str, Any],
    backlinks_bundle: Dict[str, Any],
    competitor_evidence: Dict[str, Any],
) -> Dict[str, Any]:
    backlinks = seo_section.get("backlinks") if isinstance(seo_section.get("backlinks"), dict) else {}
    summary = backlinks_bundle.get("summary") if isinstance(backlinks_bundle.get("summary"), dict) else {}
    total_backlinks = _safe_int(backlinks.get("totalBacklinks"))
    referring_domains = _safe_int(backlinks.get("referringDomains"))
    link_quality = _safe_int(backlinks.get("linkQualityScore"))

    if total_backlinks is None:
        total_backlinks = _safe_int(summary.get("backlinks"))
    if referring_domains is None:
        referring_domains = _safe_int(summary.get("referring_domains"))
    if link_quality is None:
        link_quality = _safe_int(summary.get("domain_rank"))

    # Clamp link quality score to valid 0-100 range
    # DataForSEO domain_rank can exceed 100 — always normalise before rendering
    if link_quality is not None:
        link_quality = max(0, min(100, link_quality))

    ratio = float(total_backlinks or 0) / max(float(referring_domains or 1), 1.0)
    anchors = _ensure_list(backlinks_bundle.get("anchors"))
    anchor_risk = False
    if anchors:
        anchor_risk = sum(1 for item in anchors[:10] if isinstance(item, dict) and _safe_int(item.get("backlinks")) and (_safe_text(item.get("anchor")).count(" ") == 0)) >= 6

    if not total_backlinks and not referring_domains:
        quality_summary = "Backlink benchmark data was limited in this run, so authority is being judged conservatively."
    elif (referring_domains or 0) < 20:
        quality_summary = "The backlink profile is still relatively thin. A small number of referring domains limits how much trust the site can transfer into new rankings."
    elif ratio > 20 or anchor_risk:
        quality_summary = "The profile shows concentration risk: backlink volume is outpacing unique referring domains or anchor diversity, so quality matters more than raw count."
    else:
        quality_summary = "The backlink base is usable, but it still needs more editorially relevant referring domains to compete on higher-value commercial terms."

    recommendation = (
        "Prioritize editorial links from relevant agencies, software partners, industry publications, niche directories, and proof-led digital PR. "
        "Pair link acquisition with service pages and comparison content so new authority lands on pages that can rank for non-brand demand."
    )

    competitor_rows: List[Dict[str, Any]] = []
    for item in _ensure_list(competitor_evidence.get("selected"))[:3]:
        if not isinstance(item, dict):
            continue
        metrics = item.get("metrics") if isinstance(item.get("metrics"), dict) else {}
        competitor_rows.append(
            {
                "name": _safe_text(item.get("domain") or item.get("website")) or "Competitor",
                "backlinks": _safe_int(metrics.get("backlinks")),
                "domains": _safe_int(metrics.get("referring_domains") or metrics.get("keywords")),
                "note": (
                    "Backlink totals were not returned for this competitor in the current run."
                    if _safe_int(metrics.get("backlinks")) is None
                    else None
                ),
            }
        )

    return {
        "totalBacklinks": total_backlinks,
        "referringDomains": referring_domains,
        "linkQualityScore": link_quality,
        "qualitySummary": quality_summary,
        "profileCommentary": (
            f"The site currently shows {total_backlinks or 0} backlinks across {referring_domains or 0} referring domains. "
            f"That creates a baseline authority signal, but the commercial SEO payoff depends on domain diversity, relevance, and link placement quality."
        ),
        "competitorComparison": competitor_rows,
        "recommendation": recommendation,
        "notes": _safe_text(backlinks.get("notes")) or quality_summary,
    }


def build_missing_high_value_keywords_block(
    keyword_targets: List[str],
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
    company_name: str,
    company_domain: str,
    location: str | None,
) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for keyword in keyword_targets:
        snapshot = _find_serp_snapshot(keyword, d4s_enrichment)
        rank = _safe_int(snapshot.get("foundPosition"))
        if rank is not None and rank <= 10:
            continue
        monthly_searches = _find_search_volume(keyword, d4s_enrichment, market_demand)
        rows.append(
            {
                "keyword": keyword,
                "monthlySearches": monthly_searches if monthly_searches is not None else "Unavailable",
                "yourRank": f"#{rank}" if rank is not None else "Not ranking",
                "topCompetitor": _top_competitor_label(keyword, d4s_enrichment, market_demand, company_domain),
                "type": classify_keyword_type(keyword, company_name, location),
            }
        )

    rows.sort(
        key=lambda item: (
            0 if item.get("type") in {"commercial", "local"} else 1,
            -(item.get("monthlySearches") if isinstance(item.get("monthlySearches"), int) else 0),
        )
    )
    return rows[:8]


def build_keyword_rankings_block(
    *,
    company_name: str,
    website_url: str,
    site_type: str,
    services: List[str],
    positioning: Dict[str, Any] | None,
    keyword_analysis: Dict[str, Any],
    d4s_enrichment: Dict[str, Any],
    market_demand: Dict[str, Any],
    location: str | None,
    target_market: str | None,
) -> Dict[str, Any]:
    company_domain = _normalize_domain(website_url)
    keyword_targets = build_target_keyword_list(
        site_type,
        services,
        positioning,
        _ensure_list(keyword_analysis.get("keywordCandidates")),
        company_name,
        location,
        target_market,
    )

    ranking_rows: List[Dict[str, Any]] = []
    for keyword in keyword_targets:
        snapshot = _find_serp_snapshot(keyword, d4s_enrichment)
        rank = _safe_int(snapshot.get("foundPosition"))
        if rank is None:
            continue
        ranking_rows.append(
            {
                "keyword": keyword,
                "rank": rank,
                "type": classify_keyword_type(keyword, company_name, location),
                "monthlySearches": _find_search_volume(keyword, d4s_enrichment, market_demand) or "Unavailable",
                "topCompetitor": _top_competitor_label(keyword, d4s_enrichment, market_demand, company_domain),
            }
        )

    ranking_rows.sort(key=lambda item: (_safe_int(item.get("rank")) or 999))
    branded = [row for row in ranking_rows if row.get("type") == "brand"][:5]
    non_branded = [row for row in ranking_rows if row.get("type") != "brand"][:8]
    missing_rows = build_missing_high_value_keywords_block(
        keyword_targets,
        d4s_enrichment,
        market_demand,
        company_name,
        company_domain,
        location,
    )

    total_ranked = len(ranking_rows)
    top3 = sum(1 for row in ranking_rows if (_safe_int(row.get("rank")) or 999) <= 3)
    top10 = sum(1 for row in ranking_rows if (_safe_int(row.get("rank")) or 999) <= 10)
    top100 = sum(1 for row in ranking_rows if (_safe_int(row.get("rank")) or 999) <= 100)

    search_total = sum(
        item.get("monthlySearches")
        for item in missing_rows
        if isinstance(item.get("monthlySearches"), int)
    )
    if search_total > 0:
        lead_low = max(3, int(round(search_total * 0.0015)))
        lead_high = max(lead_low + 3, int(round(search_total * 0.0035)))
        opportunity_summary = (
            f"Targeting the missing commercial and local keywords in this set could directionally unlock about "
            f"{lead_low}-{lead_high} qualified leads per month within 4-6 months once the right pages and supporting links are in place."
        )
    else:
        opportunity_summary = (
            "The current keyword footprint is still shallow, so the immediate opportunity is to build a non-brand keyword map "
            "around service, comparison, and local-intent terms before expecting steady organic lead flow."
        )

    notes = (
        "Ranking data is based on the current DataForSEO keyword/SERP evidence available in this run. "
        "Where a keyword did not have a direct SERP sample, the report labels rank conservatively rather than guessing."
    )

    if not ranking_rows:
        notes += " No direct ranking positions were detected for the sampled keyword set."

    return {
        "totalRankingKeywords": total_ranked,
        "top3": top3,
        "top10": top10,
        "top100": top100,
        "topRankingKeywords": ranking_rows[:8],
        "brandedKeywords": branded,
        "nonBrandedKeywords": non_branded,
        "missingHighValueKeywords": missing_rows,
        "opportunitySummary": opportunity_summary,
        "notes": notes,
    }


def build_local_seo_block(
    *,
    site_type: str,
    location: str | None,
    target_market: str | None,
    google_places_bundle: Dict[str, Any],
    keyword_rankings_block: Dict[str, Any],
    homepage: Dict[str, Any],
) -> Dict[str, Any]:
    company_place = google_places_bundle.get("company") if isinstance(google_places_bundle.get("company"), dict) else {}
    has_gbp = bool(company_place)
    location_text = _safe_text(location)
    target_market_text = _safe_text(target_market).lower()
    homepage_text = " ".join(
        [
            _safe_text(homepage.get("title")),
            _safe_text(homepage.get("metaDescription")),
            _safe_text(homepage.get("h1")),
            _safe_text(homepage.get("text")),
        ]
    ).lower()
    local_channel_primary = site_type == "service_business" or bool(location_text)
    # Override: explicitly non-local business types should NEVER have local SEO as primary
    # regardless of whether a location is detected
    _non_local_signals = (
        "agenc" in target_market_text          # agencies / agency
        or "white-label" in target_market_text
        or "white label" in target_market_text
        or "saas" in target_market_text
        or "software" in target_market_text
        or "b2b" in target_market_text
        or "enterprise" in target_market_text
        or "worldwide" in target_market_text
        or "international" in target_market_text
        or "global" in target_market_text
        or "nationwide" in target_market_text
        or "us agencies" in target_market_text
        or "uk agencies" in target_market_text
    )
    if _non_local_signals:
        local_channel_primary = False

    issues: List[str] = []
    current_listings: List[str] = []
    missing_listings: List[str] = []

    if has_gbp:
        current_listings.append("Google Business Profile")
    else:
        missing_listings.append("Google Business Profile")
        issues.append("Google Business Profile was not confidently matched in the current run.")

    if location_text and location_text.lower() not in homepage_text:
        issues.append("Core location terms are not strongly reinforced in homepage messaging or metadata.")

    local_rankings = [
        row for row in _ensure_list(keyword_rankings_block.get("topRankingKeywords"))
        if isinstance(row, dict) and row.get("type") == "local"
    ]
    if local_channel_primary and not local_rankings:
        issues.append("Local-intent keyword visibility appears weak in the sampled SERP data.")

    if not has_gbp:
        missing_listings.extend(["Bing Places", "Apple Maps", "Relevant niche/city directories"])
    elif local_channel_primary:
        missing_listings.extend(["Bing Places", "Apple Maps"])

    current_listings = _dedupe_strings(current_listings)
    missing_listings = _dedupe_strings(missing_listings)

    score = 40
    if local_channel_primary:
        score += 10
    if has_gbp:
        score += 20
    if local_rankings:
        score += 15
    if issues:
        score -= min(20, len(issues) * 5)
    score = max(20, min(90, score))

    review_count = _safe_int(company_place.get("user_ratings_total"))
    rating = _safe_num(company_place.get("rating"))
    reviews_summary = (
        f"Google profile detected with rating {rating:.1f} from {review_count} reviews."
        if has_gbp and rating is not None and review_count is not None
        else ("Google profile detected, but review details were limited." if has_gbp else "Google profile details were not available.")
    )

    if local_channel_primary:
        impact = (
            "Local SEO should be a meaningful demand channel here. Tightening GBP, location-page signals, and directory coverage could recover missed map-pack and city-intent leads."
        )
    else:
        impact = (
            "Local SEO looks like a secondary channel for this business. It still supports trust and nearby-intent discovery, but national/category visibility is likely the bigger growth lever."
        )

    return {
        "score": score,
        "priority": "primary" if local_channel_primary else "secondary",
        "currentListings": current_listings,
        "missingListings": missing_listings,
        "reviewsSummary": reviews_summary,
        "issues": issues,
        "gbpStatus": "Detected" if has_gbp else "Not detected",
        "localRankingGaps": [
            "Map-pack visibility is weak for city/service combinations." if local_channel_primary and not local_rankings else ""
        ],
        "businessImpact": impact,
        "notes": (
            "Local search is being treated as a primary acquisition channel."
            if local_channel_primary
            else "Local search is a secondary support channel for this business model — non-brand and category-level visibility is a stronger growth lever."
        ),
    }


def build_seo_opportunity_summary(
    keyword_rankings_block: Dict[str, Any],
    local_seo_block: Dict[str, Any],
    domain_authority_block: Dict[str, Any],
) -> str:
    base = _safe_text(keyword_rankings_block.get("opportunitySummary"))
    if base:
        if (_safe_int(local_seo_block.get("score")) or 0) < 55:
            return base + " Local SEO cleanup should run in parallel so city-intent demand is not left behind."
        return base

    authority_score = _safe_int(domain_authority_block.get("score")) or 0
    if authority_score < 25:
        return "The clearest SEO opportunity is to pair new commercial pages with higher-trust referring domains so the site can move beyond branded visibility."
    return "The clearest SEO opportunity is to expand non-brand keyword coverage and support those pages with stronger proof, internal links, and selective authority building."


def build_seo_visibility_summary(
    *,
    seo_section: Dict[str, Any],
    website_url: str,
    company_name: str,
    site_type: str,
    services: List[str],
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
    criteria = criteria or {}
    location = criteria.get("location") or criteria.get("city") or criteria.get("region")
    target_market = criteria.get("targetMarket") or criteria.get("primaryTargetMarket")

    domain_block = build_domain_authority_block(
        seo_section,
        d4s_enrichment,
        competitor_evidence,
        site_type,
    )
    backlink_block = build_backlink_profile_block(
        seo_section,
        backlinks_bundle,
        competitor_evidence,
    )
    keyword_block = build_keyword_rankings_block(
        company_name=company_name,
        website_url=website_url,
        site_type=site_type,
        services=services,
        positioning=positioning,
        keyword_analysis=keyword_analysis,
        d4s_enrichment=d4s_enrichment,
        market_demand=market_demand,
        location=location,
        target_market=target_market,
    )
    local_block = build_local_seo_block(
        site_type=site_type,
        location=location,
        target_market=target_market,
        google_places_bundle=google_places_bundle,
        keyword_rankings_block=keyword_block,
        homepage=homepage,
    )
    opportunity_summary = build_seo_opportunity_summary(
        keyword_block,
        local_block,
        domain_block,
    )

    return {
        **seo_section,
        "domainAuthority": domain_block,
        "backlinks": backlink_block,
        "keywordRankings": keyword_block,
        "localSeo": local_block,
        "opportunitySummary": opportunity_summary,
        "mentorNotes": (
            "SEO performance is no longer being interpreted only as a scorecard. "
            "This section now ties authority, backlink quality, keyword coverage, and local demand into one benchmark-driven view of how organic search can produce pipeline."
        ),
    }
