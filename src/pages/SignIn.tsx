import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

export default function SignIn() {
  const [mode, setMode] = useState<Mode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({ books: 0, genres: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('books')
        .select('id, Genre', { count: 'exact', head: false });
      if (data) {
        const bookCount = data.length;
        const genreCount = new Set(data.map((b: { Genre: string }) => b.Genre)).size;
        setStats({ books: bookCount, genres: genreCount });
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Left side — Branding / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[#1a120a] to-[var(--surface-strong)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-md"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                <BookOpen className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <span className="font-display text-3xl font-semibold text-[var(--text-strong)] tracking-tight">
                Solibu Stories
              </span>
            </div>
            <h2 className="font-display text-4xl font-medium text-[var(--text-strong)] leading-tight mb-4">
              Your next great adventure awaits
            </h2>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              Discover thousands of stories across every genre. Sign in to track your reading journey and build your personal library.
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex gap-4"
          >
            {[
              { number: stats.books, label: 'Stories' },
              { number: stats.genres, label: 'Genres' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-6">
                <p className="font-display text-2xl font-semibold text-[var(--gold)]">{stat.number}</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="p-2 rounded-xl bg-[var(--gold)]/10">
              <BookOpen className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <span className="font-display text-2xl font-semibold text-[var(--text-strong)] tracking-tight">
              Solibu Stories
            </span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-[var(--surface-light)] rounded-xl p-1 mb-8 border border-[var(--border-soft)]">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === m
                    ? 'bg-[var(--gold)] text-[var(--color-bg)] shadow-lg shadow-[var(--gold)]/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-soft)]'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] mb-2">
                  Welcome back
                </h1>
                <p className="text-[var(--text-muted)] mb-8">
                  Sign in to continue your reading journey
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-soft)]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-soft)] bg-[var(--surface-light)] text-[var(--gold)] focus:ring-[var(--gold)]/20" />
                      <span className="text-sm text-[var(--text-muted)]">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-[var(--gold)] hover:text-[var(--gold-deep)] transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-semibold rounded-xl shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-[var(--text-muted)] text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-[var(--gold)] hover:text-[var(--gold-deep)] font-medium transition-colors"
                    >
                      Create one now
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] mb-2">
                  Create your account
                </h1>
                <p className="text-[var(--text-muted)] mb-8">
                  Join thousands of readers discovering new stories
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-soft)]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-[var(--border-soft)] bg-[var(--surface-light)] text-[var(--gold)] focus:ring-[var(--gold)]/20" />
                    <span className="text-sm text-[var(--text-muted)]">
                      I agree to the{' '}
                      <span className="text-[var(--gold)] hover:underline">Terms of Service</span>
                      {' '}and{' '}
                      <span className="text-[var(--gold)] hover:underline">Privacy Policy</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-semibold rounded-xl shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-[var(--text-muted)] text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-[var(--gold)] hover:text-[var(--gold-deep)] font-medium transition-colors"
                    >
                      Sign in instead
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-soft)] transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
