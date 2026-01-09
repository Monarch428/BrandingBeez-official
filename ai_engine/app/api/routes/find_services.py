from fastapi import APIRouter, Query, HTTPException
from app.services.places_finder import find_services, PlacesAPIError

router = APIRouter()

@router.get("/find-services", tags=["Service Finder"])
def find_services_route(
    service: str = Query(..., min_length=2, description="Service keyword, e.g., 'web design agency'"),
    location: str = Query(..., min_length=2, description="Location, e.g., 'London'"),
    max_results: int = Query(5, ge=1, le=10, description="Max number of results (1-10)"),
    max_reviews: int = Query(5, ge=0, le=10, description="Max reviews per place (0-10)") ,
):
    try:
        results = find_services(service=service, location=location, max_results=max_results, max_reviews=max_reviews)
        return {"ok": True, "service": service, "location": location, "results": results}
    except PlacesAPIError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
