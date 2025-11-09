import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import {
  getDashboardStats,
  getAllReservations,
  assignTableToReservation,
  updateReservationStatus,
  getAllCustomers,
  getCustomerById,
} from '../controllers/admin.controller';
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menu.controller';
import {
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/table.controller';

const router = Router();

// All admin routes require admin or manager role
router.use(authenticateToken);
router.use(authorizeRoles(UserRole.admin, UserRole.manager));

/**
 * @route   GET /api/v1/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin, Manager)
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * @route   GET /api/v1/admin/reservations
 * @desc    Get all reservations with filters
 * @access  Private (Admin, Manager)
 */
router.get('/reservations', getAllReservations);

/**
 * @route   PATCH /api/v1/admin/reservations/:id/assign-table
 * @desc    Assign table to reservation
 * @access  Private (Admin, Manager)
 */
router.patch('/reservations/:id/assign-table', assignTableToReservation);

/**
 * @route   PATCH /api/v1/admin/reservations/:id/status
 * @desc    Update reservation status
 * @access  Private (Admin, Manager)
 */
router.patch('/reservations/:id/status', updateReservationStatus);

/**
 * @route   GET /api/v1/admin/customers
 * @desc    Get all customers
 * @access  Private (Admin, Manager)
 */
router.get('/customers', getAllCustomers);

/**
 * @route   GET /api/v1/admin/customers/:id
 * @desc    Get customer details
 * @access  Private (Admin, Manager)
 */
router.get('/customers/:id', getCustomerById);

/**
 * @route   POST /api/v1/admin/menu
 * @desc    Create menu item
 * @access  Private (Admin, Manager)
 */
router.post('/menu', createMenuItem);

/**
 * @route   PUT /api/v1/admin/menu/:id
 * @desc    Update menu item
 * @access  Private (Admin, Manager)
 */
router.put('/menu/:id', updateMenuItem);

/**
 * @route   DELETE /api/v1/admin/menu/:id
 * @desc    Delete menu item
 * @access  Private (Admin, Manager)
 */
router.delete('/menu/:id', deleteMenuItem);

/**
 * @route   POST /api/v1/admin/tables
 * @desc    Create table
 * @access  Private (Admin, Manager)
 */
router.post('/tables', createTable);

/**
 * @route   PUT /api/v1/admin/tables/:id
 * @desc    Update table
 * @access  Private (Admin, Manager)
 */
router.put('/tables/:id', updateTable);

/**
 * @route   DELETE /api/v1/admin/tables/:id
 * @desc    Delete table
 * @access  Private (Admin, Manager)
 */
router.delete('/tables/:id', deleteTable);

export default router;

