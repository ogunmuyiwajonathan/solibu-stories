import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, isAdmin, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage('Invalid email or password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (!adminUser) {
        await supabase.auth.signOut();
        setErrorMessage('You are not authorized to access this panel.');
        setIsSubmitting(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="p-2 rounded-xl bg-[var(--gold)]/10">
            <BookOpen className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <span className="font-display text-2xl font-semibold text-[var(--text-strong)] tracking-tight">
            Solibu Stories
          </span>
        </div>

        <h1 className="font-display text-3xl font-medium text-[var(--text-strong)] mb-2 text-center">
          Admin Access
        </h1>
        <p className="text-[var(--text-muted)] mb-8 text-center">
          Sign in to access the admin dashboard
        </p>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-[var(--destructive)] flex-shrink-0" />
            <span className="text-[var(--destructive)] text-sm font-medium">{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-soft)] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 bg-[var(--surface-light)] border border-[var(--border-soft)] rounded-xl text-[var(--text-strong)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 transition-all"
                required
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--gold)] hover:bg-[var(--gold-deep)] text-[var(--color-bg)] font-semibold rounded-xl shadow-lg shadow-[var(--gold)]/20 transition-all hover:shadow-xl hover:shadow-[var(--gold)]/30 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-soft)] transition-colors">
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
