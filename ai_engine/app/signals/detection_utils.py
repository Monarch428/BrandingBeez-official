from __future__ import annotations

from typing import Any, Dict, Iterable, List
import re

from bs4 import BeautifulSoup


SERVICE_PATTERNS: list[tuple[str, str]] = [
    (r"\bseo\b|search engine optimization|technical seo|local seo", "SEO"),
    (r"\bppc\b|pay per click|google ads|adwords|paid search", "PPC / Google Ads"),
    (r"\bsocial media\b|facebook ads|instagram ads|linkedin ads|tiktok ads", "Social Media Marketing"),
    (r"\bweb development\b|\bwebsite development\b|\bweb design\b|\bwebsite design\b|\bui/?ux\b", "Web Design & Development"),
    (r"\bbranding\b|brand identity|logo design", "Branding & Identity"),
    (r"\bcontent marketing\b|copywriting|blog writing|content strategy", "Content Marketing"),
    (r"\bemail marketing\b|newsletter marketing|mailchimp|klaviyo", "Email Marketing"),
    (r"\bcro\b|conversion rate optimization|landing page optimization", "Conversion Rate Optimisation"),
    (r"\bcrm\b|hubspot|salesforce|marketing automation", "CRM & Automation"),
    (r"\bvideo\b|videography|motion graphics|animation", "Video & Creative Production"),
    (r"\bgraphic design\b|creative studio", "Graphic Design"),
]

CTA_PATTERNS: list[tuple[str, str]] = [
    (r"\bbook(?:\s+(?:a|your))?\s+(?:call|consultation|demo|meeting)\b", "Book Call"),
    (r"\bschedule(?:\s+(?:a|your))?\s+(?:call|consultation|demo|meeting)\b", "Schedule Call"),
    (r"\bget started\b|\bstart your project\b|\blet'?s get started\b", "Get Started"),
    (r"\bhire(?:\s+us)?\b|\bwork with us\b", "Hire Us"),
    (r"\bcontact(?:\s+us)?\b|\bget in touch\b|\btalk to us\b|\bspeak to\b", "Contact Us"),
    (r"\brequest(?:\s+a)?\s+(?:quote|proposal|audit)\b|\bfree audit\b", "Request Proposal"),
    (r"\bcall now\b|\bbook now\b|\bbook today\b", "Book Now"),
]

TESTIMONIAL_PATTERNS: list[tuple[str, str]] = [
    (r"\btestimonial(?:s)?\b", "Testimonials"),
    (r"\bclient review(?:s)?\b|\bcustomer review(?:s)?\b|\breview(?:s)?\b", "Client Reviews"),
    (r"\bwhat our clients say\b|\bwhat clients say\b|\bkind words\b", "What Our Clients Say"),
    (r"\bsuccess stor(?:y|ies)\b", "Success Stories"),
    (r"\btrusted by\b|\bhappy client(?:s)?\b", "Trusted By"),
]

CASE_STUDY_PATTERNS: list[tuple[str, str]] = [
    (r"\bcase stud(?:y|ies)\b", "Case Studies"),
    (r"\bportfolio\b|\bour work\b|\bwork examples\b", "Portfolio"),
    (r"\bproject(?:s)?\b|\bclient work\b", "Projects"),
    (r"\bsuccess stor(?:y|ies)\b|\bresults\b", "Success Stories"),
]

GENERIC_SERVICE_CUES = (
    "services",
    "service",
    "solutions",
    "what we do",
    "capabilities",
    "our offer",
    "how we help",
)

CONTENT_URL_TOKENS = (
    "/blog",
    "/article",
    "/articles",
    "/insights",
    "/resources",
    "/news",
    "/guides",
)

SERVICE_URL_TOKENS = (
    "/services",
    "/service",
    "/solutions",
    "/capabilities",
    "/contact",
    "/book",
    "/quote",
    "/consult",
)

ECOMMERCE_URL_TOKENS = (
    "/shop",
    "/store",
    "/product",
    "/products",
    "/collections",
    "/cart",
    "/checkout",
)

ECOMMERCE_TEXT_TOKENS = (
    "add to cart",
    "buy now",
    "cart",
    "checkout",
    "collections",
    "shipping",
    "returns",
    "sku",
)

