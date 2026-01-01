import { useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
          <button className="btn-secondary px-3 py-2.5 rounded-[14px] text-[13px]">
            Search
          </button>
          <button className="btn-primary px-3 py-2.5 rounded-[14px] text-[13px]">
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
    </div>
  );
}
