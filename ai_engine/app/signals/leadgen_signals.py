from typing import Any, Dict, List

from app.pipeline.recommendation_engine import build_cta_recommendation, derive_site_context
from app.signals.detection_utils import (
    deduplicate_list_preserve_order,
    detect_cta,
    detect_site_proof_signals,
    detect_site_type,
)

LEAD_MAGNET_PATTERNS = [
    ("ebook", "Ebook"),
    ("whitepaper", "Whitepaper"),
    ("case study", "Case Study"),
    ("guide", "Guide"),
    ("checklist", "Checklist"),
    ("template", "Template"),
    ("free audit", "Free Audit"),
    ("free consultation", "Free Consultation"),
    ("download", "Download"),
    ("newsletter", "Newsletter"),
    ("subscribe", "Newsletter"),
    ("calculator", "Calculator"),
    ("proposal", "Proposal Request"),
]

CTA_TOKENS = ("contact", "book", "schedule", "audit", "quote", "proposal", "consult", "demo", "call")
EMAIL_TOKENS = ("mailto:", "@")
CHAT_TOKENS = ("whatsapp", "live chat", "chat now", "intercom", "drift", "zendesk")


def _safe_text(value: Any) -> str:
    return str(value or "").strip()


def _normalize_url_list(value: Any) -> List[str]:
    if not isinstance(value, list):
        return []
    out: List[str] = []
    for item in value:
        text = _safe_text(item)
        if text:
            out.append(text)
    return out


