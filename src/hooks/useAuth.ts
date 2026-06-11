import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile, type Profile } from '../data/profiles';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();
      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        if (mounted) setProfile(p);
        await checkAdminStatus(session.user.id);
      }
      if (mounted) setIsLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN' && session?.user) {
          const p = await fetchProfile(session.user.id);
          if (mounted) setProfile(p);
          await checkAdminStatus(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
        }
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          const p = await fetchProfile(session.user.id);
          if (mounted) setProfile(p);
          await checkAdminStatus(session.user.id);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo || window.location.origin },
    });
    return { error };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      const p = await fetchProfile(data.user.id);
      setProfile(p);
      await checkAdminStatus(data.user.id);
    }
    return { error };
  }, [checkAdminStatus]);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (!error && data.user) {
      const p = await fetchProfile(data.user.id);
      setProfile(p);
    }
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
      setIsAdmin(false);
    }
    return { error };
  }, []);

  return {
    user,
    session,
    profile,
    isAdmin,
    isAuthenticated: !!user,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
