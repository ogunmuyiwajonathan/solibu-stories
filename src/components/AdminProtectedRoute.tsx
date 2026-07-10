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

  if (!isLoaded || isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-[#101838] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1EAE98] animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
