import { Navigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useClerkAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#101838] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1EAE98] animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
