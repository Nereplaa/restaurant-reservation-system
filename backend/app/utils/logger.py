"""
Logging configuration
"""
import logging
import colorlog
from app.config import settings

# Create color formatter
formatter = colorlog.ColoredFormatter(
    "%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(asctime)s%(reset)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    }
)

# Create console handler
handler = logging.StreamHandler()
handler.setFormatter(formatter)

# Create logger
logger = logging.getLogger("restaurant-api")
logger.addHandler(handler)
logger.setLevel(getattr(logging, settings.LOG_LEVEL))

# Prevent duplicate logs
logger.propagate = False

