import { useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
}

const initialFormData: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'customer',
  password: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData(initialFormData);
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
    });
    setFormError('');
    setFormSuccess('');
    setShowEditModal(true);
  };

  const handleCreateUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setFormError('Lütfen zorunlu alanları doldurun');
      return;
    }

    setIsSaving(true);
    setFormError('');
    try {
      await api.post('/auth/register', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      setFormSuccess('Kullanıcı başarıyla oluşturuldu');
      setTimeout(() => {
        setShowAddModal(false);
        fetchCustomers();
      }, 1000);
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Kullanıcı oluşturulamadı');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setFormError('Lütfen zorunlu alanları doldurun');
      return;
    }

    setIsSaving(true);
    setFormError('');
    try {
      await api.patch(`/admin/users/${selectedUser.id}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      });
      setFormSuccess('Kullanıcı başarıyla güncellendi');
      setTimeout(() => {
        setShowEditModal(false);
        fetchCustomers();
      }, 1000);
    } catch (err: any) {
      setFormError(err.response?.data?.error?.message || 'Kullanıcı güncellenemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin: 'badge badge-info',
      manager: 'badge badge-warn',
      server: 'badge badge-ok',
      kitchen: 'badge badge-ok',
      customer: 'badge',
    };
    return badges[role] || 'badge';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const roleOptions = [
    { value: 'customer', label: 'Müşteri' },
    { value: 'server', label: 'Garson' },
    { value: 'kitchen', label: 'Mutfak' },
    { value: 'manager', label: 'Yönetici' },
    { value: 'admin', label: 'Admin' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading customers...</p>
        </div>
      </div>
    );
  }

  const staffCount = customers.filter(c => c.role === 'admin' || c.role === 'kitchen' || c.role === 'manager' || c.role === 'server').length;
  const customerCount = customers.filter(c => c.role === 'customer').length;
  const thisMonthCount = customers.filter(c => {
    const joinDate = new Date(c.createdAt);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Customers
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            View and manage all customers
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium max-w-[360px]"
          />
          <button
            onClick={handleAddUser}
            className="btn-primary px-3 py-2.5 rounded-[14px] text-[13px]"
          >
            + Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 mb-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      )}

      {/* Main Panel */}
      <div className="glass-panel rounded-2xl p-4 mb-6">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <span className={getRoleBadge(customer.role)} style={{ padding: '5px 8px' }}>
                      {getInitials(customer.firstName, customer.lastName)}
                    </span>
                    <span className="font-medium">{customer.firstName} {customer.lastName}</span>
                  </div>
                </td>
                <td className="text-white/70">{customer.email}</td>
                <td className="text-white/70">{customer.phone || 'N/A'}</td>
                <td>
                  <span className={getRoleBadge(customer.role)}>
                    {customer.role}
                  </span>
                </td>
                <td className="text-white/70">
                  {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td>
                  <button
                    onClick={() => handleEditUser(customer)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors text-sm"
                  >
                    ✏️ Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-10 text-white/60">
            <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3 shadow-lg">
              👥
            </div>
            <p className="text-[13px]">
              {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-12 gap-3.5">
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{customers.length}</div>
          <div className="kpi-hint">All registered accounts.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">This Month</div>
          <div className="kpi-value">{thisMonthCount}</div>
          <div className="kpi-hint">New sign-ups this month.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Staff Users</div>
          <div className="kpi-value">{staffCount}</div>
          <div className="kpi-hint">Admin / Manager / Server / Kitchen.</div>
        </div>
        <div className="col-span-3 kpi-card">
          <div className="kpi-label">Customer Users</div>
          <div className="kpi-value">{customerCount}</div>
          <div className="kpi-hint">Guests with customer role.</div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h2 className="font-playfair text-xl text-white mb-4">Yeni Kullanıcı Ekle</h2>

            {formError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-xl text-sm mb-4">
                ⚠️ {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-4 py-2 rounded-xl text-sm mb-4">
                ✓ {formSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Ad *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-premium w-full"
                    placeholder="Ad"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Soyad *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-premium w-full"
                    placeholder="Soyad"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">E-posta *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-premium w-full"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-premium w-full"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">Şifre *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-premium w-full"
                  placeholder="Şifre"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-premium w-full"
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateUser}
                disabled={isSaving}
                className="flex-1 btn-primary py-2.5 rounded-xl disabled:opacity-50"
              >
                {isSaving ? 'Oluşturuluyor...' : 'Oluştur'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h2 className="font-playfair text-xl text-white mb-4">Kullanıcı Düzenle</h2>

            {formError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-xl text-sm mb-4">
                ⚠️ {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-4 py-2 rounded-xl text-sm mb-4">
                ✓ {formSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Ad *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-premium w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Soyad *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-premium w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">E-posta *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-premium w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-premium w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-premium w-full"
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateUser}
                disabled={isSaving}
                className="flex-1 btn-primary py-2.5 rounded-xl disabled:opacity-50"
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
