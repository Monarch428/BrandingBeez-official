from __future__ import annotations

from app.core.config import settings
from app.core.network import is_network_available


class LLMProviderManager:
    def can_use_openai(self) -> bool:
        return bool(getattr(settings, "OPENAI_API_KEY", None)) and is_network_available("api.openai.com")

    def can_use_gemini(self) -> bool:
        return bool(getattr(settings, "GEMINI_API_KEY", None)) and is_network_available("generativelanguage.googleapis.com")

    def get_active_provider(self, preferred: str | None = None) -> str | None:
        pref = (preferred or "openai").strip().lower()
        if pref in ("openai", "oai"):
            if self.can_use_openai():
                return "openai"
            if self.can_use_gemini():
                return "gemini"
            return None
        if pref in ("gemini", "google", "gcp"):
            if self.can_use_gemini():
                return "gemini"
            if self.can_use_openai():
                return "openai"
            return None
        if self.can_use_openai():
            return "openai"
        if self.can_use_gemini():
            return "gemini"
        return None

    def fallback_provider(self, current: str | None) -> str | None:
        cur = (current or "").strip().lower()
        if cur in ("openai", "oai"):
            return "gemini" if self.can_use_gemini() else None
        if cur in ("gemini", "google", "gcp"):
            return "openai" if self.can_use_openai() else None
        return self.get_active_provider()
