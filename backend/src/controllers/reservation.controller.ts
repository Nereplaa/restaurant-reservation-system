import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Generate a unique confirmation number
 */
const generateConfirmationNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RES-${timestamp}-${random}`;
};

/**
 * @desc    Check availability for date/time
 * @route   GET /api/v1/reservations/availability
 * @access  Public
 */
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time, partySize } = req.query;

    if (!date || !time || !partySize) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Please provide date, time, and party size',
        400
      );
  }

    const partySizeNum = parseInt(partySize as string);

    // Find available tables for the party size
    const availableTables = await prisma.table.findMany({
      where: {
        capacity: {
          gte: partySizeNum,
        },
        status: {
          in: ['available', 'reserved'], // Reserved can be re-reserved at different times
        },
      },
    });

    // Check existing reservations for the same date and time
    const existingReservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date as string),
        time: new Date(`1970-01-01T${time}`),
        status: {
          in: ['confirmed'],
        },
      },
      include: {
        table: true,
      },
    });

    // Calculate available slots
    const reservedTableIds = existingReservations.map((r) => r.tableId);
    const availableTablesForSlot = availableTables.filter(
      (table) => !reservedTableIds.includes(table.id)
    );

    const isAvailable = availableTablesForSlot.length > 0;

    successResponse(
      res,
      {
        isAvailable,
        availableTableCount: availableTablesForSlot.length,
        suggestedTables: availableTablesForSlot.slice(0, 3), // Show top 3 options
      },
      isAvailable ? 'Tables available' : 'No tables available for this time slot',
      200
    );
  } catch (error) {
    logger.error('Check availability error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error checking availability', 500);
  }
};

/**
 * @desc    Get all reservations for authenticated user
 * @route   GET /api/v1/reservations
 * @access  Private (Customer)
 */
export const getUserReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      errorResponse(res, 'UNAUTHORIZED', 'Not authenticated', 401);
  }

    const { status, upcoming } = req.query;

    // Build filter
    const filter: any = { userId };

    if (status) {
      filter.status = status;
    }

    if (upcoming === 'true') {
      filter.date = {
        gte: new Date(),
      };
    }

    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' },
      ],
    });

    successResponse(
      res,
      {
        count: reservations.length,
        reservations,
      },
      'Reservations retrieved successfully',
      200
    );
  } catch (error) {
    logger.error('Get user reservations error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving reservations', 500);
  }
};

/**
 * @desc    Create new reservation
 * @route   POST /api/v1/reservations
 * @access  Private (Customer)
 */
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      errorResponse(res, 'UNAUTHORIZED', 'Not authenticated', 401);
  }

    const { date, time, partySize, specialRequest, tableId } = req.body;

    // Validation
    if (!date || !time || !partySize) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Please provide date, time, and party size',
        400
      );
  }

    // Validate party size
    if (partySize < 1 || partySize > 20) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Party size must be between 1 and 20',
        400
      );
  }

    // Check if date is in the future
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Cannot make reservations for past dates',
        400
      );
  }

    // Check if reservation is at least 2 hours from now for same-day bookings
    const reservationDateTime = new Date(`${date}T${time}`);
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

    if (reservationDateTime < twoHoursFromNow) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Reservations must be at least 2 hours in advance',
        400
      );
  }

    // Check if date is within 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    if (reservationDate > thirtyDaysFromNow) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        'Reservations can only be made up to 30 days in advance',
        400
      );
  }

    // If tableId provided, check if table is available
    if (tableId) {
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          tableId,
          date: reservationDate,
          time: new Date(`1970-01-01T${time}`),
          status: 'confirmed',
        },
      });

      if (existingReservation) {
        errorResponse(
          res,
          'TABLE_UNAVAILABLE',
          'This table is already reserved for the selected time',
          409
        );
  }
    }

    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber();

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        tableId: tableId || null,
        date: reservationDate,
        time: new Date(`1970-01-01T${time}`),
        partySize,
        specialRequest: specialRequest || null,
        confirmationNumber,
        status: 'confirmed',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });

    logger.info(`New reservation created: ${confirmationNumber} by user ${userId}`);

    successResponse(res, reservation, 'Reservation created successfully', 201);
  } catch (error) {
    logger.error('Create reservation error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error creating reservation', 500);
  }
};

/**
 * @desc    Get reservation by ID
 * @route   GET /api/v1/reservations/:id
 * @access  Private
 */
export const getReservationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });

    if (!reservation) {
      errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
      return;
   }

    // Check if user owns this reservation or is admin
    if (reservation.userId !== userId && !['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
      return;
   }

    successResponse(res, reservation, 'Reservation retrieved successfully', 200);
  } catch (error) {
    logger.error('Get reservation by ID error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving reservation', 500);
  }
};

/**
 * @desc    Update reservation
 * @route   PUT /api/v1/reservations/:id
 * @access  Private (Customer - own reservation)
 */
export const updateReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { id } = req.params;
    const { date, time, partySize, specialRequest, tableId } = req.body;

    // Find reservation
    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
      return;
   }

    // Check if user owns this reservation or is admin
    if (existingReservation.userId !== userId && !['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
      return;
   }

    // Cannot modify cancelled reservations
    if (existingReservation.status === 'cancelled') {
      errorResponse(res, 'INVALID_OPERATION', 'Cannot modify cancelled reservation', 400);
      return;
  }

    // Build update data
    const updateData: any = {};

    if (date) {
      const reservationDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (reservationDate < today) {
        errorResponse(res, 'VALIDATION_ERROR', 'Cannot set past dates', 400);
  }

      updateData.date = reservationDate;
    }

    if (time) {
      updateData.time = new Date(`1970-01-01T${time}`);
    }

    if (partySize) {
      if (partySize < 1 || partySize > 20) {
        errorResponse(res, 'VALIDATION_ERROR', 'Party size must be between 1 and 20', 400);
  }
      updateData.partySize = partySize;
    }

    if (specialRequest !== undefined) {
      updateData.specialRequest = specialRequest || null;
    }

    if (tableId !== undefined) {
      updateData.tableId = tableId || null;
    }

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
            capacity: true,
            location: true,
          },
        },
      },
    });

    logger.info(`Reservation updated: ${id} by user ${userId}`);

    successResponse(res, updatedReservation, 'Reservation updated successfully', 200);
  } catch (error) {
    logger.error('Update reservation error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error updating reservation', 500);
  }
};

/**
 * @desc    Cancel reservation
 * @route   DELETE /api/v1/reservations/:id
 * @access  Private (Customer - own reservation)
 */
export const cancelReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { id } = req.params;

    // Find reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
      return;
   }

    // Check if user owns this reservation or is admin
    if (reservation.userId !== userId && !['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
      return;
   }

    // Check if already cancelled
    if (reservation.status === 'cancelled') {
      errorResponse(res, 'INVALID_OPERATION', 'Reservation already cancelled', 400);
      return;
   }

    // Check if cancellation is at least 2 hours before reservation
    const reservationDateTime = new Date(reservation.date);
    const [hours, minutes] = reservation.time.toISOString().split('T')[1].split(':');
    reservationDateTime.setHours(parseInt(hours), parseInt(minutes));

    const twoHoursBefore = new Date(reservationDateTime);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);

    if (new Date() > twoHoursBefore) {
      errorResponse(
        res,
        'INVALID_OPERATION',
        'Reservations can only be cancelled up to 2 hours before the scheduled time',
        400
      );
  }

    // Cancel reservation (soft delete by updating status)
    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
      include: {
        table: {
          select: {
            tableNumber: true,
          },
        },
      },
    });

    logger.info(`Reservation cancelled: ${id} by user ${userId}`);

    successResponse(res, cancelledReservation, 'Reservation cancelled successfully', 200);
  } catch (error) {
    logger.error('Cancel reservation error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error cancelling reservation', 500);
  }
};

