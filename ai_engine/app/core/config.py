from __future__ import annotations

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Mongo
    MONGO_URI: str
    MONGO_DB_NAME: str | None = None
    MONGO_COLLECTION_REPORTS: str = "AI report generated"

    # DataForSEO (base64 of "login:password")
    DATAFORSEO_BASIC_B64: str | None = None

    # Optional: store login/password instead of base64
    DATAFORSEO_LOGIN: str | None = None
    DATAFORSEO_PASSWORD: str | None = None
    DATAFORSEO_TIMEOUT_SEC: int = 45

    # Defaults for Labs/SERP calls (can be overridden per request)
    DATAFORSEO_DEFAULT_LOCATION_CODE: int = 2840  # US (sample default)
    DATAFORSEO_DEFAULT_LANGUAGE_CODE: str = "en"

    SE_RANKING_API_KEY: str | None = None
    SE_RANKING_BASE_URL: str = "https://api.seranking.com"

    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    # Optional
    AI_ENGINE_KEY: str | None = None
    PAGESPEED_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None

    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_REFRESH_TOKEN: str | None = None
    GSC_SITE_URL: str | None = None

    HTTP_TIMEOUT_SEC: int = 20
    MAX_INTERNAL_LINKS: int = 60
    MAX_CONTENT_PAGES: int = 6

    USE_PLAYWRIGHT_FOR_CONTENT_PAGES: bool = True

    LINK_EXTRACT_TIMEOUT_SEC: int = 90
    PLAYWRIGHT_GOTO_TIMEOUT_MS: int = 60000
    PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS: int = 30000

    class Config:
        # Always load .env from ai_engine/.env, even if uvicorn is started elsewhere
        env_file = str(Path(__file__).resolve().parents[2] / ".env")
        extra = "ignore"


settings = Settings()
