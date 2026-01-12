from typing import Any, Dict
from datetime import datetime
import asyncio
import sys
import logging
import time

# Windows + Python 3.13: Playwright (subprocess) requires Proactor loop
if sys.platform.startswith('win'):
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

from app.core.utils import normalize_url, make_token
from app.core.config import settings
from app.extractors.homepage_fetch import fetch_homepage_html, parse_homepage
from app.extractors.robots_sitemap import check_robots_and_sitemap

# ✅ OLD simple extractor (kept as fallback)
from app.extractors.link_extractor import extract_links as extract_links_simple

# ✅ NEW universal extractor (async)
# Make sure you created this module as discussed:
# app/extractors/universal_links/orchestrator.py  (with extract_links_auto)
try:
    from app.extractors.universal_links.orchestrator import extract_links_auto
except Exception:
    extract_links_auto = None  # type: ignore

from app.reviews.review_scraper_safe import ReviewScraperSafe
from app.services.places_finder import build_google_reputation_bundle, to_review_analyzer_source
from app.signals.website_signals import build_website_signals
from app.signals.seo_signals import build_seo_signals
from app.signals.reputation_signals import build_reputation_signals
from app.signals.services_signals import build_services_signals
from app.signals.leadgen_signals import build_leadgen_signals
from app.llm.report_builder import build_report_with_llm
from app.db.repositories.reports_repo import ReportsRepository
from app.models.requests import AnalyzeRequest, AnalyzeResponse

import requests

logger = logging.getLogger(__name__)


def ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def ensure_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def compute_overall(subscores: Dict[str, Any]) -> int | None:
    """Compute overall score using ONLY available numeric sub-scores.

    Returns None when nothing measurable was collected (so UI/PDF can show N/A).
    """
    vals = []
    for v in (subscores or {}).values():
        if isinstance(v, (int, float)):
            vals.append(float(v))
    if not vals:
        return None
    return int(round(sum(vals) / len(vals)))


def run_pagespeed(url: str) -> Dict[str, Any] | None:
    """Run Google PageSpeed Insights for mobile + desktop.

    This should NEVER crash the pipeline. If PageSpeed fails or times out, return
    a structured error payload so the rest of the report can still be generated.
    """
    if not settings.PAGESPEED_API_KEY:
        return None

    def fetch(strategy: str) -> Dict[str, Any]:
        psi = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        params = {"url": url, "strategy": strategy, "key": settings.PAGESPEED_API_KEY}

        last_err: Exception | None = None

        # ✅ Retry a couple of times; PSI can be slow/flake.
        for attempt in range(1, 3):
            try:
                # Longer timeout: PSI often takes >60s for JS-heavy sites.
                r = requests.get(psi, params=params, timeout=120)
                r.raise_for_status()

                data = r.json() or {}
                lh = ensure_dict(data.get("lighthouseResult"))
                cats = ensure_dict(lh.get("categories"))
                audits = ensure_dict(lh.get("audits"))

                perf = ensure_dict(cats.get("performance")).get("score")
                seo = ensure_dict(cats.get("seo")).get("score")
                perf_score = int(perf * 100) if perf is not None else None
                seo_score = int(seo * 100) if seo is not None else None

                lcp = ensure_dict(audits.get("largest-contentful-paint")).get("numericValue")
                cls = ensure_dict(audits.get("cumulative-layout-shift")).get("numericValue")
                tbt = ensure_dict(audits.get("total-blocking-time")).get("numericValue")

                opps = []
                for _, a in audits.items():
                    a = ensure_dict(a)
                    details = ensure_dict(a.get("details"))
                    if details.get("type") == "opportunity":
                        title = a.get("title")
                        if title:
                            opps.append({"title": title, "description": a.get("description")})

                return {
                    "performanceScore": perf_score,
                    "seoScore": seo_score,
                    "lcpMs": int(lcp) if isinstance(lcp, (int, float)) else None,
                    "cls": float(cls) if isinstance(cls, (int, float)) else None,
                    "tbtMs": int(tbt) if isinstance(tbt, (int, float)) else None,
                    "opportunities": opps[:8],
                }

            except Exception as e:
                last_err = e
                logger.warning(
                    "[Pipeline] pagespeed %s attempt %s failed: %s",
                    strategy,
                    attempt,
                    str(e),
                )
                time.sleep(1.5 * attempt)

        return {"error": f"pagespeed_{strategy}_failed: {str(last_err)}" if last_err else "pagespeed_failed"}

    return {"mobile": fetch("mobile"), "desktop": fetch("desktop")}



