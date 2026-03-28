from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

from app.core.config import settings
from app.integrations.dataforseo_client import DataForSEOClient, _domain_from_url
from app.llm.client import call_openai_json, get_effective_llm_mode

logger = logging.getLogger(__name__)

STOPWORDS = {
    "the","and","for","with","from","your","our","you","a","an","to","of","in","on","at","by","is","are","be","we",
    "agency","company","services","service","business","marketing","digital"
}

WEAK_COMPETITOR_DOMAINS = {
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "pinterest.com",
    "wikipedia.org",
    "yelp.com",
    "yellowpages.com",
    "trustpilot.com",
    "mapquest.com",
    "justdial.com",
    "clutch.co",
    "goodfirms.co",
    "sortlist.com",
    "designrush.com",
    "expertise.com",
    "upcity.com",
    "bark.com",
    "threebestrated.com",
}

DIRECTORY_KEYWORDS = (
    "directory",
    "listing",
    "rankings",
    "top-",
    "best-",
    "reviews",
    "compare",
)

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

def _extract_keywords_from_title(title: str | None, max_items: int = 3) -> List[str]:
    if not title:
        return []
    raw = [w.strip(" ,|:-—\t\n\r").lower() for w in title.split() if w.strip()]
    keep = []
    for w in raw:
        w = "".join([c for c in w if c.isalnum() or c in ("-",)])
        if not w or len(w) < 3 or w in STOPWORDS:
            continue
        if w not in keep:
            keep.append(w)
        if len(keep) >= max_items:
            break
    # Capitalize first letter for nicer display / SERP queries
    return [k.replace("-", " ") for k in keep]


def _normalize_domain(value: Any) -> str:
    text = str(value or "").strip().lower()
    if not text:
        return ""
    text = text.replace("http://", "").replace("https://", "").split("/", 1)[0]
    if text.startswith("www."):
        text = text[4:]
    return text.strip(".")


def _is_weak_competitor_domain(domain: str) -> bool:
    domain = _normalize_domain(domain)
    if not domain:
        return True
    return any(domain == weak or domain.endswith("." + weak) for weak in WEAK_COMPETITOR_DOMAINS)


def is_valid_competitor(site: Dict[str, Any], site_type: str | None = None, target_market: str | None = None) -> bool:
    """Lightweight guard to exclude weak directories and clearly off-model domains."""
    domain = _normalize_domain(site.get("domain") or site.get("website") or site.get("url"))
    if _is_weak_competitor_domain(domain):
        return False

    haystack = " ".join(
        str(site.get(key) or "")
        for key in ("domain", "website", "title", "name", "description", "summary", "source")
    ).lower()

    if any(token in haystack for token in DIRECTORY_KEYWORDS) and "case study" not in haystack:
        return False

    if site_type == "ecommerce":
        return any(token in haystack for token in ("shop", "store", "product", "catalog", "checkout", "cart"))

    if site_type == "content_site":
        return not any(token in haystack for token in ("forum", "directory", "listing"))

    if target_market:
        target_tokens = [token for token in str(target_market).lower().replace(",", " ").split() if len(token) > 2]
        if target_tokens and not any(token in haystack for token in target_tokens):
            metrics = site.get("metrics") if isinstance(site.get("metrics"), dict) else {}
            if not any(_safe_int(metrics.get(key)) for key in ("intersections", "keywords", "etv")):
                return False

    return True


def filter_competitors(
    candidates: List[Dict[str, Any]],
    *,
    site_type: str | None = None,
    target_market: str | None = None,
    limit: int | None = None,
) -> List[Dict[str, Any]]:
    filtered = [item for item in candidates if isinstance(item, dict) and is_valid_competitor(item, site_type=site_type, target_market=target_market)]
    return filtered[:limit] if isinstance(limit, int) and limit > 0 else filtered


