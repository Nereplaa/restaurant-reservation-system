import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/admin/dashboard/stats
 * @access  Private (Admin, Manager)
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Get various statistics in parallel
    const [
      todayReservationsCount,
      upcomingReservationsCount,
      totalCustomers,
      activeOrdersCount,
      availableTablesCount,
      todayOrders,
    ] = await Promise.all([
      // Today's reservations
      prisma.reservation.count({
        where: {
          date: today,
          status: 'confirmed',
        },
      }),
      // Upcoming reservations (next 7 days)
      prisma.reservation.count({
        where: {
          date: {
            gte: today,
            lte: nextWeek,
          },
          status: 'confirmed',
        },
      }),
      // Total registered customers
      prisma.user.count({
        where: {
          role: 'customer',
        },
      }),
      // Active orders
      prisma.order.count({
        where: {
          status: {
            in: ['pending', 'preparing', 'ready'],
          },
        },
      }),
      // Available tables
      prisma.table.count({
        where: {
          status: 'available',
        },
      }),
      // Today's orders
      prisma.order.findMany({
        where: {
          orderTime: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          orderItems: {
            select: {
              priceAtOrder: true,
              quantity: true,
            },
          },
        },
      }),
    ]);

    // Calculate today's revenue
    const todayRevenue = todayOrders.reduce((total, order) => {
      const orderTotal = order.orderItems.reduce((sum, item) => {
        return sum + (Number(item.priceAtOrder) * item.quantity);
      }, 0);
      return total + orderTotal;
    }, 0);

    // Get popular time slots for reservations
    const reservationsByHour = await prisma.reservation.groupBy({
      by: ['time'],
      where: {
        date: {
          gte: today,
        },
        status: 'confirmed',
      },
      _count: {
        time: true,
      },
      orderBy: {
        _count: {
          time: 'desc',
        },
      },
      take: 5,
    });

    const stats = {
      todayReservations: todayReservationsCount,
      upcomingReservations: upcomingReservationsCount,
      totalCustomers,
      activeOrders: activeOrdersCount,
      availableTables: availableTablesCount,
      todayRevenue: todayRevenue.toFixed(2),
      popularTimeSlots: reservationsByHour.map((slot) => ({
        time: slot.time,
        count: slot._count.time,
      })),
    };

    successResponse(res, stats, 'Dashboard statistics retrieved successfully', 200);
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving dashboard statistics', 500);
  }
};

/**
 * @desc    Get all reservations (admin view)
 * @route   GET /api/v1/admin/reservations
 * @access  Private (Admin, Manager)
 */
export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, date, search } = req.query;

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const searchDate = new Date(date as string);
      filter.date = searchDate;
    }

    if (search) {
      filter.OR = [
        { confirmationNumber: { contains: search as string, mode: 'insensitive' } },
        { user: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { user: { lastName: { contains: search as string, mode: 'insensitive' } } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        table: {
          select: {
            id: true,
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
    logger.error('Get all reservations (admin) error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving reservations', 500);
  }
};

/**
 * @desc    Assign table to reservation
 * @route   PATCH /api/v1/admin/reservations/:id/assign-table
 * @access  Private (Admin, Manager)
 */
export const assignTableToReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tableId } = req.body;

    if (!tableId) {
      errorResponse(res, 'VALIDATION_ERROR', 'Table ID is required', 400);
  }

    // Verify reservation exists
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
      return;
    }

    // Verify table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      errorResponse(res, 'NOT_FOUND', 'Table not found', 404);
      return;
  }

    // Check if table capacity is sufficient
    if (table.capacity < reservation.partySize) {
      errorResponse(
        res,
        'INVALID_OPERATION',
        `Table capacity (${table.capacity}) is insufficient for party size (${reservation.partySize})`,
        400
      );
  }

    // Update reservation with table assignment
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        tableId,
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

    logger.info(`Table ${table.tableNumber} assigned to reservation ${id}`);

    successResponse(res, updatedReservation, 'Table assigned successfully', 200);
  } catch (error) {
    logger.error('Assign table to reservation error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error assigning table', 500);
  }
};

/**
 * @desc    Update reservation status
 * @route   PATCH /api/v1/admin/reservations/:id/status
 * @access  Private (Admin, Manager)
 */
export const updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show'];
    if (!status || !validStatuses.includes(status)) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        `Status must be one of: ${validStatuses.join(', ')}`,
        400
      );
  }

    // Find reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
      return;
    }

    // Update status
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        table: {
          select: {
            tableNumber: true,
          },
        },
      },
    });

    logger.info(`Reservation ${id} status updated to ${status}`);

    successResponse(res, updatedReservation, 'Reservation status updated successfully', 200);
  } catch (error) {
    logger.error('Update reservation status error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error updating reservation status', 500);
  }
};

/**
 * @desc    Get all customers
 * @route   GET /api/v1/admin/customers
 * @access  Private (Admin, Manager)
 */
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    // Build filter
    const filter: any = {
      role: 'customer',
    };

    if (search) {
      filter.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    successResponse(
      res,
      {
        count: customers.length,
        customers,
      },
      'Customers retrieved successfully',
      200
    );
  } catch (error) {
    logger.error('Get all customers error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving customers', 500);
  }
};

/**
 * @desc    Get customer details
 * @route   GET /api/v1/admin/customers/:id
 * @access  Private (Admin, Manager)
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        reservations: {
          orderBy: {
            date: 'desc',
          },
          take: 20,
          include: {
            table: {
              select: {
                tableNumber: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      errorResponse(res, 'NOT_FOUND', 'Customer not found', 404);
  }

    successResponse(res, customer, 'Customer details retrieved successfully', 200);
  } catch (error) {
    logger.error('Get customer by ID error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving customer details', 500);
  }
};

