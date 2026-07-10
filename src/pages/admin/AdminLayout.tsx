import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Library,
  PlusCircle,
  Menu,
  X,
  Image as ImageIcon,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth, useUser } from '@clerk/react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/admin/novels', label: 'All Novels', icon: <Library className="w-5 h-5" /> },
  { to: '/admin/novels/add', label: 'Add Novel', icon: <PlusCircle className="w-5 h-5" /> },
  { to: '/admin/banners', label: 'All Banners', icon: <ImageIcon className="w-5 h-5" /> },
  { to: '/admin/banners/add', label: 'Add Banner', icon: <PlusCircle className="w-5 h-5" /> },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const { user } = useUser();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[var(--surface-strong)] border-r border-[var(--border-soft)] flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[var(--border-soft)]">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.webp" alt="Solibu Stories" className="w-6 h-6 object-contain" />
            <span className="font-display text-lg font-semibold text-[var(--text-strong)]">
              Solibu Stories
            </span>
          </Link>
          <p className="text-[var(--text-muted)] text-xs mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive(item.to)
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-l-2 border-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--surface-light)]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border-soft)]">
          {user && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-strong)] truncate">
                  {user.fullName || user.primaryEmailAddress?.emailAddress || 'Admin'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/5 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border-soft)] bg-[var(--surface-strong)]">
          <span className="font-display text-lg font-semibold text-[var(--text-strong)]">Admin</span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-strong)]"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <main className="p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



