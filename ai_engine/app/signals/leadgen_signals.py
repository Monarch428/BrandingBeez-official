from typing import Any, Dict, List

def build_leadgen_signals(homepage: Dict[str, Any], links: Dict[str, Any]) -> Dict[str, Any]:
    channels: List[Dict[str, Any]] = []

    # Minimal heuristics: if homepage contact CTA exists, call it out
    if homepage.get("contactCTA"):
        channels.append({"channel": "Contact Form Detected", "leadsPerMonth": "—", "quality": "—", "status": "Detected"})
        channels.append({"channel": "Email Detected", "leadsPerMonth": "—", "quality": "—", "status": "Detected"})
    else:
        channels.append({"channel": "Contact CTA", "leadsPerMonth": "—", "quality": "—", "status": "Not Detected"})

    return {
        "channels": channels,
        "missingHighROIChannels": [],
        "leadMagnets": [],
    }
