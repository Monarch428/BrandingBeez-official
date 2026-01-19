from typing import Any, Dict
from datetime import datetime
import asyncio
import sys
import logging
import time

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

# ✅ Scrapy-powered link extractor (optional)
try:
    from app.extractors.scrapy_link_extractor import extract_links_scrapy
except Exception:
    extract_links_scrapy = None  # type: ignore

from app.extractors.content_pages import fetch_content_pages
from app.extractors.service_scraper_ext import scrape_services

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
from app.signals.dataforseo_signals import build_dataforseo_enrichment
from app.llm.report_builder import build_report_with_llm
from app.db.repositories.reports_repo import ReportsRepository
from app.db.repositories.analysis_cache_repo import AnalysisCacheRepository
from app.models.requests import AnalyzeRequest, AnalyzeResponse

# Screenshots (evidence)
try:
    from app.extractors.screenshots import capture_screenshots
except Exception:
    capture_screenshots = None  # type: ignore

# Google Search Console integration (optional)
try:
    from app.integrations.google_search_console import fetch_gsc_summary  # type: ignore
except Exception:
    fetch_gsc_summary = None  # type: ignore

import requests
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


def _domain_from_url(url: str) -> str:
    """Extract a normalized domain from a URL or domain-like string."""
    if not url:
        return ""
    u = (url or "").strip()
    if not u.startswith("http://") and not u.startswith("https://"):
        u = "https://" + u
    try:
        p = urlparse(u)
        host = (p.netloc or "").strip().lower() or (p.path or "").split("/")[0].strip().lower()
        if ":" in host:
            host = host.split(":", 1)[0]
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        u2 = u.lower().replace("http://", "").replace("https://", "")
        u2 = u2.split("/")[0]
        if ":" in u2:
            u2 = u2.split(":", 1)[0]
        if u2.startswith("www."):
            u2 = u2[4:]
        return u2


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
    """Run Google PageSpeed Insights for mobile + desktop."""
    if not settings.PAGESPEED_API_KEY:
        return None

    def fetch(strategy: str) -> Dict[str, Any]:
        psi = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        params = {"url": url, "strategy": strategy, "key": settings.PAGESPEED_API_KEY}

        last_err: Exception | None = None

        # ✅ Retry a couple of times; PSI can be slow/flake.
        for attempt in range(1, 3):
            try:
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
                    # Back-compat fields
                    "lcpMs": int(lcp) if isinstance(lcp, (int, float)) else None,
                    "cls": float(cls) if isinstance(cls, (int, float)) else None,
                    "tbtMs": int(tbt) if isinstance(tbt, (int, float)) else None,
                    "opportunities": opps[:8],
                }
            except Exception as e:
                last_err = e
                logger.warning("[Pipeline] pagespeed %s attempt %s failed: %s", strategy, attempt, str(e))
                time.sleep(1.5 * attempt)

        return {"error": f"pagespeed_{strategy}_failed: {str(last_err)}" if last_err else "pagespeed_failed"}

    return {
        "url": url,
        "fetchedAt": datetime.utcnow().isoformat() + "Z",
        "mobile": fetch("mobile"),
        "desktop": fetch("desktop"),
    }


