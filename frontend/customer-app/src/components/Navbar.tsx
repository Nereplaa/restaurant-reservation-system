import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#0f1a2b] border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-semibold text-white tracking-[0.12em] uppercase text-sm">
                BORCELLE
              </span>
              <span className="text-[9px] tracking-[0.08em] uppercase text-[#9aa3b2]">
                Fine Dining
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full transition-all ${isActive('/') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              Anasayfa
            </Link>
            <Link
              to="/menu"
              className={`text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full transition-all ${isActive('/menu') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              Menü
            </Link>
            {user && (
              <>
                <Link
                  to="/booking"
                  className={`text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full transition-all ${isActive('/booking') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Rezervasyon
                </Link>
                <Link
                  to="/reservations"
                  className={`text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full transition-all ${isActive('/reservations') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Rezervasyonlarım
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-white/70 text-sm hidden md:block">
                  Hoş geldin, <span className="text-white font-medium">{user.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs tracking-[0.10em] uppercase px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="text-xs tracking-[0.10em] uppercase px-5 py-2 rounded-full bg-white text-[#0f1a2b] font-medium hover:bg-white/90 transition-all"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
