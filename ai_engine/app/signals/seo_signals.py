"""SEO signals builder.

The orchestrator calls ``build_seo_signals(homepage, robots_sitemap, pagespeed)``.
Older versions of this file defined ``build_seo_signals()`` with no parameters,
which causes a runtime TypeError (the crash you're seeing).

We keep the output conservative (no third-party provider = N/A) but we *do*
surface on-page hygiene + Lighthouse SEO score (if PageSpeed ran).

NEW:
- Optional DataForSEO Backlinks enrichment (if DATAFORSEO_BASIC_B64 is configured).
  This will fill:
  - domainAuthority.score (best-effort mapping based on available response fields)
  - backlinks.totalBacklinks
  - backlinks.referringDomains
"""

from typing import Any, Dict, Optional
from app.core.config import settings
from app.integrations.se_ranking_client import SERankingClient
import os


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
            # crude parse: strip scheme and path
            s = s.replace("https://", "").replace("http://", "")
            s = s.split("/")[0]
            return s or None

    return None


def enrich_seo_visibility_with_se_ranking(website: str, out: dict):
    try:
        domain = website.replace("https://", "").replace("http://", "").rstrip("/")

        client = SERankingClient()

        backlinks_resp = client.backlinks_overview(domain)
        authority_resp = client.domain_authority(domain)

        backlinks_data = backlinks_resp.get("data", {})
        authority_data = authority_resp.get("data", {})

        total_backlinks = backlinks_data.get("total", 0)
        referring_domains = backlinks_data.get("referring_domains", 0)

        domain_trust = authority_data.get("domain_trust")
        page_trust = authority_data.get("page_trust")

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

    # Base output (same as your current behavior)
    out: Dict[str, Any] = {
        # External authority/backlinks need providers (Ahrefs/Semrush/Moz/etc.)
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
        # Useful without any paid provider
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
    # We only attempt this if credentials exist. If anything fails, we keep the conservative output.
    basic_b64 = (settings.DATAFORSEO_BASIC_B64 or "").strip()
    if basic_b64:
        try:
            # Import lazily so your app still runs if integration file isn't present yet.
            from app.integrations.dataforseo_client import DataForSEOClient  # type: ignore

            target = _extract_domain_from_website(homepage, robots_sitemap)
            if target:
                client = DataForSEOClient(basic_b64=basic_b64)

                # ----------------------------
                # Labs: Domain Rank Overview (preferred for Domain Authority-like score)
                # ----------------------------
                try:
                    target_domain = (website_url or homepage.get("url") or "").strip()
                    if not target_domain:
                        # fallback: derive from robots_sitemap.finalUrl if present
                        target_domain = str((robots_sitemap or {}).get("finalUrl") or "")
                    target_domain = target_domain.replace("https://", "").replace("http://", "").split("/")[0].strip()

                    if target_domain and hasattr(client, "labs_domain_rank_overview_live"):
                        loc = getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840)
                        lang = getattr(settings, "DATAFORSEO_DEFAULT_LANGUAGE_CODE", "en")
                        labs = client.labs_domain_rank_overview_live(
                            target_domain, location_code=int(loc), language_code=str(lang), limit=100
                        )

                        # Some client implementations return {"json": <api_json>, ...}
                        labs_json = labs.get("json") if isinstance(labs, dict) and "json" in labs else labs

                        # Expected: tasks[0].result[0].domain_rank
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
                    # Ignore labs errors; backlinks may still work
                    pass


                # Prefer a "live" method when available. If your client uses task_post/task_get,
                # you can swap this call to the task-based version.
                resp = client.create_backlinks_summary_task(target)

                # DataForSEO responses vary; we parse defensively.
                # Typical structure:
                # { "status_code":..., "tasks":[{ "result":[{ ...fields... }]}] }
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

                # Common fields (best-effort):
                # backlinks / referring domains:
                total_backlinks = (
                    _safe_num(result_obj.get("backlinks"))  # some methods
                    or _safe_num(result_obj.get("total_backlinks"))
                    or _safe_num((result_obj.get("summary") or {}).get("backlinks"))
                )
                referring_domains = (
                    _safe_num(result_obj.get("referring_domains"))
                    or _safe_num(result_obj.get("refdomains"))
                    or _safe_num((result_obj.get("summary") or {}).get("referring_domains"))
                )

                # Authority-like metric:
                # DataForSEO may expose "rank"/"domain_rank"/"domain_rating"/etc depending on endpoint.
                authority = (
                    _safe_num(result_obj.get("domain_rank"))
                    or _safe_num(result_obj.get("rank"))
                    or _safe_num(result_obj.get("domain_rating"))
                    or _safe_num((result_obj.get("summary") or {}).get("domain_rank"))
                )

                # Update output only if we got actual numbers
                if authority is not None:
                    out["domainAuthority"]["score"] = int(round(authority))
                    out["domainAuthority"]["notes"] = "Derived from DataForSEO backlinks data (metric availability depends on your plan/endpoint)."

                if total_backlinks is not None or referring_domains is not None:
                    out["backlinks"]["totalBacklinks"] = int(round(total_backlinks)) if total_backlinks is not None else None
                    out["backlinks"]["referringDomains"] = int(round(referring_domains)) if referring_domains is not None else None
                    out["backlinks"]["notes"] = "Fetched from DataForSEO Backlinks API."

        except Exception as e:
            # Keep output conservative; just explain why provider enrichment isn't present.
            out["domainAuthority"]["notes"] = f"{out['domainAuthority'].get('notes')} (DataForSEO enrichment failed: {e})"
            out["backlinks"]["notes"] = f"{out['backlinks'].get('notes')} (DataForSEO enrichment failed: {e})"

    return out

                # # Labs: Domain Rank Overview (preferred for Domain Authority-like score)
                # try:
                #     target_domain = (website_url or homepage.get("url") or "").strip()
                #     if not target_domain:
                #         # fallback: derive from robots_sitemap.finalUrl if present
                #         target_domain = str((robots_sitemap or {}).get("finalUrl") or "")
                #     target_domain = target_domain.replace("https://", "").replace("http://", "").split("/")[0].strip()

                #     if target_domain:
                #         loc = getattr(settings, "DATAFORSEO_DEFAULT_LOCATION_CODE", 2840)
                #         lang = getattr(settings, "DATAFORSEO_DEFAULT_LANGUAGE_CODE", "en")
                #         labs = client.labs_domain_rank_overview_live(
                #             target_domain, location_code=int(loc), language_code=str(lang), limit=100
                #         )
                #         labs_json = labs.get("json") if isinstance(labs, dict) else None
                #         # tasks[0].result[0].domain_rank
                #         try:
                #             tasks = (labs_json or {}).get("tasks") or []
                #             res0 = (tasks[0].get("result") or [])[0] if tasks and isinstance(tasks[0], dict) else {}
                #             authority = (
                #                 _safe_num(res0.get("domain_rank"))
                #                 or _safe_num(res0.get("rank"))
                #                 or _safe_num((res0.get("summary") or {}).get("domain_rank"))
                #             )
                #             if authority is not None:
                #                 out["domainAuthority"]["score"] = int(round(authority))
                #                 out["domainAuthority"]["notes"] = "Fetched from DataForSEO Labs: Domain Rank Overview."
                #         except Exception:
                #             pass
                # except Exception:
                #     # Ignore labs errors; backlinks may still work
                #     pass
