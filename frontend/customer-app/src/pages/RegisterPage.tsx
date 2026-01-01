import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-playfair font-semibold text-white tracking-[0.14em] uppercase text-lg">
                BORCELLE
              </span>
              <span className="text-[10px] tracking-[0.10em] uppercase text-[#9aa3b2]">
                Fine Dining • 2004
              </span>
            </div>
          </Link>
          <h2 className="font-playfair text-3xl font-medium text-white mb-2">
            Hesap Oluşturun
          </h2>
          <p className="text-[#cfd4dc]">
            Aramıza katılın ve özel deneyimlerden yararlanın
          </p>
        </div>

        {/* Form Card - Dark Theme */}
        <div className="glass-dark rounded-2xl p-8 border border-white/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                  Ad *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                  placeholder="Adınız"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                  Soyad *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                E-posta Adresi *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                Telefon Numarası <span className="text-white/40">(Opsiyonel)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                placeholder="+90 (5XX) XXX XX XX"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                Şifre *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-white/40">En az 8 karakter olmalıdır</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                Şifre Tekrar *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 hover:bg-[#cfd4dc]/30 text-white font-medium py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Hesap oluşturuluyor...
                </span>
              ) : 'Hesap Oluştur'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0f1a2b] text-white/50">Zaten hesabınız var mı?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Giriş yapın
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-white/60 text-sm hover:text-white transition">
            ← Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
