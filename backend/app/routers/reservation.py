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


@router.get("/")
async def get_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = None
):
    """
    Get all reservations for current user (or all for admin/staff)
    """
    if current_user.role in [UserRole.admin, UserRole.manager, UserRole.server]:
        # Admin/staff can see all reservations
        query = db.query(Reservation).order_by(Reservation.date.desc())
        if limit:
            query = query.limit(limit)
        reservations = query.all()
    else:
        # Customers only see their own reservations
        query = db.query(Reservation).filter(
            Reservation.user_id == current_user.id
        ).order_by(Reservation.date.desc())
        if limit:
            query = query.limit(limit)
        reservations = query.all()
    
    # Format response for frontend
    reservation_list = []
    for r in reservations:
        reservation_dict = {
            "id": str(r.id),
            "userId": str(r.user_id),
            "tableId": str(r.table_id) if r.table_id else None,
            "guestCount": r.party_size,
            "reservationDate": r.date.isoformat() if r.date else None,
            "reservationTime": r.time.strftime("%H:%M") if r.time else None,
            "status": r.status.value.upper() if r.status else None,
            "specialRequests": r.special_request,
            "confirmationNumber": r.confirmation_number,
            "createdAt": r.created_at.isoformat() if r.created_at else None,
            "updatedAt": r.updated_at.isoformat() if r.updated_at else None,
            "user": {
                "firstName": r.user.first_name if r.user else None,
                "lastName": r.user.last_name if r.user else None
            } if r.user else None
        }
        reservation_list.append(reservation_dict)
    
    return {
        "success": True,
        "data": {
            "reservations": reservation_list
        }
    }


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

