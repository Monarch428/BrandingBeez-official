import requests
from app.core.config import settings

def detect_site_type(url: str) -> str:
    try:
        res = requests.get(url, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)), headers={"User-Agent": "Mozilla/5.0"})
        text = (res.text or "").lower()

        if "react" in text or "__next" in text or "vue" in text:
            return "dynamic"
        if len(text) < 2000:
            return "blocked"
        return "static"
    except Exception:
        return "dynamic"
