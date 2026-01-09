from typing import Any, Dict
from datetime import datetime
import asyncio
import sys

# Windows + Python 3.13: Playwright (subprocess) requires Proactor loop
if sys.platform.startswith("win"):
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


def ensure_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def ensure_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def compute_overall(subscores: Dict[str, int]) -> int:
    vals = [v for v in subscores.values() if isinstance(v, int)]
    if not vals:
        return 0
    return int(round(sum(vals) / len(vals)))


def run_pagespeed(url: str) -> Dict[str, Any] | None:
    if not settings.PAGESPEED_API_KEY:
        return None

    def fetch(strategy: str) -> Dict[str, Any] | None:
        psi = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        params = {"url": url, "strategy": strategy, "key": settings.PAGESPEED_API_KEY}
        r = requests.get(psi, params=params, timeout=60)
        if r.status_code != 200:
            return None

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

    return {"mobile": fetch("mobile"), "desktop": fetch("desktop")}


def sanitize_with_template(template: Any, candidate: Any) -> Any:
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
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)

    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result()


def build_links_payload(website_url: str, html: str) -> Dict[str, Any]:
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
                "site_type": result.get("site_type"),
                "extraction_engine": result.get("engine"),
            }
        except Exception:
            pass

    return ensure_dict(extract_links_simple(website_url, html, max_links=settings.MAX_INTERNAL_LINKS))


def run_analysis_pipeline(payload: AnalyzeRequest) -> AnalyzeResponse:
    website = normalize_url(payload.website)
    company = (payload.companyName or "").strip() or "Unknown"

    html, final_url = fetch_homepage_html(website)
    if not html:
        raise RuntimeError("Unable to fetch homepage HTML")

    homepage = ensure_dict(parse_homepage(html))
    robots_sitemap = ensure_dict(check_robots_and_sitemap(final_url or website))

    links = build_links_payload(final_url or website, html)
    pagespeed = run_pagespeed(final_url or website)

    scraper = ReviewScraperSafe()
    reviews_scraped = ensure_dict(scraper.scrape_all_sources(final_url or website, max_reviews=10))

    # ✅ Google Places (API) reputation enrichment (ratings + reviews)
    google_places_bundle: Dict[str, Any] = {}
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

            company_place = ensure_dict(google_places_bundle.get("company"))

            # 1) Merge sample review texts for sentiment/themes (usually 3–5 from Google)
            google_reviews = to_review_analyzer_source(company_place)
            if google_reviews:
                reviews_scraped.setdefault("reviews", {})
                reviews_scraped["reviews"].setdefault("google", [])
                if isinstance(reviews_scraped["reviews"]["google"], list):
                    reviews_scraped["reviews"]["google"].extend(google_reviews)

                # Keep sampled total for analysis transparency
                reviews_scraped.setdefault("summary", {})
                current_total = reviews_scraped["summary"].get("total_reviews") or 0
                try:
                    current_total = int(current_total)
                except Exception:
                    current_total = 0
                reviews_scraped["summary"]["total_reviews"] = current_total + len(google_reviews)

            # 2) Store authoritative Google totals separately (THIS fixes 31 vs 5)
            reviews_scraped.setdefault("platform_meta", {})
            reviews_scraped["platform_meta"]["google"] = {
                "rating": company_place.get("rating"),
                "totalReviews": company_place.get("user_ratings_total"),
            }
    except Exception:
        google_places_bundle = {}

    # Signals
    website_section = ensure_dict(build_website_signals(homepage, robots_sitemap, pagespeed))
    seo_section = ensure_dict(build_seo_signals())

    # ✅ reputation_signals will now use platform_meta totals (Google = 31)
    rep_section = ensure_dict(build_reputation_signals(reviews_scraped))

    # Attach Google Places evidence into report
    if google_places_bundle:
        rep_section["googlePlaces"] = google_places_bundle

    services_section = ensure_dict(build_services_signals())
    leadgen_section = ensure_dict(build_leadgen_signals(homepage, links))

    technical_seo = ensure_dict(website_section.get("technicalSEO"))
    domain_auth = ensure_dict(seo_section.get("domainAuthority"))

    subs = {
        "website": int(technical_seo.get("score") or 0),
        "seo": int(domain_auth.get("score") or 0),
        "reputation": 0 if rep_section.get("reviewScore") in ("—", None) else 60,
        "leadGen": 60 if homepage.get("contactCTA") else 30,
        "services": 30,
        "costEfficiency": 0,
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
                "website": subs["website"],
                "seo": subs["seo"],
                "reputation": "—" if rep_section.get("reviewScore") == "—" else subs["reputation"],
                "leadGen": subs["leadGen"],
                "services": subs["services"],
                "costEfficiency": "—" if subs["costEfficiency"] == 0 else subs["costEfficiency"],
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
        "links": links,
        "reviewStatuses": ensure_dict(reviews_scraped.get("statuses")),
        "reviewSummary": ensure_dict(reviews_scraped.get("summary")),
        "googlePlaces": ensure_dict(google_places_bundle),
        "subScores": subs,
        "dataSources": base_report["appendices"]["dataSources"],
        "dataGaps": base_report["appendices"]["dataGaps"],
    }

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
            "reviewsTotalSampled": ensure_dict(reviews_scraped.get("summary")).get("total_reviews", 0),
            "googlePlacesCompanyRating": ensure_dict((google_places_bundle or {}).get("company")).get("rating") if google_places_bundle else None,
            "googlePlacesCompanyTotal": ensure_dict((google_places_bundle or {}).get("company")).get("user_ratings_total") if google_places_bundle else None,
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