CONTENT_TEXT_TOKENS = (
    "blog",
    "insights",
    "newsletter",
    "subscribe",
    "resources",
    "article",
    "editorial",
)

TRUST_SIGNAL_PATTERNS: list[tuple[str, str]] = [
    (r"\btrusted by\b", "Trusted By"),
    (r"\bpartner agenc(?:y|ies)\b|\bpartners?\b", "Partner Agencies"),
    (r"\baward(?:s)?\b|\bcertified\b|\baccredited\b", "Awards / Certifications"),
    (r"\bclient logos?\b|\bbrands? we work with\b", "Client Logos"),
]

# -----------------------------------------------------------------------
# NON-SERVICE REJECTION PATTERNS
# Any candidate service name matching these is discarded — it is a heading,
# slogan, CTA, FAQ item, package label, case-study name, or step label,
# NOT a real service offering.
# -----------------------------------------------------------------------
_NON_SERVICE_REJECT: list[re.Pattern] = [
    # FAQ / question blocks
    re.compile(r"^(faq|faqs|frequently asked|what is |why |how |when |where |who |can i |do you |is it |will you )", re.IGNORECASE),
    # CTA / action phrases
    re.compile(r"\b(ready to|get started|let's|contact us|book a|schedule a|talk to|speak to|request a|sign up|start now|learn more|find out|click here|discover|explore|try for free|free trial|transform your|scale your|grow your)\b", re.IGNORECASE),
    # Pricing / package tier labels (standalone)
    re.compile(r"^(starter|growth|scale|pro|enterprise|basic|standard|premium|elite|platinum|gold|silver|bronze|most popular|best value|what'?s included|loyalty points|points system)$", re.IGNORECASE),
    # Numbered / labelled process steps
    re.compile(r"^(\d+[\.\)]\s+|step\s+\d+[\.:]\s*)", re.IGNORECASE),
    # Client / company names without a service word
    re.compile(r"^[A-Z][a-z]+ (Solicitors|Therapy|Ltd|Inc|LLC|Co\.|Group|Studios?|Media|Law|Rooms?|Dogs?|Ironing|Bubbles|Elite|Losers|Abroad)$"),
    # Slogans / brand taglines
    re.compile(r"\b(driving digital|digital success|innovation[s]?|quality excellence|our mission|our vision|who we are|about us|meet your|meet the team|unlock opportunit|build real|stay ready|everyday language|smart content setup|focus on what|stay up to date|ai search is)\b", re.IGNORECASE),
    # Pricing / package section headings
    re.compile(r"(our flexible pricing|pricing &|loyalty points|points system|our packages|&amp; packages)", re.IGNORECASE),
    # Review / testimonial section labels
    re.compile(r"(what our clients|our client reviews|what .{0,20} say|testimonials|review(s)? about)", re.IGNORECASE),
    # Stats / social proof labels
    re.compile(r"(stats\.|statistics|awards|certifications|our numbers|results we.ve|social land stats)", re.IGNORECASE),
    # Free resource labels
    re.compile(r"(free stuff|free ebook|free guide|free download|resources|get your free)", re.IGNORECASE),
    # Navigation items only
    re.compile(r"^(home|about|contact|blog|news|insights|resources|portfolio|our work|projects|gallery|media|press|packages|pricing|faq|testimonials|reviews|team|careers|jobs)$", re.IGNORECASE),
    # Generic headings that are section dividers, not services
    re.compile(r"^(more clicks|more leads|why choose|why we|what we do best|what can we help|our new|our services that|our services &|our services built|choose your services|execution by|continuous growth|what is answer engine|aeo work for you|builds your reputation|a step-by-step|answer engine optimisation essex|answer engine optimisation services)$", re.IGNORECASE),
    # Case-study titles / campaign result headlines
    re.compile(r"(generates?\s+\d|hits?\s+\d+[km]|drives?\s+\d+[km]|impressions|conversions with|high.?impact|high.?engagement)", re.IGNORECASE),
]

_MIN_SERVICE_NAME_LEN = 4
_MAX_SERVICE_NAME_LEN = 65


def is_non_service_text(text: str) -> bool:
    """Return True if `text` looks like a non-service heading, label, or slogan."""
    if not isinstance(text, str):
        return True
    cleaned = text.strip()
    if len(cleaned) < _MIN_SERVICE_NAME_LEN:
        return True
    if len(cleaned) > _MAX_SERVICE_NAME_LEN:
        return True
    for pattern in _NON_SERVICE_REJECT:
        if pattern.search(cleaned):
            return True
    return False