def _competitor_relevance_score(item: Dict[str, Any], *, source: str) -> int:
    domain = _normalize_domain(item.get("domain"))
    if _is_weak_competitor_domain(domain):
        return -1

    intersections = _safe_int(item.get("intersections")) or 0
    keywords = _safe_int(item.get("keywords")) or 0
    rank = _safe_int(item.get("rank"))
    etv = _safe_int(item.get("etv")) or 0

    score = (intersections * 4) + keywords + min(20, etv)
    if source == "serp":
        if rank is not None:
            score += max(0, 12 - min(rank, 12))
        if intersections == 0 and keywords == 0 and (rank is None or rank > 10):
            return -1
    return score


def _rank_competitors(items: List[Dict[str, Any]], *, source: str, limit: int = 20) -> List[Dict[str, Any]]:
    ranked: List[tuple[int, Dict[str, Any]]] = []
    seen: set[str] = set()
    for item in items:
        if not isinstance(item, dict):
            continue
        domain = _normalize_domain(item.get("domain"))
        if not domain or domain in seen:
            continue
        score = _competitor_relevance_score({**item, "domain": domain}, source=source)
        if score < 0:
            continue
        seen.add(domain)
        ranked.append((score, {**item, "domain": domain}))

    ranked.sort(key=lambda row: row[0], reverse=True)
    return [item for _, item in ranked[:limit]]

def _d4s_defaults(criteria: Dict[str, Any] | None) -> Tuple[int, str]:
    """Get location_code + language_code for DataForSEO calls.

    - language defaults to 'en' unless overridden
    - location_code is resolved from (criteria.location_code) OR (criteria.location text) OR settings default
    """
    crit = criteria or {}

    # language default
    lang = crit.get("language_code") or crit.get("languageCode") or getattr(settings, "DATAFORSEO_DEFAULT_LANGUAGE_CODE", "en")
    lang = str(lang or "en").strip().lower() or "en"

    # location: explicit code preferred
    loc_raw = crit.get("location_code") or crit.get("locationCode")
    loc: Optional[int] = None
    try:
        if loc_raw is not None:
            loc = int(loc_raw)
    except Exception:
        loc = None

    if loc is None:
        # best-effort resolve from plain-text location
        loc_text = crit.get("location") or crit.get("location_name") or crit.get("locationName")
        try:
            from app.utils.d4s_location import resolve_location_code
            loc = resolve_location_code(str(loc_text) if loc_text else None, prefer="serp")
        except Exception:
            loc = None

    if loc is None:
        loc = int(getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840))

    return int(loc), lang

def _unwrap_d4s_json(resp: Dict[str, Any]) -> Dict[str, Any]:
    # Our client returns {status_code, json, text}
    data = resp.get("json") if isinstance(resp, dict) else None
    return data if isinstance(data, dict) else {}

def _first_task_result(data: Dict[str, Any]) -> Dict[str, Any]:
    tasks = data.get("tasks") if isinstance(data, dict) else None
    if isinstance(tasks, list) and tasks:
        t0 = tasks[0] if isinstance(tasks[0], dict) else {}
        res = t0.get("result")
        if isinstance(res, list) and res:
            return res[0] if isinstance(res[0], dict) else {}
    return {}

