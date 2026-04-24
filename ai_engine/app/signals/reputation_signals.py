from typing import Any, Dict, List, Tuple

from app.pipeline.recommendation_engine import build_reputation_recommendation, derive_site_context
from app.reviews.review_analyzer import ReviewAnalyzer


def _benchmark_text(rating: Any, total_reviews: Any) -> str:
    base = (
        "Benchmark (rule-of-thumb): For most service businesses/agencies, a healthy Google profile is usually "
        "around 4.2–4.5★ with ~20–50 reviews. This varies by niche and city, but it’s a practical baseline."
    )
    if isinstance(rating, (int, float)) and rating >= 4.7:
        base += " Your rating is already above that typical range, which is a strong trust signal."
    if isinstance(total_reviews, (int, float)) and total_reviews >= 50:
        base += " Your review volume is also strong (50+), which typically improves conversion."
    return base


def _gap_text_and_actions(rating: Any, total_reviews: Any, pos: List[str], neg: List[str]) -> Tuple[str, List[str]]:
    actions: List[str] = []
    parts: List[str] = []
    if isinstance(rating, (int, float)):
        if rating < 4.2:
            parts.append(f"Rating ({rating:.1f}★) is below the usual baseline (4.2–4.5★).")
            actions.append("Read the last 10–20 reviews and fix the top recurring complaint (speed, comms, quality, etc.).")
        elif rating < 4.6:
            parts.append(f"Rating ({rating:.1f}★) is around the typical baseline.")
            actions.append("Focus on pushing review volume and replying to reviews to strengthen trust.")
        else:
            parts.append(f"Rating ({rating:.1f}★) is a clear strength (above typical baseline).")
            actions.append("Use this rating on key conversion pages (homepage hero, service pages, proposals).")
    if isinstance(total_reviews, (int, float)):
        if total_reviews < 20:
            parts.append(f"Review count ({int(total_reviews)}) is low; prospects may not see enough proof yet.")
            actions.append("Implement a review-request workflow after delivery, targeting 2–4 new reviews per month.")
        elif total_reviews < 50:
            parts.append(f"Review count ({int(total_reviews)}) is healthy, but not yet ‘dominant’ proof.")
            actions.append("Aim for 50+ over time; consistent review velocity matters more than bursts.")
        else:
            parts.append(f"Review count ({int(total_reviews)}) is strong and should support conversions.")
            actions.append("Keep review velocity steady and prioritize owner replies to reviews.")
    if neg:
        parts.append("Reviews show repeat friction points you can tighten.")
    else:
        parts.append("No consistent negative pattern detected in the sampled review text (good sign).")
    if pos:
        actions.append(f"Double down on what people praise: {', '.join(pos[:2])}. Put this into your messaging.")
    seen = set()
    deduped = []
    for a in actions:
        if a not in seen:
            seen.add(a)
            deduped.append(a)
    return " ".join(parts).strip(), deduped


