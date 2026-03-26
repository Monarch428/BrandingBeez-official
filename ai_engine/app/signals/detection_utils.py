from __future__ import annotations

from typing import Any, Iterable, List
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


def detect_services(html: str, text: str) -> List[str]:
    combined = " ".join(
        part for part in (_extract_html_text(html), _normalize_text(text)) if part
    )
    return _match_patterns(combined, SERVICE_PATTERNS)


def detect_cta(text: str) -> List[str]:
    return _match_patterns(text, CTA_PATTERNS)


def detect_testimonials(text: str) -> List[str]:
    return _match_patterns(text, TESTIMONIAL_PATTERNS)


def detect_case_studies(data: Any) -> List[str]:
    return _match_patterns(_normalize_text(data), CASE_STUDY_PATTERNS)


def has_generic_service_cues(html: str, text: str) -> bool:
    combined = " ".join(
        part for part in (_extract_html_text(html), _normalize_text(text)) if part
    ).lower()
    return any(cue in combined for cue in GENERIC_SERVICE_CUES)
