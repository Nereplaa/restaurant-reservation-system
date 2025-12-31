"""
Main FastAPI application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import socketio
from app.config import settings
from app.routers import auth, reservation, menu, order, table, admin, chat
from app.utils.logger import logger
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Restaurant Service API",
    description="Python FastAPI backend for Restaurant Service System",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.cors_origins_list,
    logger=False,
    engineio_logger=False
)

# Combine FastAPI and Socket.IO
socket_app = socketio.ASGIApp(sio, app)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(reservation.router, prefix="/api/v1")
app.include_router(menu.router, prefix="/api/v1")
app.include_router(order.router, prefix="/api/v1")
app.include_router(table.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "message": "Server is running",
        "timestamp": logger.info("Health check")
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Restaurant Service API",
        "version": "2.0.0",
        "docs": "/api/docs"
    }

# 404 handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handle 404 errors"""
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": "Route not found"
            }
        }
    )

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    logger.info(f"Socket connected: {sid}")
    await sio.emit('connection_established', {'status': 'connected'}, room=sid)

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    logger.info(f"Socket disconnected: {sid}")

@sio.event
async def join_kitchen(sid):
    """Join kitchen room for real-time updates"""
    await sio.enter_room(sid, 'kitchen')
    logger.info(f"Socket {sid} joined kitchen room")
    await sio.emit('joined_kitchen', {'success': True}, room=sid)

@sio.event
async def leave_kitchen(sid):
    """Leave kitchen room"""
    await sio.leave_room(sid, 'kitchen')
    logger.info(f"Socket {sid} left kitchen room")

@sio.event
async def update_order_status(sid, data):
    """Broadcast order status update"""
    logger.info(f"Order {data.get('orderId')} status updated to {data.get('status')}")
    await sio.emit('order_updated', data, room='kitchen')

# Helper function to emit new order (can be called from order router)
async def emit_new_order(order_data: dict):
    """Emit new order to kitchen"""
    await sio.emit('new_order', order_data, room='kitchen')
    logger.info(f"New order {order_data.get('id')} emitted to kitchen")

# Helper function to emit order deletion
async def emit_order_deleted(order_id: str):
    """Emit order deletion to kitchen"""
    await sio.emit('order_deleted', {'orderId': order_id}, room='kitchen')
    logger.info(f"Order {order_id} deletion emitted to kitchen")

# Export socket app
__all__ = ['socket_app', 'app', 'sio']

