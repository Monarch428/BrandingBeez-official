from .openai_classifier import openai_infer_category

async def analyze_cms(features):
    html = features["html"].lower()
    scripts = " ".join(features["scripts"]).lower()
    cookies = " ".join(features["cookies"]).lower()

    if "wp-content" in html or "wp-includes" in html:
        return {
            "detected": ["WordPress"],
            "confidence": 0.95,
            "reason": "WordPress asset paths found",
            "score": 9,
            "evidence": "HTML asset inspection"
        }

    if "shopify" in scripts or "_shopify" in cookies:
        return {
            "detected": ["Shopify"],
            "confidence": 0.95,
            "reason": "Shopify scripts/cookies detected",
            "score": 9,
            "evidence": "Script + cookie inspection"
        }

    if "wix" in scripts:
        return {
            "detected": ["Wix"],
            "confidence": 0.9,
            "reason": "Wix platform script detected",
            "score": 9,
            "evidence": "Script inspection"
        }

    # Headless / Static fallback
    ai = await openai_infer_category(features, "CMS")
    ai["confidence"] = max(ai["confidence"], 0.6)
    ai["score"] = int(ai["confidence"] * 10)
    ai["evidence"] = "No visible CMS assets; inferred headless/static CMS"

    return ai
