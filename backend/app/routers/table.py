"""
Table routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.table import TableCreate, TableUpdate, TableResponse
from app.models.table import Table, TableStatus
from app.models.user import User, UserRole
from app.middleware.auth import get_current_user, require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/tables", tags=["Tables"])


@router.get("/")
async def get_tables(
    status_filter: Optional[TableStatus] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all tables (optionally filtered by status)
    """
    query = db.query(Table)
    
    if status_filter:
        query = query.filter(Table.status == status_filter)
    
    tables = query.order_by(Table.table_number).all()
    
    # Format for frontend with camelCase
    tables_data = []
    for table in tables:
        table_dict = {
            "id": str(table.id),
            "tableNumber": table.table_number,
            "capacity": table.capacity,
            "location": table.location,
            "status": table.status.value if table.status else None,
            "createdAt": table.created_at.isoformat() if table.created_at else None,
            "updatedAt": table.updated_at.isoformat() if table.updated_at else None
        }
        tables_data.append(table_dict)
    
    return {
        "success": True,
        "data": tables_data
    }


@router.get("/available")
async def get_available_tables(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time: str = Query(..., description="Time in HH:MM format"),
    party_size: int = Query(1, ge=1, description="Minimum party size"),
    end_time: str = Query(None, description="End time in HH:MM format (optional)"),
    db: Session = Depends(get_db)
):
    """
    Get available tables for a specific date and time, filtered by capacity.
    Returns only tables that:
    1. Have capacity >= party_size
    2. Are not reserved for the given date and time slot (checks overlap)
    """
    from app.models.reservation import Reservation, ReservationStatus
    from datetime import datetime, timedelta, time as dt_time
    
    # Parse date and time
    try:
        reservation_date = datetime.strptime(date, "%Y-%m-%d").date()
        reservation_start = datetime.strptime(time, "%H:%M").time()
        if end_time:
            reservation_end = datetime.strptime(end_time, "%H:%M").time()
        else:
            # Default: 2 hours after start
            start_dt = datetime.combine(reservation_date, reservation_start)
            reservation_end = (start_dt + timedelta(hours=2)).time()
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid date or time format")
    
    # Get all tables with sufficient capacity
    all_tables = db.query(Table).filter(
        Table.capacity >= party_size
    ).order_by(Table.capacity.asc(), Table.table_number).all()
    
    # Get all confirmed reservations for that date
    reservations = db.query(Reservation).filter(
        Reservation.date == reservation_date,
        Reservation.table_id.isnot(None),
        Reservation.status == ReservationStatus.confirmed
    ).all()
    
    # Find reserved table IDs for overlapping time slots
    reserved_ids = set()
    for res in reservations:
        res_start = res.time
        # Use end_time if available, otherwise assume 2 hours
        if res.end_time:
            res_end = res.end_time
        else:
            res_start_dt = datetime.combine(reservation_date, res_start)
            res_end = (res_start_dt + timedelta(hours=2)).time()
        
        # Check time overlap: new reservation overlaps with existing
        # Overlap if: new_start < existing_end AND new_end > existing_start
        if reservation_start < res_end and reservation_end > res_start:
            reserved_ids.add(str(res.table_id))
    
    # Filter available tables
    available_tables = []
    for table in all_tables:
        if str(table.id) not in reserved_ids:
            table_dict = {
                "id": str(table.id),
                "tableNumber": table.table_number,
                "capacity": table.capacity,
                "location": table.location,
                "status": table.status.value if table.status else None
            }
            available_tables.append(table_dict)
    
    return {
        "success": True,
        "data": available_tables,
        "meta": {
            "date": date,
            "time": time,
            "endTime": end_time,
            "partySize": party_size,
            "totalAvailable": len(available_tables)
        }
    }


@router.get("/{table_id}", response_model=TableResponse)
async def get_table(table_id: str, db: Session = Depends(get_db)):
    """
    Get table by ID
    """
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    return TableResponse.model_validate(table)


@router.post("/", response_model=TableResponse, status_code=status.HTTP_201_CREATED)
async def create_table(
    table: TableCreate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Create a new table (admin/manager only)
    """
    # Check if table number already exists
    existing_table = db.query(Table).filter(Table.table_number == table.table_number).first()
    if existing_table:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Table {table.table_number} already exists"
        )
    
    new_table = Table(**table.model_dump())
    
    db.add(new_table)
    db.commit()
    db.refresh(new_table)
    
    logger.info(f"New table created: {new_table.table_number}")
    
    return TableResponse.model_validate(new_table)


@router.patch("/{table_id}", response_model=TableResponse)
async def update_table(
    table_id: str,
    table_update: TableUpdate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager, UserRole.server)),
    db: Session = Depends(get_db)
):
    """
    Update table (admin/manager/server)
    """
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    # Update fields
    update_data = table_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(table, field, value)
    
    db.commit()
    db.refresh(table)
    
    logger.info(f"Table updated: {table.table_number}")
    
    return TableResponse.model_validate(table)


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_table(
    table_id: str,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Delete table (admin/manager only)
    """
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    
    db.delete(table)
    db.commit()
    
    logger.info(f"Table deleted: {table.table_number}")
    
    return None