def build_leadgen_signals(
    homepage: Dict[str, Any],
    links: Dict[str, Any],
    *,
    site_type: str | None = None,
    page_registry: Dict[str, Any] | None = None,
    company_name: str | None = None,
    website: str | None = None,
    services: List[str] | None = None,
    target_market: str | None = None,
    location: str | None = None,
) -> Dict[str, Any]:
    channels: List[Dict[str, Any]] = []
    recommendation_details: List[Dict[str, Any]] = []
    action_candidates: List[Dict[str, Any]] = []

    html = _safe_text(homepage.get("html"))
    internal_links = _normalize_url_list(links.get("internal_links") if isinstance(links, dict) else None)
    text_blob = " ".join([
        _safe_text(homepage.get("title")),
        _safe_text(homepage.get("metaDescription")),
        _safe_text(homepage.get("text")),
        html,
        " ".join(internal_links[:250]),
    ]).lower()

    resolved_site_type = site_type or detect_site_type({"homepage": homepage, "links": links})
    cta_hits = detect_cta(text_blob)
    proof_signals = detect_site_proof_signals(text_blob, page_registry)
    has_homepage_cta = bool(homepage.get("contactCTA")) or bool(cta_hits)
    cta_urls = [u for u in internal_links if any(token in u.lower() for token in CTA_TOKENS)]
    has_form = "<form" in html.lower()
    has_email = any(token in text_blob for token in EMAIL_TOKENS)
    has_chat = any(token in text_blob for token in CHAT_TOKENS)

    channels.append({
        "channel": "Primary website CTA",
        "leadsPerMonth": "Directional only",
        "quality": "High intent",
        "status": "Detected" if has_homepage_cta or has_form else "Needs Review",
        "notes": (
            f"Homepage CTA or form detected. Signals: {', '.join(cta_hits[:3])}."
            if has_homepage_cta or has_form
            else "CTA signals are weak or not structurally extractable from the current crawl."
        ),
    })

    if cta_urls:
        channels.append({
            "channel": "Contact / booking pages",
            "leadsPerMonth": "Directional only",
            "quality": "High intent",
            "status": "Detected",
            "notes": f"Detected {len(cta_urls)} conversion-oriented URLs.",
        })
    if has_email:
        channels.append({
            "channel": "Email capture / direct outreach",
            "leadsPerMonth": "Directional only",
            "quality": "Medium-High",
            "status": "Detected",
            "notes": "Email contact signals detected on-site.",
        })
    if has_chat:
        channels.append({
            "channel": "Chat-led inquiry",
            "leadsPerMonth": "Directional only",
            "quality": "Medium-High",
            "status": "Detected",
            "notes": "Live chat or messaging prompt detected.",
        })

    if any(k in text_blob for k in ["newsletter", "subscribe", "mailchimp", "klaviyo"]):
        channels.append({
            "channel": "Newsletter signup",
            "leadsPerMonth": "Directional only",
            "quality": "Mid funnel",
            "status": "Detected",
            "notes": "Newsletter or email signup signals detected.",
        })

    trust_hits = (proof_signals.get("testimonials") or []) + (proof_signals.get("trustSignals") or [])
    if trust_hits:
        channels.append({
            "channel": "Proof-assisted conversion support",
            "leadsPerMonth": "Directional only",
            "quality": "Conversion support",
            "status": "Detected",
            "notes": f"Trust or testimonial signals detected: {', '.join(trust_hits[:3])}.",
        })

    lead_magnets: List[Dict[str, Any]] = []
    for pat, label in LEAD_MAGNET_PATTERNS:
        if pat in text_blob:
            stage = "Top" if label in {"Guide", "Checklist", "Template", "Ebook", "Whitepaper"} else "Mid"
            if label in {"Proposal Request", "Free Audit", "Free Consultation"}:
                stage = "Bottom"
            lead_magnets.append({
                "type": label, "title": label, "ctaUrl": "-", "funnelStage": stage, "notes": f"Detected keyword '{pat}' on-site."
            })

    site_context = derive_site_context(
        company_name=company_name or "",
        website=website or (homepage.get("url") or ""),
        homepage=homepage or {},
        services=services or [],
        target_market=target_market,
        location=location,
    )

    missing: List[Any] = []
    if not has_homepage_cta and not cta_urls:
        detail = build_cta_recommendation(site_context=site_context, weak_reason="The crawl did not confirm a strong, explicit conversion path in the hero or navigation.")
        recommendation_details.append(detail)
        action_candidates.append({
            "title": "Clarify primary CTA and next-step offer",
            "sourceSection": "leadGeneration",
            "impact": "high",
            "effort": "low",
            "urgency": "high",
            "confidence": 0.85,
            "pillar": "acquisition",
            "kpis": ["CTA click-through", "lead-to-meeting rate"],
            "details": detail,
        })
        missing.append({
            "channel": "Primary CTA clarity",
            "estimatedLeads": "Improves conversion from existing traffic",
            "setupTime": "1-3 days",
            "monthlyCost": "Low",
            "priority": "High",
            "notes": detail.get("recommendation"),
        })

    if not lead_magnets and resolved_site_type == "service_business":
        missing.append({
            "channel": "Lead magnet / audit offer",
            "estimatedLeads": "Directional only",
            "setupTime": "3-7 days",
            "monthlyCost": "Low",
            "priority": "Medium",
            "notes": "Add a diagnostic audit, calculator, or downloadable guide aligned to the core service offer.",
        })

    channels = deduplicate_list_preserve_order(channels)
    lead_magnets = deduplicate_list_preserve_order(lead_magnets)

    return {
        "channels": channels,
        "mentorNotes": (
            "Primary website CTAs are present but need review for clarity and visibility. Email capture and proof-assisted conversion support exist but can be enhanced with stronger CTAs and trust signals. Missing high-ROI channels like paid acquisition and CRM automation should be considered for scaling lead flow."
            if channels else None
        ),
        "missingHighROIChannels": missing,
        "leadMagnets": lead_magnets,
        "recommendationDetails": recommendation_details,
        "actionCandidates": action_candidates,
    }


# ----------------------------
# Updated override batch
# ----------------------------

def _dedupe_dict_rows(rows: List[Dict[str, Any]], key_name: str) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    seen = set()
    for row in rows or []:
        if not isinstance(row, dict):
            continue
        key = _safe_text(row.get(key_name)).lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(row)
    return out


def _looks_like_real_lead_magnet(text_blob: str, internal_links: List[str]) -> bool:
    """
    Require stronger evidence than just the presence of a keyword.
    A real lead magnet needs either:
    - A URL that suggests a download/guide/resource page, OR
    - The keyword appears alongside a download/get/access action word
    Simple keyword presence alone (e.g. 'calculator' or 'guide' as a heading)
    is NOT sufficient to confirm a lead magnet exists.
    """
    blob = (text_blob or "").lower()
    # URL-based evidence: a link that looks like a lead magnet landing page
    url_tokens = ["audit", "download", "template", "ebook", "guide", "checklist", "whitepaper", "free-report", "get-the-guide", "get-the-ebook"]
    for u in internal_links:
        u_lower = (u or "").lower()
        if any(token in u_lower for token in url_tokens):
            return True
    # Text-based: keyword must appear with a CTA action word nearby (within 120 chars)
    action_words = ["download", "get your free", "access the", "grab the", "claim your", "sign up for", "register for", "get the free", "download the"]
    magnet_words = ["ebook", "guide", "checklist", "template", "whitepaper", "free audit", "free report", "calculator"]
    for action in action_words:
        idx = blob.find(action)
        while idx != -1:
            snippet = blob[max(0, idx - 60):idx + 120]
            if any(m in snippet for m in magnet_words):
                return True
            idx = blob.find(action, idx + 1)
    return False


