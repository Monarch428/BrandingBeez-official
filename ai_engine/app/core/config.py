from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Mongo (use same URI/DB as Node)
    MONGO_URI: str
    MONGO_DB_NAME: str | None = None
    MONGO_COLLECTION_REPORTS: str = "AI report generated"  # must match mongoose collection :contentReference[oaicite:3]{index=3}

    # Auth between Node and Python (optional)
    AI_ENGINE_KEY: str | None = None

    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    # Optional Google PageSpeed Insights
    PAGESPEED_API_KEY: str | None = None

    # Google Places (Service Finder)
    GOOGLE_API_KEY: str | None = None

    # Crawl limits
    HTTP_TIMEOUT_SEC: int = 20
    MAX_INTERNAL_LINKS: int = 60
    MAX_CONTENT_PAGES: int = 6

    # Content extraction
    USE_PLAYWRIGHT_FOR_CONTENT_PAGES: bool = True

    # Link extraction (universal_links)
    LINK_EXTRACT_TIMEOUT_SEC: int = 90
    PLAYWRIGHT_GOTO_TIMEOUT_MS: int = 60000
    PLAYWRIGHT_NETWORKIDLE_TIMEOUT_MS: int = 30000

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