def build_dataforseo_enrichment(
    website_url: str,
    homepage: Dict[str, Any] | None = None,
    criteria: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """Fetch optional DataForSEO Labs + Keywords data.

    Returns a dict with best-effort parsed fields:
      - domain_rank: int|None
      - competitors: list[dict] (domain + a few metrics if present)
      - serp_competitors: list[dict]
      - keywords_for_site: list[dict]
      - serp_snapshots: list[dict] (organic SERP snapshots for a few keywords)
      - raw: raw provider payload snippets (kept small)
      - notes: list[str] of warnings/why missing
    """
    domain = _domain_from_url(website_url)
    loc, lang = _d4s_defaults(criteria)
    notes: List[str] = []

    try:
        client = DataForSEOClient()
    except Exception as e:
        return {
            "domain": domain,
            "domain_rank": None,
            "competitors": [],
            "serp_competitors": [],
            "keywords_for_site": [],
            "raw": {},
            "notes": [f"DataForSEO disabled: {e}"],
            "location_code": loc,
            "language_code": lang,
        }

    out: Dict[str, Any] = {
        "domain": domain,
        "domain_rank": None,
        "competitors": [],
        "serp_competitors": [],
        "keywords_for_site": [],
        "keywords_top_10": [],
        "keyword_seo_improvements": [],
        "serp_snapshots": [],
        "raw": {},
        "notes": notes,
        "location_code": loc,
        "language_code": lang,
    }

    # 1) Domain rank overview
    try:
        resp = client.labs_domain_rank_overview_live(domain, location_code=loc, language_code=lang, limit=100)
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        rank = _safe_int(r0.get("domain_rank") or r0.get("rank") or (r0.get("summary") or {}).get("domain_rank"))
        out["domain_rank"] = rank
        out["raw"]["domain_rank_overview"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1]}
        if rank is None:
            notes.append("Domain rank overview returned no domain_rank (plan/endpoint limitations or empty data).")

    except Exception as e:
        notes.append(f"Domain rank overview failed: {e}")

    # 2) Competitors (domain-based)
    try:
        resp = client.labs_competitors_domain_live(domain, location_code=loc, language_code=lang, limit=50)
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        competitors: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:20]:
                if not isinstance(it, dict):
                    continue
                competitors.append(
                    {
                        "domain": it.get("domain") or it.get("target") or it.get("website"),
                        "intersections": _safe_int(it.get("intersections")),
                        "keywords": _safe_int(it.get("keywords")),
                        "etv": it.get("etv"),  # keep as-is (may be float)
                    }
                )
        out["competitors"] = _rank_competitors([c for c in competitors if c.get("domain")], source="domain")
        out["raw"]["competitors_domain"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1]}
        if not out["competitors"]:
            notes.append("Competitors (domain) returned no items.")

    except Exception as e:
        notes.append(f"Competitors (domain) failed: {e}")

    # 3) Keywords for site (Google Ads data)
    try:
        resp = client.keywords_for_site_live(domain, sort_by="relevance")
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        kws: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:50]:
                if not isinstance(it, dict):
                    continue
                kws.append(
                    {
                        "keyword": it.get("keyword"),
                        "search_volume": _safe_int(it.get("search_volume") or (it.get("keyword_info") or {}).get("search_volume")),
                        "competition": it.get("competition") or (it.get("keyword_info") or {}).get("competition"),
                        "cpc": it.get("cpc") or (it.get("keyword_info") or {}).get("cpc"),
                    }
                )
        out["keywords_for_site"] = [k for k in kws if k.get("keyword")]
        out["raw"]["keywords_for_site"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1]}
        if not out["keywords_for_site"]:
            notes.append("Keywords-for-site returned no items.")

    except Exception as e:
        notes.append(f"Keywords-for-site failed: {e}")

    # 3a) Keyword improvements (LLM, mode2) with fallback (mode1 does nothing)
    try:
        if int(get_effective_llm_mode() or 2) == 2 and out.get("keywords_for_site"):
            seed = [str(k.get("keyword")) for k in (out.get("keywords_for_site") or []) if isinstance(k, dict) and k.get("keyword")][:40]
            if seed:
                company_hint = None
                try:
                    company_hint = (homepage or {}).get("companyName") or (homepage or {}).get("title")
                except Exception:
                    company_hint = None

                system = "You are an SEO strategist. Output valid JSON only."
                user = (
                    "Given the keyword list for a company website, do two things:\n"
                    "1) Pick the best 10 primary keywords (high intent, relevant).\n"
                    "2) Provide 8 actionable SEO improvements specifically for targeting these keywords.\n\n"
                    "Return JSON with keys: top_10_keywords (array of strings), seo_improvements (array of strings).\n\n"
                    f"Company/Context: {company_hint or domain}\n"
                    f"Keywords: {seed}\n"
                )
                data = call_openai_json(system, user, model=getattr(settings, "OPENAI_MODEL_MINI", None) or settings.OPENAI_MODEL, max_tokens=1500, temperature=0.2)
                if isinstance(data, dict):
                    t10 = data.get("top_10_keywords") if isinstance(data.get("top_10_keywords"), list) else []
                    imp = data.get("seo_improvements") if isinstance(data.get("seo_improvements"), list) else []
                    out["keywords_top_10"] = [str(x).strip() for x in t10 if str(x).strip()][:10]
                    out["keyword_seo_improvements"] = [str(x).strip() for x in imp if str(x).strip()][:12]
    except Exception as e:
        notes.append(f"Keyword LLM enhancement skipped: {e}")

    

    # 3b) Search volume for selected keywords (Google Ads Search Volume)
    # This fills the "Keyword Opportunities" appendix with consistent metrics.
    try:
        # pick keywords: prefer explicit criteria.keywords, else keywords_for_site
        sv_keywords: List[str] = []
        if criteria and isinstance(criteria.get("keywords"), list):
            sv_keywords = [str(k) for k in criteria.get("keywords") if str(k).strip()]
        if not sv_keywords:
            for it in (out.get("keywords_for_site") or [])[:50]:
                if isinstance(it, dict) and it.get("keyword"):
                    sv_keywords.append(str(it.get("keyword")))
        sv_keywords = [k for k in sv_keywords if isinstance(k, str) and k.strip()][:50]

        if sv_keywords:
            # resolve ADS location_code from plain text location, if needed
            ads_loc = None
            try:
                from app.utils.d4s_location import resolve_location_code
                loc_text = (criteria or {}).get("location") if isinstance(criteria, dict) else None
                ads_loc = resolve_location_code(str(loc_text) if loc_text else None, client=client, prefer="ads")
            except Exception:
                ads_loc = None
            if ads_loc is None:
                ads_loc = loc  # fallback to SERP location_code

            resp = client.keywords_data_search_volume_live(
                sv_keywords,
                location_code=ads_loc,
                language_code=lang,
                include_serp_info=False,
            )
            data = _unwrap_d4s_json(resp)
            r0 = _first_task_result(data)
            items = r0.get("items") if isinstance(r0, dict) else None

            sv_out: List[Dict[str, Any]] = []
            if isinstance(items, list):
                for it in items[:100]:
                    if not isinstance(it, dict):
                        continue
                    kw = it.get("keyword")
                    info = it.get("keyword_info") if isinstance(it.get("keyword_info"), dict) else {}
                    sv_out.append(
                        {
                            "keyword": kw,
                            "search_volume": _safe_int(it.get("search_volume") or info.get("search_volume")),
                            "cpc": it.get("cpc") or info.get("cpc"),
                            "competition": it.get("competition") or info.get("competition"),
                            "competition_index": _safe_int(it.get("competition_index") or info.get("competition_index")),
                        }
                    )
            # Keep compact
            out["search_volume"] = [k for k in sv_out if k.get("keyword")]
            out["raw"]["search_volume"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1], "location_code": ads_loc}

            if not out["search_volume"]:
                notes.append("Search volume returned no items (keyword list may be empty or unsupported).")
        else:
            notes.append("Search volume skipped: no keywords available (provide criteria.keywords or enable keywords_for_site).")

    except Exception as e:
        notes.append(f"Search volume failed: {e}")
