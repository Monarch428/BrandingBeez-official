import requests

def detect_site_type(url: str) -> str:
    try:
        res = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        text = (res.text or "").lower()

        if "react" in text or "__next" in text or "vue" in text:
            return "dynamic"
        if len(text) < 2000:
            return "blocked"
        return "static"
    except Exception:
        return "dynamic"
