import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        api.get('/admin/stats'),
        api.get('/reservations', { params: { limit: 5 } })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (reservationsRes.data.success) {
        setRecentReservations(reservationsRes.data.data.reservations);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Dashboard verileri yuklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Yukleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="glass-panel rounded-2xl p-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: 'badge badge-warn',
      CONFIRMED: 'badge badge-ok',
      confirmed: 'badge badge-ok',
      SEATED: 'badge badge-info',
      COMPLETED: 'badge',
      completed: 'badge',
      CANCELLED: 'badge badge-danger',
      cancelled: 'badge badge-danger',
      NO_SHOW: 'badge badge-danger',
      no_show: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Beklemede',
      CONFIRMED: 'Onaylandi',
      confirmed: 'Onaylandi',
      SEATED: 'Oturdu',
      COMPLETED: 'Tamamlandi',
      completed: 'Tamamlandi',
      CANCELLED: 'Iptal',
      cancelled: 'Iptal',
      NO_SHOW: 'Gelmedi',
      no_show: 'Gelmedi',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Kontrol Paneli
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Hosgeldiniz! Bugunku genel durum asagidadir.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <span className="pill">
            <span className="dot"></span>
            Canli
          </span>
          <Link to="/reservations" className="btn-secondary px-3 py-2.5 rounded-[14px] text-[13px] inline-flex items-center gap-2">
            Rezervasyonlar
          </Link>
          <Link to="/orders" className="btn-primary px-3 py-2.5 rounded-[14px] text-[13px] inline-flex items-center gap-2">
            Siparisler
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-12 gap-3.5 mb-6">
        <div className="col-span-3 kpi-card animate-fade-in-up">
          <div className="kpi-label">Bugunku Rezervasyonlar</div>
          <div className="kpi-value">{stats?.todayReservations || 0}</div>
          <div className="kpi-hint">
            {stats?.todayReservations === 0 ? 'Bugun icin rezervasyon yok.' : 'Bugun icin planlanmis rezervasyonlar.'}
          </div>
        </div>
        <div className="col-span-3 kpi-card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="kpi-label">Bugunku Gelir</div>
          <div className="kpi-value">{stats?.todayRevenue || 0} TL</div>
          <div className="kpi-hint">Siparisler tamamlandikca guncellenir.</div>
        </div>
        <div className="col-span-3 kpi-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="kpi-label">Toplam Musteri</div>
          <div className="kpi-value">{stats?.totalCustomers || 0}</div>
          <div className="kpi-hint">Kayitli musteri sayisi.</div>
        </div>
        <div className="col-span-3 kpi-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="kpi-label">Aktif Siparisler</div>
          <div className="kpi-value">{stats?.activeOrders || 0}</div>
          <div className="kpi-hint">{stats?.activeOrders === 0 ? 'Mutfak bos.' : 'Hazirlanan siparisler.'}</div>
        </div>
      </div>

      {/* Recent Reservations Panel */}
      <div className="glass-panel rounded-2xl p-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-title">
          <span>Son Rezervasyonlar</span>
          <div className="line"></div>
          <Link to="/reservations" className="btn-secondary px-3 py-2 rounded-[14px] text-[13px] ml-auto">
            Tumunu Gor →
          </Link>
        </div>

        {recentReservations.length === 0 ? (
          <div className="text-center py-10 text-white/60">
            <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3 shadow-lg">
              ✨
            </div>
            <p className="text-[13px]">Henuz rezervasyon yok</p>
          </div>
        ) : (
          <table className="table-premium">
            <thead>
              <tr>
                <th>Onay Kodu</th>
                <th>Musteri</th>
                <th>Tarih ve Saat</th>
                <th>Kisi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="font-medium">{reservation.confirmationNumber}</td>
                  <td>
                    {reservation.user ? `${reservation.user.firstName} ${reservation.user.lastName}` : 'Bilinmiyor'}
                  </td>
                  <td className="text-white/70">
                    {new Date(reservation.reservationDate).toLocaleDateString('tr-TR')} — {reservation.reservationTime}
                  </td>
                  <td>{reservation.guestCount}</td>
                  <td>
                    <span className={getStatusBadge(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
