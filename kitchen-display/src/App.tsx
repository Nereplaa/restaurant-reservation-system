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
      setError(err.response?.data?.error?.message || 'Siparişler yüklenemedi');
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
      alert(err.response?.data?.error?.message || 'Durum güncellenemedi');
    }
  };

  // Initialize
  useEffect(() => {
    fetchOrders();

    // Connect to WebSocket
    const socket = socketService.connect();

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('✅ Mutfak Ekranı sunucuya bağlandı');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Listen for new orders
    socketService.onNewOrder((newOrder) => {
      console.log('🔔 Yeni sipariş geldi:', newOrder);
      playNotificationSound();
      fetchOrders();
    });

    // Listen for order updates
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('📝 Sipariş güncellendi:', updatedOrder);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#cfd4dc] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-playfair text-white text-2xl tracking-wide">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-4xl font-semibold text-white tracking-wide mb-2">
              🍽️ Mutfak Ekranı
            </h1>
            <p className="text-[#9aa3b2] tracking-wider text-sm">Anlık Sipariş Takibi</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-[#cfd4dc]">
                {connectionStatus === 'connected' ? 'Bağlı' : 'Bağlantı Yok'}
              </span>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active')}
              className="glass text-white px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#cfd4dc]/50 outline-none cursor-pointer"
            >
              <option value="active" className="bg-[#16233a]">Aktif Siparişler</option>
              <option value="all" className="bg-[#16233a]">Tüm Siparişler</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
              className="glass hover:bg-white/15 text-white font-medium px-5 py-2 rounded-xl transition-all"
            >
              🔄 Yenile
            </button>

            {/* Current Time */}
            <div className="text-right glass rounded-xl px-4 py-2">
              <p className="font-playfair text-2xl font-medium text-white">{new Date().toLocaleTimeString('tr-TR')}</p>
              <p className="text-xs text-[#9aa3b2]">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="glass rounded-2xl p-4 text-center border border-yellow-500/30 status-pending">
            <p className="font-playfair text-4xl font-bold text-yellow-400">{pendingOrders.length}</p>
            <p className="text-sm text-[#cfd4dc] tracking-wider mt-1">Beklemede</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-blue-500/30 status-preparing">
            <p className="font-playfair text-4xl font-bold text-blue-400">{preparingOrders.length}</p>
            <p className="text-sm text-[#cfd4dc] tracking-wider mt-1">Hazırlanıyor</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-green-500/30 status-ready">
            <p className="font-playfair text-4xl font-bold text-green-400">{readyOrders.length}</p>
            <p className="text-sm text-[#cfd4dc] tracking-wider mt-1">Hazır</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center border border-gray-500/30 status-completed">
            <p className="font-playfair text-4xl font-bold text-gray-400">{completedOrders.length}</p>
            <p className="text-sm text-[#cfd4dc] tracking-wider mt-1">Tamamlandı</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 glass border border-red-500/40 text-red-200 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-5xl mb-4">🎉</p>
            <p className="font-playfair text-2xl text-[#cfd4dc]">Aktif sipariş yok</p>
            <p className="text-[#7b8698] mt-2">Yeni siparişler otomatik olarak burada görünecek</p>
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

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-[#7b8698] text-xs tracking-wider">
          BORCELLE • Mutfak Yönetim Sistemi • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
