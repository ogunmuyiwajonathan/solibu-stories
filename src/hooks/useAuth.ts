import { useAuth as useClerkAuth, useUser } from '@clerk/react';

/**
 * Thin wrapper over Clerk's reader-side auth.
 *
 * IMPORTANT: this must import from `@clerk/react`, never from `@clerk/clerk-react`.
 * Those are two independent Clerk implementations with separate React contexts. The
 * `ClerkProvider` in `src/main.tsx` comes from `@clerk/react`, so a hook reading the
 * `@clerk/clerk-react` context never sees a signed-in user.
 */
export function useAuth() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user } = useUser();

  return {
    user,
    isAuthenticated: isSignedIn ?? false,
    isLoading: !isLoaded,
  };
}