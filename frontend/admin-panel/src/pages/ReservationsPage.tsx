import { useState, useEffect } from 'react';
import api from '../services/api';
import { Reservation, Table } from '../types';
import CustomSelect from '../components/CustomSelect';

const reservationStatusOptions = [
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

const filterStatusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate end time (2 hours after start)
  const calculateEndTime = (startTime: string): string => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = (hours + 2) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsRes, tablesRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/tables')
      ]);

      if (reservationsRes.data.success) {
        setReservations(reservationsRes.data.data.reservations);
      }

      if (tablesRes.data.success) {
        setTables(tablesRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setSelectedTable(reservation.tableId || '');
    setSelectedStatus(reservation.status);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedReservation) return;

    try {
      await api.patch(`/reservations/${selectedReservation.id}`, {
        status: selectedStatus.toLowerCase(),
        table_id: selectedTable || null,
      });

      fetchData();
      setShowModal(false);
      setSelectedReservation(null);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update reservation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete reservation');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      confirmed: 'badge badge-ok',
      CONFIRMED: 'badge badge-ok',
      pending: 'badge badge-warn',
      PENDING: 'badge badge-warn',
      completed: 'badge',
      COMPLETED: 'badge',
      cancelled: 'badge badge-danger',
      CANCELLED: 'badge badge-danger',
      no_show: 'badge badge-danger',
      NO_SHOW: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  // Filter reservations by status and search query
  const filteredReservations = reservations.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status.toUpperCase() === filterStatus.toUpperCase();
    const matchesSearch = searchQuery === '' ||
      r.confirmationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${r.user?.firstName} ${r.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading reservations...</p>
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
            Reservations
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Manage all restaurant reservations
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="pill">
            <span className="dot"></span>
            Connected
          </span>
        </div>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 mb-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      )}

      {/* Main Panel */}
      <div className="glass-panel rounded-2xl p-4">
        {/* Search Row */}
        <div className="flex items-center gap-2.5 flex-wrap mb-4">
          <div className="w-[180px]">
            <CustomSelect
              options={filterStatusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
            />
          </div>
          <input
            type="text"
            placeholder="Search by name / confirmation..."
            className="input-premium flex-1 min-w-[220px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <table className="table-premium">
          <thead>
            <tr>
              <th>Confirmation #</th>
              <th>Customer</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Table</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="font-medium">{reservation.confirmationNumber}</td>
                <td>
                  {reservation.user ? `${reservation.user.firstName} ${reservation.user.lastName}` : 'N/A'}
                </td>
                <td className="text-white/70">
                  {new Date(reservation.reservationDate).toLocaleDateString('tr-TR')} — {reservation.reservationTime} - {calculateEndTime(reservation.reservationTime)}
                </td>
                <td>{reservation.guestCount}</td>
                <td className="text-white/70">{reservation.table?.tableNumber || 'Not assigned'}</td>
                <td>
                  <span className={getStatusBadge(reservation.status)}>
                    {reservation.status}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openUpdateModal(reservation)}
                      className="btn-secondary px-3 py-1.5 rounded-[14px] text-[12px]"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="btn-danger px-3 py-1.5 rounded-[14px] text-[12px]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReservations.length === 0 && (
          <div className="text-center py-10 text-white/60">
            <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3 shadow-lg">
              📅
            </div>
            <p className="text-[13px]">No reservations found</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
            <h3 className="font-playfair text-xl font-medium text-white mb-2">
              Manage Reservation
            </h3>
            <p className="text-[13px] text-white/60 mb-6">
              {selectedReservation.confirmationNumber} — {selectedReservation.user?.firstName} {selectedReservation.user?.lastName}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Status
                </label>
                <CustomSelect
                  options={reservationStatusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Assign Table
                </label>
                <CustomSelect
                  options={[
                    { value: '', label: 'Masa atanmadı' },
                    ...tables.map(table => ({
                      value: table.id,
                      label: `Masa ${table.tableNumber} - Kapasite: ${table.capacity} (${table.area || table.location || 'Ana Salon'})`
                    }))
                  ]}
                  value={selectedTable}
                  onChange={setSelectedTable}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 btn-primary px-4 py-3 rounded-[14px] font-medium"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedReservation(null);
                }}
                className="flex-1 btn-secondary px-4 py-3 rounded-[14px] font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
