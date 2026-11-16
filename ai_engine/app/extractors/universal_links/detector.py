from app.core.config import settings
from app.core.http import http_get

def detect_site_type(url: str) -> str:
    try:
        res = http_get(url, timeout=int(getattr(settings, "LINK_REQUEST_TIMEOUT_SEC", 5)))
        text = (res.text or "").lower()

        if "react" in text or "__next" in text or "vue" in text:
            return "dynamic"
        if len(text) < 2000:
            return "blocked"
        return "static"
    except Exception:
        return "dynamic"
