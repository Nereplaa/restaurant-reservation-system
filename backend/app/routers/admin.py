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
    # Count users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Count reservations by status
    total_reservations = db.query(func.count(Reservation.id)).scalar()
    confirmed_reservations = db.query(func.count(Reservation.id)).filter(
        Reservation.status == ReservationStatus.confirmed
    ).scalar()
    
    # Count orders by status
    total_orders = db.query(func.count(Order.id)).scalar()
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.status == OrderStatus.pending
    ).scalar()
    preparing_orders = db.query(func.count(Order.id)).filter(
        Order.status == OrderStatus.preparing
    ).scalar()
    
    # Count menu items
    total_menu_items = db.query(func.count(MenuItem.id)).scalar()
    available_menu_items = db.query(func.count(MenuItem.id)).filter(
        MenuItem.available == True
    ).scalar()
    
    # Count tables by status
    total_tables = db.query(func.count(Table.id)).scalar()
    available_tables = db.query(func.count(Table.id)).filter(
        Table.status == TableStatus.available
    ).scalar()
    occupied_tables = db.query(func.count(Table.id)).filter(
        Table.status == TableStatus.occupied
    ).scalar()
    
    stats = {
        "users": {
            "total": total_users
        },
        "reservations": {
            "total": total_reservations,
            "confirmed": confirmed_reservations
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders,
            "preparing": preparing_orders
        },
        "menu_items": {
            "total": total_menu_items,
            "available": available_menu_items
        },
        "tables": {
            "total": total_tables,
            "available": available_tables,
            "occupied": occupied_tables
        }
    }
    
    logger.info(f"Admin stats requested by {current_user.email}")
    
    return stats


@router.get("/users")
async def get_all_users(
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Get all users (admin/manager only)
    """
    users = db.query(User).all()
    
    # Remove password hashes from response
    users_data = []
    for user in users:
        user_dict = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        users_data.append(user_dict)
    
    return users_data

