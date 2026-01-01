import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
  elapsedTime: number;
}

export default function OrderCard({ order, onUpdateStatus, elapsedTime }: OrderCardProps) {
  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'status-pending border-yellow-500/50',
      PREPARING: 'status-preparing border-blue-500/50',
      READY: 'status-ready border-green-500/50 animate-pulse-glow',
      SERVED: 'status-completed border-gray-500/50',
      CANCELLED: 'status-completed border-red-500/50',
    };
    return classes[status] || 'status-completed';
  };

  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      PENDING: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      PREPARING: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      READY: 'bg-gradient-to-r from-green-500 to-emerald-500',
      SERVED: 'bg-gradient-to-r from-gray-500 to-gray-600',
      CANCELLED: 'bg-gradient-to-r from-red-500 to-rose-500',
    };
    return classes[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: 'Beklemede',
      PREPARING: 'Hazırlanıyor',
      READY: 'Hazır',
      SERVED: 'Servis Edildi',
      CANCELLED: 'İptal Edildi',
    };
    return texts[status] || status;
  };

  const getTimeColor = (minutes: number) => {
    if (minutes < 10) return 'text-green-400';
    if (minutes < 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} dk`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}dk`;
  };

  const minutes = Math.floor(elapsedTime / 60);

  return (
    <div className={`glass-card rounded-2xl p-5 border-2 ${getStatusClass(order.status)} shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-fade-in-up`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-playfair text-2xl font-semibold text-white tracking-wide">
            Masa {order.table?.tableNumber || '?'}
          </h3>
          <p className="text-xs text-[#9aa3b2] tracking-wider mt-1">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getTimeColor(minutes)} font-playfair`}>
            {formatTime(minutes)}
          </div>
          <p className="text-xs text-[#7b8698] tracking-wider">Süre</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`${getStatusBadgeClass(order.status)} text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="mb-4 max-h-56 overflow-y-auto space-y-2 pr-1">
        {order.orderItems?.map((item, index) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-xl p-3 animate-slide-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-base font-medium text-white flex items-center gap-2">
                  <span className="text-[#cfd4dc] font-bold">{item.quantity}×</span>
                  {item.menuItem?.name || 'Bilinmeyen Ürün'}
                </p>
                {item.specialInstructions && (
                  <p className="text-sm text-amber-400/90 mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {item.specialInstructions}
                  </p>
                )}
                {item.menuItem?.preparationTime && (
                  <p className="text-xs text-[#7b8698] mt-1">
                    ⏱️ {item.menuItem.preparationTime} dakika
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-200">
            <span className="font-semibold text-amber-400">Not:</span> {order.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {order.status !== 'SERVED' && order.status !== 'CANCELLED' && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {order.status === 'PENDING' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="col-span-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              🍳 Hazırlamaya Başla
            </button>
          )}
          {order.status === 'PREPARING' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'READY')}
                className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                ✅ Hazır
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                ❌
              </button>
            </>
          )}
          {order.status === 'READY' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'SERVED')}
              className="col-span-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              🍽️ Servis Edildi
            </button>
          )}
        </div>
      )}

      {/* Completed/Cancelled Badge */}
      {(order.status === 'SERVED' || order.status === 'CANCELLED') && (
        <div className="mt-4 text-center py-2 rounded-xl bg-white/5">
          <p className="text-[#9aa3b2] text-sm font-medium">
            {order.status === 'SERVED' ? '✅ Tamamlandı' : '❌ İptal Edildi'}
          </p>
        </div>
      )}
    </div>
  );
}
