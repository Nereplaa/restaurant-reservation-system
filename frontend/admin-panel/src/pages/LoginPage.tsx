import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@restaurant.com');
    setPassword('admin123');
  };

  const fillDemoKitchen = () => {
    setEmail('kitchen@restaurant.com');
    setPassword('kitchen123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: `
          radial-gradient(900px 600px at 18% 12%, rgba(207,212,220,0.12), transparent 60%),
          radial-gradient(800px 520px at 85% 18%, rgba(255,255,255,0.06), transparent 60%),
          linear-gradient(180deg, #0f1a2b, #16233a)
        `
      }}
    >
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-white/[0.16] bg-white/10 flex items-center justify-center overflow-hidden">
            <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-playfair text-2xl font-medium text-white tracking-wide mb-1">
            Restaurant Admin
          </h1>
          <p className="text-[11px] tracking-[0.12em] uppercase text-[#9aa3b2]">
            Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="font-playfair text-xl font-medium text-white text-center mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-white/90 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-premium w-full"
                placeholder="admin@restaurant.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-premium w-full"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-[14px] font-medium text-[13px] tracking-wide disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-white/[0.12]">
            <p className="text-[11px] text-white/60 uppercase tracking-wider text-center mb-3">
              Demo Accounts
            </p>
            <div className="space-y-2">
              <button
                onClick={fillDemoAdmin}
                className="w-full btn-secondary py-2.5 rounded-[14px] text-[12px]"
              >
                👑 Admin Account
              </button>
              <button
                onClick={fillDemoKitchen}
                className="w-full btn-secondary py-2.5 rounded-[14px] text-[12px]"
              >
                👨‍🍳 Kitchen Staff Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-[11px] tracking-wider">
            © BORCELLE • Restaurant Management System
          </p>
        </div>
      </div>
    </div>
  );
}
