"""
Restaurant Settings schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class RestaurantSettingsBase(BaseModel):
    """Base schema for RestaurantSettings"""
    name: Optional[str] = None
    slogan: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[Dict[str, Any]] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    total_tables: Optional[str] = None
    total_capacity: Optional[str] = None
    services: Optional[List[str]] = None
    social_media: Optional[Dict[str, str]] = None
    hero_video_url: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    experience: Optional[str] = None
    philosophy: Optional[str] = None
    features: Optional[List[Dict[str, Any]]] = None
    hero_badges: Optional[List[str]] = None


class RestaurantSettingsUpdate(RestaurantSettingsBase):
    """Schema for updating restaurant settings"""
    pass


class RestaurantSettingsResponse(BaseModel):
    """Response schema for RestaurantSettings"""
    id: str
    name: str
    slogan: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Dict[str, Any] = {}
    opening_time: str = "11:00"
    closing_time: str = "23:00"
    total_tables: Optional[str] = None
    total_capacity: Optional[str] = None
    services: List[str] = []
    social_media: Dict[str, str] = {}
    hero_video_url: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    gallery_images: List[str] = []
    mission: Optional[str] = None
    vision: Optional[str] = None
    experience: Optional[str] = None
    philosophy: Optional[str] = None
    features: List[Dict[str, Any]] = []
    hero_badges: List[str] = []
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}
