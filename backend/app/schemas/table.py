"""
Table schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.table import TableStatus


class TableBase(BaseModel):
    """Base table schema"""
    table_number: str
    capacity: int
    location: Optional[str] = None


class TableCreate(TableBase):
    """Table creation schema"""
    pass


class TableUpdate(BaseModel):
    """Table update schema"""
    table_number: Optional[str] = None
    capacity: Optional[int] = None
    location: Optional[str] = None
    status: Optional[TableStatus] = None


class TableResponse(TableBase):
    """Table response schema"""
    id: str
    status: TableStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

