"""
Category schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    """Base schema for Category"""
    key: str
    label: str
    label_tr: Optional[str] = None
    emoji: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class CategoryCreate(CategoryBase):
    """Schema for creating a category"""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category"""
    key: Optional[str] = None
    label: Optional[str] = None
    label_tr: Optional[str] = None
    emoji: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    """Response schema for Category"""
    id: str
    key: str
    label: str
    label_tr: Optional[str] = None
    emoji: Optional[str] = None
    sort_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}
