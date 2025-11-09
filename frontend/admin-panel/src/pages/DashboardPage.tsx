import { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardStats, Reservation } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reservationsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/reservations', { params: { limit: 5 } })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (reservationsRes.data.success) {
        setRecentReservations(reservationsRes.data.data.reservations);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
    <div className={`${color} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SEATED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Reservations"
          value={stats?.todayReservations || 0}
          icon="📅"
          color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        />
        <StatCard
          title="Today's Revenue"
          value={stats?.todayRevenue || 0}
          icon="💰"
          color="bg-gradient-to-br from-green-500 to-green-600 text-white"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon="👥"
          color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders || 0}
          icon="📝"
          color="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
        />
        <StatCard
          title="Available Tables"
          value={stats?.availableTables || 0}
          icon="🪑"
          color="bg-gradient-to-br from-teal-500 to-teal-600 text-white"
        />
        <StatCard
          title="Occupied Tables"
          value={stats?.occupiedTables || 0}
          icon="✅"
          color="bg-gradient-to-br from-red-500 to-red-600 text-white"
        />
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Reservations</h2>
          <a href="/reservations" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </a>
        </div>

        {recentReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent reservations</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirmation #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.confirmationNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.user ? `${reservation.user.firstName} ${reservation.user.lastName}` : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.reservationDate).toLocaleDateString()} {reservation.reservationTime}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.guestCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

