"""
Reservation model
"""
from sqlalchemy import Column, String, Integer, DateTime, Date, Time, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.database import Base


class ReservationStatus(str, enum.Enum):
    """Reservation status enumeration"""
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class Reservation(Base):
    """Reservation model"""
    __tablename__ = "reservations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    table_id = Column(String, ForeignKey("tables.id", ondelete="SET NULL"), nullable=True, index=True)
    date = Column(Date, nullable=False, index=True)
    time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=True)
    party_size = Column(Integer, nullable=False)
    status = Column(SQLEnum(ReservationStatus), default=ReservationStatus.confirmed, nullable=False, index=True)
    special_request = Column(Text, nullable=True)
    confirmation_number = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")
    orders = relationship("Order", back_populates="reservation")

