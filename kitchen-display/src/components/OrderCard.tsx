import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
  elapsedTime: number;
}

export default function OrderCard({ order, onUpdateStatus, elapsedTime }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500',
      PREPARING: 'bg-blue-500',
      READY: 'bg-green-500',
      SERVED: 'bg-gray-500',
      CANCELLED: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTimeColor = (minutes: number) => {
    if (minutes < 10) return 'text-green-400';
    if (minutes < 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const minutes = Math.floor(elapsedTime / 60);

  return (
    <div className={`bg-gray-800 rounded-2xl p-6 border-4 ${getStatusColor(order.status)} shadow-2xl hover:shadow-3xl transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Table {order.table?.tableNumber || 'N/A'}
          </h3>
          <p className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getTimeColor(minutes)}`}>
            {formatTime(minutes)}
          </div>
          <p className="text-xs text-gray-400">Elapsed</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`${getStatusColor(order.status)} text-white px-4 py-2 rounded-full text-sm font-bold uppercase`}>
          {order.status}
        </span>
      </div>

      {/* Order Items */}
      <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
        {order.orderItems?.map((item) => (
          <div key={item.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-lg font-semibold text-white">
                  {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                </p>
                {item.specialInstructions && (
                  <p className="text-sm text-yellow-400 mt-1">
                    ⚠️ {item.specialInstructions}
                  </p>
                )}
                {item.menuItem?.preparationTime && (
                  <p className="text-xs text-gray-400 mt-1">
                    ⏱️ {item.menuItem.preparationTime} min
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
          <p className="text-sm text-yellow-200">
            <span className="font-semibold">Notes:</span> {order.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {order.status !== 'SERVED' && order.status !== 'CANCELLED' && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {order.status === 'PENDING' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'PREPARING' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'READY')}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Mark Ready
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          {order.status === 'READY' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'SERVED')}
              className="col-span-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Mark as Served
            </button>
          )}
        </div>
      )}

      {/* Completed/Cancelled Badge */}
      {(order.status === 'SERVED' || order.status === 'CANCELLED') && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            {order.status === 'SERVED' ? '✅ Completed' : '❌ Cancelled'}
          </p>
        </div>
      )}
    </div>
  );
}