def sanitize_with_template(template: Any, candidate: Any) -> Any:
    """Enforces the report schema using base_report as the template."""
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
    """Run an async coroutine from sync code safely."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)

    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result()


def build_links_payload(website_url: str, html: str) -> Dict[str, Any]:
    """Prefer Universal extractor if available; otherwise fallback to simple extractor."""
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

    # Scrapy (optional) – more robust than bs4-only extraction on messy HTML
    if bool(getattr(settings, "USE_SCRAPY_LINK_EXTRACTOR", True)) and extract_links_scrapy is not None:
        try:
            out = ensure_dict(extract_links_scrapy(website_url, html, max_links=settings.MAX_INTERNAL_LINKS))
            out.setdefault("site_type", None)
            out["extraction_engine"] = out.get("extraction_engine") or "scrapy_link_extractor"
            return out
        except Exception:
            pass

    out = ensure_dict(extract_links_simple(website_url, html, max_links=settings.MAX_INTERNAL_LINKS))
    out.setdefault("site_type", None)
    out.setdefault("extraction_engine", "bs4_link_extractor")
    return out


def should_use_playwright_for_site(homepage_html: str, links_payload: Dict[str, Any]) -> bool:
    """Decide whether to run Playwright heavy steps.

    Goal: keep runs fast by defaulting to Scrapy/HTTP, and only enabling
    Playwright when the site looks like an SPA or when HTML text is too thin.
    """
    try:
        lp = ensure_dict(links_payload)
        site_type = (lp.get("site_type") or "").strip().lower()
        if site_type in ("spa", "react", "angular", "vue", "nextjs", "nuxt", "svelte"):
            return True

        html = homepage_html or ""
        # Heuristic: very low visible text in raw HTML + lots of script tags
        from bs4 import BeautifulSoup

        soup = BeautifulSoup(html, "html.parser")
        text = (soup.get_text(" ", strip=True) or "")
        word_count = len([w for w in text.split() if len(w) > 1])
        script_count = len(soup.find_all("script"))

        if word_count < 120 and script_count >= 10:
            return True

        # Heuristic: common SPA root div
        if soup.select_one("#root, #__next, #app") is not None and word_count < 220:
            return True

        return False
    except Exception:
        return True


def run_analysis_pipeline(payload: AnalyzeRequest) -> AnalyzeResponse:
    website = normalize_url(payload.website)
    company = (payload.companyName or "").strip() or "Unknown"

    # ✅ IMPORTANT: define criteria ONCE so it is always available
    criteria = ensure_dict(getattr(payload, "criteria", {}) or {})

    # Cache
    cache_repo = AnalysisCacheRepository()
    cache_enabled = bool(getattr(settings, "CACHE_ENABLED", True))

    # ✅ If UI explicitly requested a fresh run, bypass all cached sections
    # (crawl/pages, pagespeed, dataforseo, places, screenshots, etc.)
    if bool(getattr(payload, "forceNewAnalysis", False)):
        cache_enabled = False
        logger.info("[Pipeline] forceNewAnalysis enabled -> bypassing cache")
    cache_key = cache_repo.make_cache_key(website)

    html, final_url = fetch_homepage_html(website)
    if not html:
        raise RuntimeError("Unable to fetch homepage HTML")

    homepage = ensure_dict(parse_homepage(html))
    robots_sitemap = ensure_dict(check_robots_and_sitemap(final_url or website))

    # ✅ Links (cached)
    links = None
    if cache_enabled:
        links = cache_repo.get_section_if_fresh(cache_key, "links", ttl_days=int(getattr(settings, "CACHE_TTL_CRAWL_DAYS", 7)))
    if not links:
        links = build_links_payload(final_url or website, html)
        if cache_enabled:
            cache_repo.upsert_section(cache_key, "links", links)

    # Decide whether to run Playwright for additional pages (speed optimization)
    def _should_use_playwright(home_html: str, homepage_parsed: Dict[str, Any], links_payload: Dict[str, Any]) -> bool:
        # If universal extractor already identified SPA, prefer Playwright
        site_type = (ensure_dict(links_payload).get("site_type") or "").lower()
        if site_type in ("spa", "react", "angular", "vue", "nextjs"):
            return True
        # Heuristic: very low visible text + lots of scripts often means JS rendering
        try:
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(home_html or "", "html.parser")
            text = soup.get_text(" ", strip=True)
            word_count = len([w for w in (text or "").split() if len(w) > 1])
            scripts = len(soup.find_all("script"))
            # If the homepage has too little text, we likely need JS-rendered DOM
            if word_count < 120 and scripts >= 10:
                return True
        except Exception:
            pass
        return bool(getattr(settings, "USE_PLAYWRIGHT_FOR_CONTENT_PAGES", True))

    # ✅ PageSpeed (cached)
    pagespeed = None
    if cache_enabled:
        pagespeed = cache_repo.get_section_if_fresh(cache_key, "pagespeed", ttl_days=int(getattr(settings, "CACHE_TTL_PAGESPEED_DAYS", 1)))
    if not pagespeed:
        try:
            pagespeed = run_pagespeed(final_url or website)
            logger.info("[Pipeline] pagespeed done: has=%s", bool(pagespeed))
        except Exception as e:
            logger.exception("[Pipeline] pagespeed failed, continuing: %s", str(e))
            pagespeed = {"url": (final_url or website), "fetchedAt": datetime.utcnow().isoformat() + "Z", "mobile": {"error": str(e)}, "desktop": {"error": str(e)}}
        if cache_enabled and pagespeed is not None:
            cache_repo.upsert_section(cache_key, "pagespeed", pagespeed)

    scraper = ReviewScraperSafe()
    reviews_scraped = ensure_dict(scraper.scrape_all_sources(final_url or website, max_reviews=10))

    # ✅ Google Places (API) reputation enrichment (ratings + reviews)
    # ✅ Google Places (cached)
    google_places_bundle = {}
    try:
        gp_location = (criteria.get("location") or criteria.get("city") or criteria.get("region") or "").strip()
        gp_service = (criteria.get("service") or criteria.get("primaryService") or payload.industry or "business").strip()
        if gp_location and getattr(settings, "GOOGLE_API_KEY", None):
            cached_places = None
            if cache_enabled:
                cached_places = cache_repo.get_section_if_fresh(cache_key, "places", ttl_days=int(getattr(settings, "CACHE_TTL_PLACES_DAYS", 7)))
            if cached_places:
                google_places_bundle = ensure_dict(cached_places)
            else:
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
                if cache_enabled and google_places_bundle:
                    cache_repo.upsert_section(cache_key, "places", google_places_bundle)

            company_place = ensure_dict(google_places_bundle.get("company"))
            google_reviews = to_review_analyzer_source(company_place)
            if google_reviews:
                reviews_scraped.setdefault("reviews", {})
                reviews_scraped["reviews"].setdefault("google", [])
                reviews_scraped["reviews"]["google"].extend(google_reviews)

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

    # ✅ DataForSEO enrichment (cached)
    d4s_enrichment = {}
    if cache_enabled:
        cached_d4s = cache_repo.get_section_if_fresh(cache_key, "dataforseo", ttl_days=int(getattr(settings, "CACHE_TTL_DATAFORSEO_DAYS", 7)))
        if cached_d4s:
            d4s_enrichment = ensure_dict(cached_d4s)
    if not d4s_enrichment:
        try:
            d4s_enrichment = ensure_dict(build_dataforseo_enrichment(final_url or website, homepage=homepage, criteria=criteria))
        except Exception as e:
            logger.exception("[Pipeline] DataForSEO enrichment failed (continuing): %s", str(e))
            d4s_enrichment = {"notes": [str(e)]}
        if cache_enabled and d4s_enrichment:
            cache_repo.upsert_section(cache_key, "dataforseo", d4s_enrichment)

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

    # Own-site content pages (best-effort, cached)
    own_pages = []
    internal_links_site: list[str] = []
    try:
        internal_links_site = ensure_list(ensure_dict(links).get("internal_links"))
        site_max_pages = int(criteria.get("siteMaxPages") or 10)
        site_max_pages = max(3, min(site_max_pages, 15))

        cached_pages = None
        if cache_enabled:
            cached_pages = cache_repo.get_section_if_fresh(cache_key, "content_pages", ttl_days=int(getattr(settings, "CACHE_TTL_CRAWL_DAYS", 7)))
        if cached_pages:
            own_pages = cached_pages or []
        else:
            use_pw_for_pages = _should_use_playwright(html, homepage, ensure_dict(links))
            # Force PW only when needed to keep generation fast
            own_pages = fetch_content_pages(
                final_url or website,
                internal_links_site,
                max_pages=site_max_pages,
                timeout=45,
                use_playwright=use_pw_for_pages,
            ) or []
            if cache_enabled and own_pages:
                cache_repo.upsert_section(cache_key, "content_pages", own_pages)
    except Exception:
        own_pages = []

    # ✅ Screenshots (cached)
    screenshots_bundle = {}
    try:
        enable_shots = bool(getattr(settings, "ENABLE_SCREENSHOTS", True))
        if enable_shots and capture_screenshots is not None:
            cached_shots = None
            if cache_enabled:
                cached_shots = cache_repo.get_section_if_fresh(cache_key, "screenshots", ttl_days=int(getattr(settings, "CACHE_TTL_SCREENSHOTS_DAYS", 7)))
            if cached_shots:
                screenshots_bundle = ensure_dict(cached_shots)
            else:
                screenshots_bundle = ensure_dict(capture_screenshots(final_url or website))
                if cache_enabled and screenshots_bundle:
                    cache_repo.upsert_section(cache_key, "screenshots", screenshots_bundle)
    except Exception as e:
        logger.warning("[Pipeline] screenshots failed, continuing: %s", str(e))
        screenshots_bundle = {"error": str(e)}

    # Attach Google Places reputation evidence for the final report
    if google_places_bundle:
        rep_section["googlePlaces"] = google_places_bundle

    # ✅✅ FIX: define scraped_services BEFORE using it
    scraped_services = []
    try:
        # Prefer passing internal links if scraper supports it; otherwise fallback to url-only
        try:
            scraped_services = scrape_services(
                final_url or website,
                internal_links=internal_links_site,
                max_pages=int(criteria.get("servicesMaxPages") or 8),
                timeout=int(criteria.get("servicesTimeout") or 45),
            ) or []
        except TypeError:
            # In case your scrape_services signature is (url) only
            scraped_services = scrape_services(final_url or website) or []
    except Exception as e:
        logger.warning("[Pipeline] service_scraper failed, continuing: %s", str(e))
        scraped_services = []

    services_section = ensure_dict(build_services_signals(homepage, own_pages, scraped_services=scraped_services))
    leadgen_section = ensure_dict(build_leadgen_signals(homepage, links))

    # ----------------------------
    # Deterministic extraction helpers (so PDF never shows empty competitor/services blocks)
    # ----------------------------
    import re as _re

    def _uniq_str(items: list[str]) -> list[str]:
        out: list[str] = []
        seen: set[str] = set()
        for it in items or []:
            s = (it or "").strip()
            if not s:
                continue
            k = s.lower()
            if k in seen:
                continue
            seen.add(k)
            out.append(s)
        return out

    def _extract_services_from_pages(pages: list[dict]) -> list[str]:
        text = "\n".join(
            [
                str(p.get("title") or "") + " " + str(p.get("metaDescription") or "") + " " + str(p.get("textSnippet") or "")
                for p in pages
                if isinstance(p, dict)
            ]
        )
        patterns = [
            (r"\bseo\b|search engine optimization", "SEO"),
            (r"\bppc\b|pay per click|google ads|adwords", "PPC / Google Ads"),
            (r"\bsocial media\b|facebook ads|instagram ads|tiktok ads|linkedin ads", "Social Media Marketing"),
            (r"\bweb design\b|website design|ui/ux|web development|website development", "Web Design & Development"),
            (r"\bbranding\b|brand identity|logo design", "Branding & Identity"),
            (r"\bcontent marketing\b|copywriting|blog", "Content Marketing"),
            (r"\bemail marketing\b|newsletter|klaviyo|mailchimp", "Email Marketing"),
            (r"\bcro\b|conversion rate optimization|landing page", "Conversion Rate Optimisation"),
            (r"\bcrm\b|hubspot|marketing automation", "CRM & Automation"),
        ]
        found: list[str] = []
        for pat, name in patterns:
            if _re.search(pat, text, _re.IGNORECASE):
                found.append(name)
        return _uniq_str(found)

    def _extract_location_from_pages(pages: list[dict]) -> str | None:
        t = "\n".join([str(p.get("textSnippet") or "") for p in pages if isinstance(p, dict)])
        cities = ["london", "manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol", "liverpool", "sheffield", "nottingham", "cardiff", "belfast"]
        for c in cities:
            if c in t.lower():
                return c.title() + ", UK"
        if " united kingdom" in t.lower() or " uk" in t.lower():
            return "UK"
        return None

    def _extract_years_in_business(pages: list[dict]) -> str | None:
        t = "\n".join([str(p.get("textSnippet") or "") + " " + str(p.get("metaDescription") or "") for p in pages if isinstance(p, dict)])
        m = _re.search(r"(since|founded)\s*(19\d{2}|20\d{2})", t, _re.IGNORECASE)
        if m:
            yr = m.group(2)
            try:
                y = int(yr)
                yrs = max(0, datetime.utcnow().year - y)
                return f"{yrs}+ yrs (since {y})"
            except Exception:
                return f"Since {yr}"
        return None

    def _extract_team_size(pages: list[dict]) -> str | None:
        t = "\n".join([str(p.get("textSnippet") or "") for p in pages if isinstance(p, dict)])
        m = _re.search(r"team of\s*(\d{1,4})", t, _re.IGNORECASE)
        if m:
            return m.group(1)
        m = _re.search(r"(\d{1,4})\+\s*(people|experts|employees|specialists)", t, _re.IGNORECASE)
        if m:
            return m.group(1) + "+"
        return None

    def _market_overlap(our: list[str], theirs: list[str]) -> str | None:
        if not our or not theirs:
            return None
        o = set([s.lower() for s in our])
        t = set([s.lower() for s in theirs])
        inter = len(o.intersection(t))
        denom = max(1, len(o))
        pct = int(round((inter / denom) * 100))
        return f"{pct}%"

    def _competitor_strengths(pages: list[dict]) -> list[str]:
        strengths: list[str] = []
        for p in pages:
            if not isinstance(p, dict):
                continue
            if p.get("hasCaseStudySignals"):
                strengths.append("Shows case studies/portfolio evidence")
            if p.get("hasTestimonialsSignals"):
                strengths.append("Highlights testimonials/social proof")
            if p.get("hasFAQ"):
                strengths.append("Uses FAQs to address objections")
            if p.get("hasPricingSignals"):
                strengths.append("Mentions pricing/packages (can improve conversion)")
        return _uniq_str(strengths)

    # Competitive analysis (best-effort)
    competitive_analysis = {"competitors": [], "positioningMatrix": [], "notes": "No competitor data was detected."}
    competitor_evidence = {"selected": [], "evidence": [], "notes": []}

    try:
        social_domains = {
            "linkedin.com",
            "facebook.com",
            "instagram.com",
            "twitter.com",
            "x.com",
            "tiktok.com",
            "youtube.com",
            "pinterest.com",
            "crunchbase.com",
            "glassdoor.com",
            "wikipedia.org",
            "yelp.com",
        }

        def _is_social(d: str) -> bool:
            d = (d or "").lower().strip()
            return any(d == s or d.endswith("." + s) for s in social_domains)

        company_domain = _domain_from_url(final_url or website)

        comp_domains = ensure_list(d4s_enrichment.get("competitors")) if isinstance(d4s_enrichment, dict) else []
        serp_comp_domains = ensure_list(d4s_enrichment.get("serp_competitors")) if isinstance(d4s_enrichment, dict) else []

        candidates: list[dict] = []
        for it in (comp_domains or [])[:15]:
            if isinstance(it, dict) and it.get("domain"):
                candidates.append({"domain": it.get("domain"), "source": "DataForSEO Labs competitors_domain", "metrics": it})
        for it in (serp_comp_domains or [])[:15]:
            if isinstance(it, dict) and it.get("domain"):
                candidates.append({"domain": it.get("domain"), "source": "DataForSEO Labs serp_competitors", "metrics": it})

        user_comp = ensure_list(criteria.get("competitors")) if isinstance(criteria, dict) else []
        for u in user_comp[:10]:
            if isinstance(u, str) and u.strip():
                candidates.append({"domain": _domain_from_url(u), "source": "UserProvided", "metrics": {}})

        seen = set()
        filtered: list[dict] = []
        for c in candidates:
            d = (c.get("domain") or "").lower().strip()
            if not d:
                continue
            if d == company_domain or d.endswith("." + company_domain):
                continue
            if _is_social(d):
                continue
            if d in seen:
                continue
            seen.add(d)
            filtered.append(c)

        max_comp = int((criteria.get("competitorMaxCompetitors") or 6) if isinstance(criteria, dict) else 6)
        filtered = filtered[: max(1, min(max_comp, 10))]

        our_services = []
        try:
            our_services = [s.get("name") for s in ensure_list(services_section.get("services")) if isinstance(s, dict) and s.get("name")]
        except Exception:
            our_services = []

        max_pages_per = int((criteria.get("competitorMaxPages") or 6) if isinstance(criteria, dict) else 6)
        max_pages_per = max(2, min(max_pages_per, 10))

        for c in filtered:
            d = c.get("domain") or ""
            url = ("https://" + d) if d and not d.startswith("http") else (d or "")
            url = url.rstrip("/")
            if not url:
                continue

            try:
                internal_links: list[str] = []
                if extract_links_auto is not None:
                    res_links = _run_async_safely(extract_links_auto(url, timeout_sec=90))
                    res_links = ensure_dict(res_links)
                    internal_links = ensure_list(res_links.get("links"))[: settings.MAX_INTERNAL_LINKS]
                else:
                    internal_links = ensure_list(extract_links_simple(url))[: settings.MAX_INTERNAL_LINKS]

                pages = fetch_content_pages(url, internal_links, max_pages=max_pages_per, timeout=45) or []

                services_list = _extract_services_from_pages(pages)
                location = _extract_location_from_pages(pages)
                years = _extract_years_in_business(pages)
                team = _extract_team_size(pages)
                strengths = _competitor_strengths(pages)
                overlap = _market_overlap(our_services, services_list)

                competitor_obj = {
                    "name": d,
                    "website": url,
                    "location": location,
                    "teamSize": team,
                    "yearsInBusiness": years,
                    "services": services_list,
                    "strengthsVsYou": strengths,
                    "yourAdvantages": [],
                    "marketOverlap": overlap,
                    "source": c.get("source"),
                    "metrics": c.get("metrics") or {},
                }

                competitor_evidence["selected"].append({"domain": d, "website": url, "source": c.get("source"), "metrics": c.get("metrics") or {}})
                competitor_evidence["evidence"].append(
                    {
                        "domain": d,
                        "website": url,
                        "pages": [
                            {
                                "url": p.get("url"),
                                "title": p.get("title"),
                                "metaDescription": p.get("metaDescription"),
                                "textSnippet": p.get("textSnippet"),
                                "hasFAQ": p.get("hasFAQ"),
                                "hasPricingSignals": p.get("hasPricingSignals"),
                                "hasTestimonialsSignals": p.get("hasTestimonialsSignals"),
                                "hasCaseStudySignals": p.get("hasCaseStudySignals"),
                                "hasCTA": p.get("hasCTA"),
                                "usedJsRendering": p.get("usedJsRendering"),
                            }
                            for p in pages[:max_pages_per]
                            if isinstance(p, dict)
                        ],
                    }
                )

                competitive_analysis["competitors"].append(competitor_obj)

            except Exception as e:
                competitor_evidence["notes"].append(f"{d}: enrichment failed ({e})")

        if competitive_analysis["competitors"]:
            competitive_analysis["notes"] = "Competitors inferred and enriched (deterministic extraction + JS-aware crawl)."
        else:
            competitive_analysis["notes"] = "No competitor data was detected. Provide competitors/keywords in the form or enable DataForSEO Labs."

    except Exception as e:
        competitive_analysis["notes"] = f"Competitor enrichment failed: {e}"

    technical_seo = ensure_dict(website_section.get("technicalSEO"))
    domain_auth = ensure_dict(seo_section.get("domainAuthority"))

    # -------------------------
    # Sub-scores
    # -------------------------
    def _as_int_score(v: Any) -> int | None:
        try:
            if v is None:
                return None
            n = int(round(float(v)))
            return max(0, min(100, n))
        except Exception:
            return None

    def _reputation_subscore(rep: Dict[str, Any]) -> int | None:
        rs = rep.get("reviewScore")
        try:
            if rs in ("—", "-", None, "N/A"):
                return None
            n = float(rs)
            if n <= 0:
                return None
            return max(0, min(100, int(round((n / 5.0) * 100))))
        except Exception:
            return None

    def _leadgen_subscore(home: Dict[str, Any], lead: Dict[str, Any]) -> int | None:
        score = 50
        if home.get("contactCTA"):
            score += 20
        channels = lead.get("channels") or []
        if isinstance(channels, list):
            detected = sum(1 for c in channels if str((c or {}).get("status", "")).lower() == "detected")
            score += min(20, detected * 10)
        return max(0, min(100, int(score)))

    def _services_subscore(services: Dict[str, Any]) -> int | None:
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
        "costEfficiency": None,
    }

    overall = compute_overall(subs)

    # -------------------------
    # Executive Summary helpers (deterministic, evidence-backed)
    # -------------------------
    cq = ensure_dict(website_section.get("contentQuality"))
    cq_strengths = ensure_list(cq.get("strengths"))
    cq_gaps = ensure_list(cq.get("gaps"))

    strengths: list[str] = []
    # Website/content strengths
    for s in (cq_strengths or []):
        if isinstance(s, str) and s.strip():
            strengths.append(s.strip())
            if len(strengths) >= 5:
                break
    # Baseline homepage positives
    if homepage.get("contactCTA"):
        strengths.append("Clear call-to-action detected on homepage.")
    # DataForSEO positives (if available)
    try:
        dr = d4s_enrichment.get("domain_rank")
        if isinstance(dr, (int, float)) and dr > 0:
            strengths.append(f"Domain rank signal available (DataForSEO): {int(round(float(dr)))}.")
    except Exception:
        pass

    # Weaknesses: prefer measured issues/gaps over generic statements
    weaknesses: list[str] = []
    for it in ensure_list(technical_seo.get("issues")):
        if isinstance(it, str) and it.strip():
            weaknesses.append(it.strip())
    for it in (cq_gaps or []):
        if isinstance(it, str) and it.strip():
            weaknesses.append(it.strip())
        if len(weaknesses) >= 7:
            break

    # Biggest opportunity: pick the most material growth limiter from verified signals.
    def _pick_biggest() -> str:
        # 1) Visibility gap (low authority / few keywords)
        try:
            da_score = ensure_dict(seo_section.get("domainAuthority")).get("score")
            if isinstance(da_score, (int, float)) and float(da_score) < 35:
                return (
                    "Your biggest limiter right now is visibility. Authority signals are low compared to established competitors, "
                    "which means even a good service offer will struggle to get discovered organically. "
                    "Recommendation: build a proof-first content engine (case studies + service pages) and earn 10–30 quality referring domains."
                )
        except Exception:
            pass

        # 2) Trust gap (no/low reviews)
        try:
            rep_platforms = ensure_list(rep_section.get("platforms"))
            google_reviews = None
            google_rating = None
            for p in rep_platforms:
                if isinstance(p, dict) and (p.get("platform") or "").lower() == "google":
                    google_reviews = p.get("reviewCount")
                    google_rating = p.get("rating")
                    break
            if (google_reviews is None) or (isinstance(google_reviews, (int, float)) and float(google_reviews) < 10):
                return (
                    "Your biggest limiter right now is trust/credibility. Visitors need proof (reviews, testimonials, case studies) before they convert. "
                    "Recommendation: collect and publish 10–20 reviews, add 2–5 metric-backed case studies, and place trust assets above the fold on key pages."
                )
            if isinstance(google_rating, (int, float)) and float(google_rating) < 4.2:
                return (
                    "Your biggest limiter right now is perceived quality. A sub‑4.2 rating can suppress conversions even with good traffic. "
                    "Recommendation: respond to negatives, fix the top recurring complaint, and actively request fresh reviews from happy clients."
                )
        except Exception:
            pass

        # 3) Conversion friction (no CTA / missing contact)
        if not homepage.get("contactCTA"):
            return (
                "Your biggest limiter right now is conversion friction. People may be interested, but there isn't a clear next step to contact you or request a quote. "
                "Recommendation: add one primary CTA site-wide and a short, low-friction contact form on every key service page."
            )

        # 4) Content gaps (no services/case studies/FAQ)
        if cq_gaps:
            return (
                f"Your biggest limiter right now is content coverage. {cq_gaps[0]} "
                "Recommendation: strengthen service pages with outcomes, FAQs, and proof, then interlink them to your homepage and about page."
            )

        # 5) Default
        return (
            "Your biggest limiter right now is missing evidence/benchmark data for competitive scoring. "
            "Recommendation: keep caching enabled and connect/confirm DataForSEO + Google Places so future runs are faster and more precise."
        )

    biggest = _pick_biggest()

    # ---- Option A: deterministic plan/advantages/risks from available signals ----
    def _derive_option_a_sections() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
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

        mobile_perf = ensure_dict(ensure_dict(pagespeed.get("mobile")).get("performance")).get("score")
        desktop_perf = ensure_dict(ensure_dict(pagespeed.get("desktop")).get("performance")).get("score")
        tech_issues = ensure_list(ensure_dict(website_section.get("technicalSEO")).get("issues"))
        content_gaps = ensure_list(website_section.get("contentGaps"))
        missing_channels = ensure_list(ensure_dict(leadgen_section).get("missingHighROIChannels"))

        rep_platforms = ensure_list(rep_section.get("platforms"))
        google_rating = None
        google_reviews = None
        for p in rep_platforms:
            if isinstance(p, dict) and (p.get("platform") or "").lower() == "google":
                google_rating = p.get("rating")
                google_reviews = p.get("reviewCount")
                break

        week_by_week: list[dict[str, Any]] = []

        week_by_week.append(
            {
                "week": "Weeks 1–2",
                "focus": "Baseline & tracking setup",
                "actions": _uniq(
                    [
                        "Confirm analytics tracking (GA4) and goal/conversion events",
                        "Run PageSpeed Insights (mobile + desktop) and capture baseline metrics",
                        "Audit indexation basics (robots.txt, sitemap.xml) and fix obvious blockers",
                    ]
                ),
                "expectedOutcome": "Clear baseline KPIs and tracking so improvements can be measured.",
                "kpis": ["Core Web Vitals (LCP/CLS/INP)", "Conversion events firing", "Index coverage errors"],
            }
        )

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

        week_by_week.append(
            {
                "week": "Weeks 3–4",
                "focus": "Technical SEO & performance quick wins",
                "actions": _uniq(tech_actions),
                "expectedOutcome": "Better crawlability and faster pages, improving organic visibility and conversion rate.",
                "kpis": ["PSI performance (mobile/desktop)", "Crawl errors", "Page weight reduction"],
            }
        )

        page_actions = [
            "Ensure core pages exist and are complete (Services, About, Contact, Case Studies)",
            "Add strong CTAs above the fold and consistent contact points",
            "Add trust elements (testimonials, certifications, portfolio)",
        ]
        if content_gaps:
            page_actions.extend([f"Create/expand: {g}" for g in content_gaps[:5]])

        week_by_week.append(
            {
                "week": "Weeks 5–6",
                "focus": "Conversion-ready content & trust building",
                "actions": _uniq(page_actions),
                "expectedOutcome": "Higher enquiry/lead conversion from existing traffic.",
                "kpis": ["Form submissions", "CTA click-through", "Bounce rate on landing pages"],
            }
        )

        week_by_week.append(
            {
                "week": "Weeks 7–8",
                "focus": "SEO content plan & on-page optimisation",
                "actions": _uniq(
                    [
                        "Build a keyword-to-page mapping for priority services/locations",
                        "Publish 4–6 high-intent pages/posts based on keyword opportunities",
                        "Improve internal linking between service pages and supporting content",
                    ]
                ),
                "expectedOutcome": "More ranking pages and better topical authority.",
                "kpis": ["Ranking keyword count", "Organic impressions/clicks (if GSC connected)", "Indexed pages"],
            }
        )

        rep_actions = ["Optimise Google Business Profile and key local listings", "Set up a review request process and response SOP"]
        if google_rating is not None and google_reviews is not None:
            rep_actions.insert(0, f"Leverage existing Google rating ({google_rating}) across key pages and proposals")

        week_by_week.append(
            {
                "week": "Weeks 9–10",
                "focus": "Local visibility & reputation",
                "actions": _uniq(rep_actions),
                "expectedOutcome": "Improved local pack visibility and higher trust conversion.",
                "kpis": ["New reviews", "Local pack presence", "GBP actions (calls/website clicks)"],
            }
        )

        lg_actions = ["Launch 1–2 high-ROI acquisition channels", "Set up CRM follow-up automation and lead qualification"]
        if missing_channels:
            lg_actions.extend([f"Implement channel: {c}" for c in missing_channels[:4]])

        week_by_week.append(
            {
                "week": "Weeks 11–12",
                "focus": "Lead generation scale-up",
                "actions": _uniq(lg_actions),
                "expectedOutcome": "More consistent lead flow and faster follow-ups.",
                "kpis": ["Leads/week", "Lead-to-meeting rate", "Response time"],
            }
        )

        action_plan = {"weekByWeek": week_by_week, "kpisToTrack": [], "notes": "Generated from available crawl/speed/reputation signals (fallback)."}

        advantages: list[dict[str, Any]] = []
        if google_rating is not None and google_reviews is not None:
            advantages.append(
                {
                    "advantage": "Strong Google review profile",
                    "whyItMatters": f"Social proof improves conversion; current Google rating is {google_rating} across {google_reviews} reviews.",
                    "howToLeverage": "Show rating/review snippets on homepage and service pages; include in proposals and ads extensions.",
                }
            )
        if desktop_perf is not None and isinstance(desktop_perf, (int, float)) and desktop_perf >= 60:
            advantages.append(
                {
                    "advantage": "Decent desktop performance baseline",
                    "whyItMatters": "Faster pages help both SEO and conversion rates.",
                    "howToLeverage": "Preserve performance while adding content; monitor CWV after every release.",
                }
            )
        if links.get("site_type"):
            advantages.append(
                {
                    "advantage": "Clear site structure signals detected",
                    "whyItMatters": "A discoverable structure improves crawl efficiency and internal linking opportunities.",
                    "howToLeverage": "Create a content hub and link supporting articles into high-intent service pages.",
                }
            )

        competitive_adv = {"advantages": advantages, "uniqueAngle": None, "notes": "Generated from verified signals (fallback)."}

        risks: list[dict[str, Any]] = []
        if mobile_perf is not None and isinstance(mobile_perf, (int, float)) and mobile_perf < 70:
            risks.append(
                {
                    "risk": "Mobile performance may suppress conversions",
                    "severity": "High" if mobile_perf < 50 else "Medium",
                    "likelihood": "High",
                    "mitigation": "Optimise images/scripts, reduce render-blocking resources, and monitor CWV after fixes.",
                    "notes": f"Mobile PSI performance score observed: {mobile_perf}.",
                }
            )
        if content_gaps:
            risks.append(
                {
                    "risk": "Missing/weak core content reduces trust and ranking coverage",
                    "severity": "Medium",
                    "likelihood": "High",
                    "mitigation": "Publish complete service/location pages, add trust assets (case studies/testimonials), and strengthen internal linking.",
                    "notes": f"Detected content gaps: {', '.join([str(x) for x in content_gaps[:4]])}.",
                }
            )
        if not gsc_summary:
            risks.append(
                {
                    "risk": "Lack of Search Console data hides organic issues",
                    "severity": "Medium",
                    "likelihood": "High",
                    "mitigation": "Connect Google Search Console to monitor queries, pages, and coverage errors.",
                }
            )
        if not ensure_dict(seo_section.get("domainAuthority")).get("score"):
            risks.append(
                {
                    "risk": "Authority/competitor benchmarks are unavailable",
                    "severity": "Low",
                    "likelihood": "High",
                    "mitigation": "Connect DataForSEO Labs (domain rank + competitors) to quantify authority and competitive landscape.",
                }
            )

        risk_assessment = {"risks": risks, "compliance": [], "notes": "Generated from verified signals (fallback)."}
        return action_plan, competitive_adv, risk_assessment

    action_plan_90, competitive_adv, risk_assessment = _derive_option_a_sections()

    # -------------------------
    # Quick Wins (deterministic): prioritize fixes that improve discoverability + conversion.
    # -------------------------
    quick_wins: list[dict[str, Any]] = []

    # 1) Fix robots/sitemap blockers
    try:
        if not ensure_dict(robots_sitemap.get("robots")).get("ok"):
            quick_wins.append(
                {
                    "title": "Add robots.txt (and allow key pages to be crawled)",
                    "impact": "Improves crawlability and indexation.",
                    "time": "1–2 hrs",
                    "cost": "Low",
                    "details": "Publish robots.txt at /robots.txt and ensure it does not block important sections.",
                }
            )
        if not ensure_dict(robots_sitemap.get("sitemap")).get("ok"):
            quick_wins.append(
                {
                    "title": "Publish sitemap.xml and reference it from robots.txt",
                    "impact": "Improves crawl discovery and coverage.",
                    "time": "1–2 hrs",
                    "cost": "Low",
                    "details": "Generate sitemap.xml, host it at /sitemap.xml, and add 'Sitemap:' line into robots.txt.",
                }
            )
    except Exception:
        pass

    # 2) PageSpeed highest impact (take top opportunities if present)
    try:
        m_opps = ensure_list(ensure_dict(ensure_dict(pagespeed).get("mobile")).get("opportunities"))
        d_opps = ensure_list(ensure_dict(ensure_dict(pagespeed).get("desktop")).get("opportunities"))
        for o in (m_opps[:3] + d_opps[:2]):
            if isinstance(o, dict) and o.get("title"):
                quick_wins.append(
                    {
                        "title": f"PageSpeed quick win: {o.get('title')}",
                        "impact": "Faster load times; better conversions and CWV.",
                        "time": "2–6 hrs",
                        "cost": "Low",
                        "details": str(o.get("description") or "Implement the recommended Lighthouse opportunity.").strip(),
                    }
                )
                if len(quick_wins) >= 5:
                    break
    except Exception:
        pass

    # 3) Content proof (case studies/testimonials)
    try:
        if any("case" in (g or "").lower() for g in cq_gaps):
            quick_wins.append(
                {
                    "title": "Publish 2 case studies with metrics (before/after)",
                    "impact": "Boosts trust + improves conversion rates.",
                    "time": "4–8 hrs",
                    "cost": "Low",
                    "details": "Add structured case study pages: problem → approach → results (numbers) → testimonial.",
                }
            )
        if any("testimonial" in (g or "").lower() for g in cq_gaps):
            quick_wins.append(
                {
                    "title": "Add testimonials/reviews above the fold on key pages",
                    "impact": "Improves lead form submissions.",
                    "time": "1–3 hrs",
                    "cost": "Low",
                    "details": "Place 3–6 testimonials on homepage and each service page; link to Google reviews if available.",
                }
            )
    except Exception:
        pass

    # Cap and de-dupe
    _qw_seen: set[str] = set()
    _qw_out: list[dict[str, Any]] = []
    for q in quick_wins:
        t = str(q.get("title") or "").strip()
        if not t:
            continue
        key = t.lower()
        if key in _qw_seen:
            continue
        _qw_seen.add(key)
        _qw_out.append(q)
        if len(_qw_out) >= 5:
            break
    quick_wins = _qw_out

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
            "quickWins": quick_wins,
            "highPriorityRecommendations": [
                "Recommendation: implement the Top Immediate Actions section first (technical crawlability, speed wins, trust assets).",
                "Recommendation: keep caching enabled so reruns do not re-spend DataForSEO credits and PageSpeed calls.",
            ],
        },
        "websiteDigitalPresence": website_section,
        "seoVisibility": seo_section,
        "reputation": rep_section,
        "servicesPositioning": services_section,
        "leadGeneration": leadgen_section,
        "competitiveAnalysis": competitive_analysis,
        # Sections 8–10: scenario-based outputs are ONLY allowed when estimationMode=true.
        # Keep a schema-compliant template here so sanitize_with_template retains optional keys
        # returned by the LLM (estimationDisclaimer/confidenceScore/scenarios).
        "costOptimization": {
            "notes": "Not available: requires spend inputs (tools/payroll/ad spend) or integrations.",
            "opportunities": [],
            "estimationDisclaimer": None,
            "confidenceScore": None,
            "scenarios": [],
        },
        "targetMarket": {
            "notes": "Not available without manual input or analytics/CRM data.",
            "segments": [],
            "estimationDisclaimer": None,
            "confidenceScore": None,
            "scenarios": [],
        },
        "financialImpact": {
            "notes": "Not available without revenue/spend inputs or integrations.",
            "revenueTable": [],
            "estimationDisclaimer": None,
            "confidenceScore": None,
            "scenarios": [],
        },
        "actionPlan90Days": action_plan_90,
        "competitiveAdvantages": competitive_adv,
        "riskAssessment": risk_assessment,
        "appendices": {
            "keywords": [],
            "dataSources": [
                {"source": final_url or website, "use": "Website crawl & heuristics", "confidence": "medium"},
                {"source": ensure_dict(robots_sitemap.get("robots")).get("url"), "use": "robots.txt check", "confidence": "high"},
                {"source": ensure_dict(robots_sitemap.get("sitemap")).get("url"), "use": "sitemap.xml check", "confidence": "high"},
                {"source": final_url or website, "use": f"Link extraction (site_type={links.get('site_type')})", "confidence": "medium"},
            ],
            "dataGaps": [],
            "pagesCrawled": ensure_list(internal_links_site)[:25],
            "evidence": {
                "pagespeed": {
                    "fetchedAt": ensure_dict(pagespeed).get("fetchedAt") if isinstance(pagespeed, dict) else None,
                    "url": (ensure_dict(pagespeed).get("url") if isinstance(pagespeed, dict) else (final_url or website)),
                },
                "screenshots": screenshots_bundle,
                "extraction": {
                    "linksEngine": ensure_dict(links).get("extraction_engine"),
                    "siteType": ensure_dict(links).get("site_type"),
                    "contentPagesUsedPlaywright": any(bool(p.get("usedJsRendering")) for p in (own_pages or []) if isinstance(p, dict)),
                },
            },
        },
    }

    # ---- Data gaps
    data_gaps: list[dict[str, Any]] = []

    if not gsc_summary:
        if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
            data_gaps.append(
                {
                    "area": "Google Search Console",
                    "missing": "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set",
                    "impact": "Organic clicks/queries/pages/CTR/avg position will be unavailable.",
                    "howToFix": "Create OAuth client in Google Cloud (Web app) and set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. Also set GOOGLE_REFRESH_TOKEN.",
                }
            )
        elif not settings.GOOGLE_REFRESH_TOKEN:
            data_gaps.append(
                {
                    "area": "Google Search Console",
                    "missing": "GOOGLE_REFRESH_TOKEN not set",
                    "impact": "Cannot call Search Console API without a refresh token for offline access.",
                    "howToFix": "Generate a refresh token once via OAuth consent (offline access) and set GOOGLE_REFRESH_TOKEN in AI engine .env.",
                }
            )
        else:
            data_gaps.append(
                {
                    "area": "Google Search Console",
                    "missing": "No matching site property / access denied",
                    "impact": "Search Console metrics are not included.",
                    "howToFix": "Verify the site property exists and the OAuth user has access (URL-prefix or sc-domain). Optionally set GSC_SITE_URL to the exact property.",
                }
            )

    da_score = ensure_dict(seo_section.get("domainAuthority")).get("score") if isinstance(seo_section, dict) else None
    if da_score in (None, "—", "N/A"):
        data_gaps.append(
            {
                "area": "Backlinks & Domain Authority",
                "missing": "Third-party SEO provider not connected (Ahrefs/Semrush/Moz/DataForSEO).",
                "impact": "Authority and backlink metrics will show N/A.",
                "howToFix": "Integrate one provider (recommended: DataForSEO Backlinks + SERP + Keyword Data, or Ahrefs/Semrush/Moz).",
            }
        )

    data_gaps.append(
        {
            "area": "Cost Efficiency",
            "missing": "Ads spend + tooling costs not connected.",
            "impact": "Cost efficiency scoring and ROI estimates will show N/A.",
            "howToFix": "Integrate Google Ads API (spend/conversions) and/or add a manual cost input form for tools/payroll.",
        }
    )

    base_report["appendices"]["dataGaps"] = data_gaps

    # Attach keyword ideas (if any)
    try:
        kitems = ensure_list(d4s_enrichment.get("keywords_for_site")) if isinstance(d4s_enrichment, dict) else []
        base_report["appendices"]["keywords"] = [{"tier": "Keywords for Site (DataForSEO)", "items": kitems[:50]}] if kitems else []
        if kitems:
            base_report["appendices"]["dataSources"].append({"source": "DataForSEO Keywords Data API", "use": "Keyword ideas + basic metrics for the analyzed site", "confidence": "Medium"})
    except Exception:
        pass

    llm_context = {
        "companyName": company,
        "website": final_url or website,
        "homepage": homepage,
        "robotsSitemap": robots_sitemap,
        "pagespeed": pagespeed,
        "links": links,
        "reviewStatuses": ensure_dict(reviews_scraped.get("statuses")),
        "reviewSummary": ensure_dict(reviews_scraped.get("summary")),
        "googlePlaces": ensure_dict(google_places_bundle) if google_places_bundle else {},
        "subScores": subs,
        "dataSources": base_report["appendices"]["dataSources"],
        "dataGaps": base_report["appendices"]["dataGaps"],
        "competitiveAnalysisSeed": competitive_analysis,
        "competitorsEnrichment": competitor_evidence,

        # Extra evidence for mentor-style, specific recommendations
        "contentPages": own_pages[:12],
        "servicesSignals": services_section,
        "leadGenSignals": leadgen_section,
        "websiteSignals": website_section,
        "seoSignals": seo_section,
        "reputationSignals": rep_section,
        "dataforseo": d4s_enrichment,

        # Estimation mode (Sections 8–10)
        # When disabled, the LLM must not model costs/revenue; we enforce that again after merge.
        "estimationMode": bool(getattr(payload, "estimationMode", False)),
        "estimationInputs": (
            # Pydantic v2: model_dump(); v1: dict()
            (getattr(payload, "estimationInputs", None).model_dump()  # type: ignore[attr-defined]
             if hasattr(getattr(payload, "estimationInputs", None), "model_dump")
             else getattr(payload, "estimationInputs", None).dict())
            if getattr(payload, "estimationInputs", None) is not None
            else None
        ),
    }

    try:
        llm_report = build_report_with_llm(base_report, llm_context)
    except Exception:
        llm_report = None

    llm_report = ensure_dict(llm_report)
    merged = sanitize_with_template(base_report, llm_report)
    merged = patch_required_metadata(merged, base_report)

    # ---- Safety gate for Sections 8–10
    # Even if the LLM returns something unexpected, only allow scenario-based outputs for
    # sections 8–10 when estimationMode is explicitly enabled.
    if not bool(getattr(payload, "estimationMode", False)):
        merged["costOptimization"] = base_report.get("costOptimization")
        merged["targetMarket"] = base_report.get("targetMarket")
        merged["financialImpact"] = base_report.get("financialImpact")

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
            "googlePlacesCompanyRating": ensure_dict((google_places_bundle or {}).get("company")).get("rating") if google_places_bundle else None,
            "googlePlacesCompanyTotal": ensure_dict((google_places_bundle or {}).get("company")).get("user_ratings_total") if google_places_bundle else None,
            "linkExtraction": {
                "siteType": links.get("site_type"),
                "totalInternalLinks": links.get("total_internal_links"),
                "engine": links.get("extraction_engine"),
            },
        },
    }

    return AnalyzeResponse(ok=True, token=token, reportId=report_id, reportJson=merged, meta=meta)
