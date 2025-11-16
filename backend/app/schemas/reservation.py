"""
Reservation schemas
"""
from pydantic import BaseModel
from datetime import datetime, date, time
from typing import Optional
from app.models.reservation import ReservationStatus


class ReservationBase(BaseModel):
    """Base reservation schema"""
    date: date
    time: time
    party_size: int
    special_request: Optional[str] = None


class ReservationCreate(ReservationBase):
    """Reservation creation schema"""
    pass


class ReservationUpdate(BaseModel):
    """Reservation update schema"""
    date: Optional[date] = None
    time: Optional[time] = None
    party_size: Optional[int] = None
    special_request: Optional[str] = None
    status: Optional[ReservationStatus] = None


class ReservationResponse(ReservationBase):
    """Reservation response schema"""
    id: str
    user_id: str
    table_id: Optional[str]
    status: ReservationStatus
    confirmation_number: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

