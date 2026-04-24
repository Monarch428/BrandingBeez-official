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
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4.1-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    # OpenAI rate-limit controls (server-side)
    # Limits concurrent in-process OpenAI calls to reduce 429 bursts.
    OPENAI_MAX_CONCURRENT: int = 1
    # After N consecutive 429 responses, open a circuit-breaker for a cooldown
    # window and (optionally) route LLM work to Gemini.
    OPENAI_429_STRIKE_THRESHOLD: int = 4
    OPENAI_CIRCUIT_BREAKER_COOLDOWN_SEC: int = 45
    OPENAI_FALLBACK_TO_GEMINI_ON_429: bool = True
    OPENAI_REPAIR_ENABLED: bool = True
    OPENAI_REPAIR_WHEN_CIRCUIT_OPEN: bool = False
    OPENAI_RETRY_BASE_DELAY_SEC: float = 2.0
    OPENAI_RETRY_MAX_DELAY_SEC: int = 30
    GEMINI_RETRY_BASE_DELAY_SEC: float = 2.0
    GEMINI_RETRY_MAX_DELAY_SEC: int = 20

    # Gemini (Google Generative Language) settings
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL_MINI: str = "gemini-2.5-flash"  # lightweight/low-cost model

    # LLM output caching (stores prompt-hash keyed results in analysis_cache)
    LLM_CACHE_ENABLED: bool = False
    LLM_CACHE_TTL_DAYS: int = 30

    # LLM mode control
    # 2 = richer (multi-step prompts / extra enrichment)
    # 1 = safe (minimal LLM usage to avoid 429/rate-limit failures)
    LLM_MODE: int = 2
    # If true, the engine will downgrade to LLM_MODE=1 in-process when it
    # encounters sustained 429/rate-limit errors and will continue the analysis.
    LLM_DOWNGRADE_ON_429: bool = True

    # Minimum spacing between LLM calls to avoid burst rate limits.
    LLM_MIN_CALL_GAP_MS: int = 1500

    # LLM prompt / response controls
    # These are consumed by the LLM client + report builder to keep prompt sizes
    # predictable and to avoid Gemini/OpenAI returning truncated JSON.
    LLM_MAX_PROMPT_CHARS: int = 18000
    LLM_MAX_SYSTEM_PROMPT_CHARS: int = 6000
    LLM_MAX_USER_PROMPT_CHARS: int = 16000
    LLM_MAX_TOTAL_PROMPT_CHARS: int = 18000
    LLM_REPAIR_MAX_CHARS: int = 12000

    # Stage toggles
    LLM_SKIP_RECONCILE: bool = True
    LLM_ENABLE_SECTIONS_8_10_LLM: bool = True
    LLM_ENABLE_FINAL_SYNTHESIS: bool = True
    LLM_ENABLE_FINAL_EXEC_SUMMARY: bool = True
    LLM_ENABLE_FINAL_VISIBILITY_PATCH: bool = True
    LLM_ENABLE_FINAL_GROWTH_PATCH: bool = True
    LLM_ENABLE_FINAL_GROWTH_COMMERCIAL_PATCH: bool = True
    LLM_ENABLE_FINAL_ACTIONPLAN_PATCH: bool = True

    # Retry controls
    LLM_OPENAI_MAX_RETRIES: int = 3
    LLM_GEMINI_MAX_RETRIES: int = 2
    LLM_RECONCILE_MAX_RETRIES: int = 1
    LLM_ESTIMATION_MAX_RETRIES: int = 2
    LLM_FINAL_PATCH_MAX_RETRIES: int = 2
    LLM_GEMINI_STRICT_JSON_RETRY_COUNT: int = 1

    # Stage-specific token budgets
    LLM_RECONCILE_MAX_TOKENS: int = 1800
    LLM_ESTIMATION_STAGE_MAX_TOKENS: int = 1800
    LLM_ESTIMATION_FALLBACK_MAX_TOKENS: int = 900
    LLM_FINAL_EXEC_SUMMARY_MAX_TOKENS: int = 1800
    LLM_FINAL_VISIBILITY_MAX_TOKENS: int = 1800
    LLM_FINAL_GROWTH_MAX_TOKENS: int = 1700
    LLM_FINAL_GROWTH_COMMERCIAL_MAX_TOKENS: int = 1800
    LLM_FINAL_ACTIONPLAN_MAX_TOKENS: int = 2000
    LLM_FINAL_SYNTHESIS_MAX_TOKENS: int = 1800

    # Runtime safety / debugging
    LLM_LOG_RUNTIME_SETTINGS: bool = True
    LLM_INCLUDE_RUNTIME_META: bool = True
    LLM_STAGE_FORCE_DETERMINISTIC_ON_FAILURE: bool = True
    LLM_CACHE_EMPTY_RESULTS: bool = False

    # Optional
    AI_ENGINE_KEY: str | None = None
    PAGESPEED_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None

    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_REFRESH_TOKEN: str | None = None
    GSC_SITE_URL: str | None = None

    HTTP_TIMEOUT_SEC: int = 20
    SLOW_STAGE_WARNING_MS: int = 10000
    MAX_INTERNAL_LINKS: int = 10000
    MAX_LINKS: int = 10000
    MAX_CONTENT_PAGES: int = 100
    NETWORK_CHECK_TIMEOUT_SEC: int = 3
    NETWORK_CHECK_CACHE_TTL_SEC: int = 30
    LINK_REQUEST_TIMEOUT_SEC: int = 20

    # When true, Playwright is allowed to run for content pages.
    # Actual usage is still gated by heuristics in extractors/content_pages.py
    # so we only render pages that appear to be JS shells / thin HTML.
    USE_PLAYWRIGHT_FOR_CONTENT_PAGES: bool = False

    # Hard cap on how many pages we will render with Playwright for content extraction.
    MAX_PLAYWRIGHT_CONTENT_PAGES: int = 50
    MAX_SERVICE_PAGES: int = 50
    MAX_EXTRACTED_SERVICES: int = 250

    # If static extraction already has >= this many words, we skip Playwright.
    JS_TEXT_MIN_WORDS: int = 280

    # Scrapy (optional): more robust link extraction on messy HTML
    USE_SCRAPY_LINK_EXTRACTOR: bool = True

    LINK_EXTRACT_TIMEOUT_SEC: int = 120
    PLAYWRIGHT_GOTO_TIMEOUT_MS: int = 60000
    PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS: int = 30000

    # Screenshots (evidence)
    ENABLE_PAGESPEED: bool = True
    ENABLE_EXTERNAL_SCRAPING: bool = True
    ENABLE_REVIEWS: bool = True
    ENABLE_SCREENSHOTS: bool = True
    ENABLE_STRUCTURED_REPORT_LLM_REFINEMENT: bool = False
    MAX_SCREENSHOTS: int = 10
    SCREENSHOT_TIMEOUT_SEC: int = 120
    SCREENSHOT_FULL_PAGE: bool = True
    SCREENSHOT_DESKTOP_WIDTH: int = 1366
    SCREENSHOT_DESKTOP_HEIGHT: int = 768
    SCREENSHOT_MOBILE_WIDTH: int = 390
    SCREENSHOT_MOBILE_HEIGHT: int = 844
    PAGESPEED_TIMEOUT_SEC: int = 90
    PAGESPEED_MAX_RETRIES: int = 2

    class Config:
        # Always load .env from ai_engine/.env, even if uvicorn is started elsewhere
        env_file = str(Path(__file__).resolve().parents[2] / ".env")
        extra = "ignore"


settings = Settings()
