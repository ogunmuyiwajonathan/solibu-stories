import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useConvex, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Shield, XCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
        <div className="bg-red-900/20 border border-red-800/40 rounded-2xl p-8 max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-300 mb-2">Configuration Error</h2>
          <p className="text-zinc-400">
            VITE_GOOGLE_CLIENT_ID is not set. Please configure it in the .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AdminLoginInner />
    </GoogleOAuthProvider>
  );
}

function AdminLoginInner() {
  const navigate = useNavigate();
  const convex = useConvex();
  const loginWithGoogle = useAction(api.admin.loginWithGoogle);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if a valid session already exists
  useEffect(() => {
    const token = localStorage.getItem('admin_session_token');
    if (!token) {
      setIsChecking(false);
      return;
    }
    convex
      .query(api.admin.isAdmin, { session_token: token })
      .then((result) => {
        if (result && result.isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_email');
          localStorage.removeItem('admin_picture');
          setIsChecking(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_session_token');
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_picture');
        setIsChecking(false);
      });
  }, [navigate, convex]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError(null);
      setIsLoggingIn(true);
      const result = await loginWithGoogle({
        idToken: credentialResponse.credential!,
      });
      localStorage.setItem('admin_session_token', result.sessionToken);
      localStorage.setItem('admin_email', result.email);
      localStorage.setItem('admin_picture', result.picture ?? '');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please try again.';
      if (msg.includes('not authorized') || msg.includes('Access denied')) {
        setError('Access denied. This Google account is not authorized as an admin.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </button>

        {/* Card */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-8 h-8 text-zinc-950" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Admin Access
          </h1>
          <p className="text-zinc-400 text-center text-sm mb-8">
            Sign in with your authorized Google account to manage the library.
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-800/40 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">Access Denied</p>
                <p className="text-red-400/80 text-xs mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Google Sign In */}
          <div className="flex justify-center">
            {isLoggingIn ? (
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span className="text-zinc-400 text-sm">Verifying...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed. Please try again.')}
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
                width={300}
              />
            )}
          </div>

          <p className="text-zinc-600 text-xs text-center mt-6">
            Only authorized admin accounts can access this area.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
