import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { CustomSelect, CustomDatePicker, CustomTimePicker } from '../components/FormComponents';

interface AvailableTable {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string | null;
  status: string;
}

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    endTime: '',
    partySize: 2,
    specialRequest: '',
    tableId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Table selection state
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tablesError, setTablesError] = useState('');

  // Generate party size options
  const partySizeOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Kişi`,
  }));

  // Fetch available tables when date, time, endTime, or partySize changes
  useEffect(() => {
    if (formData.date && formData.time && formData.endTime && formData.partySize) {
      fetchAvailableTables();
    } else {
      setAvailableTables([]);
      setFormData((prev) => ({ ...prev, tableId: '' }));
    }
  }, [formData.date, formData.time, formData.endTime, formData.partySize]);

  const fetchAvailableTables = async () => {
    setLoadingTables(true);
    setTablesError('');
    try {
      const response = await api.get('/tables/available', {
        params: {
          date: formData.date,
          time: formData.time,
          end_time: formData.endTime,
          party_size: formData.partySize,
        },
      });
      if (response.data.success) {
        setAvailableTables(response.data.data);
        // Reset table selection if previous selection is no longer available
        const tableIds = response.data.data.map((t: AvailableTable) => t.id);
        if (formData.tableId && !tableIds.includes(formData.tableId)) {
          setFormData((prev) => ({ ...prev, tableId: '' }));
        }
      }
    } catch (err: unknown) {
      setTablesError('Masalar yüklenemedi');
      setAvailableTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  const handleTableSelect = (tableId: string) => {
    setFormData((prev) => ({
      ...prev,
      tableId: prev.tableId === tableId ? '' : tableId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await api.post('/reservations', {
        date: formData.date,
        time: formData.time,
        end_time: formData.endTime,
        party_size: formData.partySize,
        special_request: formData.specialRequest,
        table_id: formData.tableId || null,
      });
      if (response.data) {
        setSuccess('Rezervasyon başarıyla oluşturuldu!');
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Rezervasyon oluşturulamadı');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center">
        <div className="text-center glass-dark rounded-2xl border border-white/10 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="font-playfair text-2xl font-medium text-white mb-4">Giriş Yapın</h2>
          <p className="text-white/60 mb-6">Rezervasyon yapmak için giriş yapın</p>
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

  const canShowTables = formData.date && formData.time && formData.partySize;

  return (
    <div className="min-h-screen bg-premium">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1a2b] to-[#16233a] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl font-medium mb-2">Rezervasyon Yap</h1>
          <p className="text-white/60">Masanızı ayırtın ve unutulmaz bir yemek deneyimi yaşayın</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="glass-dark rounded-2xl border border-white/10 p-8 relative z-10">
            <h2 className="font-playfair text-xl text-white mb-6">Rezervasyon Bilgileri</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-xl text-sm animate-fade-in-up">
                  ✓ {success}
                </div>
              )}

              {/* Date Field */}
              <div>
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                  Tarih *
                </label>
                <CustomDatePicker
                  value={formData.date}
                  onChange={(val) => setFormData({ ...formData, date: val })}
                />
              </div>

              {/* Time Row - Start & End */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                    Başlangıç Saati *
                  </label>
                  <CustomTimePicker
                    value={formData.time}
                    onChange={(val) => setFormData({ ...formData, time: val, endTime: '' })}
                    minHour={11}
                    maxHour={21}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                    Bitiş Saati *
                  </label>
                  <CustomTimePicker
                    value={formData.endTime}
                    onChange={(val) => setFormData({ ...formData, endTime: val })}
                    minHour={formData.time ? parseInt(formData.time.split(':')[0]) + 1 : 12}
                    maxHour={22}
                  />
                </div>
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                  Kişi Sayısı *
                </label>
                <CustomSelect
                  options={partySizeOptions}
                  value={formData.partySize}
                  onChange={(val) => setFormData({ ...formData, partySize: Number(val) })}
                  placeholder="Kişi sayısı seçin"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
              </div>

              {/* Special Request */}
              <div>
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                  Özel İstekler <span className="text-white/40">(Opsiyonel)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  placeholder="Örn: Cam kenarı masa, doğum günü kutlaması..."
                  className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/30 focus:border-[#cfd4dc]/50 focus:bg-white/8 transition-all outline-none resize-none"
                />
              </div>

              {/* Selected Table Info */}
              {formData.tableId && (
                <div className="bg-[#cfd4dc]/10 border border-[#cfd4dc]/20 rounded-xl p-3 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#cfd4dc]">✓</span>
                    <span className="text-white">Seçilen Masa:</span>
                    <span className="text-[#cfd4dc] font-medium">
                      {availableTables.find((t) => t.id === formData.tableId)?.tableNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !formData.date || !formData.time || !formData.endTime}
                  className="flex-1 py-3.5 px-6 rounded-xl font-medium bg-gradient-to-r from-[#cfd4dc] to-[#9aa3b2] text-[#0f1a2b] hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Oluşturuluyor...
                    </span>
                  ) : 'Rezervasyonu Onayla'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3.5 rounded-xl font-medium bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>

          {/* Table Selection Section */}
          <div className="glass-dark rounded-2xl border border-white/10 p-8">
            <h2 className="font-playfair text-xl text-white mb-2">Masa Seçimi</h2>
            <p className="text-white/50 text-sm mb-6">
              {canShowTables
                ? `${formData.partySize} kişi için uygun masalar`
                : 'Tarih, saat ve kişi sayısı seçin'
              }
            </p>

            {!canShowTables ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                  🪑
                </div>
                <p className="text-white/40 text-sm">
                  Uygun masaları görmek için önce<br />tarih, saat ve kişi sayısı seçin
                </p>
              </div>
            ) : loadingTables ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/50 text-sm">Masalar yükleniyor...</p>
              </div>
            ) : tablesError ? (
              <div className="text-center py-12">
                <p className="text-red-300 text-sm">⚠️ {tablesError}</p>
              </div>
            ) : availableTables.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                  😔
                </div>
                <p className="text-white/50 text-sm">
                  Bu tarih ve saatte {formData.partySize} kişilik<br />uygun masa bulunmuyor
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableTables.map((table) => (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => handleTableSelect(table.id)}
                    className={`relative p-4 rounded-xl border transition-all duration-200 text-left group ${formData.tableId === table.id
                      ? 'bg-[#cfd4dc]/20 border-[#cfd4dc]/50 shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                      }`}
                  >
                    {/* Selection indicator */}
                    {formData.tableId === table.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#cfd4dc] flex items-center justify-center animate-fade-in-up">
                        <svg className="w-3 h-3 text-[#0f1a2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Table icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${formData.tableId === table.id
                      ? 'bg-[#cfd4dc]/30'
                      : 'bg-white/10 group-hover:bg-white/15'
                      }`}>
                      <span className="text-lg">🪑</span>
                    </div>

                    {/* Table info */}
                    <div className={`font-medium text-sm ${formData.tableId === table.id ? 'text-white' : 'text-white/80'}`}>
                      Masa {table.tableNumber}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                      <span>{table.capacity} Kişilik</span>
                      {table.location && (
                        <>
                          <span>•</span>
                          <span>{table.location}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Info box */}
            {canShowTables && availableTables.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/50 text-xs">
                  💡 Masa seçimi opsiyoneldir. Seçim yapmazsanız, restoran size en uygun masayı atayacaktır.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Important Info */}
        <div className="mt-8 glass-dark rounded-xl p-6 border border-white/10">
          <h4 className="font-medium text-[#cfd4dc] mb-3">📋 Önemli Bilgiler</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-sm">
            <li>• Rezervasyonlar en az 2 saat önceden yapılmalıdır</li>
            <li>• 30 güne kadar önceden rezervasyon yapabilirsiniz</li>
            <li>• Her rezervasyon yaklaşık 2 saat içindir</li>
            <li>• İptaller en az 2 saat önce yapılmalıdır</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
