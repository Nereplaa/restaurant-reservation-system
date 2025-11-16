"""
Table model
"""
from sqlalchemy import Column, String, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.database import Base


class TableStatus(str, enum.Enum):
    """Table status enumeration"""
    available = "available"
    occupied = "occupied"
    reserved = "reserved"
    maintenance = "maintenance"


class Table(Base):
    """Table model"""
    __tablename__ = "tables"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    table_number = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False, index=True)
    location = Column(String, nullable=True)
    status = Column(SQLEnum(TableStatus), default=TableStatus.available, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="table")
    orders = relationship("Order", back_populates="table")

