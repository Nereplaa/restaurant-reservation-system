import { Response } from 'express';
import { ApiResponse, ApiError } from '../types';

/**
 * Format success response
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  
  return res.status(statusCode).json(response);
}

/**
 * Format error response
 */
export function errorResponse(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): Response {
  const response: ApiError = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  
  return res.status(statusCode).json(response);
}

