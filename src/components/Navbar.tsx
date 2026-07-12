import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Heart, User, LogOut } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { useAuth, useUser, UserButton } from '@clerk/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 200);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/library', label: 'Library' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isHomePage = location.pathname === '/';
  const isDarkBg = theme === 'dark' || (isHomePage && !isScrolled);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-[var(--color-surface)]/80 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group min-h-[44px] min-w-[44px]">
            <div className="p-1.5 rounded-lg bg-[#C89B5A]/10 group-hover:bg-[#C89B5A]/20 transition-colors flex-shrink-0">
              <img
                src="/images/logo.webp"
                alt="Solibu Stories"
                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <span className={`font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
              isDarkBg ? 'text-white' : 'text-white'
            }`}>
              Solibu Stories
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 min-h-[44px] flex items-center rounded-lg font-medium text-sm tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-[#C89B5A] bg-[#C89B5A]/10'
                      : isDarkBg
                      ? 'text-white/70 hover:text-white hover:bg-white/5'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isLoaded ? (
              <div className={`w-9 h-9 rounded-full ${isDarkBg ? 'bg-white/10' : 'bg-[var(--color-border)]/50'} animate-pulse`} />
            ) : isSignedIn && user ? (
              <>
                <span className={`text-sm font-medium tracking-wide ${
                  isDarkBg ? 'text-white/70' : 'text-[var(--color-muted)]'
                }`}>
                  Hi, {user.firstName || user.username || user.primaryEmailAddress?.emailAddress || ''}
                </span>
                <UserButton />
              </>
            ) : (
              <Link
                to="/signin"
                className={`flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg font-medium text-sm transition-all duration-300 ${
                  isDarkBg
                    ? 'bg-[var(--gold)] text-[var(--color-bg)] hover:bg-[var(--gold-deep)] shadow-lg shadow-[var(--gold)]/20'
                    : 'bg-[var(--gold)] text-[var(--color-bg)] hover:bg-[var(--gold-deep)] shadow-lg shadow-[var(--gold)]/20'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${
              isDarkBg ? 'text-white hover:bg-white/10' : 'text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
            }`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden bg-[var(--color-surface)]/95 backdrop-blur-xl border-t border-[var(--color-border)]/30 shadow-2xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3 min-h-[48px] rounded-lg font-medium text-base transition-colors ${
                    location.pathname === link.to
                      ? 'text-[#C89B5A] bg-[#C89B5A]/10'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-border)]/30'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-[var(--color-border)]/30 my-2" />

              {isSignedIn && user && (
                <>
                  <Link to="/favourites" className="flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg font-medium text-[var(--text-strong)] hover:bg-[var(--color-border)]/30 transition-colors">
                    <Heart className="w-5 h-5 flex-shrink-0" /> My Favourites
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg font-medium text-[var(--text-strong)] hover:bg-[var(--color-border)]/30 transition-colors">
                    <User className="w-5 h-5 flex-shrink-0" /> My Profile
                  </Link>
                </>
              )}

              {isSignedIn && user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/5 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                >
                  <LogIn className="w-5 h-5 flex-shrink-0" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

