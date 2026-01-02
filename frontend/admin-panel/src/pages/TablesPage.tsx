import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../types';
import CustomSelect from '../components/CustomSelect';

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'maintenance', label: 'Maintenance' },
];

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTable, setCurrentTable] = useState<Partial<Table>>({
    tableNumber: '',
    capacity: 2,
    location: '',
    status: 'available',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && currentTable.id) {
        const response = await api.put(`/tables/${currentTable.id}`, currentTable);
        if (response.data.success) {
          fetchTables();
          closeModal();
        }
      } else {
        const response = await api.post('/tables', currentTable);
        if (response.data.success) {
          fetchTables();
          closeModal();
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to save table');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
      const response = await api.delete(`/tables/${id}`);
      if (response.data.success) {
        fetchTables();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete table');
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentTable({
      tableNumber: '',
      capacity: 2,
      location: '',
      status: 'available',
    });
    setShowModal(true);
  };

  const openEditModal = (table: Table) => {
    setIsEditing(true);
    setCurrentTable(table);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTable({
      tableNumber: '',
      capacity: 2,
      location: '',
      status: 'available',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      available: 'badge badge-ok',
      occupied: 'badge badge-danger',
      reserved: 'badge badge-warn',
      maintenance: 'badge',
    };
    return badges[status] || 'badge';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading tables...</p>
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
            Tables
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Manage restaurant tables
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary px-4 py-2.5 rounded-[14px] text-[13px]"
        >
          + Add Table
        </button>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 mb-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="glass-card rounded-2xl p-4 hover:border-[#cfd4dc]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium text-white">Table {table.tableNumber}</h3>
                <p className="text-xs text-white/60">{table.location}</p>
              </div>
              <span className={getStatusBadge(table.status)}>
                {table.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-white/70 text-sm">
                <span className="mr-2">👥</span>
                <span>Capacity: {table.capacity} guests</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(table)}
                className="flex-1 btn-secondary px-3 py-2 rounded-[12px] text-[12px]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(table.id)}
                className="flex-1 btn-danger px-3 py-2 rounded-[12px] text-[12px]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-10 glass-panel rounded-2xl text-white/60">
          <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
            ⧉
          </div>
          <p className="text-[13px]">No tables yet. Add your first table!</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-12 gap-3.5">
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Available</div>
          <div className="kpi-value">{tables.filter(t => t.status === 'available').length}</div>
          <div className="kpi-hint">Ready for guests.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Occupied</div>
          <div className="kpi-value">{tables.filter(t => t.status === 'occupied').length}</div>
          <div className="kpi-hint">Currently in use.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Reserved</div>
          <div className="kpi-value">{tables.filter(t => t.status === 'reserved').length}</div>
          <div className="kpi-hint">Booked for later.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Maintenance</div>
          <div className="kpi-value">{tables.filter(t => t.status === 'maintenance').length}</div>
          <div className="kpi-hint">Under maintenance.</div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
            <h3 className="font-playfair text-xl font-medium text-white mb-6">
              {isEditing ? 'Edit Table' : 'Add New Table'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Table Number
                </label>
                <input
                  type="text"
                  required
                  value={currentTable.tableNumber}
                  onChange={(e) => setCurrentTable({ ...currentTable, tableNumber: e.target.value })}
                  className="input-premium w-full"
                  placeholder="e.g., 1, A1, VIP-1"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={currentTable.capacity}
                  onChange={(e) => setCurrentTable({ ...currentTable, capacity: parseInt(e.target.value) })}
                  className="input-premium w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={currentTable.location}
                  onChange={(e) => setCurrentTable({ ...currentTable, location: e.target.value })}
                  className="input-premium w-full"
                  placeholder="e.g., Main Hall, Patio, Window"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                  Status
                </label>
                <CustomSelect
                  options={statusOptions}
                  value={currentTable.status || 'available'}
                  onChange={(value) => setCurrentTable({ ...currentTable, status: value as any })}
                />
              </div>


              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 btn-primary px-4 py-3 rounded-[14px] font-medium"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary px-4 py-3 rounded-[14px] font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
