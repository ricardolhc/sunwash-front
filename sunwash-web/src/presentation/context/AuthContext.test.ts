/** @jest-environment jsdom */

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { AuthGateway } from '../../application/gateway/AuthGateway';
import { clearAccessToken, getAccessToken, setAccessToken } from '../../infra/http/authToken';
import { AuthProvider, createSessionRestorer, restoreAuthSession, useAuthContext, type AuthContextValue } from './AuthContext';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const authResult = {
  accessToken: 'access-token',
  tokenType: 'Bearer',
  expiresIn: 900,
  user: {
    id: '1',
    name: 'Ana',
    email: 'ana@example.com',
    role: 'USER' as const,
  },
};

const gatewayWith = (refresh: AuthGateway['refresh']): AuthGateway => ({
  refresh,
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  me: jest.fn(),
});

const deferred = <T,>() => {
  let resolve: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve: resolve! };
};

const AuthStateProbe = ({ onValue }: { onValue: (value: AuthContextValue) => void }) => {
  onValue(useAuthContext());
  return null;
};

describe('auth session restoration', () => {
  afterEach(() => {
    clearAccessToken();
  });

  test('returns the refresh result without committing a token before the provider accepts it', async () => {
    const gateway = gatewayWith(jest.fn().mockResolvedValue(authResult));

    const result = await restoreAuthSession(gateway);

    expect(result).toEqual(authResult);
    expect(getAccessToken()).toBeNull();
  });

  test('does not clear a newer token when refresh cannot restore a session', async () => {
    setAccessToken('newer-token');
    const gateway = gatewayWith(jest.fn().mockRejectedValue(new Error('Unauthorized')));

    const result = await restoreAuthSession(gateway);

    expect(result).toBeNull();
    expect(getAccessToken()).toBe('newer-token');
  });

  test('shares a restoration attempt when an effect runs twice in StrictMode', async () => {
    const refresh = jest.fn().mockResolvedValue(authResult);
    const restore = createSessionRestorer(gatewayWith(refresh));

    const [first, second] = await Promise.all([restore(), restore()]);

    expect(first).toEqual(authResult);
    expect(second).toEqual(authResult);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  test('starts a fresh restoration after the previous attempt settles', async () => {
    const refresh = jest.fn()
      .mockResolvedValueOnce(authResult)
      .mockResolvedValueOnce({ ...authResult, accessToken: 'new-access-token' });
    const restore = createSessionRestorer(gatewayWith(refresh));

    await expect(restore()).resolves.toEqual(authResult);
    await expect(restore()).resolves.toMatchObject({ accessToken: 'new-access-token' });

    expect(refresh).toHaveBeenCalledTimes(2);
  });

  test('does not restore an old session after logout wins the race', async () => {
    const pendingRefresh = deferred<typeof authResult>();
    const gateway = gatewayWith(jest.fn().mockReturnValue(pendingRefresh.promise));
    let context: AuthContextValue | undefined;
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    await act(async () => {
      root.render(createElement(
        AuthProvider,
        { authGateway: gateway },
        createElement(AuthStateProbe, { onValue: (value) => { context = value; } }),
      ));
    });

    await act(async () => {
      await context!.logout();
    });

    await act(async () => {
      pendingRefresh.resolve(authResult);
      await pendingRefresh.promise;
    });

    expect(context!.status).toBe('anonymous');
    expect(context!.user).toBeNull();
    expect(getAccessToken()).toBeNull();

    await act(async () => {
      root.unmount();
    });
  });
});
