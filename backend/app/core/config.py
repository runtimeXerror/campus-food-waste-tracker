from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    PROJECT_NAME: str = "NourishTrack API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    DATABASE_URL: str = "postgresql+asyncpg://user:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    CORS_ORIGINS: str = '["http://localhost:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
