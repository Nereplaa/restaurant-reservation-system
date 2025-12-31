"""
Table model with enhanced area and feature support
"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Enum as SQLEnum
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


class TableArea(str, enum.Enum):
    """Table area/zone enumeration"""
    TERRACE = "TERRACE"        # Teras - sigara serbest
    MAIN_HALL = "MAIN_HALL"    # Ana Salon - sigara yasak
    VIP = "VIP"                # VIP Oda - sigara serbest


class Table(Base):
    """Table model with enhanced features for smart recommendations"""
    __tablename__ = "tables"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    table_number = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False, index=True)
    
    # Area/Zone information
    area = Column(SQLEnum(TableArea), default=TableArea.MAIN_HALL, nullable=False, index=True)
    location = Column(String, nullable=True)  # Legacy field for backward compatibility
    
    # Table features
    smoking_allowed = Column(Boolean, default=False, nullable=False, index=True)
    is_window = Column(Boolean, default=False, nullable=False, index=True)  # Cam kenarı
    is_wall = Column(Boolean, default=False, nullable=False)     # Duvar kenarı
    is_vip = Column(Boolean, default=False, nullable=False, index=True)
    
    # Status
    status = Column(SQLEnum(TableStatus), default=TableStatus.available, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="table")
    orders = relationship("Order", back_populates="table")
    
    @property
    def area_display(self) -> str:
        """Return human-readable area name in Turkish"""
        area_names = {
            TableArea.TERRACE: "Teras",
            TableArea.MAIN_HALL: "Ana Salon",
            TableArea.VIP: "VIP Oda"
        }
        return area_names.get(self.area, str(self.area))
    
    @property
    def position_display(self) -> str:
        """Return position description in Turkish"""
        if self.is_vip:
            return "Özel Oda"
        elif self.is_window:
            return "Cam Kenarı"
        elif self.is_wall:
            return "Duvar Kenarı"
        else:
            return "Merkez"