# 4) SERP competitors (keyword-based) – best effort keywords
    try:
        keywords: List[str] = []
        if criteria:
            # allow frontend to pass explicit keywords later
            if isinstance(criteria.get("keywords"), list):
                keywords = [str(k) for k in criteria.get("keywords") if str(k).strip()]
        if not keywords:
            hp_title = (homepage or {}).get("title") if isinstance(homepage, dict) else None
            keywords = _extract_keywords_from_title(hp_title, max_items=2)

        if keywords:
            resp = client.labs_serp_competitors_live(keywords, location_code=loc, language_code=lang, limit=50)
            data = _unwrap_d4s_json(resp)
            r0 = _first_task_result(data)
            items = r0.get("items") if isinstance(r0, dict) else None
            sc: List[Dict[str, Any]] = []
            if isinstance(items, list):
                for it in items[:20]:
                    if not isinstance(it, dict):
                        continue
                    sc.append(
                        {
                            "domain": it.get("domain") or it.get("target"),
                            "rank": _safe_int(it.get("rank")),
                            "intersections": _safe_int(it.get("intersections")),
                            "keywords": _safe_int(it.get("keywords")),
                        }
                    )
            out["serp_competitors"] = _rank_competitors([c for c in sc if c.get("domain")], source="serp")
            out["raw"]["serp_competitors"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1], "keywords": keywords}
            if not out["serp_competitors"]:
                notes.append("SERP competitors returned no items.")

        else:
            notes.append("SERP competitors skipped: no keywords could be inferred (provide criteria.keywords to enable).")

    except Exception as e:
        notes.append(f"SERP competitors failed: {e}")

    # 5) SERP snapshots (organic) for a small keyword set
    # This is NOT the same as "SERP competitors" (labs). This is actual SERP result data.
    try:
        # Pick best keywords: explicit > keywords_for_site > inferred
        serp_keywords: List[str] = []
        if criteria and isinstance(criteria.get("keywords"), list):
            serp_keywords = [str(k) for k in criteria.get("keywords") if str(k).strip()]

        if not serp_keywords:
            # Prefer top keywords-for-site
            kfs = out.get("keywords_for_site") if isinstance(out.get("keywords_for_site"), list) else []
            for it in kfs[:5]:
                if isinstance(it, dict) and it.get("keyword"):
                    serp_keywords.append(str(it.get("keyword")))

        if not serp_keywords:
            hp_title = (homepage or {}).get("title") if isinstance(homepage, dict) else None
            serp_keywords = _extract_keywords_from_title(hp_title, max_items=3)

        serp_keywords = [k for k in serp_keywords if isinstance(k, str) and k.strip()][:3]

        if serp_keywords:
            snapshots: List[Dict[str, Any]] = []
            for kw in serp_keywords:
                try:
                    resp = client.serp_google_organic_live_advanced(kw, location_code=loc, language_code=lang, depth=20)
                    data = _unwrap_d4s_json(resp)
                    r0 = _first_task_result(data)
                    items = r0.get("items") if isinstance(r0, dict) else None

                    # Find the first occurrence of the analyzed domain in the SERP.
                    pos: Optional[int] = None
                    top_urls: List[str] = []
                    if isinstance(items, list):
                        for it in items[:20]:
                            if not isinstance(it, dict):
                                continue
                            url = (it.get("url") or it.get("domain") or "")
                            if isinstance(url, str) and url:
                                top_urls.append(url)
                            if pos is None:
                                d = (it.get("domain") or "")
                                if isinstance(d, str) and d.strip().lower() == domain:
                                    pos = _safe_int(it.get("rank_absolute") or it.get("rank_group") or it.get("position"))

                    snapshots.append(
                        {
                            "keyword": kw,
                            "foundPosition": pos,
                            "checkedDepth": 20,
                            "topUrls": top_urls[:10],
                        }
                    )
                except Exception as e:
                    snapshots.append({"keyword": kw, "error": str(e)})

            out["serp_snapshots"] = snapshots
            out["raw"]["serp_snapshots"] = {"keywords": serp_keywords}
        else:
            notes.append("SERP snapshots skipped: no keywords available.")

    except Exception as e:
        notes.append(f"SERP snapshots failed: {e}")

    return out