def deduplicate_list_preserve_order(items: Iterable[Any]) -> List[Any]:
    out: List[Any] = []
    seen: set[str] = set()
    for item in items or []:
        if item is None:
            continue
        if isinstance(item, str):
            value = re.sub(r"\s+", " ", item).strip()
            if not value:
                continue
            key = value.lower()
        else:
            value = item
            key = repr(item)
        if key in seen:
            continue
        seen.add(key)
        out.append(value)
    return out


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value).strip()
    if isinstance(value, (list, tuple, set)):
        return " ".join([_normalize_text(v) for v in value if _normalize_text(v)])
    if isinstance(value, dict):
        parts: list[str] = []
        for v in value.values():
            t = _normalize_text(v)
            if t:
                parts.append(t)
        return " ".join(parts)
    return str(value).strip()


def _extract_html_text(html: str) -> str:
    if not isinstance(html, str) or not html.strip():
        return ""
    soup = BeautifulSoup(html, "html.parser")
    texts: list[str] = []

    for selector in ("h1", "h2", "h3", "nav a", "header a", "section", "button", "a", "[aria-label]"):
        for node in soup.select(selector):
            text = _normalize_text(node.get_text(" ", strip=True))
            if text:
                texts.append(text)
            aria = _normalize_text(node.get("aria-label"))
            if aria:
                texts.append(aria)
            title = _normalize_text(node.get("title"))
            if title:
                texts.append(title)

    return " ".join(deduplicate_list_preserve_order(texts))


def _match_patterns(text: str, patterns: list[tuple[str, str]]) -> List[str]:
    haystack = _normalize_text(text).lower()
    if not haystack:
        return []
    found: list[str] = []
    for pattern, label in patterns:
        if re.search(pattern, haystack, re.IGNORECASE):
            found.append(label)
    return deduplicate_list_preserve_order(found)


def _collect_signal_text(*parts: Any) -> str:
    chunks: list[str] = []
    for part in parts:
        normalized = _normalize_text(part)
        if normalized:
            chunks.append(normalized)
    return " ".join(chunks).strip()


def _extract_candidate_urls(data: Any) -> List[str]:
    urls: List[str] = []
    if isinstance(data, dict):
        for key, value in data.items():
            if key in {"url", "website", "link", "href"} and isinstance(value, str):
                urls.append(value)
            elif key in {"internal_links", "pages", "crawl_pages", "service_candidates"} and isinstance(value, list):
                for item in value:
                    urls.extend(_extract_candidate_urls(item))
            elif isinstance(value, (dict, list)):
                urls.extend(_extract_candidate_urls(value))
    elif isinstance(data, list):
        for item in data:
            urls.extend(_extract_candidate_urls(item))
    elif isinstance(data, str) and data.startswith(("http://", "https://", "/")):
        urls.append(data)
    return deduplicate_list_preserve_order([u for u in urls if isinstance(u, str) and u.strip()])


def detect_services(html: str, text: str, screenshots_text: Any = None) -> List[str]:
    combined = _collect_signal_text(_extract_html_text(html), text, screenshots_text)
    return _match_patterns(combined, SERVICE_PATTERNS)


def detect_cta(text: str, extra_text: Any = None) -> List[str]:
    return _match_patterns(_collect_signal_text(text, extra_text), CTA_PATTERNS)


def detect_testimonials(text: str, extra_text: Any = None) -> List[str]:
    return _match_patterns(_collect_signal_text(text, extra_text), TESTIMONIAL_PATTERNS)


def detect_case_studies(data: Any, page_registry: Any = None) -> List[str]:
    return _match_patterns(_collect_signal_text(data, page_registry), CASE_STUDY_PATTERNS)


def detect_site_proof_signals(text: Any, page_registry: Any = None) -> Dict[str, Any]:
    evidence = _collect_signal_text(text, page_registry)
    testimonials = detect_testimonials(evidence)
    case_studies = detect_case_studies(evidence)
    trust_signals = _match_patterns(evidence, TRUST_SIGNAL_PATTERNS)
    total_hits = len(testimonials) + len(case_studies) + len(trust_signals)
    confidence = "strong" if total_hits >= 4 else "medium" if total_hits >= 2 else "weak" if total_hits == 1 else "none"
    return {
        "testimonials": testimonials,
        "caseStudies": case_studies,
        "trustSignals": trust_signals,
        "confidence": confidence,
    }


