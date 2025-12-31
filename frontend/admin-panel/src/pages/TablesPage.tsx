import { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../types';

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tables</h1>
          <p className="text-gray-600 mt-1">Manage restaurant tables</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          + Add Table
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Table {table.tableNumber}</h3>
                <p className="text-sm text-gray-600">{table.location}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <span className="mr-2">👥</span>
                <span className="text-sm">Capacity: {table.capacity} guests</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(table)}
                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(table.id)}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No tables yet. Add your first table!</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-80">Available</p>
          <p className="text-3xl font-bold mt-2">{tables.filter(t => t.status === 'available').length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-80">Occupied</p>
          <p className="text-3xl font-bold mt-2">{tables.filter(t => t.status === 'occupied').length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-80">Reserved</p>
          <p className="text-3xl font-bold mt-2">{tables.filter(t => t.status === 'reserved').length}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-6">
          <p className="text-sm opacity-80">Maintenance</p>
          <p className="text-3xl font-bold mt-2">{tables.filter(t => t.status === 'maintenance').length}</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Table' : 'Add New Table'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number
                </label>
                <input
                  type="text"
                  required
                  value={currentTable.tableNumber}
                  onChange={(e) => setCurrentTable({ ...currentTable, tableNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1, A1, VIP-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={currentTable.capacity}
                  onChange={(e) => setCurrentTable({ ...currentTable, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={currentTable.location}
                  onChange={(e) => setCurrentTable({ ...currentTable, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Hall, Patio, Window"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={currentTable.status}
                  onChange={(e) => setCurrentTable({ ...currentTable, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
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

