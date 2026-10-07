import type { ReactNode } from 'react';
import { ClerkProvider, useAuth } from '@clerk/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { convex } from './convex';

/**
 * Clerk + Convex must wrap the app together: Convex reads Clerk's auth state
 * through the `useAuth` hook passed here, so both providers have to share one
 * React tree.
 */
export default function ConvexClerkProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
