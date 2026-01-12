from .openai_classifier import openai_infer_category

async def analyze_analytics(features):
    html = features["html"].lower()
    scripts = " ".join(features["scripts"]).lower()
    cookies = " ".join(features["cookies"]).lower()

    if "google-analytics" in scripts or "gtag(" in html:
        return {
            "detected": ["Google Analytics"],
            "confidence": 0.95,
            "reason": "Google Analytics tracking script detected",
            "score": 9,
            "evidence": "Client-side script inspection"
        }

    if "_ga" in cookies:
        return {
            "detected": ["Google Analytics"],
            "confidence": 0.85,
            "reason": "Analytics tracking cookie detected",
            "score": 8,
            "evidence": "Cookie inspection"
        }

    if "hotjar" in scripts:
        return {
            "detected": ["Hotjar"],
            "confidence": 0.9,
            "reason": "Hotjar behavior analytics detected",
            "score": 9,
            "evidence": "Script inspection"
        }

    # Privacy-first / server-side analytics
    ai = await openai_infer_category(features, "Analytics")
    ai["confidence"] = max(ai["confidence"], 0.6)
    ai["score"] = int(ai["confidence"] * 10)
    ai["evidence"] = "No client-side trackers; inferred server-side analytics"

    return ai
