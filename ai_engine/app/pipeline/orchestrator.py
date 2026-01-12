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
from app.signals.dataforseo_signals import build_dataforseo_enrichment
from app.llm.report_builder import build_report_with_llm
from app.db.repositories.reports_repo import ReportsRepository
from app.models.requests import AnalyzeRequest, AnalyzeResponse

# Google Search Console integration (optional)
try:
    from app.integrations.google_search_console import fetch_gsc_summary  # type: ignore
except Exception:
    fetch_gsc_summary = None  # type: ignore


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
                    "strategy": strategy,
                    "performanceScore": perf_score,
                    "seoScore": seo_score,
                    "bestPracticesScore": int(ensure_dict(cats.get("best-practices")).get("score") * 100)
                    if ensure_dict(cats.get("best-practices")).get("score") is not None
                    else None,
                    "accessibilityScore": int(ensure_dict(cats.get("accessibility")).get("score") * 100)
                    if ensure_dict(cats.get("accessibility")).get("score") is not None
                    else None,
                    "metrics": {
                        "fcpMs": int(ensure_dict(audits.get("first-contentful-paint")).get("numericValue"))
                        if isinstance(ensure_dict(audits.get("first-contentful-paint")).get("numericValue"), (int, float))
                        else None,
                        "lcpMs": int(lcp) if isinstance(lcp, (int, float)) else None,
                        "tbtMs": int(tbt) if isinstance(tbt, (int, float)) else None,
                        "cls": float(cls) if isinstance(cls, (int, float)) else None,
                        "speedIndexMs": int(ensure_dict(audits.get("speed-index")).get("numericValue"))
                        if isinstance(ensure_dict(audits.get("speed-index")).get("numericValue"), (int, float))
                        else None,
                    },
                    # Back-compat fields (some UI reads these flat keys)
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


    # Google Search Console (optional)
    gsc_summary = None
    try:
        gsc_summary = fetch_gsc_summary(final_url or website) if (final_url or website and callable(fetch_gsc_summary)) else None
    except Exception:
        gsc_summary = None

    # Signals (guarded)
    website_section = ensure_dict(build_website_signals(homepage, robots_sitemap, pagespeed))
    seo_section = ensure_dict(build_seo_signals(homepage, robots_sitemap, pagespeed, website_url=(final_url or website)))
    if gsc_summary:
        seo_section["searchConsole"] = gsc_summary

    # ----------------------------
    # Optional: DataForSEO Labs + Keywords enrichment
    # ----------------------------
    d4s_enrichment = {}
    try:
        criteria = ensure_dict(getattr(payload, "criteria", {}) or {})
        d4s_enrichment = ensure_dict(build_dataforseo_enrichment(final_url or website, homepage=homepage, criteria=criteria))
    except Exception as e:
        logger.exception("[Pipeline] DataForSEO enrichment failed (continuing): %s", str(e))
        d4s_enrichment = {"notes": [str(e)]}

    # Map Domain Rank -> Domain Authority score (best-effort)
    try:
        domain_auth = ensure_dict(seo_section.get("domainAuthority"))
        if domain_auth.get("score") is None and isinstance(d4s_enrichment.get("domain_rank"), (int, float)):
            domain_auth["score"] = int(round(float(d4s_enrichment["domain_rank"])))
            domain_auth["notes"] = "Fetched from DataForSEO Labs: Domain Rank Overview."
            seo_section["domainAuthority"] = domain_auth
    except Exception:
        pass

    rep_section = ensure_dict(build_reputation_signals(reviews_scraped))
    # Attach Google Places reputation evidence for the final report
    if "google_places_bundle" in locals() and google_places_bundle:
        rep_section["googlePlaces"] = google_places_bundle
    services_section = ensure_dict(build_services_signals())
    leadgen_section = ensure_dict(build_leadgen_signals(homepage, links))

    # ----------------------------
    # Competitive analysis (best-effort)
    # ----------------------------
    competitive_analysis = {"competitors": [], "positioningMatrix": [], "notes": "No competitor data was detected."}
    try:
        # Use DataForSEO competitor domains if present
        comp_domains = ensure_list(d4s_enrichment.get("competitors")) if isinstance(locals().get("d4s_enrichment"), dict) else []
        serp_comp_domains = ensure_list(d4s_enrichment.get("serp_competitors")) if isinstance(locals().get("d4s_enrichment"), dict) else []
        candidates = []
        for it in (comp_domains or [])[:10]:
            if isinstance(it, dict) and it.get("domain"):
                candidates.append({"name": it.get("domain"), "website": f"https://{it.get('domain')}", "source": "DataForSEO Labs competitors_domain", "metrics": it})
        if not candidates:
            for it in (serp_comp_domains or [])[:10]:
                if isinstance(it, dict) and it.get("domain"):
                    candidates.append({"name": it.get("domain"), "website": f"https://{it.get('domain')}", "source": "DataForSEO Labs serp_competitors", "metrics": it})
        if candidates:
            competitive_analysis = {"competitors": candidates, "positioningMatrix": [], "notes": "Competitors inferred from DataForSEO Labs."}
    except Exception:
        pass

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

    # --- Option A: deterministic plan/advantages/risks from available signals ---
    def _derive_option_a_sections() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
        """Generate (11) 90-day plan, (12) competitive advantages, (13) risk assessment
        using ONLY already-computed signals (no invented metrics).

        This is used as a safety-net when LLM generation is intentionally conservative
        and returns empty arrays for these sections.
        """

        # Helper to keep only distinct, non-empty strings
        def _uniq(items: list[str]) -> list[str]:
            out: list[str] = []
            seen: set[str] = set()
            for it in items:
                s = (it or "").strip()
                if not s:
                    continue
                key = s.lower()
                if key in seen:
                    continue
                seen.add(key)
                out.append(s)
            return out

        # Inputs we are allowed to use
        mobile_perf = ensure_dict(ensure_dict(pagespeed.get("mobile")).get("performance")).get("score")
        desktop_perf = ensure_dict(ensure_dict(pagespeed.get("desktop")).get("performance")).get("score")
        tech_issues = ensure_list(ensure_dict(website_section.get("technicalSEO")).get("issues"))
        content_gaps = ensure_list(website_section.get("contentGaps"))
        missing_channels = ensure_list(ensure_dict(leadgen_section).get("missingHighROIChannels"))

        # Reputation (if available)
        rep_platforms = ensure_list(rep_section.get("platforms"))
        google_rating = None
        google_reviews = None
        for p in rep_platforms:
            if isinstance(p, dict) and (p.get("platform") or "").lower() == "google":
                google_rating = p.get("rating")
                google_reviews = p.get("reviewCount")
                break

        # ---- Action plan (90 days) ----
        week_by_week: list[dict[str, Any]] = []

        # Week 1–2: baseline + tracking
        week_by_week.append({
            "week": "Weeks 1–2",
            "focus": "Baseline & tracking setup",
            "actions": _uniq([
                "Confirm analytics tracking (GA4) and goal/conversion events",
                "Run PageSpeed Insights (mobile + desktop) and capture baseline metrics",
                "Audit indexation basics (robots.txt, sitemap.xml) and fix obvious blockers",
            ]),
            "expectedOutcome": "Clear baseline KPIs and tracking so improvements can be measured.",
            "kpis": ["Core Web Vitals (LCP/CLS/INP)", "Conversion events firing", "Index coverage errors"],
        })

        # Weeks 3–4: technical fixes (based on detected issues)
        tech_actions = [
            "Fix critical technical SEO issues found in the crawl",
            "Address Core Web Vitals opportunities (image optimisation, script deferral, caching)",
        ]
        if mobile_perf is not None:
            tech_actions.append(f"Improve mobile performance score (current: {mobile_perf})")
        if desktop_perf is not None:
            tech_actions.append(f"Maintain/improve desktop performance score (current: {desktop_perf})")
        if tech_issues:
            tech_actions.extend([f"Resolve: {i}" for i in tech_issues[:5]])

        week_by_week.append({
            "week": "Weeks 3–4",
            "focus": "Technical SEO & performance quick wins",
            "actions": _uniq(tech_actions),
            "expectedOutcome": "Better crawlability and faster pages, improving organic visibility and conversion rate.",
            "kpis": ["PSI performance (mobile/desktop)", "Crawl errors", "Page weight reduction"],
        })

        # Weeks 5–6: key pages & conversion assets
        page_actions = [
            "Ensure core pages exist and are complete (Services, About, Contact, Case Studies)",
            "Add strong CTAs above the fold and consistent contact points",
            "Add trust elements (testimonials, certifications, portfolio)" 
        ]
        if content_gaps:
            page_actions.extend([f"Create/expand: {g}" for g in content_gaps[:5]])

        week_by_week.append({
            "week": "Weeks 5–6",
            "focus": "Conversion-ready content & trust building",
            "actions": _uniq(page_actions),
            "expectedOutcome": "Higher enquiry/lead conversion from existing traffic.",
            "kpis": ["Form submissions", "CTA click-through", "Bounce rate on landing pages"],
        })

        # Weeks 7–8: SEO growth loop (keywords/content)
        week_by_week.append({
            "week": "Weeks 7–8",
            "focus": "SEO content plan & on-page optimisation",
            "actions": _uniq([
                "Build a keyword-to-page mapping for priority services/locations",
                "Publish 4–6 high-intent pages/posts based on keyword opportunities",
                "Improve internal linking between service pages and supporting content",
            ]),
            "expectedOutcome": "More ranking pages and better topical authority.",
            "kpis": ["Ranking keyword count", "Organic impressions/clicks (if GSC connected)", "Indexed pages"],
        })

        # Weeks 9–10: Local SEO + reputation flywheel
        rep_actions = ["Optimise Google Business Profile and key local listings", "Set up a review request process and response SOP"]
        if google_rating is not None and google_reviews is not None:
            rep_actions.insert(0, f"Leverage existing Google rating ({google_rating}) across key pages and proposals")

        week_by_week.append({
            "week": "Weeks 9–10",
            "focus": "Local visibility & reputation",
            "actions": _uniq(rep_actions),
            "expectedOutcome": "Improved local pack visibility and higher trust conversion.",
            "kpis": ["New reviews", "Local pack presence", "GBP actions (calls/website clicks)"],
        })

        # Weeks 11–12: Lead gen channels + automation
        lg_actions = ["Launch 1–2 high-ROI acquisition channels", "Set up CRM follow-up automation and lead qualification"]
        if missing_channels:
            lg_actions.extend([f"Implement channel: {c}" for c in missing_channels[:4]])

        week_by_week.append({
            "week": "Weeks 11–12",
            "focus": "Lead generation scale-up",
            "actions": _uniq(lg_actions),
            "expectedOutcome": "More consistent lead flow and faster follow-ups.",
            "kpis": ["Leads/week", "Lead-to-meeting rate", "Response time"],
        })

        action_plan = {
            "weekByWeek": week_by_week,
            "kpisToTrack": [],
            "notes": "Generated from available crawl, speed and reputation signals (Option A fallback).",
        }

        # ---- Competitive advantages ----
        advantages: list[dict[str, Any]] = []
        if google_rating is not None and google_reviews is not None:
            advantages.append({
                "advantage": "Strong Google review profile",
                "whyItMatters": f"Social proof improves conversion; current Google rating is {google_rating} across {google_reviews} reviews.",
                "howToLeverage": "Show rating/review snippets on homepage and service pages; include in proposals and ads extensions.",
            })

        if desktop_perf is not None and isinstance(desktop_perf, (int, float)) and desktop_perf >= 60:
            advantages.append({
                "advantage": "Decent desktop performance baseline",
                "whyItMatters": "Faster pages help both SEO and conversion rates.",
                "howToLeverage": "Preserve performance while adding content; monitor CWV after every release.",
            })

        if links.get("site_type"):
            advantages.append({
                "advantage": "Clear site structure signals detected",
                "whyItMatters": "A discoverable structure improves crawl efficiency and internal linking opportunities.",
                "howToLeverage": "Create a content hub and link supporting articles into high-intent service pages.",
            })

        competitive_adv = {
            "advantages": advantages,
            "uniqueAngle": None,
            "notes": "Generated from verified reputation + performance + crawl signals (Option A fallback).",
        }

        # ---- Risk assessment ----
        risks: list[dict[str, Any]] = []

        if mobile_perf is not None and isinstance(mobile_perf, (int, float)) and mobile_perf < 70:
            risks.append({
                "risk": "Mobile performance may suppress conversions",
                "severity": "High" if mobile_perf < 50 else "Medium",
                "likelihood": "High",
                "mitigation": "Optimise images/scripts, reduce render-blocking resources, and monitor CWV after fixes.",
                "notes": f"Mobile PSI performance score observed: {mobile_perf}.",
            })

        if content_gaps:
            risks.append({
                "risk": "Missing/weak core content reduces trust and ranking coverage",
                "severity": "Medium",
                "likelihood": "High",
                "mitigation": "Publish complete service/location pages, add trust assets (case studies/testimonials), and strengthen internal linking.",
                "notes": f"Detected content gaps: {', '.join([str(x) for x in content_gaps[:4]])}.",
            })

        if not gsc_summary:
            risks.append({
                "risk": "Lack of Search Console data hides organic issues",
                "severity": "Medium",
                "likelihood": "High",
                "mitigation": "Connect Google Search Console to monitor queries, pages, and coverage errors.",
            })

        if not ensure_dict(seo_section.get("domainAuthority")).get("score"):
            risks.append({
                "risk": "Authority/competitor benchmarks are unavailable",
                "severity": "Low",
                "likelihood": "High",
                "mitigation": "Connect DataForSEO Labs (domain rank + competitors) to quantify authority and competitive landscape.",
            })

        risk_assessment = {
            "risks": risks,
            "compliance": [],
            "notes": "Generated from verified crawl, speed and data-gap signals (Option A fallback).",
        }

        return action_plan, competitive_adv, risk_assessment

    action_plan_90, competitive_adv, risk_assessment = _derive_option_a_sections()

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
        "competitiveAnalysis": competitive_analysis,
        "costOptimization": {"notes": "Not available: requires spend inputs (tools/payroll/ad spend) or integrations.", "opportunities": []},
        "targetMarket": {"notes": "Not available without manual input or analytics/CRM data.", "segments": []},
        "financialImpact": {"notes": "Not available without revenue/spend inputs or integrations.", "revenueTable": []},
        "actionPlan90Days": action_plan_90,
        "competitiveAdvantages": competitive_adv,
        "riskAssessment": risk_assessment,
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

    
    # ---- Data gaps (so PDF can explain why some sections are N/A) ----
    data_gaps: list[dict[str, Any]] = []

    # Search Console
    if not gsc_summary:
        if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
            data_gaps.append({
                "area": "Google Search Console",
                "missing": "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set",
                "impact": "Organic clicks/queries/pages/CTR/avg position will be unavailable.",
                "howToFix": "Create OAuth client in Google Cloud (Web app) and set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. Also set GOOGLE_REFRESH_TOKEN.",
            })
        elif not settings.GOOGLE_REFRESH_TOKEN:
            data_gaps.append({
                "area": "Google Search Console",
                "missing": "GOOGLE_REFRESH_TOKEN not set",
                "impact": "Cannot call Search Console API without a refresh token for offline access.",
                "howToFix": "Generate a refresh token once via OAuth consent (offline access) and set GOOGLE_REFRESH_TOKEN in AI engine .env.",
            })
        else:
            data_gaps.append({
                "area": "Google Search Console",
                "missing": "No matching site property / access denied",
                "impact": "Search Console metrics are not included.",
                "howToFix": "Verify the site property exists and the OAuth user has access (URL-prefix or sc-domain). Optionally set GSC_SITE_URL to the exact property.",
            })

    # SEO provider / Backlinks / Authority
    da_score = ensure_dict(seo_section.get("domainAuthority")).get("score") if isinstance(seo_section, dict) else None
    if da_score in (None, "—", "N/A"):
        data_gaps.append({
            "area": "Backlinks & Domain Authority",
            "missing": "Third-party SEO provider not connected (Ahrefs/Semrush/Moz/DataForSEO).",
            "impact": "Authority and backlink metrics will show N/A.",
            "howToFix": "Integrate one provider (recommended: DataForSEO Backlinks + SERP + Keyword Data, or Ahrefs/Semrush/Moz).",
        })

    # Ads / Cost efficiency
    data_gaps.append({
        "area": "Cost Efficiency",
        "missing": "Ads spend + tooling costs not connected.",
        "impact": "Cost efficiency scoring and ROI estimates will show N/A.",
        "howToFix": "Integrate Google Ads API (spend/conversions) and/or add a manual cost input form for tools/payroll.",
    })

    base_report["appendices"]["dataGaps"] = data_gaps

    # Attach keyword ideas (if any) as appendix for the PDF/LLM
    try:
        kitems = ensure_list(d4s_enrichment.get("keywords_for_site")) if isinstance(locals().get("d4s_enrichment"), dict) else []
        # Store in a very flexible shape (schema allows dict)
        base_report["appendices"]["keywords"] = [
            {"tier": "Keywords for Site (DataForSEO)", "items": kitems[:50]}
        ] if kitems else []
        if kitems:
            base_report["appendices"]["dataSources"].append({
                "source": "DataForSEO Keywords Data API",
                "use": "Keyword ideas + basic metrics for the analyzed site",
                "confidence": "Medium"
            })
    except Exception:
        pass

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