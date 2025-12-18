"""
Authentication schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Any
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


class WrappedTokenResponse(BaseModel):
    """Wrapped token response for frontend compatibility"""
    success: bool = True
    data: TokenResponse


class WrappedUserResponse(BaseModel):
    """Wrapped user response for frontend compatibility"""
    success: bool = True
    data: UserResponse


class MessageResponse(BaseModel):
    """Generic message response"""
    success: bool
    message: str
    data: dict | None = None

