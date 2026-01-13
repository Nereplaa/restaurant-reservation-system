import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Reservation {
  id: string;
  reservationDate: string;
  reservationTime: string;
  endTime: string | null;
  guestCount: number;
  status: string;
  specialRequests: string | null;
  confirmationNumber: string;
  tableId: string | null;
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
      setError('Rezervasyonlar yüklenemedi');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await api.delete(`/reservations/${id}`);
      if (response.data.success) {
        alert('Rezervasyon başarıyla iptal edildi');
        fetchReservations();
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Rezervasyon iptal edilemedi');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      confirmed: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      completed: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      cancelled: 'bg-red-500/20 border-red-500/30 text-red-300',
      no_show: 'bg-white/10 border-white/20 text-white/60',
    };
    return badges[status] || 'bg-white/10 border-white/20 text-white/60';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tarih yok';
    try {
      // Handle YYYY-MM-DD format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('tr-TR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return new Date(dateString).toLocaleDateString('tr-TR');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    // Handle HH:MM format directly
    return timeString.substring(0, 5);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center">
        <div className="text-center glass-dark rounded-2xl border border-white/10 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="font-playfair text-2xl font-medium text-white mb-4">Giriş Yapın</h2>
          <p className="text-white/60 mb-6">Rezervasyonlarınızı görmek için giriş yapın</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-3 rounded-xl"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1a2b] to-[#16233a] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl font-medium mb-2">Rezervasyonlarım</h1>
          <p className="text-white/60">Restoran rezervasyonlarınızı görüntüleyin ve yönetin</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${filter === 'upcoming'
                ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
            >
              Yaklaşan
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${filter === 'all'
                ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                }`}
            >
              Tümü
            </button>
          </div>

          <button
            onClick={() => navigate('/booking')}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white text-[#0f1a2b] hover:bg-white/90 transition shadow-lg"
          >
            + Yeni Rezervasyon
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Rezervasyonlar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="glass-dark border border-red-500/30 text-red-200 px-6 py-4 rounded-xl">
            ⚠️ {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="glass-dark rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
              📅
            </div>
            <h3 className="font-playfair text-2xl font-medium text-white mb-2">Rezervasyon Bulunamadı</h3>
            <p className="text-white/60 mb-6">
              {filter === 'upcoming' ? 'Yaklaşan' : ''} rezervasyonunuz bulunmuyor.
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              İlk Rezervasyonunuzu Yapın
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="glass-dark rounded-2xl border border-white/10 p-6 hover:border-white/20 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(reservation.status)}`}
                      >
                        {reservation.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/40">
                        #{reservation.confirmationNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Tarih</div>
                        <div className="font-medium text-white">
                          {formatDate(reservation.reservationDate)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Saat</div>
                        <div className="font-medium text-white">
                          {formatTime(reservation.reservationTime)} - {formatTime(reservation.endTime)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Kişi Sayısı</div>
                        <div className="font-medium text-white">
                          {reservation.guestCount} Kişi
                        </div>
                      </div>
                    </div>

                    {reservation.tableId && (
                      <div className="mt-3 text-sm text-white/60">
                        <span className="font-medium text-white/80">Masa atandı</span>
                      </div>
                    )}

                    {reservation.specialRequests && (
                      <div className="mt-3 text-sm text-white/60">
                        <span className="font-medium text-white/80">Özel İstek:</span>{' '}
                        {reservation.specialRequests}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                    {reservation.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                          className="btn-secondary px-4 py-2 rounded-xl text-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="btn-danger px-4 py-2 rounded-xl text-sm"
                        >
                          İptal Et
                        </button>
                      </>
                    )}
                    {reservation.status === 'completed' && (
                      <div className="text-emerald-400 font-medium text-sm">✓ Tamamlandı</div>
                    )}
                    {reservation.status === 'cancelled' && (
                      <div className="text-red-400 font-medium text-sm">✕ İptal Edildi</div>
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