def build_backlinks_bundle(
    website_url: str,
    criteria: Dict[str, Any] | None = None,
    include_history: bool = True,
    limit: int = 100,
) -> Dict[str, Any]:
    """Collect richer backlink data for the PDF appendix.

    We keep this separate from build_dataforseo_enrichment() to:
    - cache independently (backlinks can be heavy)
    - keep core enrichment lightweight
    """

    domain = _domain_from_url(website_url)
    out: Dict[str, Any] = {
        "domain": domain,
        "summary": {},
        "referring_domains": [],
        "backlinks": [],
        "anchors": [],
        "top_pages": [],
        "history": [],
        "notes": [],
        "raw": {},
    }

    try:
        client = DataForSEOClient()
    except Exception as e:
        out["notes"].append(f"DataForSEO disabled: {e}")
        return out

    # Shared options
    internal_list_limit = int((criteria or {}).get("internal_list_limit") or 10)
    backlinks_status_type = str((criteria or {}).get("backlinks_status_type") or "live")
    include_subdomains = bool((criteria or {}).get("include_subdomains") if (criteria or {}).get("include_subdomains") is not None else True)
    exclude_internal_backlinks = bool((criteria or {}).get("exclude_internal_backlinks") if (criteria or {}).get("exclude_internal_backlinks") is not None else True)
    include_indirect_links = bool((criteria or {}).get("include_indirect_links") if (criteria or {}).get("include_indirect_links") is not None else True)
    rank_scale = str((criteria or {}).get("rank_scale") or "one_hundred")

    def _first_task(data: Dict[str, Any]) -> Dict[str, Any]:
        tasks = data.get("tasks") if isinstance(data, dict) else None
        if isinstance(tasks, list) and tasks:
            return tasks[0] if isinstance(tasks[0], dict) else {}
        return {}

    # 1) Summary
    try:
        resp = client.create_backlinks_summary_task(domain, include_subdomains=include_subdomains, limit=min(int(limit), 1000))
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        if isinstance(r0, dict):
            out["summary"] = {
                "backlinks": _safe_int(r0.get("backlinks") or r0.get("total_backlinks")),
                "referring_domains": _safe_int(r0.get("referring_domains") or r0.get("refdomains")),
                "broken_backlinks": _safe_int(r0.get("broken_backlinks")),
                "domain_rank": _safe_int(r0.get("domain_rank") or r0.get("rank")),
                "spam_score": r0.get("spam_score"),
            }
        out["raw"]["summary"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
    except Exception as e:
        out["notes"].append(f"Backlinks summary failed: {e}")

    # 2) Referring domains
    try:
        resp = client.backlinks_referring_domains_live(
            domain,
            limit=min(int(limit), 200),
            internal_list_limit=internal_list_limit,
            backlinks_status_type=backlinks_status_type,
            include_subdomains=include_subdomains,
            exclude_internal_backlinks=exclude_internal_backlinks,
            include_indirect_links=include_indirect_links,
            rank_scale=rank_scale,
        )
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        rd: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:50]:
                if not isinstance(it, dict):
                    continue
                rd.append(
                    {
                        "domain": it.get("domain") or it.get("referring_domain"),
                        "backlinks": _safe_int(it.get("backlinks")),
                        "dofollow": _safe_int(it.get("dofollow_backlinks")),
                        "rank": _safe_int(it.get("rank") or it.get("domain_rank")),
                        "spam_score": it.get("spam_score"),
                    }
                )
        out["referring_domains"] = [x for x in rd if x.get("domain")]
        out["raw"]["referring_domains"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
    except Exception as e:
        out["notes"].append(f"Referring domains failed: {e}")

    # 3) Backlinks sample (one per domain is best for reporting)
    try:
        mode = str((criteria or {}).get("mode") or "one_per_domain")
        resp = client.backlinks_backlinks_live(
            domain,
            limit=min(int(limit), 200),
            internal_list_limit=internal_list_limit,
            backlinks_status_type=backlinks_status_type,
            include_subdomains=include_subdomains,
            exclude_internal_backlinks=exclude_internal_backlinks,
            include_indirect_links=include_indirect_links,
            mode=mode,
            rank_scale=rank_scale,
        )
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        bl: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:50]:
                if not isinstance(it, dict):
                    continue
                bl.append(
                    {
                        "referring_page": it.get("referring_page") or it.get("referring_page_url") or it.get("url_from"),
                        "referring_domain": it.get("referring_domain") or it.get("domain_from"),
                        "target_url": it.get("target") or it.get("target_url") or it.get("url_to"),
                        "anchor": it.get("anchor"),
                        "dofollow": it.get("dofollow"),
                        "rank": _safe_int(it.get("rank") or it.get("domain_rank")),
                        "spam_score": it.get("spam_score"),
                    }
                )
        out["backlinks"] = [x for x in bl if x.get("referring_page")]
        out["raw"]["backlinks"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
    except Exception as e:
        out["notes"].append(f"Backlinks list failed: {e}")

    # 4) Anchors
    try:
        resp = client.backlinks_anchors_live(
            domain,
            limit=min(int(limit), 200),
            internal_list_limit=internal_list_limit,
            backlinks_status_type=backlinks_status_type,
            include_subdomains=include_subdomains,
            exclude_internal_backlinks=exclude_internal_backlinks,
            include_indirect_links=include_indirect_links,
            rank_scale=rank_scale,
        )
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        an: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:30]:
                if not isinstance(it, dict):
                    continue
                an.append({"anchor": it.get("anchor"), "backlinks": _safe_int(it.get("backlinks")), "referring_domains": _safe_int(it.get("referring_domains"))})
        out["anchors"] = [x for x in an if x.get("anchor")]
        out["raw"]["anchors"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
    except Exception as e:
        out["notes"].append(f"Anchors failed: {e}")

    # 5) Top linked pages
    try:
        resp = client.backlinks_domain_pages_live(
            domain,
            limit=min(int(limit), 200),
            internal_list_limit=internal_list_limit,
            backlinks_status_type=backlinks_status_type,
            include_subdomains=include_subdomains,
            exclude_internal_backlinks=exclude_internal_backlinks,
            include_indirect_links=include_indirect_links,
            rank_scale=rank_scale,
        )
        data = _unwrap_d4s_json(resp)
        r0 = _first_task_result(data)
        items = r0.get("items") if isinstance(r0, dict) else None
        pg: List[Dict[str, Any]] = []
        if isinstance(items, list):
            for it in items[:30]:
                if not isinstance(it, dict):
                    continue
                pg.append(
                    {
                        "page": it.get("page") or it.get("url") or it.get("target"),
                        "backlinks": _safe_int(it.get("backlinks")),
                        "referring_domains": _safe_int(it.get("referring_domains")),
                    }
                )
        out["top_pages"] = [x for x in pg if x.get("page")]
        out["raw"]["top_pages"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
    except Exception as e:
        out["notes"].append(f"Top pages failed: {e}")

    # 6) History (optional)
    if include_history:
        try:
            resp = client.backlinks_history_live(domain, rank_scale=rank_scale)
            data = _unwrap_d4s_json(resp)
            r0 = _first_task_result(data)
            items = r0.get("items") if isinstance(r0, dict) else None
            hs: List[Dict[str, Any]] = []
            if isinstance(items, list):
                for it in items[-12:]:  # keep last ~12 periods if present
                    if not isinstance(it, dict):
                        continue
                    hs.append(
                        {
                            "date": it.get("date") or it.get("time"),
                            "backlinks": _safe_int(it.get("backlinks")),
                            "referring_domains": _safe_int(it.get("referring_domains")),
                            "new_backlinks": _safe_int(it.get("new_backlinks")),
                            "lost_backlinks": _safe_int(it.get("lost_backlinks")),
                        }
                    )
            out["history"] = hs
            out["raw"]["history"] = {"status_code": resp.get("status_code"), "task": _first_task(data)}
        except Exception as e:
            out["notes"].append(f"History failed: {e}")

    return out
