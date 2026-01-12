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

from typing import Any, Dict, Optional

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
