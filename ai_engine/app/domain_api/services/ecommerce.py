from .openai_classifier import openai_infer_category

async def analyze_ecommerce(features):
    result = await openai_infer_category(features, "Ecommerce")
    result["score"] = int(result.get("confidence",0)*10)
    result["evidence"] = result.get("reason","")
    return result
