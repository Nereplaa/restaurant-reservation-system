import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:7001';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewOrder(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  onOrderUpdated(callback: (order: any) => void) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();

