import { useState, useEffect } from 'react';
import api from '../services/api';
import { Order } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 30 seconds
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
      setError(err.response?.data?.error?.message || 'Failed to load orders');
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
      alert(err.response?.data?.error?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-blue-100 text-blue-800',
      READY: 'bg-green-100 text-green-800',
      SERVED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600 mt-1">View and manage all orders</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'ALL' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStatus === status 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Order #{order.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-600">
                  Table {order.table?.tableNumber || 'N/A'}
                </p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Created:</span>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </div>
              {order.user && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Customer:</span>{' '}
                  {order.user.firstName} {order.user.lastName}
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-600">
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>

            {order.notes && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Notes:</span> {order.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-lg transition-colors"
              >
                View Details
              </button>
              {order.status !== 'SERVED' && order.status !== 'CANCELLED' && (
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="SERVED">Served</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Order Details</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <p className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Table:</span>
                  <p className="font-medium">{selectedOrder.table?.tableNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <p className="font-medium text-blue-600 text-lg">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">Created At:</span>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.menuItem?.name || 'Unknown Item'}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>
                          )}
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Notes:</span>
                  <p className="text-gray-700 mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedOrder(null);
              }}
              className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'].map(status => (
          <div key={status} className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-2">{status}</p>
            <p className="text-3xl font-bold text-gray-800">
              {orders.filter(o => o.status === status).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

