"""
User model
"""
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    customer = "customer"
    admin = "admin"
    manager = "manager"
    server = "server"
    kitchen = "kitchen"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.customer, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="user", cascade="all, delete-orphan")

