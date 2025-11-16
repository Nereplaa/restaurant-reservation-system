"""
Order routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime
from app.database import get_db
from app.schemas.order import OrderCreate, OrderUpdate, OrderStatusUpdate, OrderResponse
from app.models.order import Order, OrderItem, OrderStatus
from app.models.menu_item import MenuItem
from app.models.user import User, UserRole
from app.middleware.auth import get_current_user, require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/orders", tags=["Orders"])


def generate_order_number() -> str:
    """Generate a unique order number"""
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.server)),
    db: Session = Depends(get_db)
):
    """
    Create a new order (admin/server only)
    """
    # Validate order has items
    if not order.items or len(order.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item"
        )
    
    # Generate order number
    order_number = generate_order_number()
    
    # Create order
    new_order = Order(
        order_number=order_number,
        table_id=order.table_id,
        reservation_id=order.reservation_id,
        notes=order.notes
    )
    
    db.add(new_order)
    db.flush()  # Flush to get the order ID
    
    # Create order items
    for item in order.items:
        # Get menu item to get current price
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        
        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item {item.menu_item_id} not found"
            )
        
        if not menu_item.available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item {menu_item.name} is not available"
            )
        
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            price_at_order=menu_item.price,
            special_notes=item.special_notes
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    
    logger.info(f"New order created: {order_number}")
    
    # Fetch order with items
    order_with_items = db.query(Order).filter(Order.id == new_order.id).first()
    return OrderResponse.model_validate(order_with_items)


@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.kitchen, UserRole.server)),
    db: Session = Depends(get_db)
):
    """
    Get all orders (for kitchen/admin/server)
    """
    orders = db.query(Order).order_by(Order.order_time.desc()).all()
    return [OrderResponse.model_validate(order) for order in orders]


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.kitchen, UserRole.server)),
    db: Session = Depends(get_db)
):
    """
    Get order by ID
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return OrderResponse.model_validate(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.kitchen)),
    db: Session = Depends(get_db)
):
    """
    Update order status (admin/kitchen only)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update status
    order.status = status_update.status
    
    # Set ready time if status is ready
    if status_update.status == OrderStatus.ready and not order.ready_time:
        order.ready_time = datetime.utcnow()
    
    db.commit()
    db.refresh(order)
    
    logger.info(f"Order {order.order_number} status updated to {status_update.status}")
    
    return OrderResponse.model_validate(order)


@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: str,
    order_update: OrderUpdate,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.server)),
    db: Session = Depends(get_db)
):
    """
    Update order (admin/server only)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update fields
    update_data = order_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(order, field, value)
    
    db.commit()
    db.refresh(order)
    
    logger.info(f"Order updated: {order.order_number}")
    
    return OrderResponse.model_validate(order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: str,
    current_user: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db)
):
    """
    Delete order (admin only)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    db.delete(order)
    db.commit()
    
    logger.info(f"Order deleted: {order.order_number}")
    
    return None

