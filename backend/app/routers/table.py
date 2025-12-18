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

