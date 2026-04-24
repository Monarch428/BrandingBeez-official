from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional, Tuple

from app.core.config import settings
from app.integrations.dataforseo_client import DataForSEOClient
from app.signals.dataforseo_signals import _d4s_defaults  # reuse location/lang resolver

logger = logging.getLogger(__name__)


def _safe_float(v: Any) -> Optional[float]:
    try:
        if v is None:
            return None
        if isinstance(v, bool):
            return None
        if isinstance(v, (int, float)):
            return float(v)
        s = str(v).strip()
        if not s:
            return None
        return float(s)
    except Exception:
        return None


def _safe_int(v: Any) -> Optional[int]:
    try:
        if v is None:
            return None
        if isinstance(v, bool):
            return None
        if isinstance(v, (int, float)):
            return int(round(float(v)))
        s = str(v).strip()
        if not s:
            return None
        return int(round(float(s)))
    except Exception:
        return None


def _uniq(seq: List[str]) -> List[str]:
    out: List[str] = []
    for s in seq:
        s2 = (s or "").strip()
        if not s2:
            continue
        if s2.lower() in {x.lower() for x in out}:
            continue
        out.append(s2)
    return out


def _build_seed_keywords(
    services: List[str],
    location_text: Optional[str],
    target_market: Optional[str],
    extra_keywords: Optional[List[str]] = None,
    max_items: int = 30,
) -> List[str]:
    """Create Google-Ads-friendly seed keyword phrases."""

    loc = (location_text or "").strip()
    market = (target_market or "").strip()
    base_suffixes: List[str] = []
    if loc:
        base_suffixes.append(loc)
    # Some users pass targetMarket like "UK" / "United Kingdom" / "B2B" etc.
    if market and market.lower() not in (loc.lower() if loc else ""):
        # avoid duplicating location
        base_suffixes.append(market)

    suffix = " ".join([s for s in base_suffixes if s])
    seeds: List[str] = []

    # Primary patterns
    patterns = [
        "{svc} agency {suffix}",
        "{svc} services {suffix}",
        "{svc} company {suffix}",
        "{svc} {suffix}",
    ]

    for svc in services:
        svc_clean = (svc or "").strip()
        if not svc_clean:
            continue
        for pat in patterns:
            kw = pat.format(svc=svc_clean, suffix=suffix).strip()
            kw = " ".join(kw.split())
            if len(kw) >= 3:
                seeds.append(kw)

    # Add extras (from keywords_for_site / top10 keywords etc.)
    for ek in extra_keywords or []:
        ek2 = " ".join(str(ek).strip().split())
        if ek2 and len(ek2) >= 3:
            seeds.append(ek2)

    # Deduplicate and trim
    seeds = _uniq(seeds)
    return seeds[: max(5, min(max_items, len(seeds)))]