def sanitize_with_template(template: Any, candidate: Any) -> Any:
    """
    Enforces the report schema using base_report as the template.
    - If types mismatch, returns template.
    - If both dict, recursively sanitize keys.
    - If list expected, candidate must be list.
    This prevents LLM from breaking Pydantic validation.
    """
    if candidate is None:
        return template

    if isinstance(template, dict):
        if not isinstance(candidate, dict):
            return template
        out = {}
        for k, v in template.items():
            out[k] = sanitize_with_template(v, candidate.get(k))
        return out

    if isinstance(template, list):
        if not isinstance(candidate, list):
            return template
        if len(template) > 0:
            item_template = template[0]
            return [sanitize_with_template(item_template, it) for it in candidate]
        return candidate

    if isinstance(template, (str, int, float, bool)):
        if isinstance(template, (int, float)) and isinstance(candidate, (int, float)):
            return candidate
        return candidate if isinstance(candidate, type(template)) else template

    return candidate


def patch_required_metadata(report: Dict[str, Any], base_report: Dict[str, Any]) -> Dict[str, Any]:
    report = ensure_dict(report)
    report_md = ensure_dict(report.get("reportMetadata"))
    base_md = ensure_dict(base_report.get("reportMetadata"))

    for key in ["reportId", "analysisDate", "overallScore", "subScores", "companyName", "website"]:
        if key not in report_md or report_md.get(key) in (None, "", {}):
            report_md[key] = base_md.get(key)

    report["reportMetadata"] = report_md
    return report


