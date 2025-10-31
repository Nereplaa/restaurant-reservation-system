import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { errorResponse } from '../utils/responseFormatter';
import { ErrorCode } from '../types';
import { UserRole } from '@prisma/client';

/**
 * Verify JWT token and attach user to request
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return errorResponse(
      res,
      ErrorCode.UNAUTHORIZED,
      'Access token required',
      401
    );
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: UserRole;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(
      res,
      ErrorCode.INVALID_TOKEN,
      'Invalid or expired token',
      403
    );
  }
}

/**
 * Authorize specific roles
 */
export function authorizeRoles(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return errorResponse(
        res,
        ErrorCode.UNAUTHORIZED,
        'Authentication required',
        401
      );
    }
    
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        ErrorCode.FORBIDDEN,
        'You do not have permission to perform this action',
        403
      );
    }
    
    next();
  };
}

