"""
File Upload routes - Image upload for menu items
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import os
import uuid
from datetime import datetime
import shutil
from PIL import Image
from app.models.user import User, UserRole
from app.middleware.auth import require_roles
from app.utils.logger import logger

router = APIRouter(prefix="/upload", tags=["Upload"])

# Upload directory configuration
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads")
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def ensure_upload_dir():
    """Ensure upload directory exists"""
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove any path separators and keep only the filename
    filename = os.path.basename(filename)
    # Replace spaces and special chars
    filename = filename.replace(" ", "_")
    # Keep only alphanumeric, underscore, hyphen, and dot
    safe_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.")
    return "".join(c for c in filename if c in safe_chars)


def generate_unique_filename(original_filename: str, category: Optional[str] = None) -> str:
    """Generate unique filename with timestamp and category prefix"""
    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".png"
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    
    if category:
        category_safe = sanitize_filename(category)
        return f"{category_safe}_{timestamp}_{unique_id}{ext}"
    
    return f"menu_{timestamp}_{unique_id}{ext}"


def validate_image(file_path: str) -> bool:
    """Validate that the file is actually an image"""
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except Exception:
        return False


def optimize_image(file_path: str, max_size: int = 1200) -> None:
    """Optimize image: resize if too large, compress"""
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if needed (for JPEG compatibility)
            if img.mode in ("RGBA", "P"):
                # Keep PNG format for transparency
                pass
            
            # Resize if larger than max_size
            if max(img.size) > max_size:
                ratio = max_size / max(img.size)
                new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Save with optimization
            ext = os.path.splitext(file_path)[1].lower()
            if ext in (".jpg", ".jpeg"):
                img.save(file_path, "JPEG", quality=85, optimize=True)
            elif ext == ".png":
                img.save(file_path, "PNG", optimize=True)
            elif ext == ".webp":
                img.save(file_path, "WEBP", quality=85)
            else:
                img.save(file_path)
                
    except Exception as e:
        logger.warning(f"Image optimization failed: {e}")


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    category: Optional[str] = None,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager))
):
    """
    Upload an image file for menu items.
    - Accepts PNG, JPG, JPEG, WEBP
    - Max file size: 5MB
    - Auto-generates unique filename with category prefix
    - Optimizes image (resizes if too large, compresses)
    """
    ensure_upload_dir()
    
    # Check file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size (read content to verify)
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Reset file position
    await file.seek(0)
    
    # Generate unique filename
    new_filename = generate_unique_filename(file.filename or "image.png", category)
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Validate it's actually an image
        if not validate_image(file_path):
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file"
            )
        
        # Optimize image
        optimize_image(file_path)
        
        # Return the URL path
        image_url = f"/static/uploads/{new_filename}"
        
        logger.info(f"Image uploaded: {new_filename} by {current_user.email}")
        
        return {
            "success": True,
            "data": {
                "url": image_url,
                "filename": new_filename
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        logger.error(f"Upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload image"
        )


@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    current_user: User = Depends(require_roles(UserRole.admin, UserRole.manager))
):
    """Delete an uploaded image"""
    # Sanitize filename to prevent path traversal
    safe_filename = sanitize_filename(filename)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    try:
        os.remove(file_path)
        logger.info(f"Image deleted: {safe_filename} by {current_user.email}")
        return {"success": True, "message": "Image deleted"}
    except Exception as e:
        logger.error(f"Delete error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete image"
        )
