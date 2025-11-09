import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// JWT secret from environment variable
const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key-change-this') as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as string;

/**
 * Generate JWT token
 */
const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as any);
};

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Please provide email, password, first name, and last name',
        400
      );
  }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorResponse(res, 'VALIDATION_ERROR', 'Invalid email format', 400);
  }

    // Password strength validation
    if (password.length < 8) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Password must be at least 8 characters long',
        400
      );
  }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      errorResponse(res, 'USER_EXISTS', 'User with this email already exists', 409);
  }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: 'customer',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    logger.info(`New user registered: ${user.email}`);

    successResponse(
      res,
      {
        user,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    logger.error('Registration error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error registering user', 500);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      errorResponse(res, 'VALIDATION_ERROR', 'Please provide email and password', 400);
  }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      return;
   }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      return;
   }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${user.email}`);

    successResponse(
      res,
      {
        user: userWithoutPassword,
        token,
      },
      'Login successful',
      200
    );
  } catch (error) {
    logger.error('Login error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error logging in', 500);
  }
};

/**
 * @desc    Get current authenticated user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User ID is attached to req by authenticateToken middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      errorResponse(res, 'UNAUTHORIZED', 'Not authenticated', 401);
  }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      errorResponse(res, 'USER_NOT_FOUND', 'User not found', 404);
  }

    successResponse(res, user, 'User retrieved successfully', 200);
  } catch (error) {
    logger.error('Get current user error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving user', 500);
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // With JWT, logout is mainly handled client-side by removing the token
  // Here we just return a success message
  successResponse(res, null, 'Logout successful', 200);
};

