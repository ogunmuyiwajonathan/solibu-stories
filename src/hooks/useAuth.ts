import { useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export function useAuth() {
  const { isSignedIn, isLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const signInWithGoogle = useCallback(async () => {
    return { error: null };
  }, []);

  const signInWithEmail = useCallback(async (_email: string, _password: string) => {
    return { error: null };
  }, []);

  const signUpWithEmail = useCallback(async (_email: string, _password: string, _name: string) => {
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await clerkSignOut();
    return { error: null };
  }, [clerkSignOut]);

  return {
    user: clerkUser,
    session: null,
    isAdmin: false,
    isAuthenticated: isSignedIn ?? false,
    isLoading: !isLoaded,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clerkUser,
  };
}
