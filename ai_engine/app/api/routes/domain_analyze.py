from fastapi import APIRouter, HTTPException, Query, Header
import logging
import time

from app.core.config import settings
from app.domain_api.analyzer import analyze_website_sync

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/domain-analyze")
def domain_analyze(
    url: str = Query(..., description="Website URL to analyze (https://example.com)"),
    x_ai_engine_key: str | None = Header(default=None),
):
    """Technology stack + quality score analyzer (ported from Domain-API-main)."""
    if settings.AI_ENGINE_KEY:
        if not x_ai_engine_key or x_ai_engine_key != settings.AI_ENGINE_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized")

    t0 = time.perf_counter()
    try:
        out = analyze_website_sync(url)
        logger.info("[API] /domain-analyze ok in %.2fs url=%s", time.perf_counter()-t0, url)
        return {"ok": True, "data": out}
    except Exception as e:
        logger.exception("[API] /domain-analyze failed in %.2fs", time.perf_counter()-t0)
        raise HTTPException(status_code=500, detail=f"Domain analyze failed: {str(e)}")
