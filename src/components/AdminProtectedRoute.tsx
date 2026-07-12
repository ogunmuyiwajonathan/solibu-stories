import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function AdminProtectedRoute() {
  const convex = useConvex();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('admin_session_token');
    if (!token) {
      setStatus('unauthorized');
      return;
    }
    convex
      .query(api.admin.isAdmin, { session_token: token })
      .then((result) => {
        if (result && result.isAdmin) {
          setStatus('authorized');
        } else {
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_email');
          setStatus('unauthorized');
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_session_token');
        localStorage.removeItem('admin_email');
        setStatus('unauthorized');
      });
  }, [convex]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
