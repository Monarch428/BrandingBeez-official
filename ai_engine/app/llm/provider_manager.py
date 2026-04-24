from __future__ import annotations

from app.core.config import settings
from app.core.network import is_network_available


class LLMProviderManager:
    def can_use_openai(self) -> bool:
        return bool(getattr(settings, "OPENAI_API_KEY", None)) and is_network_available("api.openai.com")

    def can_use_gemini(self) -> bool:
        return bool(getattr(settings, "GEMINI_API_KEY", None)) and is_network_available("generativelanguage.googleapis.com")

    def _normalize_provider_name(self, provider: str | None) -> str:
        value = (provider or "gemini").strip().lower()
        if value in ("openai", "oai"):
            return "openai"
        if value in ("gemini", "google", "gcp"):
            return "gemini"
        return "gemini"

    def get_active_provider(self, preferred: str | None = None) -> str | None:
        pref = self._normalize_provider_name(preferred)
        if pref == "openai":
            if self.can_use_openai():
                return "openai"
            if self.can_use_gemini():
                return "gemini"
            return None
        if self.can_use_gemini():
            return "gemini"
        if self.can_use_openai():
            return "openai"
        return None

    def fallback_provider(self, current: str | None) -> str | None:
        cur = self._normalize_provider_name(current)
        if cur == "openai":
            return "gemini" if self.can_use_gemini() else None
        if cur == "gemini":
            return "openai" if self.can_use_openai() else None
        return self.get_active_provider()
