"""
Authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, WrappedTokenResponse, WrappedUserResponse, MessageResponse
from app.schemas.user import UserResponse
from app.models.user import User
from app.utils.auth import hash_password, verify_password, create_access_token
from app.middleware.auth import get_current_user
from app.utils.logger import logger
import re

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=WrappedTokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Validate email format
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Validate password strength
    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    
    # Hash password
    password_hash = hash_password(request.password)
    
    # Create user
    new_user = User(
        email=request.email.lower(),
        password_hash=password_hash,
        first_name=request.first_name,
        last_name=request.last_name,
        phone=request.phone
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = create_access_token({
        "userId": new_user.id,
        "email": new_user.email,
        "role": new_user.role.value
    })
    
    logger.info(f"New user registered: {new_user.email}")
    
    return WrappedTokenResponse(
        success=True,
        data=TokenResponse(
            user=UserResponse.model_validate(new_user),
            token=token
        )
    )


@router.post("/login", response_model=WrappedTokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login user
    """
    # Find user
    user = db.query(User).filter(User.email == request.email.lower()).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate token
    token = create_access_token({
        "userId": user.id,
        "email": user.email,
        "role": user.role.value
    })
    
    logger.info(f"User logged in: {user.email}")
    
    return WrappedTokenResponse(
        success=True,
        data=TokenResponse(
            user=UserResponse.model_validate(user),
            token=token
        )
    )


@router.get("/me", response_model=WrappedUserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return WrappedUserResponse(
        success=True,
        data=UserResponse.model_validate(current_user)
    )


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """
    Logout user (client-side token removal)
    """
    return MessageResponse(
        success=True,
        message="Logout successful"
    )

