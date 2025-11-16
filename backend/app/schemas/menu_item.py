"""
Menu Item schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from app.models.menu_item import MenuCategory


class MenuItemBase(BaseModel):
    """Base menu item schema"""
    name: str
    name_tr: Optional[str] = None
    description: Optional[str] = None
    detailed_info: Optional[str] = None
    price: Decimal
    category: MenuCategory
    image_url: Optional[str] = None
    available: bool = True
    dietary_tags: List[str] = []
    preparation_time: int = 15
    calories: Optional[int] = None
    protein: Optional[Decimal] = None
    carbs: Optional[Decimal] = None
    fat: Optional[Decimal] = None


class MenuItemCreate(MenuItemBase):
    """Menu item creation schema"""
    pass


class MenuItemUpdate(BaseModel):
    """Menu item update schema"""
    name: Optional[str] = None
    name_tr: Optional[str] = None
    description: Optional[str] = None
    detailed_info: Optional[str] = None
    price: Optional[Decimal] = None
    category: Optional[MenuCategory] = None
    image_url: Optional[str] = None
    available: Optional[bool] = None
    dietary_tags: Optional[List[str]] = None
    preparation_time: Optional[int] = None
    calories: Optional[int] = None
    protein: Optional[Decimal] = None
    carbs: Optional[Decimal] = None
    fat: Optional[Decimal] = None


class MenuItemResponse(MenuItemBase):
    """Menu item response schema"""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

