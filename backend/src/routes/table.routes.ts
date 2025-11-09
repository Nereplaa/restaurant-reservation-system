import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/table.controller';

const router = Router();

/**
 * @route   GET /api/v1/tables
 * @desc    Get all tables
 * @access  Private (Admin, Server, Manager)
 */
router.get('/',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.server, UserRole.manager),
  getAllTables
);

/**
 * @route   GET /api/v1/tables/:id
 * @desc    Get table by ID
 * @access  Private (Admin, Server, Manager)
 */
router.get('/:id',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.server, UserRole.manager),
  getTableById
);

/**
 * @route   POST /api/v1/tables
 * @desc    Create table
 * @access  Private (Admin, Manager)
 */
router.post('/',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.manager),
  createTable
);

/**
 * @route   PUT /api/v1/tables/:id
 * @desc    Update table
 * @access  Private (Admin, Manager)
 */
router.put('/:id',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.manager),
  updateTable
);

/**
 * @route   DELETE /api/v1/tables/:id
 * @desc    Delete table
 * @access  Private (Admin, Manager)
 */
router.delete('/:id',
  authenticateToken,
  authorizeRoles(UserRole.admin, UserRole.manager),
  deleteTable
);

export default router;

