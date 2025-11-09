import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { register, login, getCurrentUser, logout } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new customer
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

export default router;

