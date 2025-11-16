"""
User schemas
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str


class UserResponse(UserBase):
    """User response schema"""
    id: str
    role: UserRole
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """User update schema"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

