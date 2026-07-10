import { Link } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Loader2, Shield, ArrowLeft, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const isAdmin = useQuery(api.admin.isAdmin);
  const rejectNonAdmin = useMutation(api.admin.checkAndRejectNonAdmin);
  const rejected = useRef(false);

  useEffect(() => {
    if (isSignedIn && isAdmin === false && !rejected.current) {
      rejected.current = true;
      rejectNonAdmin();
    }
  }, [isSignedIn, isAdmin, rejectNonAdmin]);

  if (!isLoaded || isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    if (!isSignedIn) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
          <div className="bg-[var(--surface-strong)] border border-[var(--border-soft)] rounded-2xl p-8 text-center max-w-md">
            <div className="p-3 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 inline-flex mb-4">
              <Shield className="w-8 h-8 text-[var(--gold)]" />
            </div>
            <h1 className="font-display text-xl font-semibold text-[var(--text-strong)] mb-2">
              Author Portal
            </h1>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              Sign in with your author account to access the dashboard.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] text-[var(--color-bg)] rounded-xl font-medium text-sm hover:bg-[var(--gold-deep)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      );
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
            You are signed in but not registered as an author. Contact the site owner if you believe this is a mistake.
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

  return <>{children}</>;
}
