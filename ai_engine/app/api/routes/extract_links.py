from fastapi import APIRouter, Query, HTTPException

from app.core.config import settings
from app.extractors.universal_links.orchestrator import extract_links_auto

router = APIRouter()

@router.get("/extract-links")
async def extract_links(
    url: str = Query(..., description="Target website URL"),
    timeout_sec: int | None = Query(
        default=None,
        ge=5,
        le=300,
        description="Max time allowed for extraction (seconds). Defaults to settings.LINK_EXTRACT_TIMEOUT_SEC.",
    ),
):
    """
    Universal extraction:
    - Fast static extraction
    - lxml fallback
    - Playwright for dynamic
    - Selenium fallback (optional)
    """
    try:
        # No hard-coded asyncio.wait_for here; timeouts are enforced inside extractors (and can be configured).
        # If you want an outer cap, pass timeout_sec and the orchestrator will respect it.
        return await extract_links_auto(url, timeout_sec=timeout_sec or settings.LINK_EXTRACT_TIMEOUT_SEC)
    except TimeoutError as te:
        raise HTTPException(status_code=504, detail=str(te))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