def _run_async_safely(coro):
    """Run an async coroutine from sync code safely.

    Your /api/analyze endpoint is sync, so FastAPI runs it in a worker thread
    (no running event loop). In that normal case we use asyncio.run().

    If a loop is already running (e.g., called from an async context), we fall back
    to scheduling the coroutine in that loop.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        # No running loop => normal case
        return asyncio.run(coro)

    # Running loop exists => create a task and wait for it
    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result()


def build_links_payload(website_url: str, html: str) -> Dict[str, Any]:
    """
    Prefer Universal extractor if available; otherwise fallback to simple extractor.
    Returns a dict that matches what your leadgen_signals expects (it already receives 'links').
    """
    # 1) Try universal extractor (async)
    if extract_links_auto is not None:
        try:
            result = _run_async_safely(extract_links_auto(website_url))
            result = ensure_dict(result)

            universal_links = result.get("links") or []
            if not isinstance(universal_links, list):
                universal_links = []

            return {
                "company_website": website_url,
                "internal_links": universal_links[: settings.MAX_INTERNAL_LINKS],
                "external_links": [],
                "total_internal_links": int(result.get("total_links") or len(universal_links)),
                "total_external_links": 0,
                # extra evidence fields
                "site_type": result.get("site_type"),
                "extraction_engine": result.get("engine"),
            }
        except Exception:
            # fallthrough to simple extractor
            pass

    # 2) Fallback: simple extractor (your current behavior)
    return ensure_dict(extract_links_simple(website_url, html, max_links=settings.MAX_INTERNAL_LINKS))


def run_analysis_pipeline(payload: AnalyzeRequest) -> AnalyzeResponse:
    website = normalize_url(payload.website)
    company = (payload.companyName or "").strip() or "Unknown"

    html, final_url = fetch_homepage_html(website)
    if not html:
        raise RuntimeError("Unable to fetch homepage HTML")

    homepage = ensure_dict(parse_homepage(html))
    robots_sitemap = ensure_dict(check_robots_and_sitemap(final_url or website))

    # ✅ UPDATED: Use universal links extraction first, fallback to simple extractor
    links = build_links_payload(final_url or website, html)

    try:
        pagespeed = run_pagespeed(final_url or website)
        logger.info("[Pipeline] pagespeed done: has=%s", bool(pagespeed))
    except Exception as e:
        logger.exception("[Pipeline] pagespeed failed, continuing: %s", str(e))
        pagespeed = {"mobile": {"error": str(e)}, "desktop": {"error": str(e)}}

    scraper = ReviewScraperSafe()
    reviews_scraped = ensure_dict(scraper.scrape_all_sources(final_url or website, max_reviews=10))

    # ✅ Google Places (API) reputation enrichment (ratings + reviews)
    google_places_bundle = {}
    try:
        criteria = ensure_dict(getattr(payload, "criteria", {}) or {})
        gp_location = (criteria.get("location") or criteria.get("city") or criteria.get("region") or "").strip()
        gp_service = (criteria.get("service") or criteria.get("primaryService") or payload.industry or "business").strip()
        if gp_location and getattr(settings, "GOOGLE_API_KEY", None):
            google_places_bundle = ensure_dict(
                build_google_reputation_bundle(
                    service=gp_service,
                    location=gp_location,
                    company_name=company,
                    company_website=(final_url or website),
                    max_results=int(criteria.get("placesMaxResults") or 5),
                    max_reviews=int(criteria.get("placesMaxReviews") or 5),
                )
            )
            # Merge company Google reviews into the same structure used by ReviewAnalyzer
            company_place = ensure_dict(google_places_bundle.get("company"))
            google_reviews = to_review_analyzer_source(company_place)
            if google_reviews:
                reviews_scraped.setdefault("reviews", {})
                reviews_scraped["reviews"].setdefault("google", [])
                reviews_scraped["reviews"]["google"].extend(google_reviews)

                # Provide platform meta so the reputation section can show real Google rating + total count
                # (otherwise it falls back to sampled count and "N/A" rating).
                try:
                    rating = company_place.get("rating")
                    total = company_place.get("user_ratings_total")
                    reviews_scraped.setdefault("platform_meta", {})
                    reviews_scraped["platform_meta"].setdefault("google", {})
                    if rating is not None:
                        reviews_scraped["platform_meta"]["google"]["rating"] = rating
                    if total is not None:
                        reviews_scraped["platform_meta"]["google"]["totalReviews"] = total
                except Exception:
                    pass

                reviews_scraped.setdefault("summary", {})
                reviews_scraped["summary"]["total_reviews"] = int(reviews_scraped["summary"].get("total_reviews") or 0) + len(google_reviews)
    except Exception:
        google_places_bundle = {}


    # Signals (guarded)
    website_section = ensure_dict(build_website_signals(homepage, robots_sitemap, pagespeed))
    seo_section = ensure_dict(build_seo_signals(homepage, robots_sitemap, pagespeed))
    rep_section = ensure_dict(build_reputation_signals(reviews_scraped))
    # Attach Google Places reputation evidence for the final report
    if "google_places_bundle" in locals() and google_places_bundle:
        rep_section["googlePlaces"] = google_places_bundle
    services_section = ensure_dict(build_services_signals())
    leadgen_section = ensure_dict(build_leadgen_signals(homepage, links))

    technical_seo = ensure_dict(website_section.get("technicalSEO"))
    domain_auth = ensure_dict(seo_section.get("domainAuthority"))

    # -------------------------
    # Sub‑scores
    # -------------------------
    # IMPORTANT: avoid hardcoded/static scores.
    # If a data-source is missing, return None for that sub-score so:
    #   1) Executive summary shows N/A (instead of 0)
    #   2) Overall score is computed only from collected metrics.

    def _as_int_score(v: Any) -> int | None:
        try:
            if v is None:
                return None
            n = int(round(float(v)))
            return max(0, min(100, n))
        except Exception:
            return None

    def _reputation_subscore(rep: Dict[str, Any]) -> int | None:
        # rep.reviewScore is out of 5 when available
        rs = rep.get("reviewScore")
        try:
            if rs in ("—", "-", None, "N/A"):
                return None
            n = float(rs)
            if n <= 0:
                return None
            # Convert 1–5 scale to 0–100
            return max(0, min(100, int(round((n / 5.0) * 100))))
        except Exception:
            return None

    def _leadgen_subscore(home: Dict[str, Any], lead: Dict[str, Any]) -> int | None:
        # Light heuristic based on detected conversion elements.
        # (You can later replace this with deeper crawl + analytics integrations.)
        score = 50
        if home.get("contactCTA"):
            score += 20
        channels = lead.get("channels") or []
        if isinstance(channels, list):
            detected = sum(1 for c in channels if str((c or {}).get("status", "")).lower() == "detected")
            score += min(20, detected * 10)
        return max(0, min(100, int(score)))

    def _services_subscore(services: Dict[str, Any]) -> int | None:
        # If you haven't crawled service pages yet, don't pretend we know.
        s = services.get("services")
        if isinstance(s, list) and len(s) > 0:
            return max(0, min(100, 40 + min(60, len(s) * 8)))
        return None

    subs = {
        "website": _as_int_score(technical_seo.get("score")),
        "seo": _as_int_score(domain_auth.get("score")),
        "reputation": _reputation_subscore(rep_section),
        "leadGen": _leadgen_subscore(homepage, leadgen_section),
        "services": _services_subscore(services_section),
        # Cost efficiency requires pricing/cost inputs or integrations; keep as None until implemented.
        "costEfficiency": None,
    }

    overall = compute_overall(subs)

    strengths = []
    if homepage.get("title"):
        strengths.append(f'Homepage title detected: "{homepage.get("title")}"')
    if homepage.get("metaDescription"):
        strengths.append("Meta description detected on homepage.")
    if homepage.get("contactCTA"):
        strengths.append("A contact CTA appears to exist on homepage (heuristic check).")

    weaknesses = ensure_list(technical_seo.get("issues"))

    biggest = (
        "Connect verified data sources (SEO provider, reviews/GBP, competitor SERP data) "
        "to replace currently unavailable sections."
    )

    base_report: Dict[str, Any] = {
        "reportMetadata": {
            "reportId": make_token("bbreport"),
            "companyName": company,
            "website": final_url or website,
            "analysisDate": datetime.utcnow().strftime("%d %b %Y"),
            "overallScore": overall,
            "subScores": {
                "website": subs.get("website"),
                "seo": subs.get("seo"),
                "reputation": subs.get("reputation"),
                "leadGen": subs.get("leadGen"),
                "services": subs.get("services"),
                "costEfficiency": subs.get("costEfficiency"),
            },
        },
        "executiveSummary": {
            "biggestOpportunity": biggest,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "quickWins": [
                {
                    "title": "Publish sitemap.xml and reference it from robots.txt",
                    "impact": "Improves crawl discovery and coverage.",
                    "time": "1–2 hrs",
                    "cost": "Low",
                    "details": "Add sitemap.xml and ensure robots.txt points to it.",
                }
            ],
            "highPriorityRecommendations": [
                "Connect verified data sources (SEO provider, reviews/GBP, competitor SERP data) to replace currently unavailable sections."
            ],
        },
        "websiteDigitalPresence": website_section,
        "seoVisibility": seo_section,
        "reputation": rep_section,
        "servicesPositioning": services_section,
        "leadGeneration": leadgen_section,
        "competitiveAnalysis": {"competitors": [], "positioningMatrix": [], "notes": "No competitor data was detected."},
        "costOptimization": {"notes": "Not available: requires spend inputs (tools/payroll/ad spend) or integrations.", "opportunities": []},
        "targetMarket": {"notes": "Not available without manual input or analytics/CRM data.", "segments": []},
        "financialImpact": {"notes": "Not available without revenue/spend inputs or integrations.", "revenueTable": []},
        "actionPlan90Days": [
            {
                "weekRange": "Week 1: Data & baseline setup",
                "title": "Data & baseline setup",
                "actions": [
                    "Connect PageSpeed API key (optional) and run PSI for mobile + desktop",
                    "Implement full-site crawler (titles, meta, headings, broken links, thin pages)",
                    "Add integrations for SEO visibility + reputation (see Data Gaps)",
                ],
                "expectedOutcome": "You will replace 'Unknown' sections with verified metrics.",
                "kpis": [],
            }
        ],
        "competitiveAdvantages": {"advantages": [], "notes": "Not available: requires service catalog + competitor comparison."},
        "riskAssessment": {"risks": []},
        "appendices": {
            "keywords": [],
            "dataSources": [
                {"source": final_url or website, "use": "Website crawl & heuristics", "confidence": "medium"},
                {"source": ensure_dict(robots_sitemap.get("robots")).get("url"), "use": "robots.txt check", "confidence": "high"},
                {"source": ensure_dict(robots_sitemap.get("sitemap")).get("url"), "use": "sitemap.xml check", "confidence": "high"},
                # ✅ Add link extraction evidence for transparency
                {
                    "source": final_url or website,
                    "use": f"Link extraction (site_type={links.get('site_type')})",
                    "confidence": "medium",
                },
            ],
            "dataGaps": [],
        },
    }

    llm_context = {
        "companyName": company,
        "website": final_url or website,
        "homepage": homepage,
        "robotsSitemap": robots_sitemap,
        "pagespeed": pagespeed,
        "links": links,  # ✅ pass extracted link evidence to LLM
        "reviewStatuses": ensure_dict(reviews_scraped.get("statuses")),
        "reviewSummary": ensure_dict(reviews_scraped.get("summary")),
        "googlePlaces": ensure_dict(google_places_bundle) if "google_places_bundle" in locals() else {},
        "subScores": subs,
        "dataSources": base_report["appendices"]["dataSources"],
        "dataGaps": base_report["appendices"]["dataGaps"],
    }

    # LLM enrich (but NEVER break schema)
    try:
        llm_report = build_report_with_llm(base_report, llm_context)
    except Exception:
        llm_report = None

    llm_report = ensure_dict(llm_report)
    merged = sanitize_with_template(base_report, llm_report)
    merged = patch_required_metadata(merged, base_report)

    repo = ReportsRepository()
    token = make_token("bbai")

    report_id = repo.create_report(
        token=token,
        analysis=merged,
        website=final_url or website,
        company_name=company,
        industry=payload.industry,
        email=payload.email,
        name=payload.name,
        report_download_token=None,
    )

    meta = {
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "evidence": {
            "robotsOk": ensure_dict(robots_sitemap.get("robots")).get("ok"),
            "sitemapOk": ensure_dict(robots_sitemap.get("sitemap")).get("ok"),
            "hasStructuredData": homepage.get("hasStructuredData"),
            "reviewsTotal": ensure_dict(reviews_scraped.get("summary")).get("total_reviews", 0),
            "googlePlacesCompanyRating": ensure_dict((google_places_bundle or {}).get("company")).get("rating") if "google_places_bundle" in locals() else None,
            "googlePlacesCompanyTotal": ensure_dict((google_places_bundle or {}).get("company")).get("user_ratings_total") if "google_places_bundle" in locals() else None,
            "linkExtraction": {
                "siteType": links.get("site_type"),
                "totalInternalLinks": links.get("total_internal_links"),
                "engine": links.get("extraction_engine"),
            },
        },
    }

    return AnalyzeResponse(
        ok=True,
        token=token,
        reportId=report_id,
        reportJson=merged,
        meta=meta,
    )
