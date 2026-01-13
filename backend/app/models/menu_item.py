"""
Menu Item model
"""
from sqlalchemy import Column, String, Numeric, Boolean, Integer, DateTime, Text, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from app.database import Base


class MenuCategory(str, enum.Enum):
    """Menu category enumeration - Borcelle Fine Dining"""
    starters = "starters"      # Başlangıçlar
    appetizers = "appetizers"  # Başlangıçlar (alias)
    soups = "soups"            # Çorbalar
    mains = "mains"            # Ana Yemekler
    grills = "grills"          # Izgara
    kebabs = "kebabs"          # Kebaplar
    pizzas = "pizzas"          # Gurme Pizzalar
    chef = "chef"              # Şef Özel
    desserts = "desserts"      # Tatlılar
    drinks = "drinks"          # İçecekler
    wines = "wines"            # Şarap Koleksiyonu
    specials = "specials"      # Özel Menü


class MenuItem(Base):
    """Menu Item model"""
    __tablename__ = "menu_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    name_tr = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    detailed_info = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(SQLEnum(MenuCategory), nullable=False, index=True)
    image_url = Column(String, nullable=True)
    available = Column(Boolean, default=True, nullable=False, index=True)
    dietary_tags = Column(JSON, default=list, nullable=False)
    preparation_time = Column(Integer, default=15, nullable=False)
    calories = Column(Integer, nullable=True)
    protein = Column(Numeric(5, 1), nullable=True)
    carbs = Column(Numeric(5, 1), nullable=True)
    fat = Column(Numeric(5, 1), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="menu_item")

