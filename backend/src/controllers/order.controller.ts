import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Generate a unique order number
 */
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private (Admin, Kitchen, Server)
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, tableId, date } = req.query;

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (tableId) {
      filter.tableId = tableId;
    }

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);

      filter.orderTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        table: {
          select: {
            tableNumber: true,
            location: true,
          },
        },
        reservation: {
          select: {
            confirmationNumber: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
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
      orderBy: {
        orderTime: 'desc',
      },
    });

    successResponse(
      res,
      {
        count: orders.length,
        orders,
      },
      'Orders retrieved successfully',
      200
    );
  } catch (error) {
    logger.error('Get all orders error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving orders', 500);
  }
};

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private (Admin, Server)
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reservationId, tableId, orderItems, notes } = req.body;

    // Validation
    if (!tableId) {
      errorResponse(res, 'VALIDATION_ERROR', 'Table ID is required', 400);
  }

    if (!orderItems || orderItems.length === 0) {
      errorResponse(res, 'VALIDATION_ERROR', 'Order must have at least one item', 400);
  }

    // Verify table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      errorResponse(res, 'NOT_FOUND', 'Table not found', 404);
  }

    // Verify reservation if provided
    if (reservationId) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        errorResponse(res, 'NOT_FOUND', 'Reservation not found', 404);
  }
    }

    // Verify all menu items exist and get their prices
    const menuItemIds = orderItems.map((item: any) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      errorResponse(res, 'NOT_FOUND', 'One or more menu items not found', 404);
  }

    // Create price map
    const priceMap = new Map(menuItems.map((item) => [item.id, item.price]));

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          reservationId: reservationId || null,
          tableId,
          status: 'pending',
          notes: notes || null,
        },
      });

      // Create order items
      const orderItemsData = orderItems.map((item: any) => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity || 1,
        priceAtOrder: priceMap.get(item.menuItemId) || 0,
        specialNotes: item.specialNotes || null,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // Return full order with items
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          table: {
            select: {
              tableNumber: true,
              location: true,
            },
          },
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true,
                  category: true,
                  preparationTime: true,
                },
              },
            },
          },
        },
      });
    });

    logger.info(`New order created: ${orderNumber}`);

    // Emit socket event for real-time updates
    const io = (req as any).app.get('io');
    if (io) {
      io.emit('order:created', order);
    }

    successResponse(res, order, 'Order created successfully', 201);
  } catch (error) {
    logger.error('Create order error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error creating order', 500);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private (Admin, Kitchen)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const validStatuses = ['pending', 'preparing', 'ready', 'served', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      errorResponse(
        res,
        'VALIDATION_ERROR',
        `Status must be one of: ${validStatuses.join(', ')}`,
        400
      );
  }

    // Find order
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      errorResponse(res, 'NOT_FOUND', 'Order not found', 404);
      return;
   }

    // Prepare update data
    const updateData: any = { status };

    // Set readyTime when status changes to 'ready'
    if (status === 'ready' && existingOrder.status !== 'ready') {
      updateData.readyTime = new Date();
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        table: {
          select: {
            tableNumber: true,
            location: true,
          },
        },
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
    });

    logger.info(`Order status updated: ${id} to ${status}`);

    // Emit socket event for real-time updates
    const io = (req as any).app.get('io');
    if (io) {
      io.emit('order:statusUpdated', updatedOrder);
    }

    successResponse(res, updatedOrder, 'Order status updated successfully', 200);
  } catch (error) {
    logger.error('Update order status error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error updating order status', 500);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        table: {
          select: {
            tableNumber: true,
            location: true,
            capacity: true,
          },
        },
        reservation: {
          select: {
            confirmationNumber: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                name: true,
                description: true,
                category: true,
                price: true,
                preparationTime: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      errorResponse(res, 'NOT_FOUND', 'Order not found', 404);
  }

    successResponse(res, order, 'Order retrieved successfully', 200);
  } catch (error) {
    logger.error('Get order by ID error:', error);
    errorResponse(res, 'SERVER_ERROR', 'Error retrieving order', 500);
  }
};

