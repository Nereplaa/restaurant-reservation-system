"""
Application configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    PORT: int = 5000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',')]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