def build_reputation_signals(
    scraped: Dict[str, Any],
    *,
    company_name: str | None = None,
    website: str | None = None,
    homepage: Dict[str, Any] | None = None,
    services: List[str] | None = None,
    target_market: str | None = None,
    location: str | None = None,
) -> Dict[str, Any]:
    analyzer = ReviewAnalyzer()
    reviews_by_source: Dict[str, Any] = scraped.get("reviews", {}) or {}
    analysis = analyzer.analyze(reviews_by_source)

    summary = scraped.get("summary", {}) or {}
    sampled_total = summary.get("total_reviews", 0) or 0
    platform_meta: Dict[str, Any] = scraped.get("platform_meta", {}) or {}

    platforms: List[Dict[str, Any]] = []
    summary_table: List[Dict[str, Any]] = []

    source_names = list((reviews_by_source or {}).keys())
    for meta_source in (platform_meta or {}).keys():
        if meta_source not in source_names:
            source_names.append(meta_source)

    for source in source_names:
        items = (reviews_by_source or {}).get(source, [])
        source_key = str(source).lower().strip()
        meta = platform_meta.get(source_key, {}) or {}
        sampled_count = len(items) if isinstance(items, list) else 0
        total_reviews = meta.get("totalReviews", meta.get("total_reviews", meta.get("reviewCount", sampled_count)))
        rating = meta.get("rating", "N/A")
        top_reviews = items[:5] if isinstance(items, list) else []
        platforms.append({
            "platform": str(source).title(),
            "rating": rating,
            "totalReviews": total_reviews,
            "topReviews": top_reviews,
            "sampledReviews": sampled_count,
        })
        summary_table.append({
            "platform": str(source).title(),
            "reviews": total_reviews,
            "rating": rating,
            "industryBenchmark": "N/A",
            "gap": "N/A",
            "sampledReviews": sampled_count,
        })

    if not platforms:
        return {
            "reviewScore": "—",
            "googleRating": None,
            "googleReviewCount": 0,
            "totalReviews": "—",
            "industryStandardRange": "Not available (no review sources detected).",
            "yourGap": "Not available (no review sources detected).",
            "summaryTable": [],
            "sentimentThemes": {
                "positive": [],
                "negative": [],
                "responseRate": "N/A",
                "averageResponseTime": "N/A",
            },
            "recommendationDetails": [],
            "actionCandidates": [],
        }

    totals = []
    for p in platforms:
        tr = p.get("totalReviews")
        if isinstance(tr, (int, float)):
            totals.append(int(tr))
    overall_total_reviews = sum(totals) if totals else int(sampled_total or 0)

    score = analysis.get("overall_score", None)
    review_score: Any = "—"
    if isinstance(score, (int, float)) and float(score) > 1.0:
        review_score = round(float(score), 2)

    positive_themes = analysis.get("positive_themes", []) if isinstance(analysis, dict) else []
    negative_themes = analysis.get("negative_themes", []) if isinstance(analysis, dict) else []

    google = next((p for p in platforms if str(p.get("platform", "")).lower() == "google"), None)
    google_rating = google.get("rating") if google else None
    google_total = google.get("totalReviews") if google else None

    if review_score == "—" and isinstance(google_rating, (int, float)):
        review_score = round(float(google_rating), 2)

    industry_standard = _benchmark_text(google_rating, google_total)
    gap_text, actions = _gap_text_and_actions(google_rating, google_total, positive_themes, negative_themes)

    site_context = derive_site_context(
        company_name=company_name or "",
        website=website or "",
        homepage=homepage or {},
        services=services or [],
        target_market=target_market,
        location=location,
    )
    recommendation_details: List[Dict[str, Any]] = []
    action_candidates: List[Dict[str, Any]] = []
    if google_rating not in (None, "N/A") or google_total not in (None, "N/A"):
        detail = build_reputation_recommendation(rating=google_rating, review_count=google_total, site_context=site_context)
        recommendation_details.append(detail)
        action_candidates.append({
            "title": "Merchandise review proof across key conversion pages",
            "sourceSection": "reputation",
            "impact": "medium",
            "effort": "low",
            "urgency": "medium",
            "confidence": 0.85,
            "pillar": "trust",
            "kpis": ["lead-to-meeting rate", "proposal conversion"],
            "details": detail,
        })

    return {
        "reviewScore": review_score,
        "googleRating": google_rating,
        "googleReviewCount": int(google_total) if isinstance(google_total, (int, float)) else 0,
        "totalReviews": overall_total_reviews,
        "industryStandardRange": industry_standard,
        "yourGap": gap_text,
        "summaryTable": summary_table,
        "sentimentThemes": {
            "positive": positive_themes,
            "negative": negative_themes,
            "responseRate": "N/A",
            "averageResponseTime": "N/A",
        },
        "platforms": platforms,
        "improvementSuggestions": actions,
        "recommendationDetails": recommendation_details,
        "actionCandidates": action_candidates,
    }
