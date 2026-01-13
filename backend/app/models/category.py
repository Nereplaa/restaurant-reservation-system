"""
Category model - stores menu categories dynamically
"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from datetime import datetime
import uuid
from app.database import Base


class Category(Base):
    """Menu Category model for dynamic category management"""
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Category identifier (used in code: starters, mains, etc.)
    key = Column(String, unique=True, nullable=False, index=True)
    
    # Display name (Başlangıçlar, Ana Yemekler, etc.)
    label = Column(String, nullable=False)
    
    # Turkish display name
    label_tr = Column(String, nullable=True)
    
    # Emoji for category
    emoji = Column(String, nullable=True)
    
    # Sort order for display
    sort_order = Column(Integer, default=0, nullable=False)
    
    # Active status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
