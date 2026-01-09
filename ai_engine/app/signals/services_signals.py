from typing import Any, Dict

def build_services_signals() -> Dict[str, Any]:
    # If you later add multi-page crawl (services/about), populate this from real pages.
    return {
        "services": [],
        "serviceGaps": [],
        "industriesServed": {
            "current": [],
            "concentrationNote": None,
            "highValueIndustries": [],
        },
        "positioning": {
            "currentStatement": "N/A",
            "competitorComparison": "N/A",
            "differentiation": "N/A",
        },
    }
