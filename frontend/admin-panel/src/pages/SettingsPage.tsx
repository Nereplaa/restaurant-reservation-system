import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    phone: '',
    address: '',
    email: '',
    opening_time: '11:00',
    closing_time: '23:00',
    hero_video_url: '',
    hero_title: '',
    hero_subtitle: '',
    mission: '',
    vision: '',
    experience: '',
    philosophy: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/settings/');
      const data = response.data;
      setFormData({
        name: data.name || '',
        slogan: data.slogan || '',
        phone: data.phone || '',
        address: data.address || '',
        email: data.email || '',
        opening_time: data.opening_time || '11:00',
        closing_time: data.closing_time || '23:00',
        hero_video_url: data.hero_video_url || '',
        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
        mission: data.mission || '',
        vision: data.vision || '',
        experience: data.experience || '',
        philosophy: data.philosophy || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Ayarlar yüklenemedi' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.patch('/settings/', formData);
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Settings
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Restoran ayarlarını ve bilgilerini yönetin
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-4 py-2.5 rounded-[14px] text-[13px] disabled:opacity-50"
        >
          {isSaving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`glass-panel rounded-2xl p-4 mb-4 ${message.type === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-red-500/30 bg-red-500/10'
          }`}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* Profile Section */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Profil Bilgileri
        </legend>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white border border-white/[0.18] flex-shrink-0"
            style={{ background: 'radial-gradient(circle at 35% 30%, rgba(120,170,240,0.45), rgba(255,255,255,0.10))' }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-white font-medium">{user?.email}</p>
            <span className="badge badge-info text-[10px] mt-1">
              {user?.role}
            </span>
          </div>
        </div>
      </fieldset>

      {/* Restaurant Settings */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Restoran Bilgileri
        </legend>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Restoran Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Slogan
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => handleInputChange('slogan', e.target.value)}
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Telefon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Açılış Saati
            </label>
            <input
              type="time"
              value={formData.opening_time}
              onChange={(e) => handleInputChange('opening_time', e.target.value)}
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Kapanış Saati
            </label>
            <input
              type="time"
              value={formData.closing_time}
              onChange={(e) => handleInputChange('closing_time', e.target.value)}
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
            Adres
          </label>
          <textarea
            rows={2}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="input-premium w-full resize-none"
          />
        </div>
      </fieldset>

      {/* Hero Section Settings */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Anasayfa Hero Bölümü
        </legend>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
            Video URL (YouTube Embed)
          </label>
          <input
            type="url"
            value={formData.hero_video_url}
            onChange={(e) => handleInputChange('hero_video_url', e.target.value)}
            className="input-premium w-full"
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Hero Başlık
            </label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => handleInputChange('hero_title', e.target.value)}
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Hero Altbaşlık
            </label>
            <textarea
              rows={2}
              value={formData.hero_subtitle}
              onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
              className="input-premium w-full resize-none"
            />
          </div>
        </div>
      </fieldset>

      {/* Mission & Vision */}
      <fieldset className="glass-panel rounded-2xl p-5 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Misyon & Vizyon
        </legend>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Misyon
            </label>
            <textarea
              rows={3}
              value={formData.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              className="input-premium w-full resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Vizyon
            </label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              className="input-premium w-full resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Deneyim
            </label>
            <textarea
              rows={3}
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="input-premium w-full resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Felsefe
            </label>
            <textarea
              rows={3}
              value={formData.philosophy}
              onChange={(e) => handleInputChange('philosophy', e.target.value)}
              className="input-premium w-full resize-none"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
