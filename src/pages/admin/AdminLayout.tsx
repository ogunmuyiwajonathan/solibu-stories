import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// framer-motion removed — sidebar uses CSS classes for visibility
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  BookOpen,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
  Loader2,
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/novels', label: 'All Novels', icon: BookOpen },
  { path: '/admin/novels/add', label: 'Add Novel', icon: BookOpen },
  { path: '/admin/banners', label: 'All Banners', icon: Image },
  { path: '/admin/banners/add', label: 'Add Banner', icon: Image },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const convex = useConvex();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email] = useState<string | null>(() =>
    localStorage.getItem('admin_email')
  );
  const [picture] = useState<string | null>(() =>
    localStorage.getItem('admin_picture')
  );
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const token = localStorage.getItem('admin_session_token');
      if (token) {
        await convex.mutation(api.admin.logout, { session_token: token });
      }
    } catch {
      // Even if the mutation fails, clear local state
    } finally {
      localStorage.removeItem('admin_session_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_picture');
      setIsSigningOut(false);
      navigate('/admin/login', { replace: true });
    }
  };

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {picture ? (
                <img
                  src={picture}
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/30"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-zinc-950" />
                </div>
              )}
              <div>
                <h1 className="text-white font-semibold text-sm">
                  Hi, {email === 'ogunmuyiwajonathan@gmail.com' ? 'Dev Jonathan' : 'Author Ibukun'}
                </h1>
                <p className="text-zinc-500 text-xs">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path, item.exact)
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info + sign out */}
        <div className="p-4 border-t border-zinc-800">
          {email && (
            <p className="text-zinc-500 text-xs mb-3 truncate">{email}</p>
          )}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="text-zinc-400 text-sm font-medium">Admin</span>
          </div>
          <div className="w-5" /> {/* spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
