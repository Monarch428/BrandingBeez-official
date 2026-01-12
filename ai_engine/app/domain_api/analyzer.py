import asyncio
from typing import Any, Dict

from app.domain_api.services.fetcher import fetch_website

from app.domain_api.services.cms import analyze_cms
from app.domain_api.services.frontend import analyze_frontend
from app.domain_api.services.backend import analyze_backend
from app.domain_api.services.server import analyze_server
from app.domain_api.services.database import analyze_database
from app.domain_api.services.cdn import analyze_cdn
from app.domain_api.services.security import analyze_security
from app.domain_api.services.analytics import analyze_analytics
from app.domain_api.services.marketing import analyze_marketing
from app.domain_api.services.ecommerce import analyze_ecommerce

from app.domain_api.services.scoring import calculate_overall_score, grade_website
from app.domain_api.services.lag_detector import detect_lags


async def analyze_website(url: str) -> Dict[str, Any]:
    """Run the Domain-API technology + quality analyzer."""
    features = await fetch_website(url)

    (
        cms,
        frontend,
        backend,
        server,
        database,
        cdn,
        security,
        analytics,
        marketing,
        ecommerce,
    ) = await asyncio.gather(
        analyze_cms(features),
        analyze_frontend(features),
        analyze_backend(features),
        analyze_server(features),
        analyze_database(features),
        analyze_cdn(features),
        analyze_security(features),
        analyze_analytics(features),
        analyze_marketing(features),
        analyze_ecommerce(features),
    )

    technology_analysis = {
        "CMS": cms,
        "Frontend": frontend,
        "Backend": backend,
        "Server": server,
        "Database": database,
        "CDN": cdn,
        "Security": security,
        "Analytics": analytics,
        "Marketing": marketing,
        "Ecommerce": ecommerce,
    }

    overall_score = calculate_overall_score(technology_analysis)
    grade = grade_website(overall_score)
    lag_analysis = detect_lags(technology_analysis)

    return {
        "url": features.get("url") or url,
        "technology_analysis": technology_analysis,
        "quality_score": overall_score,
        "grade": grade,
        "lag_analysis": lag_analysis,
    }



def analyze_website_sync(url: str) -> Dict[str, Any]:
    """Sync wrapper so the main pipeline (sync) can call it easily."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Create a dedicated loop (no nesting) for this call
            new_loop = asyncio.new_event_loop()
            try:
                return new_loop.run_until_complete(analyze_website(url))
            finally:
                new_loop.close()
        return loop.run_until_complete(analyze_website(url))
    except RuntimeError:
        # No current loop
        return asyncio.run(analyze_website(url))

