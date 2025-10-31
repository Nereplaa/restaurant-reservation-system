import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export function initializeSocketIO(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    
    // Authenticate socket connection
    socket.on('authenticate', (data: { token: string }) => {
      try {
        const decoded = jwt.verify(data.token, process.env.JWT_SECRET!);
        socket.data.user = decoded;
        socket.emit('authenticated', { success: true });
        logger.info(`Socket authenticated: ${socket.id}`);
      } catch (error) {
        socket.emit('unauthorized', { success: false, message: 'Invalid token' });
        socket.disconnect();
      }
    });
    
    // Join kitchen room (for kitchen staff)
    socket.on('join_kitchen', () => {
      socket.join('kitchen');
      logger.info(`Socket ${socket.id} joined kitchen room`);
      socket.emit('joined_kitchen', { success: true });
    });
    
    // Update order status
    socket.on('update_order_status', (data: { orderId: string; status: string }) => {
      // TODO: Implement actual order status update
      // This would call the order service to update the status
      logger.info(`Order ${data.orderId} status updated to ${data.status}`);
      
      // Broadcast to all clients in kitchen room
      io.to('kitchen').emit('order_updated', {
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}

/**
 * Emit new order to kitchen displays
 * This function can be called from order controller when new order is created
 */
export function emitNewOrder(io: SocketIOServer, orderData: any): void {
  io.to('kitchen').emit('new_order', orderData);
  logger.info(`New order ${orderData.id} emitted to kitchen`);
}

/**
 * Emit order deletion
 */
export function emitOrderDeleted(io: SocketIOServer, orderId: string): void {
  io.to('kitchen').emit('order_deleted', { orderId });
  logger.info(`Order ${orderId} deletion emitted to kitchen`);
}

