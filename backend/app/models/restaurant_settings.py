"""
Restaurant Settings model - stores all site configuration
"""
from sqlalchemy import Column, String, Text, JSON, DateTime, Boolean
from datetime import datetime
import uuid
from app.database import Base


class RestaurantSettings(Base):
    """Restaurant Settings model - singleton table for site configuration"""
    __tablename__ = "restaurant_settings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Basic Info
    name = Column(String, nullable=False, default="Borcelle Fine Dining")
    slogan = Column(String, nullable=True, default="Fine Dining • 2004")
    description = Column(Text, nullable=True)
    
    # Contact Info
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Operating Hours - JSON format: {"monday": {"open": "11:00", "close": "23:00"}, ...}
    opening_hours = Column(JSON, default=dict, nullable=False)
    
    # Simple hours for display
    opening_time = Column(String, default="11:00", nullable=False)
    closing_time = Column(String, default="23:00", nullable=False)
    
    # Capacity Info
    total_tables = Column(String, nullable=True)
    total_capacity = Column(String, nullable=True)
    
    # Services - JSON array of service descriptions
    services = Column(JSON, default=list, nullable=False)
    
    # Social Media - JSON format: {"instagram": "url", "facebook": "url", ...}
    social_media = Column(JSON, default=dict, nullable=False)
    
    # Homepage Content
    hero_video_url = Column(String, nullable=True)
    hero_title = Column(String, nullable=True)
    hero_subtitle = Column(Text, nullable=True)
    
    # Gallery Images - JSON array of image paths
    gallery_images = Column(JSON, default=list, nullable=False)
    
    # Mission & Vision
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    philosophy = Column(Text, nullable=True)
    
    # Features/Why Us Section - JSON array
    features = Column(JSON, default=list, nullable=False)
    
    # Badges for hero section - JSON array
    hero_badges = Column(JSON, default=list, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
