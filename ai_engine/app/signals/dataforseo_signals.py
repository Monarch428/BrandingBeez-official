from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional, Tuple

from app.core.config import settings
from app.integrations.dataforseo_client import DataForSEOClient, _domain_from_url

logger = logging.getLogger(__name__)

STOPWORDS = {
    "the","and","for","with","from","your","our","you","a","an","to","of","in","on","at","by","is","are","be","we",
    "agency","company","services","service","business","marketing","digital"
}

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

def _d4s_defaults(criteria: Dict[str, Any] | None) -> Tuple[int, str]:
    crit = criteria or {}
    loc = crit.get("location_code") or crit.get("locationCode") or getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840)
    lang = crit.get("language_code") or crit.get("languageCode") or getattr(settings, "DATAFORSEO_DEFAULT_LANGUAGE_CODE", "en")
    try:
        loc = int(loc)
    except Exception:
        loc = int(getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840))
    lang = str(lang or "en")
    return loc, lang

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
        out["competitors"] = [c for c in competitors if c.get("domain")]
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
            out["serp_competitors"] = [c for c in sc if c.get("domain")]
            out["raw"]["serp_competitors"] = {"status_code": resp.get("status_code"), "task": (data.get("tasks") or [])[:1], "keywords": keywords}
            if not out["serp_competitors"]:
                notes.append("SERP competitors returned no items.")

        else:
            notes.append("SERP competitors skipped: no keywords could be inferred (provide criteria.keywords to enable).")

    except Exception as e:
        notes.append(f"SERP competitors failed: {e}")

    return out
