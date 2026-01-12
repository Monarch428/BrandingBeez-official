from .openai_classifier import openai_infer_category

async def analyze_server(features):
    result = await openai_infer_category(features, "Server")
    result["score"] = int(result.get("confidence",0)*10)
    result["evidence"] = result.get("reason","")
    return result
