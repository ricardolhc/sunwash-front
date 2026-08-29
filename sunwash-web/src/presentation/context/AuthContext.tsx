import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthGateway,
  AuthResult,
  LoginInput,
  RegisterInput,
} from "../../application/gateway/AuthGateway";
import type { User } from "../../domain/User";
import { DummyAuthGateway } from "../../infra/gateway/DummyAuthGateway";
import {
  clearAccessToken,
  setAccessToken,
  setSessionExpiredHandler,
} from "../../infra/http/authToken";
import { DependencyContext } from "./DependencyContext";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login(input: LoginInput): Promise<AuthResult>;
  register(input: RegisterInput): Promise<AuthResult>;
  logout(): Promise<void>;
  restoreSession(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const restoreAuthSession = async (
  gateway: AuthGateway,
): Promise<AuthResult | null> => {
  try {
    return await gateway.refresh();
  } catch {
    return null;
  }
};

export const createSessionRestorer = (
  gateway: AuthGateway,
): (() => Promise<AuthResult | null>) => {
  let restoration: Promise<AuthResult | null> | null = null;

  return () => {
    restoration ??= restoreAuthSession(gateway).finally(() => {
      restoration = null;
    });
    return restoration;
  };
};

export interface AuthProviderProps {
  children?: ReactNode;
  authGateway?: AuthGateway;
}

export const AuthProvider = ({ children, authGateway }: AuthProviderProps) => {
  const dependencies = useContext(DependencyContext);
  const [gateway] = useState<AuthGateway>(
    () => authGateway ?? dependencies?.authGateway ?? new DummyAuthGateway(),
  );
  const restorer = useMemo(() => createSessionRestorer(gateway), [gateway]);
  const sessionGeneration = useRef(0);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const startSessionOperation = useCallback((): number => {
    sessionGeneration.current += 1;
    return sessionGeneration.current;
  }, []);

  const isCurrentSessionOperation = useCallback(
    (generation: number): boolean => sessionGeneration.current === generation,
    [],
  );

  const authenticate = useCallback((result: AuthResult): void => {
    setAccessToken(result.accessToken);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const restoreSession = useCallback(async (): Promise<void> => {
    const generation = startSessionOperation();
    setStatus("loading");
    const result = await restorer();
    if (!isCurrentSessionOperation(generation)) return;

    if (result) {
      authenticate(result);
      return;
    }

    setUser(null);
    setStatus("anonymous");
  }, [
    authenticate,
    isCurrentSessionOperation,
    restorer,
    startSessionOperation,
  ]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      startSessionOperation();
      setUser(null);
      setStatus("anonymous");
    });

    return () => {
      setSessionExpiredHandler(undefined);
    };
  }, [startSessionOperation]);

  const login = useCallback(
    async (input: LoginInput): Promise<AuthResult> => {
      const generation = startSessionOperation();
      const result = await gateway.login(input);
      if (isCurrentSessionOperation(generation)) authenticate(result);
      return result;
    },
    [authenticate, gateway, isCurrentSessionOperation, startSessionOperation],
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      const generation = startSessionOperation();
      const result = await gateway.register(input);
      if (isCurrentSessionOperation(generation)) authenticate(result);
      return result;
    },
    [authenticate, gateway, isCurrentSessionOperation, startSessionOperation],
  );

  const logout = useCallback(async (): Promise<void> => {
    const generation = startSessionOperation();
    try {
      await gateway.logout();
    } finally {
      if (isCurrentSessionOperation(generation)) {
        clearAccessToken();
        setUser(null);
        setStatus("anonymous");
      }
    }
  }, [gateway, isCurrentSessionOperation, startSessionOperation]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      register,
      logout,
      restoreSession,
    }),
    [login, logout, register, restoreSession, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
