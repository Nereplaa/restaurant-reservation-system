import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Reservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  specialRequest: string | null;
  confirmationNumber: string;
  table: {
    tableNumber: string;
    capacity: number;
    location: string | null;
  } | null;
  createdAt: string;
}

const ReservationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user, filter]);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const queryParam = filter === 'upcoming' ? '?upcoming=true' : '';
      const response = await api.get(`/reservations${queryParam}`);
      if (response.data.success) {
        setReservations(response.data.data.reservations);
      }
    } catch (err: any) {
      setError('Failed to load reservations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await api.delete(`/reservations/${id}`);
      if (response.data.success) {
        alert('Reservation cancelled successfully');
        fetchReservations();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view reservations</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">My Reservations</h1>
          <p className="text-xl text-gray-100">
            View and manage your restaurant reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={() => navigate('/booking')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + New Reservation
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
            {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reservations Found</h3>
            <p className="text-gray-600 mb-6">
              You don't have any {filter === 'upcoming' ? 'upcoming' : ''} reservations yet.
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Make Your First Reservation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status.toUpperCase()}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        #{reservation.confirmationNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Date</div>
                        <div className="font-semibold text-gray-900">
                          {formatDate(reservation.date)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Time</div>
                        <div className="font-semibold text-gray-900">
                          {formatTime(reservation.time)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Party Size</div>
                        <div className="font-semibold text-gray-900">
                          {reservation.partySize} Guest{reservation.partySize > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {reservation.table && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Table:</span> {reservation.table.tableNumber}
                        {reservation.table.location && ` (${reservation.table.location})`}
                      </div>
                    )}

                    {reservation.specialRequest && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Special Request:</span>{' '}
                        {reservation.specialRequest}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    {reservation.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {reservation.status === 'completed' && (
                      <div className="text-green-600 font-medium text-sm">✓ Completed</div>
                    )}
                    {reservation.status === 'cancelled' && (
                      <div className="text-red-600 font-medium text-sm">✕ Cancelled</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;

