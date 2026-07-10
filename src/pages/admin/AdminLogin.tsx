import { motion } from 'framer-motion';
import { SignIn, useAuth } from '@clerk/react';
import { Navigate, Link } from 'react-router-dom';
import { Shield, ArrowLeft, XCircle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const { isLoaded, isSignedIn } = useAuth();
  const isAdmin = useQuery(api.admin.isAdmin);
  const rejectNonAdmin = useMutation(api.admin.checkAndRejectNonAdmin);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (isSignedIn && isAdmin === false && !rejected) {
      setRejected(true);
      rejectNonAdmin();
    }
  }, [isSignedIn, isAdmin, rejected, rejectNonAdmin]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isSignedIn) {
    if (isAdmin === undefined) {
      return (
        <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
        </div>
      );
    }
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
        <div className="bg-[var(--surface-strong)] border border-[var(--border-soft)] rounded-2xl p-8 text-center max-w-md">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 inline-flex mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-display text-xl font-semibold text-[var(--text-strong)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            You are signed in but not registered as an author. If you believe this is a mistake, contact the site owner.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Mobile: full-screen background image */}
      <div className="lg:hidden fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12101a] to-[#1a1525]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-[var(--color-bg)]/85" />
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Desktop left panel - sticky, fits viewport */}
        <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12101a] to-[#1a1525]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80')] bg-cover bg-center opacity-15" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center max-w-md"
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
                  <Shield className="w-8 h-8 text-[var(--gold)]" />
                </div>
                <span className="font-display text-3xl font-semibold text-[var(--text-strong)] tracking-tight">
                  Author Portal
                </span>
              </div>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                <span className="text-[var(--gold)] text-xs font-medium uppercase tracking-widest">
                  Strictly for Authors
                </span>
              </div>
              <h2 className="font-display text-4xl font-medium text-[var(--text-strong)] leading-tight mb-4">
                Your workspace awaits
              </h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                Publish stories, track readership, and manage your portfolio from a single dashboard.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right panel - scrollable */}
        <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex items-start justify-center py-8 px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex items-center gap-2.5 mb-10">
              <div className="p-2 rounded-xl bg-[var(--gold)]/10">
                <Shield className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <span className="font-display text-2xl font-semibold text-[var(--text-strong)] tracking-tight">
                Author Portal
              </span>
            </div>

            <SignIn routing="hash" signUpUrl="/signup" fallbackRedirectUrl="/admin" />

            <div className="mt-8 text-center">
              <Link to="/signin" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-soft)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
