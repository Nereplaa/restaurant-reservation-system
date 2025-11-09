import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
} from '../controllers/order.controller';

const router = Router();

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders (for kitchen/admin)
 * @access  Private (Admin, Kitchen, Server)
 */
router.get('/', 
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.kitchen, UserRole.server),
  getAllOrders
);

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order
 * @access  Private (Admin, Server)
 */
router.post('/',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.server),
  createOrder
);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Private (Admin, Kitchen, Server)
 */
router.get('/:id',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.kitchen, UserRole.server),
  getOrderById
);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin, Kitchen)
 */
router.patch('/:id/status',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.kitchen),
  updateOrderStatus
);

export default router;

