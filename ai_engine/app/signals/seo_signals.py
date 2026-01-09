from typing import Dict, Any

def build_seo_signals() -> Dict[str, Any]:
    # Without Ahrefs/Semrush/Moz integration, keep it "not available" like your sample PDF.
    return {
        "domainAuthority": {
            "score": 0,
            "benchmark": None,
            "notes": "Not available: requires an SEO data provider API (Ahrefs/Semrush/Moz).",
        },
        "backlinks": {
            "totalBacklinks": "N/A",
            "referringDomains": "N/A",
            "linkQualityScore": "N/A",
            "notes": "Not available: requires backlink provider integration.",
        },
    }
