from __future__ import annotations

from typing import Any, Dict, List
import re

def _norm_text(s: Any) -> str:
    return (s or "").strip().lower() if isinstance(s, str) else ""

# Common marketing/agency service keywords -> canonical service name
SERVICE_MAP = [
    (r"\bseo\b|search engine optimization", "SEO"),
    (r"\bppc\b|pay per click|google ads|adwords", "PPC / Google Ads"),
    (r"\bsocial media\b|facebook ads|instagram ads|tiktok ads|linkedin ads", "Social Media Marketing"),
    (r"\bweb design\b|website design|ui/ux|ux design|web development|website development", "Web Design & Development"),
    (r"\bbranding\b|brand identity|logo design", "Branding & Identity"),
    (r"\bcontent marketing\b|copywriting|blog writing|content strategy", "Content Marketing"),
    (r"\bemail marketing\b|newsletter|klaviyo|mailchimp", "Email Marketing"),
    (r"\bconversion\b|cro\b|conversion rate optimization|landing page", "Conversion Rate Optimisation"),
    (r"\bcrm\b|hubspot|salesforce|marketing automation", "CRM & Automation"),
    (r"\bvideo\b|videography|motion graphics|animation", "Video & Creative Production"),
    (r"\bgraphic design\b|design studio|creative studio", "Graphic Design"),
    (r"\bpr\b|public relations", "PR"),
]

INDUSTRY_KEYWORDS = [
    (r"\becommerce\b|shopify|woocommerce", "Ecommerce"),
    (r"\bsaas\b|software", "SaaS"),
    (r"\bhealth\b|clinic|medical|dental", "Healthcare"),
    (r"\bestate\b|property|realtor", "Real Estate"),
    (r"\bfinance\b|bank|insurance", "Finance"),
    (r"\beducation\b|school|university|training", "Education"),
    (r"\bhospitality\b|hotel|restaurant", "Hospitality"),
    (r"\bconstruction\b|builder", "Construction"),
    (r"\blegal\b|law firm|solicitor", "Legal"),
    (r"\bmanufactur", "Manufacturing"),
]

def _extract_services_from_text(text: str) -> List[str]:
    found: List[str] = []
    t = text.lower()
    for pat, name in SERVICE_MAP:
        if re.search(pat, t, re.IGNORECASE):
            found.append(name)
    # de-dup while preserving order
    out: List[str] = []
    seen = set()
    for s in found:
        k = s.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(s)
    return out

def _extract_industries_from_text(text: str) -> List[str]:
    found: List[str] = []
    t = text.lower()
    for pat, name in INDUSTRY_KEYWORDS:
        if re.search(pat, t, re.IGNORECASE):
            found.append(name)
    out: List[str] = []
    seen = set()
    for s in found:
        k = s.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(s)
    return out

def build_services_signals(homepage: Dict[str, Any] | None = None, pages: List[Dict[str, Any]] | None = None, scraped_services: List[Dict[str, Any]] | None = None) -> Dict[str, Any]:
    """
    Deterministic, best-effort services extraction using already-fetched content pages.
    This avoids empty 'Services' section in the PDF when the LLM is conservative.
    """
    homepage = homepage or {}
    pages = pages or []
    scraped_services = scraped_services or []

    # Combine evidence text
    chunks: List[str] = []
    if isinstance(homepage.get("title"), str):
        chunks.append(homepage.get("title"))
    if isinstance(homepage.get("metaDescription"), str):
        chunks.append(homepage.get("metaDescription"))

    for p in pages:
        if not isinstance(p, dict):
            continue
        for k in ("title", "metaDescription", "textSnippet"):
            if isinstance(p.get(k), str) and p.get(k).strip():
                chunks.append(p.get(k))

    # Optional: richer scraper output (service cards/pages)
    if scraped_services:
        try:
            for s in scraped_services:
                if not isinstance(s, dict):
                    continue
                name = (s.get("name") or "").strip()
                desc = (s.get("description") or "").strip() if isinstance(s.get("description"), str) else ""
                if name:
                    chunks.append(name)
                if desc:
                    chunks.append(desc)
        except Exception:
            pass

    evidence = "\n".join(chunks)
    services = _extract_services_from_text(evidence)
    industries = _extract_industries_from_text(evidence)

    # Create list objects for PDF (name/description/targetMarket)
    services_list: List[Dict[str, Any]] = []

    # Prefer structured scraped services (if available)
    if scraped_services:
        for s in scraped_services:
            if not isinstance(s, dict):
                continue
            name = (s.get("name") or "").strip()
            if not name:
                continue
            services_list.append({
                "name": name,
                "startingPrice": None,
                "targetMarket": None,
                "description": (s.get("description") or None),
                "url": s.get("url") or None,
                "source": s.get("source") or None,
            })

    # Add regex-detected services (avoid duplicates)
    existing = { (x.get("name") or "").strip().lower() for x in services_list if isinstance(x, dict) }
    for s in services:
        key = (s or "").strip().lower()
        if not key or key in existing:
            continue
        existing.add(key)
        services_list.append({"name": s, "startingPrice": None, "targetMarket": None, "description": None})


    # Service gaps: compare against a baseline checklist for agencies
    baseline = [
        "SEO",
        "PPC / Google Ads",
        "Social Media Marketing",
        "Web Design & Development",
        "Content Marketing",
        "Conversion Rate Optimisation",
    ]
    gaps = [s for s in baseline if s not in services]

    positioning_statement = None
    if isinstance(homepage.get("metaDescription"), str) and homepage.get("metaDescription").strip():
        positioning_statement = homepage.get("metaDescription").strip()
    elif isinstance(homepage.get("title"), str) and homepage.get("title").strip():
        positioning_statement = homepage.get("title").strip()

    return {
        "services": services_list,
        "serviceGaps": gaps,
        "industriesServed": {
            "current": industries,
            "concentrationNote": None,
            "highValueIndustries": [],
        },
        "positioning": {
            "currentStatement": positioning_statement or "N/A",
            "competitorComparison": "N/A",
            "differentiation": "N/A",
        },
        "notes": "Generated from on-site content evidence (deterministic extractor).",
    }
