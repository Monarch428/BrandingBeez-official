from __future__ import annotations

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Mongo
    MONGO_URI: str
    MONGO_DB_NAME: str | None = None
    MONGO_COLLECTION_REPORTS: str = "AI report generated"
    MONGO_COLLECTION_AUTH_API_TOKENS: str = "auth_api_tokens"
    # Cache (raw collection outputs to speed up repeat runs)
    MONGO_COLLECTION_ANALYSIS_CACHE: str = "analysis_cache"

    # Cache TTLs (days)
    CACHE_TTL_PAGESPEED_DAYS: int = 1
    CACHE_TTL_DATAFORSEO_DAYS: int = 7
    CACHE_TTL_CRAWL_DAYS: int = 7
    CACHE_TTL_PLACES_DAYS: int = 7
    CACHE_TTL_SCREENSHOTS_DAYS: int = 7

    # Cache behavior
    CACHE_ENABLED: bool = True
    CACHE_VERSION: str = "v1"  # bump when you change extraction logic

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

    # When true, Playwright is allowed to run for content pages.
    # Actual usage is still gated by heuristics in extractors/content_pages.py
    # so we only render pages that appear to be JS shells / thin HTML.
    USE_PLAYWRIGHT_FOR_CONTENT_PAGES: bool = False

    # Hard cap on how many pages we will render with Playwright for content extraction.
    MAX_PLAYWRIGHT_CONTENT_PAGES: int = 4

    # If static extraction already has >= this many words, we skip Playwright.
    JS_TEXT_MIN_WORDS: int = 280

    # Scrapy (optional): more robust link extraction on messy HTML
    USE_SCRAPY_LINK_EXTRACTOR: bool = True

    LINK_EXTRACT_TIMEOUT_SEC: int = 90
    PLAYWRIGHT_GOTO_TIMEOUT_MS: int = 60000
    PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS: int = 30000

    # Screenshots (evidence)
    ENABLE_SCREENSHOTS: bool = True
    SCREENSHOT_FULL_PAGE: bool = True
    SCREENSHOT_DESKTOP_WIDTH: int = 1366
    SCREENSHOT_DESKTOP_HEIGHT: int = 768
    SCREENSHOT_MOBILE_WIDTH: int = 390
    SCREENSHOT_MOBILE_HEIGHT: int = 844

    class Config:
        # Always load .env from ai_engine/.env, even if uvicorn is started elsewhere
        env_file = str(Path(__file__).resolve().parents[2] / ".env")
        extra = "ignore"


settings = Settings()
