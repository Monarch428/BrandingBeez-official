from typing import Any, Dict, List


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
]

def build_leadgen_signals(homepage: Dict[str, Any], links: Dict[str, Any]) -> Dict[str, Any]:
    channels: List[Dict[str, Any]] = []

    html = str(homepage.get("html") or "")
    internal_links = links.get("internal_links") if isinstance(links, dict) else None
    if not isinstance(internal_links, list):
        internal_links = []
    text_blob = " ".join([
        str(homepage.get("title") or ""),
        str(homepage.get("metaDescription") or ""),
        str(homepage.get("text") or ""),
        html,
        " ".join([str(u) for u in internal_links[:200]]),
    ]).lower()

    # Minimal heuristics: if homepage contact CTA exists, call it out
    if homepage.get("contactCTA"):
        channels.append({"channel": "Contact Form Detected", "leadsPerMonth": "—", "quality": "—", "status": "Detected"})
        channels.append({"channel": "Email Detected", "leadsPerMonth": "—", "quality": "—", "status": "Detected"})
    else:
        channels.append({"channel": "Contact CTA", "leadsPerMonth": "—", "quality": "—", "status": "Not Detected"})

    # Newsletter / email capture heuristic
    if any(k in text_blob for k in ["newsletter", "subscribe", "mailchimp", "klaviyo"]):
        channels.append({"channel": "Newsletter Signup", "leadsPerMonth": "—", "quality": "—", "status": "Detected"})

    # Lead magnets detection
    lead_magnets: List[Dict[str, Any]] = []
    for pat, label in LEAD_MAGNET_PATTERNS:
        if pat in text_blob:
            lead_magnets.append({"type": label, "title": label, "ctaUrl": "—", "notes": f"Detected keyword '{pat}' on site."})

    # Try to attach URLs for obvious download/guide pages
    for u in internal_links:
        su = str(u or "")
        low = su.lower()
        if any(x in low for x in ["/ebook", "/whitepaper", "/guide", "/checklist", "/template", "/download", "/free-audit", "/audit"]):
            lead_magnets.append({"type": "Lead Magnet Page", "title": "Lead Magnet / Download", "ctaUrl": su, "notes": "Detected potential lead-magnet URL."})

    # De-dup
    seen = set()
    deduped = []
    for lm in lead_magnets:
        k = (str(lm.get("type")) + "|" + str(lm.get("ctaUrl"))).lower()
        if k in seen:
            continue
        seen.add(k)
        deduped.append(lm)

    missing = []
    if not deduped:
        missing.append("No obvious lead magnets detected (consider adding a free audit / downloadable guide).")

    return {
        "channels": channels,
        "missingHighROIChannels": missing,
        "leadMagnets": deduped,
    }
