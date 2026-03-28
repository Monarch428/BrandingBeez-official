from typing import Any, Dict, List

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
) -> Dict[str, Any]:
    channels: List[Dict[str, Any]] = []

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

    channels.append(
        {
            "channel": "Primary website CTA",
            "leadsPerMonth": "Directional only",
            "quality": "High intent",
            "status": "Detected" if has_homepage_cta or has_form else "Needs Review",
            "notes": (
                f"Homepage CTA or form detected. Signals: {', '.join(cta_hits[:3])}."
                if has_homepage_cta or has_form
                else (
                    "CTA signals are likely present but could not be structurally extracted."
                    if resolved_site_type == "service_business"
                    else "Conversion prompts appear lighter or content-led; a stronger primary CTA may still improve lead capture."
                )
            ),
        }
    )

    if cta_urls:
        channels.append(
            {
                "channel": "Contact / booking pages",
                "leadsPerMonth": "Directional only",
                "quality": "High intent",
                "status": "Detected",
                "notes": f"Detected {len(cta_urls)} conversion-oriented URLs.",
            }
        )

    if has_email:
        channels.append(
            {
                "channel": "Email capture / direct outreach",
                "leadsPerMonth": "Directional only",
                "quality": "Medium-High",
                "status": "Detected",
                "notes": "Email contact signals detected on-site.",
            }
        )

    if has_chat:
        channels.append(
            {
                "channel": "Chat-led inquiry",
                "leadsPerMonth": "Directional only",
                "quality": "Medium-High",
                "status": "Detected",
                "notes": "Live chat or messaging prompt detected.",
            }
        )

    if any(k in text_blob for k in ["newsletter", "subscribe", "mailchimp", "klaviyo"]):
        channels.append(
            {
                "channel": "Newsletter signup",
                "leadsPerMonth": "Directional only",
                "quality": "Mid funnel",
                "status": "Detected",
                "notes": "Newsletter or email signup signals detected.",
            }
            )

    trust_hits = (proof_signals.get("testimonials") or []) + (proof_signals.get("trustSignals") or [])
    if trust_hits:
        channels.append(
            {
                "channel": "Proof-assisted conversion support",
                "leadsPerMonth": "Directional only",
                "quality": "Conversion support",
                "status": "Detected",
                "notes": f"Trust or testimonial signals detected: {', '.join(trust_hits[:3])}.",
            }
        )

    lead_magnets: List[Dict[str, Any]] = []
    for pat, label in LEAD_MAGNET_PATTERNS:
        if pat in text_blob:
            stage = "Top" if label in {"Guide", "Checklist", "Template", "Ebook", "Whitepaper"} else "Mid"
            if label in {"Proposal Request", "Free Audit", "Free Consultation"}:
                stage = "Bottom"
            lead_magnets.append(
                {
                    "type": label,
                    "title": label,
                    "ctaUrl": "-",
                    "funnelStage": stage,
                    "notes": f"Detected keyword '{pat}' on-site.",
                }
            )

    for u in internal_links:
        low = u.lower()
        if any(x in low for x in ["/ebook", "/whitepaper", "/guide", "/checklist", "/template", "/download", "/free-audit", "/audit", "/proposal", "/calculator"]):
            stage = "Bottom" if any(x in low for x in ["audit", "proposal"]) else "Mid"
            if any(x in low for x in ["guide", "checklist", "template", "download", "ebook", "whitepaper"]):
                stage = "Top"
            lead_magnets.append(
                {
                    "type": "Lead Magnet Page",
                    "title": "Lead Magnet / Download",
                    "ctaUrl": u,
                    "funnelStage": stage,
                    "notes": "Detected potential lead-magnet URL.",
                }
            )

    seen = set()
    deduped: List[Dict[str, Any]] = []
    for lm in lead_magnets:
        key = (str(lm.get("type")) + "|" + str(lm.get("ctaUrl"))).lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(lm)

    missing: List[str] = []
    if not has_homepage_cta and not cta_urls:
        if resolved_site_type == "content_site":
            missing.append("A stronger subscription, download, or consultation CTA could improve content-to-lead conversion.")
        elif resolved_site_type == "ecommerce":
            missing.append("A stronger primary CTA and clearer product-to-inquiry path could improve conversion coverage.")
        else:
            missing.append("CTA signals are likely present but could not be structurally extracted.")
    if not deduped:
        if resolved_site_type == "content_site":
            missing.append("No obvious subscriber or downloadable content offer was detected. Add a newsletter, guide, or template CTA.")
        elif resolved_site_type == "service_business":
            missing.append("No obvious top- or mid-funnel lead magnet was detected. Add a guide, calculator, or diagnostic audit offer.")

    channels = deduplicate_list_preserve_order(channels)
    deduped = deduplicate_list_preserve_order(deduped)
    missing = deduplicate_list_preserve_order(missing)

    return {
        "channels": channels,
        "mentorNotes": (
            "CTA signals are likely present but could not be structurally extracted."
            if cta_hits and not cta_urls and resolved_site_type == "service_business"
            else (
                "Lead capture appears to rely more on content and trust pathways than on a single dominant CTA."
                if resolved_site_type == "content_site" and (cta_hits or trust_hits)
                else None
            )
        ),
        "missingHighROIChannels": missing,
        "leadMagnets": deduped,
    }
