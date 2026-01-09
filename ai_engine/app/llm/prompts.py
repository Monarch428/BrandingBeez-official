SYSTEM_PROMPT = """
You are BrandingBeez AI Business Growth Analyzer.
Rules:
- Never invent metrics. If unknown, say "Not available" and explain what integration is needed.
- Use provided evidence only.
- Output MUST be valid JSON object.
- Keep it brutally honest and practical.
"""

def build_user_prompt(context: dict) -> str:
    return f"""
Create a Business Growth Report JSON for the company.
Return JSON with these keys EXACTLY:
reportMetadata, executiveSummary, websiteDigitalPresence, seoVisibility, reputation,
servicesPositioning, leadGeneration, competitiveAnalysis, costOptimization, targetMarket,
financialImpact, actionPlan90Days, competitiveAdvantages, riskAssessment, appendices

Context (facts):
{context}
"""