def _extract_monthly_searches(item: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Normalize DataForSEO monthly_searches to [{month, count}, ...]."""
    out: List[Dict[str, Any]] = []
    ms = item.get("monthly_searches") or item.get("monthlySearches")
    if isinstance(ms, list):
        for row in ms[:12]:
            if not isinstance(row, dict):
                continue
            year = row.get("year")
            month = row.get("month")
            count = row.get("search_volume") or row.get("count")
            if year and month and count is not None:
                out.append({"month": f"{int(year):04d}-{int(month):02d}", "count": _safe_int(count)})
    return [r for r in out if r.get("count") is not None]


def _compute_scores(rows: List[Dict[str, Any]]) -> None:
    """In-place scoring: demandScore (0-100) + label."""
    if not rows:
        return

    max_sv = max([r.get("searchVolume") or 0 for r in rows] + [1])
    max_cpc = max([r.get("cpc") or 0 for r in rows] + [1e-9])

    for r in rows:
        sv = float(r.get("searchVolume") or 0)
        cpc = float(r.get("cpc") or 0)
        ci = float(r.get("competitionIntensity") or 0)

        volume_score = (sv / max_sv) * 60.0 if max_sv > 0 else 0.0
        intent_score = (min(cpc / max_cpc, 1.0) * 25.0) if max_cpc > 0 else 0.0
        competition_penalty = (min(ci / 10.0, 1.0) * 15.0)
        score = volume_score + intent_score - competition_penalty

        score_i = int(round(max(0.0, min(100.0, score))))
        r["demandScore"] = score_i
        if score_i >= 70:
            r["label"] = "High"
        elif score_i >= 40:
            r["label"] = "Medium"
        else:
            r["label"] = "Low"


def build_market_demand_bundle(
    *,
    services: List[str],
    criteria: Optional[Dict[str, Any]] = None,
    d4s_enrichment: Optional[Dict[str, Any]] = None,
    max_keywords: int = 20,
    serp_depth: int = 10,
) -> Dict[str, Any]:
    """Market demand analysis using DataForSEO Google Ads search volume + light SERP sampling.

    Designed to be schema-safe: returns a dict suitable for MarketDemand model.
    """

    crit = criteria or {}
    loc_code, lang = _d4s_defaults(crit)
    loc_text = (crit.get("location") or crit.get("location_name") or crit.get("locationName") or "").strip() or None
    target_market = (crit.get("targetMarket") or crit.get("primaryTargetMarket") or "").strip() or None

    # pull a few extra keywords from d4s enrichment if available
    extras: List[str] = []
    try:
        if isinstance(d4s_enrichment, dict):
            extras.extend([str(x) for x in (d4s_enrichment.get("keywords_top_10") or []) if str(x).strip()])
            # also include top items from keywords_for_site
            for it in (d4s_enrichment.get("keywords_for_site") or [])[:15]:
                if isinstance(it, dict) and it.get("keyword"):
                    extras.append(str(it.get("keyword")))
    except Exception:
        pass

    seed_keywords = _build_seed_keywords(
        services=services,
        location_text=loc_text,
        target_market=target_market,
        extra_keywords=_uniq(extras)[:15],
        max_items=40,
    )

    bundle: Dict[str, Any] = {
        "location": loc_text,
        "locationCode": int(loc_code),
        "languageCode": str(lang),
        "services": _uniq([s for s in services if isinstance(s, str) and s.strip()])[:15],
        "keywords": [],
        "summary": {
            "averageDemandScore": None,
            "totalKeywordsAnalyzed": 0,
            "topOpportunities": [],
            "observations": [],
        },
        "dataSources": [],
        "notes": [],
    }

    if not seed_keywords:
        bundle["notes"].append("No seed keywords could be generated from services/location.")
        return bundle

    try:
        client = DataForSEOClient()
    except Exception as e:
        bundle["notes"].append(f"Market demand skipped: DataForSEO disabled ({e}).")
        return bundle

    # 1) Google Ads search volume metrics
    rows: List[Dict[str, Any]] = []
    try:
        resp = client.keywords_data_search_volume_live(seed_keywords, location_code=loc_code, language_code=lang)
        data = resp.get("json") if isinstance(resp, dict) else None
        tasks = (data or {}).get("tasks") if isinstance(data, dict) else None
        result0: Dict[str, Any] = {}
        if isinstance(tasks, list) and tasks:
            r = tasks[0].get("result") if isinstance(tasks[0], dict) else None
            if isinstance(r, list) and r:
                result0 = r[0] if isinstance(r[0], dict) else {}

        items = result0.get("items") if isinstance(result0, dict) else None
        if isinstance(items, list):
            for it in items:
                if not isinstance(it, dict):
                    continue
                kw = it.get("keyword")
                if not kw:
                    continue
                info = it.get("keyword_info") if isinstance(it.get("keyword_info"), dict) else {}
                rows.append(
                    {
                        "keyword": str(kw),
                        "searchVolume": _safe_int(info.get("search_volume") or it.get("search_volume")),
                        "cpc": _safe_float(info.get("cpc") or it.get("cpc")),
                        "competition": _safe_float(info.get("competition") or it.get("competition")),
                        "monthlySearches": _extract_monthly_searches(info if info else it),
                        "serpTopDomains": [],
                        "competitionIntensity": None,
                        "demandScore": None,
                        "label": None,
                        "notes": None,
                    }
                )
    except Exception as e:
        bundle["notes"].append(f"Search volume lookup failed: {e}")
        return bundle

    # Keep top N by (searchVolume desc, cpc desc)
    rows = [r for r in rows if r.get("keyword")]
    rows.sort(key=lambda r: (int(r.get("searchVolume") or 0), float(r.get("cpc") or 0.0)), reverse=True)
    rows = rows[: max(5, int(max_keywords))]

    # 2) Light SERP sampling for top keywords (competition intensity)
    for r in rows[: min(len(rows), 10)]:
        kw = r.get("keyword")
        if not kw:
            continue
        try:
            serp = client.serp_google_organic_live_advanced(str(kw), location_code=loc_code, language_code=lang, depth=int(serp_depth))
            sjson = serp.get("json") if isinstance(serp, dict) else None
            tasks = (sjson or {}).get("tasks") if isinstance(sjson, dict) else None
            result0 = {}
            if isinstance(tasks, list) and tasks:
                rlist = tasks[0].get("result") if isinstance(tasks[0], dict) else None
                if isinstance(rlist, list) and rlist:
                    result0 = rlist[0] if isinstance(rlist[0], dict) else {}

            items = result0.get("items") if isinstance(result0, dict) else None
            domains: List[str] = []
            if isinstance(items, list):
                for it in items[: int(serp_depth)]:
                    if not isinstance(it, dict):
                        continue
                    url = it.get("url") or it.get("link")
                    if not url:
                        continue
                    try:
                        dom = str(url).split("//")[-1].split("/")[0].lower()
                        if dom:
                            domains.append(dom)
                    except Exception:
                        continue
            udomains = _uniq(domains)
            r["serpTopDomains"] = udomains[:10]
            r["competitionIntensity"] = int(min(10, len(udomains)))
        except Exception:
            # Don't fail the whole bundle
            r["notes"] = "SERP sample unavailable for this keyword."

    # 3) Score + summary
    _compute_scores(rows)
    bundle["keywords"] = rows

    scores = [int(r.get("demandScore") or 0) for r in rows if r.get("demandScore") is not None]
    avg = int(round(sum(scores) / max(1, len(scores)))) if scores else None
    bundle["summary"]["averageDemandScore"] = avg
    bundle["summary"]["totalKeywordsAnalyzed"] = len(rows)
    bundle["summary"]["topOpportunities"] = [str(r.get("keyword")) for r in rows if (r.get("label") == "High")][:8]

    obs: List[str] = []
    if avg is not None:
        if avg >= 70:
            obs.append("Overall demand indicators are strong (high-intent keywords + meaningful volume).")
        elif avg >= 40:
            obs.append("Demand indicators are moderate; focus on the highest-intent clusters first.")
        else:
            obs.append("Demand appears low in the tested cluster; broaden keyword themes or expand geography.")
    if any((r.get("cpc") or 0) >= 5 for r in rows):
        obs.append("High CPC keywords suggest strong commercial intent (good lead potential).")
    if any((r.get("competitionIntensity") or 0) >= 8 for r in rows):
        obs.append("SERPs look competitive for some keywords; consider content clusters + local SEO to differentiate.")
    bundle["summary"]["observations"] = obs[:6]

    bundle["dataSources"] = [
        {
            "source": "DataForSEO Keywords Data (Google Ads)",
            "use": "Search volume, CPC and competition for service/location keyword clusters",
            "confidence": "Medium",
        },
        {
            "source": "DataForSEO SERP API",
            "use": "Light SERP sampling to approximate competition intensity",
            "confidence": "Medium",
        },
    ]

    return bundle


# ----------------------------
# Updated override batch
# ----------------------------

def _service_keyword_variants(service: str) -> List[str]:
    svc = (service or '').strip()
    if not svc:
        return []
    variants = [svc]
    lower = svc.lower()
    if 'web design & development' in lower:
        variants += ['web development', 'website development', 'web design']
    if 'ppc / google ads' in lower:
        variants += ['google ads', 'ppc services']
    if 'conversion rate optimisation' in lower:
        variants += ['cro services', 'conversion optimisation']
    if 'branding & identity' in lower:
        variants += ['branding services', 'brand identity']
    return _uniq(variants)


def build_market_demand_bundle(
    *,
    services: List[str],
    criteria: Optional[Dict[str, Any]] = None,
    d4s_enrichment: Optional[Dict[str, Any]] = None,
    max_keywords: int = 20,
    serp_depth: int = 10,
) -> Dict[str, Any]:
    crit = criteria or {}
    loc_code, lang = _d4s_defaults(crit)
    loc_text = (crit.get("location") or crit.get("location_name") or crit.get("locationName") or "").strip() or None
    target_market = (crit.get("targetMarket") or crit.get("primaryTargetMarket") or "").strip() or None

    expanded_services: List[str] = []
    for svc in services or []:
        expanded_services.extend(_service_keyword_variants(svc))
    expanded_services = _uniq(expanded_services)

    extras: List[str] = []
    try:
        if isinstance(d4s_enrichment, dict):
            extras.extend([str(x) for x in (d4s_enrichment.get("keywords_top_10") or []) if str(x).strip()])
            for it in (d4s_enrichment.get("keywords_for_site") or [])[:15]:
                if isinstance(it, dict) and it.get("keyword"):
                    extras.append(str(it.get("keyword")))
    except Exception:
        pass

    seed_keywords = _build_seed_keywords(
        services=expanded_services,
        location_text=loc_text,
        target_market=target_market,
        extra_keywords=_uniq(extras)[:15],
        max_items=40,
    )

    bundle: Dict[str, Any] = {
        "location": loc_text,
        "locationCode": int(loc_code),
        "languageCode": str(lang),
        "services": _uniq([s for s in expanded_services if isinstance(s, str) and s.strip()])[:15],
        "keywords": [],
        "summary": {
            "averageDemandScore": None,
            "totalKeywordsAnalyzed": 0,
            "topOpportunities": [],
            "observations": [],
        },
        "dataSources": [],
        "notes": [],
    }

    if not seed_keywords:
        bundle["notes"].append("No seed keywords could be generated from services/location.")
        return bundle

    try:
        client = DataForSEOClient()
    except Exception as e:
        bundle["notes"].append(f"Market demand skipped: DataForSEO disabled ({e}).")
        return bundle

    rows: List[Dict[str, Any]] = []
    try:
        resp = client.keywords_data_search_volume_live(seed_keywords, location_code=loc_code, language_code=lang)
        data = resp.get("json") if isinstance(resp, dict) else None
        tasks = (data or {}).get("tasks") if isinstance(data, dict) else None
        result0: Dict[str, Any] = {}
        if isinstance(tasks, list) and tasks:
            r = tasks[0].get("result") if isinstance(tasks[0], dict) else None
            if isinstance(r, list) and r:
                result0 = r[0] if isinstance(r[0], dict) else {}

        items = result0.get("items") if isinstance(result0, dict) else None
        if isinstance(items, list):
            for it in items:
                if not isinstance(it, dict):
                    continue
                kw = it.get("keyword")
                if not kw:
                    continue
                info = it.get("keyword_info") if isinstance(it.get("keyword_info"), dict) else {}
                rows.append({
                    "keyword": str(kw),
                    "searchVolume": _safe_int(info.get("search_volume") or it.get("search_volume")),
                    "cpc": _safe_float(info.get("cpc") or it.get("cpc")),
                    "competition": _safe_float(info.get("competition") or it.get("competition")),
                    "monthlySearches": _extract_monthly_searches(info if info else it),
                    "serpTopDomains": [],
                    "competitionIntensity": None,
                    "demandScore": None,
                    "label": None,
                    "notes": None,
                })
    except Exception as e:
        bundle["notes"].append(f"Search volume lookup failed: {e}")
        return bundle

    rows = [r for r in rows if r.get("keyword")]
    rows.sort(key=lambda r: (int(r.get("searchVolume") or 0), float(r.get("cpc") or 0.0)), reverse=True)
    rows = rows[: max(5, int(max_keywords))]

    for r in rows[: min(len(rows), 10)]:
        kw = r.get("keyword")
        if not kw:
            continue
        try:
            serp_resp = client.serp_google_organic_live_regular([kw], location_code=loc_code, language_code=lang, depth=int(max(5, serp_depth)))
            data = serp_resp.get("json") if isinstance(serp_resp, dict) else None
            tasks = (data or {}).get("tasks") if isinstance(data, dict) else None
            result = None
            if isinstance(tasks, list) and tasks:
                result_list = tasks[0].get("result") if isinstance(tasks[0], dict) else None
                if isinstance(result_list, list) and result_list:
                    result = result_list[0]
            items = result.get("items") if isinstance(result, dict) else None
            domains: List[str] = []
            if isinstance(items, list):
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    domain = item.get("domain") or item.get("source_domain")
                    if isinstance(domain, str) and domain.strip():
                        domains.append(domain.strip())
            domains = _uniq(domains)
            r["serpTopDomains"] = domains[:5]
            r["competitionIntensity"] = len(domains[:5])
            if domains:
                r["notes"] = f"Top SERP domains: {', '.join(domains[:3])}."
        except Exception as e:
            logger.warning("[MarketDemand] SERP sampling failed for %s: %s", kw, e)

    _compute_scores(rows)
    rows.sort(key=lambda r: (int(r.get("demandScore") or 0), int(r.get("searchVolume") or 0)), reverse=True)

    avg_score = int(round(sum(int(r.get("demandScore") or 0) for r in rows) / max(1, len(rows)))) if rows else None
    top_opps = [r.get("keyword") for r in rows[:5] if r.get("keyword")]
    observations: List[str] = []
    if target_market:
        observations.append(f"Keyword demand has been scoped to the stated target market: {target_market}.")
    if loc_text:
        observations.append(f"Location bias applied using {loc_text} / location code {loc_code}.")
    if rows and any((r.get("cpc") or 0) > 0 for r in rows[:5]):
        observations.append("Higher-CPC keywords may indicate stronger commercial intent within the opportunity set.")

    bundle["keywords"] = rows
    bundle["summary"] = {
        "averageDemandScore": avg_score,
        "totalKeywordsAnalyzed": len(rows),
        "topOpportunities": top_opps,
        "observations": observations,
    }
    bundle["dataSources"] = [
        {"label": "Google Ads search volume", "source": "DataForSEO", "notes": "keywords_data_search_volume_live"},
        {"label": "SERP sampling", "source": "DataForSEO", "notes": "serp_google_organic_live_regular"},
    ]
    return bundle
