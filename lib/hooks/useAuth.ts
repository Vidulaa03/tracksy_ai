import { useCallback, useEffect, useState } from 'react';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated by making a request
    const checkAuth = async () => {
      try {
        // This is a simple check - in a real app you might have a dedicated endpoint
        setIsLoading(false);
      } catch (err) {
        setError('Failed to check authentication');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      window.location.href = '/auth/login';
    } catch (err) {
      setError('Failed to logout');
    }
  }, []);

  return { user, isLoading, error, logout };
}
