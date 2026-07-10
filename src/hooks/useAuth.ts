import { useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useAuth() {
  const { isSignedIn, isLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const adminRecord = useQuery(api.admin.isAdmin);

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
    isAdmin: adminRecord ?? false,
    isAuthenticated: isSignedIn ?? false,
    isLoading: !isLoaded,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clerkUser,
  };
}
