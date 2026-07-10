import { Navigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const isAdmin = useQuery(api.admin.isAdmin);

  // Still loading auth state
  if (!isLoaded || isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  // Not signed in - redirect to admin login
  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Signed in but not admin - redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin - show the admin content
  return <>{children}</>;
}
