import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  checkAvailability,
  getUserReservations,
  createReservation,
  getReservationById,
  updateReservation,
  cancelReservation,
} from '../controllers/reservation.controller';

const router = Router();

/**
 * @route   GET /api/v1/reservations/availability
 * @desc    Check availability for date/time
 * @access  Public
 */
router.get('/availability', checkAvailability);

/**
 * @route   GET /api/v1/reservations
 * @desc    Get all reservations for authenticated user
 * @access  Private (Customer)
 */
router.get('/', authenticateToken, getUserReservations);

/**
 * @route   POST /api/v1/reservations
 * @desc    Create new reservation
 * @access  Private (Customer)
 */
router.post('/', authenticateToken, createReservation);

/**
 * @route   GET /api/v1/reservations/:id
 * @desc    Get reservation by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, getReservationById);

/**
 * @route   PUT /api/v1/reservations/:id
 * @desc    Update reservation
 * @access  Private (Customer - own reservation)
 */
router.put('/:id', authenticateToken, updateReservation);

/**
 * @route   DELETE /api/v1/reservations/:id
 * @desc    Cancel reservation
 * @access  Private (Customer - own reservation)
 */
router.delete('/:id', authenticateToken, cancelReservation);

export default router;

