import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * @desc    Get all tables
 * @route   GET /api/v1/tables
 * @access  Private (Admin, Server, Manager)
 */
export const getAllTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, capacity } = req.query;

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (capacity) {
      filter.capacity = {
        gte: parseInt(capacity as string),
      };
    }

    const tables = await prisma.table.findMany({
      where: filter,
      orderBy: [
        { tableNumber: 'asc' },
      ],
      include: {
        _count: {
          select: {
            reservations: true,
            orders: true,
          },
        },
      },
    });

    successResponse(
      res,
      {
        count: tables.length,
        tables,
      },
      'Tables retrieved successfully',
      200
    );
  } catch (error) {
    logger.error('Get all tables error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving tables', 500);
  }
};

/**
 * @desc    Get table by ID
 * @route   GET /api/v1/tables/:id
 * @access  Private (Admin, Server, Manager)
 */
export const getTableById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            date: {
              gte: new Date(),
            },
            status: 'confirmed',
          },
          orderBy: {
            date: 'asc',
          },
          take: 10,
        },
        orders: {
          where: {
            status: {
              in: ['pending', 'preparing', 'ready'],
            },
          },
          orderBy: {
            orderTime: 'desc',
          },
          include: {
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    name: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!table) {
      errorResponse(res, 'NOT_FOUND', 'Table not found', 404);
  }

    successResponse(res, table, 'Table retrieved successfully', 200);
  } catch (error) {
    logger.error('Get table by ID error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving table', 500);
  }
};

/**
 * @desc    Create table
 * @route   POST /api/v1/tables
 * @access  Private (Admin, Manager)
 */
export const createTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const { tableNumber, capacity, location } = req.body;

    // Validation
    if (!tableNumber || !capacity) {
      errorResponse(res, 'VALIDATION_ERROR', 'Please provide table number and capacity', 400);
  }

    // Validate capacity
    if (capacity < 1 || capacity > 20) {
      errorResponse(res, 'VALIDATION_ERROR', 'Capacity must be between 1 and 20', 400);
  }

    // Check if table number already exists
    const existingTable = await prisma.table.findUnique({
      where: { tableNumber },
    });

    if (existingTable) {
      errorResponse(res, 'TABLE_EXISTS', 'Table with this number already exists', 409);
  }

    // Create table
    const table = await prisma.table.create({
      data: {
        tableNumber,
        capacity,
        location: location || null,
        status: 'available',
      },
    });

    logger.info(`New table created: ${tableNumber}`);

    successResponse(res, table, 'Table created successfully', 201);
  } catch (error) {
    logger.error('Create table error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error creating table', 500);
  }
};

/**
 * @desc    Update table
 * @route   PUT /api/v1/tables/:id
 * @access  Private (Admin, Manager)
 */
export const updateTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const { id } = req.params;
    const { tableNumber, capacity, location, status } = req.body;

    // Check if table exists
    const existingTable = await prisma.table.findUnique({
      where: { id },
    });

    if (!existingTable) {
      errorResponse(res, 'NOT_FOUND', 'Table not found', 404);
      return;
   }

    // Build update data
    const updateData: any = {};

    if (tableNumber !== undefined) {
      // Check if new table number is already in use
      if (tableNumber !== existingTable.tableNumber) {
        const tableWithNumber = await prisma.table.findUnique({
          where: { tableNumber },
        });

        if (tableWithNumber) {
          errorResponse(res, 'TABLE_EXISTS', 'Table with this number already exists', 409);
  }
      }
      updateData.tableNumber = tableNumber;
    }

    if (capacity !== undefined) {
      if (capacity < 1 || capacity > 20) {
        errorResponse(res, 'VALIDATION_ERROR', 'Capacity must be between 1 and 20', 400);
  }
      updateData.capacity = capacity;
    }

    if (location !== undefined) {
      updateData.location = location || null;
    }

    if (status !== undefined) {
      const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
      if (!validStatuses.includes(status)) {
        errorResponse(
          res,
          'VALIDATION_ERROR',
          `Status must be one of: ${validStatuses.join(', ')}`,
          400
        );
  }
      updateData.status = status;
    }

    // Update table
    const updatedTable = await prisma.table.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Table updated: ${id} - ${updatedTable.tableNumber}`);

    successResponse(res, updatedTable, 'Table updated successfully', 200);
  } catch (error) {
    logger.error('Update table error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error updating table', 500);
  }
};

/**
 * @desc    Delete table
 * @route   DELETE /api/v1/tables/:id
 * @access  Private (Admin, Manager)
 */
export const deleteTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user?.role;

    if (!['admin', 'manager'].includes(userRole)) {
      errorResponse(res, 'FORBIDDEN', 'Access denied', 403);
  }

    const { id } = req.params;

    // Check if table exists
    const existingTable = await prisma.table.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: true,
            orders: true,
          },
        },
      },
    });

    if (!existingTable) {
      errorResponse(res, 'NOT_FOUND', 'Table not found', 404);
      return;
   }

    // Check if table has active reservations or orders
    if (existingTable._count.reservations > 0 || existingTable._count.orders > 0) {
      errorResponse(
        res,
        'INVALID_OPERATION',
        'Cannot delete table with existing reservations or orders. Set to maintenance instead.',
        400
      );
  }

    // Delete table
    await prisma.table.delete({
      where: { id },
    });

    logger.info(`Table deleted: ${id} - ${existingTable.tableNumber}`);

    successResponse(res, null, 'Table deleted successfully', 200);
  } catch (error) {
    logger.error('Delete table error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error deleting table', 500);
  }
};

