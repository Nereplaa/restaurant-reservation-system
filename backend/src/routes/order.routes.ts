import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders (for kitchen/admin)
 * @access  Private (Admin, Kitchen, Server)
 */
router.get('/', 
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.kitchen, UserRole.server),
  (req, res) => {
    res.json({ message: 'Get orders - TODO: Implement' });
  }
);

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order
 * @access  Private (Admin, Server)
 */
router.post('/',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.server),
  (req, res) => {
    res.json({ message: 'Create order - TODO: Implement' });
  }
);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status
 * @access  Private (Admin, Kitchen)
 */
router.patch('/:id/status',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.kitchen),
  (req, res) => {
    res.json({ message: `Update order ${req.params.id} status - TODO: Implement` });
  }
);

export default router;

