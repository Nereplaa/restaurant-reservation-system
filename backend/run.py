"""
Application entry point
"""
import uvicorn
from app.config import settings
from app.utils.logger import logger

if __name__ == "__main__":
    logger.info(f"🚀 Starting server on {settings.HOST}:{settings.PORT}")
    logger.info(f"📊 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🔗 API Docs: http://{settings.HOST}:{settings.PORT}/api/docs")
    logger.info(f"🔗 Health check: http://{settings.HOST}:{settings.PORT}/health")
    
    uvicorn.run(
        "app.main:socket_app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower()
    )

