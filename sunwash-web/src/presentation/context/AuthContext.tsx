import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthGateway, AuthResult, LoginInput, RegisterInput } from '../../application/gateway/AuthGateway';
import type { User } from '../../domain/User';
import { HttpAuthGateway } from '../../infra/gateway/HttpAuthGateway';
import { clearAccessToken, setAccessToken, setSessionExpiredHandler } from '../../infra/http/authToken';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
  restoreSession(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const restoreAuthSession = async (gateway: AuthGateway): Promise<AuthResult | null> => {
  try {
    const result = await gateway.refresh();
    setAccessToken(result.accessToken);
    return result;
  } catch {
    clearAccessToken();
    return null;
  }
};

export const createSessionRestorer = (gateway: AuthGateway): (() => Promise<AuthResult | null>) => {
  let restoration: Promise<AuthResult | null> | null = null;

  return () => {
    restoration ??= restoreAuthSession(gateway);
    return restoration;
  };
};

export interface AuthProviderProps {
  children: ReactNode;
  authGateway?: AuthGateway;
}

export const AuthProvider = ({ children, authGateway }: AuthProviderProps) => {
  const [gateway] = useState<AuthGateway>(() => authGateway ?? new HttpAuthGateway());
  const restorer = useMemo(() => createSessionRestorer(gateway), [gateway]);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const authenticate = useCallback((result: AuthResult): void => {
    setAccessToken(result.accessToken);
    setUser(result.user);
    setStatus('authenticated');
  }, []);

  const restoreSession = useCallback(async (): Promise<void> => {
    setStatus('loading');
    const result = await restorer();
    if (result) {
      authenticate(result);
      return;
    }

    setUser(null);
    setStatus('anonymous');
  }, [authenticate, restorer]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setStatus('anonymous');
    });

    return () => {
      setSessionExpiredHandler(undefined);
    };
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<void> => {
    authenticate(await gateway.login(input));
  }, [authenticate, gateway]);

  const register = useCallback(async (input: RegisterInput): Promise<void> => {
    authenticate(await gateway.register(input));
  }, [authenticate, gateway]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await gateway.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      setStatus('anonymous');
    }
  }, [gateway]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    status,
    login,
    register,
    logout,
    restoreSession,
  }), [login, logout, register, restoreSession, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
