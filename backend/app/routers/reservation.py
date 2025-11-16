"""
Reservation routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from app.database import get_db
from app.schemas.reservation import ReservationCreate, ReservationUpdate, ReservationResponse
from app.models.reservation import Reservation
from app.models.user import User, UserRole
from app.middleware.auth import get_current_user, require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/reservations", tags=["Reservations"])


def generate_confirmation_number() -> str:
    """Generate a unique confirmation number"""
    return f"RES-{uuid.uuid4().hex[:8].upper()}"


@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    reservation: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new reservation
    """
    # Validate party size
    if reservation.party_size < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Party size must be at least 1"
        )
    
    # Generate confirmation number
    confirmation_number = generate_confirmation_number()
    
    # Create reservation
    new_reservation = Reservation(
        user_id=current_user.id,
        date=reservation.date,
        time=reservation.time,
        party_size=reservation.party_size,
        special_request=reservation.special_request,
        confirmation_number=confirmation_number
    )
    
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    
    logger.info(f"New reservation created: {confirmation_number} for user {current_user.email}")
    
    return ReservationResponse.model_validate(new_reservation)


@router.get("/", response_model=List[ReservationResponse])
async def get_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reservations for current user (or all for admin/staff)
    """
    if current_user.role in [UserRole.admin, UserRole.manager, UserRole.server]:
        # Admin/staff can see all reservations
        reservations = db.query(Reservation).order_by(Reservation.date.desc()).all()
    else:
        # Customers only see their own reservations
        reservations = db.query(Reservation).filter(
            Reservation.user_id == current_user.id
        ).order_by(Reservation.date.desc()).all()
    
    return [ReservationResponse.model_validate(r) for r in reservations]


@router.get("/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(
    reservation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get reservation by ID
    """
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    # Check permission
    if current_user.role not in [UserRole.admin, UserRole.manager, UserRole.server]:
        if reservation.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this reservation"
            )
    
    return ReservationResponse.model_validate(reservation)


@router.patch("/{reservation_id}", response_model=ReservationResponse)
async def update_reservation(
    reservation_id: str,
    reservation_update: ReservationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update reservation
    """
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    # Check permission
    if current_user.role not in [UserRole.admin, UserRole.manager, UserRole.server]:
        if reservation.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this reservation"
            )
    
    # Update fields
    update_data = reservation_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reservation, field, value)
    
    db.commit()
    db.refresh(reservation)
    
    logger.info(f"Reservation updated: {reservation.confirmation_number}")
    
    return ReservationResponse.model_validate(reservation)


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reservation(
    reservation_id: str,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Delete reservation (admin/manager only)
    """
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    db.delete(reservation)
    db.commit()
    
    logger.info(f"Reservation deleted: {reservation.confirmation_number}")
    
    return None

