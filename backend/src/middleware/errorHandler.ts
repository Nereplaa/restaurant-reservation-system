import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/responseFormatter';
import { ErrorCode } from '../types';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  // Default error
  let statusCode = 500;
  let code = ErrorCode.INTERNAL_ERROR;
  let message = 'An unexpected error occurred';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = ErrorCode.VALIDATION_ERROR;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    code = ErrorCode.UNAUTHORIZED;
    message = 'Authentication required';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    code = ErrorCode.DUPLICATE_EMAIL;
    message = 'A record with this value already exists';
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    code = ErrorCode.NOT_FOUND;
    message = 'Resource not found';
  }
  
  return errorResponse(res, code, message, statusCode, 
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
}