def score_site_type_signals(data: Any) -> Dict[str, int]:
    """Return additive signal scores for site-type classification."""
    text_blob = _collect_signal_text(data).lower()
    urls = [u.lower() for u in _extract_candidate_urls(data)]

    content_urls = sum(1 for u in urls if any(token in u for token in CONTENT_URL_TOKENS))
    service_urls = sum(1 for u in urls if any(token in u for token in SERVICE_URL_TOKENS))
    ecommerce_urls = sum(1 for u in urls if any(token in u for token in ECOMMERCE_URL_TOKENS))

    article_density = len(re.findall(r"\b(blog|article|guide|resource|news|insight|editorial)\b", text_blob))
    service_density = len(detect_services("", text_blob))
    cta_density = len(detect_cta(text_blob))
    pricing_hits = len(re.findall(r"\b(price|pricing|package|quote|proposal|book a call|consultation)\b", text_blob))
    form_hits = len(re.findall(r"\b(contact us|get in touch|request a quote|request proposal|book call|schedule call)\b", text_blob))
    product_hits = len(re.findall(r"\b(product|category|catalog|cart|checkout|sku|shipping|buy now|add to cart)\b", text_blob))

    content_score = (content_urls * 3) + sum(1 for token in CONTENT_TEXT_TOKENS if token in text_blob) + min(8, article_density)
    service_score = (service_urls * 3) + service_density + (cta_density * 2) + pricing_hits + form_hits + (2 if has_generic_service_cues("", text_blob) else 0)
    ecommerce_score = (ecommerce_urls * 3) + sum(1 for token in ECOMMERCE_TEXT_TOKENS if token in text_blob) + min(8, product_hits)

    return {
        "content_site": content_score,
        "service_business": service_score,
        "ecommerce": ecommerce_score,
        "content_urls": content_urls,
        "service_urls": service_urls,
        "ecommerce_urls": ecommerce_urls,
        "article_density": article_density,
        "service_density": service_density,
        "cta_density": cta_density,
        "pricing_hits": pricing_hits,
        "form_hits": form_hits,
        "product_hits": product_hits,
    }


def classify_site_context(scores: Dict[str, int]) -> str:
    """Map site-type scores to one of the allowed output classes."""
    content_score = int(scores.get("content_site") or 0)
    service_score = int(scores.get("service_business") or 0)
    ecommerce_score = int(scores.get("ecommerce") or 0)

    ranked = sorted(
        [
            ("content_site", content_score),
            ("service_business", service_score),
            ("ecommerce", ecommerce_score),
        ],
        key=lambda item: item[1],
        reverse=True,
    )
    top_type, top_score = ranked[0]
    second_score = ranked[1][1]

    if top_score < 3:
        return "mixed"

    if top_type == "content_site":
        if content_score >= max(service_score + 3, ecommerce_score + 3):
            return "content_site"
        if scores.get("article_density", 0) >= max(6, scores.get("service_density", 0) + 2) and scores.get("content_urls", 0) >= max(2, scores.get("service_urls", 0)):
            return "content_site"

    if top_type == "ecommerce" and ecommerce_score >= max(content_score + 2, service_score + 2):
        return "ecommerce"

    if top_type == "service_business":
        if service_score >= max(content_score + 2, ecommerce_score + 2):
            return "service_business"
        if scores.get("service_urls", 0) >= max(2, scores.get("content_urls", 0)) and (scores.get("cta_density", 0) + scores.get("pricing_hits", 0) + scores.get("form_hits", 0)) >= 3:
            return "service_business"

    if abs(top_score - second_score) <= 2:
        return "mixed"

    return top_type


def detect_site_type(data: Any) -> str:
    """Classify business-model intent for downstream reporting."""
    scores = score_site_type_signals(data)
    return classify_site_context(scores)


def has_generic_service_cues(html: str, text: str) -> bool:
    combined = " ".join(
        part for part in (_extract_html_text(html), _normalize_text(text)) if part
    ).lower()
    return any(cue in combined for cue in GENERIC_SERVICE_CUES)
