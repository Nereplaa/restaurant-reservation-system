"""
Order schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from app.models.order import OrderStatus


class OrderItemBase(BaseModel):
    """Base order item schema"""
    menu_item_id: str
    quantity: int
    special_notes: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    """Order item creation schema"""
    pass


class OrderItemResponse(OrderItemBase):
    """Order item response schema"""
    id: str
    order_id: str
    price_at_order: Decimal
    created_at: datetime
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    """Base order schema"""
    table_id: Optional[str] = None
    reservation_id: Optional[str] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    """Order creation schema"""
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    """Order update schema"""
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    """Order status update schema"""
    status: OrderStatus


class OrderResponse(OrderBase):
    """Order response schema"""
    id: str
    order_number: str
    status: OrderStatus
    order_time: datetime
    ready_time: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    order_items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True

