import { useState, useEffect } from 'react';
import api from '../services/api';
import { Order } from '../types';
import CustomSelect from '../components/CustomSelect';

const orderStatusOptions = [
  { value: 'pending', label: 'Beklemede' },
  { value: 'preparing', label: 'Hazirlaniyor' },
  { value: 'ready', label: 'Hazir' },
  { value: 'served', label: 'Servis Edildi' },
  { value: 'cancelled', label: 'Iptal' },
];

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  preparing: 'Hazirlaniyor',
  ready: 'Hazir',
  served: 'Servis Edildi',
  cancelled: 'Iptal',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Siparisler yuklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      if (response.data.success) {
        fetchOrders();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Siparis durumu guncellenemedi');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'badge badge-warn',
      preparing: 'badge badge-info',
      ready: 'badge badge-ok',
      served: 'badge',
      cancelled: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Yukleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Siparisler
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Tum siparisleri goruntuleyin ve yonetin
          </p>
        </div>
        <span className="pill">
          <span className="dot"></span>
          Canli Guncellemeler
        </span>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 mb-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-2 rounded-full text-[12px] tracking-wider uppercase transition-all ${filterStatus === 'ALL'
            ? 'btn-primary'
            : 'btn-secondary'
            }`}
        >
          Tumu
        </button>
        {['pending', 'preparing', 'ready', 'served', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-2 rounded-full text-[12px] tracking-wider uppercase transition-all ${filterStatus === status
              ? 'btn-primary'
              : 'btn-secondary'
              }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-card rounded-2xl p-4 hover:border-[#cfd4dc]/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-medium text-white">
                  Siparis #{order.id.slice(0, 8)}
                </h3>
                <p className="text-xs text-white/60">
                  Masa {order.table?.tableNumber || 'Bilinmiyor'}
                </p>
              </div>
              <span className={getStatusBadge(order.status)}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="mb-3 text-xs text-white/60 space-y-1">
              <p>Olusturuldu: {new Date(order.createdAt).toLocaleString('tr-TR')}</p>
              {order.user && (
                <p>Musteri: {order.user.firstName} {order.user.lastName}</p>
              )}
            </div>

            <div className="mb-3">
              <div className="text-xl font-medium text-[#cfd4dc]">
                {order.totalAmount.toFixed(2)} TL
              </div>
            </div>

            {order.notes && (
              <div className="mb-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-white/80">
                  <span className="font-medium">Notlar:</span> {order.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
                className="flex-1 btn-secondary px-3 py-2 rounded-[12px] text-[12px]"
              >
                Detaylar
              </button>
              {order.status !== 'served' && order.status !== 'cancelled' && (
                <div className="flex-1">
                  <CustomSelect
                    options={orderStatusOptions}
                    value={order.status}
                    onChange={(value) => handleUpdateStatus(order.id, value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-10 glass-panel rounded-2xl text-white/60">
          <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
            🧾
          </div>
          <p className="text-[13px]">Siparis bulunamadi</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-12 gap-3.5">
        {['pending', 'preparing', 'ready', 'served', 'cancelled'].map(status => (
          <div key={status} className="col-span-2 kpi-card text-center">
            <div className="kpi-value">{orders.filter(o => o.status === status).length}</div>
            <div className="kpi-label mt-1">{statusLabels[status]}</div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <h3 className="font-playfair text-xl font-medium text-white mb-6">
              Siparis Detaylari
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Siparis ID</span>
                  <p className="text-white font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Durum</span>
                  <p><span className={getStatusBadge(selectedOrder.status)}>{statusLabels[selectedOrder.status]}</span></p>
                </div>
                <div>
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Masa</span>
                  <p className="text-white font-medium">{selectedOrder.table?.tableNumber || 'Bilinmiyor'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Toplam Tutar</span>
                  <p className="text-[#cfd4dc] font-medium text-lg">{selectedOrder.totalAmount.toFixed(2)} TL</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Olusturulma Tarihi</span>
                  <p className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</p>
                </div>
              </div>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div>
                  <h4 className="text-[11px] text-white/60 uppercase tracking-wider mb-3">Siparis Kalemleri</h4>
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="text-white font-medium">{item.menuItem?.name || 'Bilinmeyen Urun'}</p>
                          <p className="text-xs text-white/60">Adet: {item.quantity}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-white/50 mt-1">{item.specialInstructions}</p>
                          )}
                        </div>
                        <p className="text-[#cfd4dc] font-medium">{(item.price * item.quantity).toFixed(2)} TL</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-[11px] text-white/60 uppercase tracking-wider">Notlar</span>
                  <p className="text-white/90 mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedOrder(null);
              }}
              className="w-full mt-6 btn-secondary py-3 rounded-[14px] font-medium"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
