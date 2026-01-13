"""
Admin routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict
from app.database import get_db
from app.models.user import User, UserRole
from app.models.reservation import Reservation, ReservationStatus
from app.models.order import Order, OrderStatus
from app.models.menu_item import MenuItem
from app.models.table import Table, TableStatus
from app.middleware.auth import require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get dashboard statistics (admin/manager only)
    """
    from datetime import date
    today = date.today()
    
    # Count total customers
    total_customers = db.query(func.count(User.id)).filter(
        User.role == UserRole.customer
    ).scalar() or 0
    
    # Count today's reservations
    today_reservations = db.query(func.count(Reservation.id)).filter(
        Reservation.date == today
    ).scalar() or 0
    
    # Count active orders (pending + preparing)
    active_orders = db.query(func.count(Order.id)).filter(
        Order.status.in_([OrderStatus.pending, OrderStatus.preparing])
    ).scalar() or 0
    
    # Count tables by status
    available_tables = db.query(func.count(Table.id)).filter(
        Table.status == TableStatus.available
    ).scalar() or 0
    occupied_tables = db.query(func.count(Table.id)).filter(
        Table.status == TableStatus.occupied
    ).scalar() or 0
    
    # Today's revenue - calculating from order items for served orders today
    # For now, set to 0 as the Order model doesn't have total_amount
    today_revenue = 0.0
    
    stats = {
        "todayReservations": today_reservations,
        "todayRevenue": today_revenue,
        "totalCustomers": total_customers,
        "activeOrders": active_orders,
        "availableTables": available_tables,
        "occupiedTables": occupied_tables
    }
    
    logger.info(f"Admin stats requested by {current_user.email}")
    
    return {
        "success": True,
        "data": stats
    }


@router.get("/users")
async def get_all_users(
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Get all users (admin/manager only)
    """
    users = db.query(User).all()
    
    # Remove password hashes from response, use camelCase for frontend
    users_data = []
    for user in users:
        user_dict = {
            "id": str(user.id),
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "phone": user.phone,
            "role": user.role.value if user.role else None,
            "createdAt": user.created_at.isoformat() if user.created_at else None,
            "updatedAt": user.updated_at.isoformat() if user.updated_at else None
        }
        users_data.append(user_dict)
    
    return {
        "success": True,
        "data": users_data
    }


from pydantic import BaseModel
from typing import Optional

class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None  
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None

@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    update_data: UserUpdateRequest,
    current_user: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db),
):
    """
    Update user details (admin only)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields if provided
    if update_data.first_name:
        user.first_name = update_data.first_name
    if update_data.last_name:
        user.last_name = update_data.last_name
    if update_data.email:
        # Check if email already exists for another user
        existing = db.query(User).filter(User.email == update_data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_data.email
    if update_data.phone is not None:
        user.phone = update_data.phone
    if update_data.role:
        try:
            user.role = UserRole(update_data.role)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {update_data.role}")
    
    db.commit()
    db.refresh(user)
    
    logger.info(f"User {user_id} updated by admin {current_user.email}")
    
    return {
        "success": True,
        "data": {
            "id": str(user.id),
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "phone": user.phone,
            "role": user.role.value if user.role else None,
        }
    }
