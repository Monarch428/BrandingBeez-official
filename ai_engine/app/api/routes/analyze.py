from fastapi import APIRouter, HTTPException, Header
from app.core.config import settings
from app.models.requests import AnalyzeRequest, AnalyzeResponse
from app.pipeline.orchestrator import run_analysis_pipeline

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest, x_ai_engine_key: str | None = Header(default=None)):
    # Optional auth between Node ↔ Python
    if settings.AI_ENGINE_KEY:
        if not x_ai_engine_key or x_ai_engine_key != settings.AI_ENGINE_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        result = run_analysis_pipeline(payload)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analyze failed: {str(e)}")
