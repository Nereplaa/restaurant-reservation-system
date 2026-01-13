"""
Category routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.models.category import Category
from app.models.user import User, UserRole
from app.middleware.auth import require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get all categories (public endpoint)
    """
    query = db.query(Category)
    
    if active_only:
        query = query.filter(Category.is_active == True)
    
    categories = query.order_by(Category.sort_order).all()
    return [CategoryResponse.model_validate(cat) for cat in categories]


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str, db: Session = Depends(get_db)):
    """
    Get category by ID
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    return CategoryResponse.model_validate(category)


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Create a new category (admin/manager only)
    """
    # Check if key already exists
    existing = db.query(Category).filter(Category.key == category.key).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with key '{category.key}' already exists"
        )
    
    new_category = Category(**category.model_dump())
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    logger.info(f"New category created: {new_category.label}")
    
    return CategoryResponse.model_validate(new_category)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_update: CategoryUpdate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager)),
    db: Session = Depends(get_db)
):
    """
    Update category (admin/manager only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Update fields
    update_data = category_update.model_dump(exclude_unset=True)
    
    # Check if key is being updated and if it already exists
    if 'key' in update_data and update_data['key'] != category.key:
        existing = db.query(Category).filter(Category.key == update_data['key']).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with key '{update_data['key']}' already exists"
            )
    
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    
    logger.info(f"Category updated: {category.label}")
    
    return CategoryResponse.model_validate(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    current_user: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db)
):
    """
    Delete category (admin only)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    db.delete(category)
    db.commit()
    
    logger.info(f"Category deleted: {category.label}")
    
    return None