def build_leadgen_signals(
    homepage: Dict[str, Any],
    links: Dict[str, Any],
    *,
    site_type: str | None = None,
    page_registry: Dict[str, Any] | None = None,
    company_name: str | None = None,
    website: str | None = None,
    services: List[str] | None = None,
    target_market: str | None = None,
    location: str | None = None,
) -> Dict[str, Any]:
    channels: List[Dict[str, Any]] = []
    recommendation_details: List[Dict[str, Any]] = []
    action_candidates: List[Dict[str, Any]] = []

    html = _safe_text(homepage.get("html"))
    internal_links = _normalize_url_list(links.get("internal_links") if isinstance(links, dict) else None)
    text_blob = " ".join([
        _safe_text(homepage.get("title")),
        _safe_text(homepage.get("metaDescription")),
        _safe_text(homepage.get("text")),
        html,
        " ".join(internal_links[:250]),
    ]).lower()

    resolved_site_type = site_type or detect_site_type({"homepage": homepage, "links": links})
    cta_hits = detect_cta(text_blob)
    proof_signals = detect_site_proof_signals(text_blob, page_registry)
    has_homepage_cta = bool(homepage.get("contactCTA")) or bool(cta_hits)
    cta_urls = [u for u in internal_links if any(token in u.lower() for token in CTA_TOKENS)]
    has_form = "<form" in html.lower()
    has_email = any(token in text_blob for token in EMAIL_TOKENS)
    has_chat = any(token in text_blob for token in CHAT_TOKENS)
    has_strong_cta = has_homepage_cta or has_form or bool(cta_urls)

    channels.append({
        "channel": "Primary website CTA",
        "leadsPerMonth": "Directional only",
        "quality": "High intent",
        "status": "Detected" if has_strong_cta else "Needs Review",
        "notes": (
            f"Homepage CTA or form detected. Signals: {', '.join(cta_hits[:3])}."
            if has_strong_cta else
            "CTA signals are weak or not structurally extractable from the current crawl."
        ),
    })

    if cta_urls:
        channels.append({
            "channel": "Contact / booking pages",
            "leadsPerMonth": "Directional only",
            "quality": "High intent",
            "status": "Detected",
            "notes": f"Detected {len(cta_urls)} conversion-oriented URLs.",
        })
    if has_email:
        channels.append({
            "channel": "Email capture / direct outreach",
            "leadsPerMonth": "Directional only",
            "quality": "Medium-High",
            "status": "Detected",
            "notes": "Email contact signals detected on-site.",
        })
    if has_chat:
        channels.append({
            "channel": "Chat-led inquiry",
            "leadsPerMonth": "Directional only",
            "quality": "Medium-High",
            "status": "Detected",
            "notes": "Live chat or messaging prompt detected.",
        })

    if any(k in text_blob for k in ["newsletter", "subscribe", "mailchimp", "klaviyo"]):
        channels.append({
            "channel": "Newsletter signup",
            "leadsPerMonth": "Directional only",
            "quality": "Mid funnel",
            "status": "Detected",
            "notes": "Newsletter or email signup signals detected.",
        })

    trust_hits = (proof_signals.get("testimonials") or []) + (proof_signals.get("trustSignals") or [])
    if trust_hits:
        channels.append({
            "channel": "Proof-assisted conversion support",
            "leadsPerMonth": "Directional only",
            "quality": "Conversion support",
            "status": "Detected",
            "notes": f"Trust or testimonial signals detected: {', '.join(trust_hits[:3])}.",
        })

    lead_magnets: List[Dict[str, Any]] = []
    if _looks_like_real_lead_magnet(text_blob, internal_links):
        for pat, label in LEAD_MAGNET_PATTERNS:
            if pat in text_blob or any(pat.replace(' ', '-') in (u or '').lower() for u in internal_links):
                stage = "Top" if label in {"Guide", "Checklist", "Template", "Ebook", "Whitepaper"} else "Mid"
                if label in {"Proposal Request", "Free Audit", "Free Consultation"}:
                    stage = "Bottom"
                lead_magnets.append({
                    "title": label,
                    "funnelStage": stage,
                    "estimatedConversionRate": None,
                    "description": f"Detected keyword or URL cue for '{label}'.",
                })

    site_context = derive_site_context(
        company_name=company_name or "",
        website=website or (homepage.get("url") or ""),
        homepage=homepage or {},
        services=services or [],
        target_market=target_market,
        location=location,
    )

    missing: List[Dict[str, Any]] = []
    if not has_strong_cta:
        detail = build_cta_recommendation(site_context=site_context, weak_reason="The crawl did not confirm a strong, explicit conversion path in the hero or navigation.")
        recommendation_details.append(detail)
        action_candidates.append({
            "title": "Clarify primary CTA and next-step offer",
            "sourceSection": "leadGeneration",
            "impact": "high",
            "effort": "low",
            "urgency": "high",
            "confidence": 0.85,
            "pillar": "acquisition",
            "kpis": ["CTA click-through", "lead-to-meeting rate"],
            "details": detail,
        })
        missing.append({
            "channel": "Primary CTA clarity",
            "status": "Missing",
            "potentialLeads": "Improves conversion from existing traffic",
            "setupTime": "1-3 days",
            "monthlyCost": "Low",
            "priority": "High",
            "notes": detail.get("recommendation"),
        })

    if not lead_magnets and resolved_site_type == "service_business":
        missing.append({
            "channel": "Lead magnet / audit offer",
            "status": "Missing",
            "potentialLeads": "Directional only",
            "setupTime": "3-7 days",
            "monthlyCost": "Low",
            "priority": "Medium",
            "notes": "Add a diagnostic audit, calculator, or downloadable guide aligned to the core service offer.",
        })

    if not has_chat and resolved_site_type == "service_business":
        missing.append({
            "channel": "Live chat / instant inquiry layer",
            "status": "Missing",
            "potentialLeads": "Directional only",
            "setupTime": "1-2 days",
            "monthlyCost": "Low",
            "priority": "Low",
            "notes": "Optional support layer for high-intent visitors who are not ready to submit a full form.",
        })

    channels = deduplicate_list_preserve_order(channels)
    lead_magnets = deduplicate_list_preserve_order(lead_magnets)
    missing = _dedupe_dict_rows(missing, "channel")

    # Build mentor notes AFTER missing is finalized so they are always consistent
    mentor_parts: List[str] = []
    if has_strong_cta:
        mentor_parts.append("Primary conversion paths are present, but CTA wording and placement can be made more explicit.")
    else:
        mentor_parts.append("The site needs a clearer next-step offer and stronger CTA intent in the hero, service pages, and footer.")
    if has_email:
        mentor_parts.append("Email capture / direct outreach signals are present.")
    if trust_hits:
        mentor_parts.append("Trust and proof cues are helping conversion, but they should be merchandised more deliberately near CTAs.")
    # Only mention missing channels if there actually are missing channels
    if missing:
        missing_labels = [
            (m.get("channel") or m.get("name") or "")
            for m in missing
            if isinstance(m, dict) and (m.get("channel") or m.get("name"))
        ]
        if missing_labels:
            mentor_parts.append(
                f"Missing high-ROI acquisition elements ({', '.join(missing_labels[:3])}) are listed below and should be prioritised before scaling spend."
            )
        else:
            mentor_parts.append("Missing high-ROI acquisition elements are listed below and should be prioritised before scaling spend.")
    # If lead magnets are present, note them explicitly
    if lead_magnets:
        magnet_labels = [m.get("title") or m.get("type") or "" for m in lead_magnets[:3] if isinstance(m, dict)]
        magnet_labels = [l for l in magnet_labels if l]
        if magnet_labels:
            mentor_parts.append(f"Lead magnet signals detected: {', '.join(magnet_labels)}.")
    elif resolved_site_type == "service_business":
        mentor_parts.append("No confirmed lead magnets detected — adding an audit, guide, or calculator would improve mid-funnel capture.")

    return {
        "channels": channels,
        "mentorNotes": " ".join(mentor_parts) if mentor_parts else None,
        "missingHighROIChannels": missing,
        "leadMagnets": lead_magnets,
        "recommendationDetails": recommendation_details,
        "actionCandidates": action_candidates,
    }
