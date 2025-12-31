"""
Application configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    PORT: int = 7001
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:7005/restaurant_db"
    
    # JWT
    JWT_SECRET: str = "your-super-secret-jwt-key-change-this-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:7002,http://localhost:7003,http://localhost:7004"
    
    # Logging
    LOG_LEVEL: str = "INFO"

    # Local LLM / chatbot configuration (for LM Studio or similar)
    LLM_API_URL: str | None = None  # e.g. "http://localhost:1234/v1/chat/completions"
    LLM_API_KEY: str | None = None
    LLM_MODEL: str | None = "openai/gpt-oss-20b"  # e.g. model name shown in LM Studio
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',')]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

