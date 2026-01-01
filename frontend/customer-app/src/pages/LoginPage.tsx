import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('john.doe@example.com');
    setPassword('customer123');
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
            Hoş Geldiniz
          </h2>
          <p className="text-[#cfd4dc]">
            Hesabınıza giriş yaparak devam edin
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

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Giriş yapılıyor...
                </span>
              ) : 'Giriş Yap'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0f1a2b] text-white/50">Hesabınız yok mu?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="block w-full text-center py-3 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
          >
            Yeni hesap oluşturun
          </Link>
        </div>

        {/* Demo Account Card */}
        <div className="mt-6 glass-dark border border-white/10 rounded-xl p-5">
          <p className="text-white/70 text-sm mb-3 text-center font-medium">Demo Hesabı</p>
          <button
            onClick={fillDemo}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium transition-all hover:bg-white/15"
          >
            🔑 Demo bilgilerini doldur
          </button>
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

export default LoginPage;
