import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @route   GET /api/v1/tables
 * @desc    Get all tables
 * @access  Private (Admin, Server)
 */
router.get('/',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.server, UserRole.manager),
  (req, res) => {
    res.json({ message: 'Get tables - TODO: Implement' });
  }
);

export default router;

