"""
Response formatting utilities
"""
from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    data: Any,
    message: str = "Success",
    status_code: int = 200
) -> JSONResponse:
    """
    Format a success response
    
    Args:
        data: Response data
        message: Success message
        status_code: HTTP status code
        
    Returns:
        JSONResponse with formatted data
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )


def error_response(
    error_code: str,
    message: str,
    status_code: int = 400,
    details: Optional[dict] = None
) -> JSONResponse:
    """
    Format an error response
    
    Args:
        error_code: Error code identifier
        message: Error message
        status_code: HTTP status code
        details: Optional additional error details
        
    Returns:
        JSONResponse with formatted error
    """
    content = {
        "success": False,
        "error": {
            "code": error_code,
            "message": message
        }
    }
    
    if details:
        content["error"]["details"] = details
    
    return JSONResponse(
        status_code=status_code,
        content=content
    )

