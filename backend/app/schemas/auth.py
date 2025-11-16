"""
Authentication schemas
"""
from pydantic import BaseModel, EmailStr
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Registration request schema"""
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: str | None = None


class TokenResponse(BaseModel):
    """Token response schema"""
    user: UserResponse
    token: str


class MessageResponse(BaseModel):
    """Generic message response"""
    success: bool
    message: str
    data: dict | None = None

