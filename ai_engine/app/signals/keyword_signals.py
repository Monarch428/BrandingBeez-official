from __future__ import annotations

from collections import Counter
from typing import Any, Dict, Iterable, List, Tuple
import re

from app.signals.detection_utils import deduplicate_list_preserve_order


STOPWORDS = {
    "the", "and", "for", "with", "from", "your", "our", "you", "a", "an", "to", "of",
    "in", "on", "at", "by", "is", "are", "be", "we", "it", "this", "that", "as", "or",
    "home", "page", "official", "welcome", "best", "top", "more", "all",
}

COMMERCIAL_TOKENS = {
    "service", "services", "agency", "company", "hire", "pricing", "quote", "consultation",
    "consultant", "near me", "cost", "package", "solution", "solutions", "developer", "design",
}
INFO_TOKENS = {
    "how", "guide", "tips", "what is", "why", "learn", "tutorial", "checklist", "best practices",
    "resource", "resources", "blog", "insights",
}
NAV_TOKENS = {"about", "contact", "login", "book", "schedule", "call", "demo"}
ECOMMERCE_TOKENS = {"shop", "store", "product", "products", "collection", "collections", "buy", "cart", "checkout"}


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value).strip().lower()
    if isinstance(value, list):
        return " ".join(_normalize_text(item) for item in value if _normalize_text(item))
    if isinstance(value, dict):
        return " ".join(_normalize_text(item) for item in value.values() if _normalize_text(item))
    return re.sub(r"\s+", " ", str(value)).strip().lower()


def _tokens(text: str) -> List[str]:
    return [token for token in re.split(r"[^a-z0-9]+", _normalize_text(text)) if token and token not in STOPWORDS]


def _slug_tokens(url: str) -> List[str]:
    cleaned = str(url or "").lower()
    cleaned = cleaned.replace("http://", "").replace("https://", "")
    return _tokens(cleaned.replace("/", " ").replace("-", " "))


def _ngrams(tokens: List[str], max_n: int = 3) -> List[str]:
    phrases: List[str] = []
    for n in (3, 2, 1):
        if n > max_n:
            continue
        for idx in range(0, max(0, len(tokens) - n + 1)):
            chunk = tokens[idx : idx + n]
            if not chunk or all(token in STOPWORDS for token in chunk):
                continue
            phrases.append(" ".join(chunk))
    return phrases


def _contains_phrase(text: str, phrase: str) -> bool:
    hay = f" {_normalize_text(text)} "
    needle = f" {_normalize_text(phrase)} "
    return bool(needle.strip()) and needle in hay


