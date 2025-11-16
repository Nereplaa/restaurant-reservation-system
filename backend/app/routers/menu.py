"""
Menu routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.models.menu_item import MenuItem, MenuCategory
from app.models.user import User, UserRole
from app.middleware.auth import get_current_user, require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("/", response_model=List[MenuItemResponse])
async def get_menu_items(
    category: Optional[MenuCategory] = Query(None),
    available: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all menu items (optionally filtered by category and availability)
    """
    query = db.query(MenuItem)
    
    if category:
        query = query.filter(MenuItem.category == category)
    
    if available is not None:
        query = query.filter(MenuItem.available == available)
    
    menu_items = query.all()
    return [MenuItemResponse.model_validate(item) for item in menu_items]


@router.get("/{item_id}", response_model=MenuItemResponse)
async def get_menu_item(item_id: str, db: Session = Depends(get_db)):
    """
    Get menu item by ID
    """
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    return MenuItemResponse.model_validate(menu_item)


@router.post("/", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    menu_item: MenuItemCreate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Create a new menu item (admin/manager only)
    """
    new_item = MenuItem(**menu_item.model_dump())
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    logger.info(f"New menu item created: {new_item.name}")
    
    return MenuItemResponse.model_validate(new_item)


@router.patch("/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: str,
    menu_item_update: MenuItemUpdate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Update menu item (admin/manager only)
    """
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    # Update fields
    update_data = menu_item_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(menu_item, field, value)
    
    db.commit()
    db.refresh(menu_item)
    
    logger.info(f"Menu item updated: {menu_item.name}")
    
    return MenuItemResponse.model_validate(menu_item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: str,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Delete menu item (admin/manager only)
    """
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    
    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    
    db.delete(menu_item)
    db.commit()
    
    logger.info(f"Menu item deleted: {menu_item.name}")
    
    return None

