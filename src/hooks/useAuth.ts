import { useCallback } from 'react';

export function useAuth() {
  const login = useCallback((_password: string): boolean => true, []);
  const logout = useCallback(() => {}, []);

  return { isAuthenticated: true, isLoading: false, login, logout };
}
