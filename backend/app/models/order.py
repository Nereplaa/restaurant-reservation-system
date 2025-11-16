"""
Order and OrderItem models
"""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.database import Base


class OrderStatus(str, enum.Enum):
    """Order status enumeration"""
    pending = "pending"
    preparing = "preparing"
    ready = "ready"
    served = "served"
    cancelled = "cancelled"


class Order(Base):
    """Order model"""
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = Column(String, unique=True, nullable=False)
    reservation_id = Column(String, ForeignKey("reservations.id", ondelete="SET NULL"), nullable=True, index=True)
    table_id = Column(String, ForeignKey("tables.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.pending, nullable=False, index=True)
    order_time = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    ready_time = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    reservation = relationship("Reservation", back_populates="orders")
    table = relationship("Table", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Order Item model"""
    __tablename__ = "order_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    menu_item_id = Column(String, ForeignKey("menu_items.id", ondelete="RESTRICT"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(Numeric(10, 2), nullable=False)
    special_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")

