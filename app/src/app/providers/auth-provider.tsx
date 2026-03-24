import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../../types/domain';
import type { MeResponse } from '../../types/api';
import { ApiError, apiRequest, setAccessTokenProvider } from '../../services/api/client';
import { sessionStorage } from '../../services/storage/session-storage';

type AuthBootstrapStatus = 'loading' | 'success' | 'error';

interface AuthContextValue {
  user: User | null;
  status: AuthBootstrapStatus;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthBootstrapStatus>('loading');

  useEffect(() => {
    setAccessTokenProvider(() => accessToken);

    return () => {
      setAccessTokenProvider(null);
    };
  }, [accessToken]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const token = await sessionStorage.getAccessToken();
        if (!mounted) {
          return;
        }

        setAccessToken(token);
        if (!token) {
          setUser(null);
          setStatus('success');
          return;
        }

        const me = await apiRequest<MeResponse>('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!mounted) {
          return;
        }

        setUser(me.user);
        setStatus('success');
      } catch (error) {
        if (!mounted) {
          return;
        }

        const isUnauthorized =
          (error instanceof ApiError && error.code === 'UNAUTHORIZED') ||
          (error instanceof Error &&
            (error.message.includes('401') || error.message.includes('403')));

        if (isUnauthorized) {
          await sessionStorage.clear();
          setUser(null);
          setAccessToken(null);
          setStatus('success');
          return;
        }

        setUser(null);
        setAccessToken(null);
        setStatus('error');
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        accessToken,
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