def _important_pages(page_registry: Any, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    selected = [page for page in pages if isinstance(page, dict)]
    if selected:
        return selected
    if isinstance(page_registry, dict):
        out: List[Dict[str, Any]] = []
        raw_pages = page_registry.get("pages")
        if isinstance(raw_pages, dict):
            for key, value in raw_pages.items():
                if isinstance(value, dict):
                    out.append({"url": key, **value})
        return out
    return []


def extract_keyword_candidates(
    text_blocks: Iterable[Any],
    titles: Iterable[Any],
    headings: Iterable[Any],
    urls: Iterable[Any],
) -> List[str]:
    candidates: List[str] = []

    for source in list(titles) + list(headings):
        text = _normalize_text(source)
        if not text:
            continue
        candidates.extend(_ngrams(_tokens(text), max_n=3))

    for source in urls:
        url = str(source or "").strip()
        if not url:
            continue
        candidates.extend(_ngrams(_slug_tokens(url), max_n=3))

    body_counter: Counter[str] = Counter()
    for block in text_blocks:
        words = _tokens(_normalize_text(block))
        body_counter.update([word for word in words if len(word) >= 4])

    candidates.extend([term for term, count in body_counter.most_common(20) if count >= 2])
    candidates = [candidate for candidate in candidates if candidate and len(candidate) >= 3]
    return deduplicate_list_preserve_order(candidates)[:40]


def classify_keyword_intent(keyword: str) -> str:
    phrase = _normalize_text(keyword)
    if not phrase:
        return "unknown"
    if any(token in phrase for token in COMMERCIAL_TOKENS | ECOMMERCE_TOKENS):
        return "commercial"
    if any(token in phrase for token in INFO_TOKENS):
        return "informational"
    if any(token in phrase for token in NAV_TOKENS):
        return "navigational"
    return "commercial" if len(phrase.split()) <= 2 else "informational"


def score_keyword_presence(page_data: Dict[str, Any], keyword_candidates: List[str]) -> Tuple[int, List[str]]:
    title = _normalize_text(page_data.get("title"))
    meta = _normalize_text(page_data.get("metaDescription"))
    h1 = _normalize_text(page_data.get("h1") or page_data.get("firstH1"))
    headings = _normalize_text(page_data.get("headings"))
    body = _normalize_text(page_data.get("text") or page_data.get("textSnippet"))
    url = _normalize_text(page_data.get("url"))

    primary_keywords = keyword_candidates[:8]
    gaps: List[str] = []
    score = 0.0

    if any(_contains_phrase(title, keyword) for keyword in primary_keywords):
        score += 25
    else:
        gaps.append("Core keyword alignment is weak in the page title.")

    if any(_contains_phrase(meta, keyword) for keyword in primary_keywords):
        score += 20
    else:
        gaps.append("Meta description does not clearly reinforce the main keyword theme.")

    if h1:
        if any(_contains_phrase(h1, keyword) for keyword in primary_keywords):
            score += 20
        else:
            gaps.append("Homepage H1 does not align with the strongest keyword theme.")
    else:
        gaps.append("Homepage H1 is missing, reducing keyword clarity.")

    if any(_contains_phrase(headings, keyword) for keyword in primary_keywords):
        score += 15
    else:
        gaps.append("Supporting headings do not reinforce the main keyword cluster.")

    if any(_contains_phrase(body, keyword) for keyword in primary_keywords):
        score += 10
    else:
        gaps.append("Body copy is light on the main target keyword cluster.")

    if any(_contains_phrase(url, keyword) for keyword in primary_keywords):
        score += 10

    repeated_hits = 0
    for keyword in primary_keywords[:5]:
        repeated_hits = max(repeated_hits, len(re.findall(re.escape(keyword), body)))
    if repeated_hits >= 8:
        score -= 10
        gaps.append("Keyword repetition appears concentrated and may read unnaturally.")

    return max(0, min(100, int(round(score)))), deduplicate_list_preserve_order(gaps)[:4]


def score_keyword_coverage(site_data: Dict[str, Any], keyword_candidates: List[str]) -> Tuple[int, List[str]]:
    pages = _important_pages(site_data.get("page_registry"), site_data.get("pages", []))
    if not pages:
        pages = [site_data.get("homepage", {})]
    coverage_hits = 0
    missing: List[str] = []
    target_keywords = keyword_candidates[:12]

    for keyword in target_keywords:
        keyword_found = False
        for page in pages:
            text_blob = _normalize_text(
                [
                    page.get("title"),
                    page.get("h1"),
                    page.get("firstH1"),
                    page.get("metaDescription"),
                    page.get("text"),
                    page.get("textSnippet"),
                    page.get("url"),
                ]
            )
            if _contains_phrase(text_blob, keyword):
                keyword_found = True
                break
        if keyword_found:
            coverage_hits += 1
        else:
            missing.append(keyword)

    ratio = (coverage_hits / max(1, len(target_keywords))) * 100
    return max(0, min(100, int(round(ratio)))), deduplicate_list_preserve_order(missing)[:5]


def score_keyword_relevance(site_type: str, services: List[str], keyword_candidates: List[str]) -> Tuple[int, List[str]]:
    expected = set()
    site_type = (site_type or "mixed").strip().lower()
    if site_type == "service_business":
        expected |= COMMERCIAL_TOKENS
    elif site_type == "content_site":
        expected |= INFO_TOKENS
    elif site_type == "ecommerce":
        expected |= ECOMMERCE_TOKENS | COMMERCIAL_TOKENS
    else:
        expected |= COMMERCIAL_TOKENS | INFO_TOKENS

    service_terms = {_normalize_text(service) for service in services if _normalize_text(service)}
    relevant = 0
    weak: List[str] = []
    for keyword in keyword_candidates[:12]:
        phrase = _normalize_text(keyword)
        if any(token in phrase for token in expected) or any(service in phrase for service in service_terms):
            relevant += 1
        else:
            weak.append(keyword)

    score = (relevant / max(1, min(12, len(keyword_candidates)))) * 100
    return max(0, min(100, int(round(score)))), deduplicate_list_preserve_order(weak)[:4]


def score_keyword_distribution(page_registry: Any, keyword_candidates: List[str]) -> Tuple[int, List[str]]:
    pages = _important_pages(page_registry, page_registry if isinstance(page_registry, list) else [])
    if not pages:
        return 40, ["Page-level keyword distribution could not be verified from the current crawl."]

    page_hit_counts: List[int] = []
    empty_pages = 0
    total_hits = 0
    for page in pages[:12]:
        text_blob = _normalize_text(
            [
                page.get("url"),
                page.get("title"),
                page.get("h1"),
                page.get("firstH1"),
                page.get("metaDescription"),
                page.get("text"),
                page.get("textSnippet"),
            ]
        )
        hits = sum(1 for keyword in keyword_candidates[:10] if _contains_phrase(text_blob, keyword))
        page_hit_counts.append(hits)
        total_hits += hits
        if hits == 0:
            empty_pages += 1

    covered_pages = sum(1 for hits in page_hit_counts if hits > 0)
    coverage_ratio = covered_pages / max(1, len(page_hit_counts))
    concentration_ratio = (max(page_hit_counts) / max(1, total_hits)) if total_hits else 1.0
    stuffing_penalty = 15 if concentration_ratio > 0.7 and total_hits >= 5 else 0
    score = (coverage_ratio * 100) - stuffing_penalty - min(20, empty_pages * 5)

    gaps: List[str] = []
    if empty_pages:
        gaps.append("Important pages are missing keyword alignment.")
    if stuffing_penalty:
        gaps.append("Keywords appear too concentrated on a small number of pages.")
    return max(0, min(100, int(round(score)))), gaps


def compute_website_keyword_score(
    *,
    homepage: Dict[str, Any],
    pages: List[Dict[str, Any]],
    services: List[str],
    site_type: str,
    keyword_sources: Dict[str, Any] | None = None,
    page_registry: Any = None,
) -> Dict[str, Any]:
    keyword_sources = keyword_sources or {}

    titles = [homepage.get("title")] + [page.get("title") for page in pages if isinstance(page, dict)]
    headings = [homepage.get("h1"), homepage.get("headings")] + [
        value
        for page in pages
        if isinstance(page, dict)
        for value in (page.get("h1"), page.get("firstH1"), page.get("navLabels"))
    ]
    urls = [homepage.get("url")] + [page.get("url") for page in pages if isinstance(page, dict)]
    text_blocks = [homepage.get("text"), homepage.get("metaDescription")] + [
        value
        for page in pages
        if isinstance(page, dict)
        for value in (page.get("text"), page.get("textSnippet"), page.get("metaDescription"))
    ]

    extracted = extract_keyword_candidates(text_blocks, titles, headings, urls)
    service_keywords = [service for service in services if isinstance(service, str) and service.strip()]
    d4s_keywords = [
        str(item.get("keyword"))
        for item in (keyword_sources.get("keywords_for_site") or [])[:20]
        if isinstance(item, dict) and item.get("keyword")
    ]
    top_keywords = [str(item) for item in (keyword_sources.get("keywords_top_10") or [])[:10] if str(item).strip()]

    keyword_candidates = deduplicate_list_preserve_order(service_keywords + top_keywords + d4s_keywords + extracted)[:20]
    if not keyword_candidates:
        return {
            "score": 0,
            "meaning": "Keyword evidence was too limited to score reliably.",
            "strengths": [],
            "gaps": ["Keyword candidates could not be extracted from current on-site evidence."],
            "recommendations": ["Provide stronger title/H1/body alignment or connect keyword data sources for a fuller keyword score."],
            "breakdown": {
                "presence": 0,
                "coverage": 0,
                "relevance": 0,
                "intentMatch": 0,
                "distribution": 0,
            },
            "opportunities": [],
        }

    presence_score, presence_gaps = score_keyword_presence(homepage, keyword_candidates)
    coverage_score, missing_keywords = score_keyword_coverage(
        {"homepage": homepage, "pages": pages, "page_registry": page_registry, "siteType": site_type},
        keyword_candidates,
    )
    relevance_score, weak_keywords = score_keyword_relevance(site_type, services, keyword_candidates)
    distribution_score, distribution_gaps = score_keyword_distribution(page_registry or pages, keyword_candidates)

    intents = [classify_keyword_intent(keyword) for keyword in keyword_candidates[:12]]
    if site_type == "content_site":
        intent_match_score = int(round((sum(1 for intent in intents if intent == "informational") / max(1, len(intents))) * 100))
    elif site_type in {"service_business", "ecommerce"}:
        intent_match_score = int(round((sum(1 for intent in intents if intent == "commercial") / max(1, len(intents))) * 100))
    else:
        intent_match_score = int(round((sum(1 for intent in intents if intent in {"commercial", "informational"}) / max(1, len(intents))) * 100))

    keyword_score = round(
        (presence_score * 0.25)
        + (coverage_score * 0.25)
        + (relevance_score * 0.20)
        + (intent_match_score * 0.15)
        + (distribution_score * 0.15)
    )
    keyword_score = max(0, min(100, int(keyword_score)))

    strengths: List[str] = []
    if presence_score >= 65:
        strengths.append("Core keywords are represented in high-visibility elements such as title, meta, H1, or URL.")
    if coverage_score >= 60:
        strengths.append("Keyword coverage extends beyond a single page and reaches more of the site.")
    if relevance_score >= 60:
        strengths.append("Detected keyword themes align with the business model and services.")
    if intent_match_score >= 60:
        strengths.append("Keyword intent generally matches the site's commercial or informational goals.")

    gaps = deduplicate_list_preserve_order(
        presence_gaps
        + distribution_gaps
        + [
            f"Missing opportunity coverage for: {', '.join(missing_keywords[:3])}."
            if missing_keywords
            else ""
        ]
        + [
            f"Lower-relevance keywords detected: {', '.join(weak_keywords[:3])}."
            if weak_keywords
            else ""
        ]
    )
    gaps = [gap for gap in gaps if gap][:5]

    recommendations: List[str] = []
    if presence_score < 65:
        recommendations.append("Add the primary keyword theme to the homepage title, meta description, and H1 in a consistent way.")
    if coverage_score < 65:
        recommendations.append("Map one primary keyword cluster to each important page and expand supporting coverage on service or topic pages.")
    if distribution_score < 60:
        recommendations.append("Spread target keywords more naturally across important pages instead of concentrating them on one page.")
    if relevance_score < 60:
        recommendations.append("Tighten keyword targeting so page topics better match the site type, services, and buyer intent.")

    opportunities = [
        {
            "keyword": keyword,
            "intent": classify_keyword_intent(keyword),
            "currentCoverage": "missing",
            "priority": "high" if idx < 3 else "medium",
        }
        for idx, keyword in enumerate(missing_keywords[:5])
    ]

    return {
        "score": keyword_score,
        "meaning": "A deterministic measure of keyword presence, coverage, relevance, intent match, and page-level distribution.",
        "strengths": strengths[:4],
        "gaps": gaps,
        "recommendations": deduplicate_list_preserve_order(recommendations)[:4],
        "breakdown": {
            "presence": presence_score,
            "coverage": coverage_score,
            "relevance": relevance_score,
            "intentMatch": intent_match_score,
            "distribution": distribution_score,
        },
        "keywordCandidates": keyword_candidates[:12],
        "opportunities": opportunities,
    }
