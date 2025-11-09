import { useState, useEffect, useCallback } from 'react';
import api from './services/api';
import socketService from './services/socket';
import OrderCard from './components/OrderCard';
import { Order } from './types';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Audio notification
  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBio=');
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      if (response.data.success) {
        fetchOrders();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update order status');
    }
  };

  // Initialize
  useEffect(() => {
    fetchOrders();

    // Connect to WebSocket
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('✅ Kitchen Display connected to server');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Listen for new orders
    socketService.onNewOrder((newOrder) => {
      console.log('🔔 New order received:', newOrder);
      playNotificationSound();
      fetchOrders();
    });

    // Listen for order updates
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('📝 Order updated:', updatedOrder);
      fetchOrders();
    });

    // Refresh orders every 30 seconds
    const refreshInterval = setInterval(fetchOrders, 30000);

    // Update current time every second for timers
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
      socketService.disconnect();
    };
  }, [fetchOrders]);

  const filteredOrders = filter === 'active'
    ? orders.filter(o => o.status !== 'SERVED' && o.status !== 'CANCELLED')
    : orders;

  const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING');
  const preparingOrders = filteredOrders.filter(o => o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter(o => o.status === 'READY');
  const completedOrders = filteredOrders.filter(o => o.status === 'SERVED' || o.status === 'CANCELLED');

  const getElapsedTime = (createdAt: string) => {
    return Math.floor((currentTime - new Date(createdAt).getTime()) / 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">🍽️ Kitchen Display System</h1>
            <p className="text-gray-400">Real-time Order Management</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active')}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="active">Active Orders</option>
              <option value="all">All Orders</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>

            {/* Current Time */}
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{new Date().toLocaleTimeString()}</p>
              <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-yellow-900 bg-opacity-50 border-2 border-yellow-600 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{pendingOrders.length}</p>
            <p className="text-sm text-gray-300">Pending</p>
          </div>
          <div className="bg-blue-900 bg-opacity-50 border-2 border-blue-600 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{preparingOrders.length}</p>
            <p className="text-sm text-gray-300">Preparing</p>
          </div>
          <div className="bg-green-900 bg-opacity-50 border-2 border-green-600 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{readyOrders.length}</p>
            <p className="text-sm text-gray-300">Ready</p>
          </div>
          <div className="bg-gray-700 bg-opacity-50 border-2 border-gray-600 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-400">{completedOrders.length}</p>
            <p className="text-sm text-gray-300">Completed</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-3xl text-gray-500 mb-4">🎉</p>
            <p className="text-xl text-gray-400">No active orders</p>
            <p className="text-gray-500 mt-2">New orders will appear here automatically</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              elapsedTime={getElapsedTime(order.createdAt)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;

