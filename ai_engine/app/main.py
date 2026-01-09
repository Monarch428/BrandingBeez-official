import sys
import asyncio

# Windows + Python 3.13: ensure subprocess support for Playwright (Proactor loop)
if sys.platform.startswith("win"):
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        # If policy isn't available, continue with default.
        pass

from fastapi import FastAPI
from app.api.routes.health import router as health_router
from app.api.routes.analyze import router as analyze_router
from app.api.routes.extract_links import router as extract_links_router
from app.api.routes.find_services import router as find_services_router
from app.core.logging import configure_logging

configure_logging()

app = FastAPI(
    title="BrandingBeez AI Business Growth Engine",
    description="Crawl + analyze + LLM report generation + MongoDB save",
    version="1.0.0",
)

app.include_router(health_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(extract_links_router, prefix="/api", tags=["Link Extraction"])
app.include_router(find_services_router, prefix="/api", tags=["Service Finder"])

@app.get("/")
def root():
    return {"message": "AI Engine running. Use /api/health, /api/analyze, /api/extract-links, /api/find-services"}
