import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: '▦' },
  { name: 'Reservations', path: '/reservations', icon: '▤' },
  { name: 'Customers', path: '/customers', icon: '👥' },
  { name: 'Tables', path: '/tables', icon: '⧉' },
  { name: 'Menu', path: '/menu', icon: '🍽' },
  { name: 'Orders', path: '/orders', icon: '🧾' },
  { name: 'Settings', path: '/settings', icon: '⚙' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <aside className="w-[280px] h-screen sticky top-0 p-4 border-r border-white/[0.14] glass flex flex-col gap-3">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-3 border-b border-white/[0.12]">
        <div className="w-11 h-11 rounded-[14px] border border-white/[0.16] bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-playfair font-semibold tracking-[0.06em] text-white text-base">
            Restaurant Admin
          </span>
          <span className="text-[11px] tracking-[0.12em] uppercase text-[#9aa3b2] mt-0.5">
            Management System
          </span>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2.5 p-2.5 border border-white/[0.12] rounded-2xl bg-white/[0.06]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white border border-white/[0.18]"
          style={{ background: 'radial-gradient(circle at 35% 30%, rgba(207,212,220,0.45), rgba(255,255,255,0.10))' }}
        >
          {getInitials()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-white truncate">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-[11px] tracking-[0.10em] uppercase text-[#9aa3b2]">
            signed in
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 py-1 flex-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] text-[13px] transition-all duration-200 border animate-slide-in ${isActive
                  ? 'bg-white/10 border-[#cfd4dc]/25 shadow-[0_12px_40px_rgba(0,0,0,0.22)]'
                  : 'border-transparent hover:bg-white/[0.08] hover:border-[#cfd4dc]/[0.18]'
                }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <span className="w-5 h-5 rounded-lg bg-white/[0.08] border border-white/[0.10] flex items-center justify-center text-xs">
                {item.icon}
              </span>
              <span className="text-white/[0.88]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-2.5 border-t border-white/[0.12]">
        <button
          onClick={logout}
          className="w-full border border-white/[0.12] bg-white/[0.06] text-white/[0.92] px-3.5 py-3 rounded-[14px] text-[13px] tracking-[0.06em] transition-all hover:bg-white/[0.10] hover:border-[#cfd4dc]/[0.22]"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
