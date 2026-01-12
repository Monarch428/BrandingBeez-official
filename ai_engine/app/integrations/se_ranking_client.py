from __future__ import annotations
import requests
from typing import Dict, Any
from app.core.config import settings


class SERankingClient:
    def __init__(self):
        if not settings.SE_RANKING_API_KEY:
            raise RuntimeError("SE_RANKING_API_KEY not configured")

        self.base_url = settings.SE_RANKING_BASE_URL.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {settings.SE_RANKING_API_KEY}",
            "Accept": "application/json",
        }
        self.timeout = 30

    def backlinks_overview(self, domain: str) -> Dict[str, Any]:
        """
        Returns backlinks + referring domains
        """
        url = f"{self.base_url}/backlinks/overview"
        params = {"domain": domain}

        r = requests.get(
            url,
            headers=self.headers,
            params=params,
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()

    def domain_authority(self, domain: str) -> Dict[str, Any]:
        """
        Returns domain trust / authority metrics
        """
        url = f"{self.base_url}/domains/metrics"
        params = {"domain": domain}

        r = requests.get(
            url,
            headers=self.headers,
            params=params,
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()
