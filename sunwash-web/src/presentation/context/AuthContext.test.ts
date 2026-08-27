import type { AuthGateway } from '../../application/gateway/AuthGateway';
import { clearAccessToken, getAccessToken, setAccessToken } from '../../infra/http/authToken';
import { createSessionRestorer, restoreAuthSession } from './AuthContext';

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

describe('auth session restoration', () => {
  afterEach(() => {
    clearAccessToken();
  });

  test('restores the access token from a successful refresh response', async () => {
    const gateway = gatewayWith(jest.fn().mockResolvedValue(authResult));

    const result = await restoreAuthSession(gateway);

    expect(result).toEqual(authResult);
    expect(getAccessToken()).toBe('access-token');
  });

  test('clears the previous access token when refresh cannot restore a session', async () => {
    setAccessToken('expired-token');
    const gateway = gatewayWith(jest.fn().mockRejectedValue(new Error('Unauthorized')));

    const result = await restoreAuthSession(gateway);

    expect(result).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  test('shares a restoration attempt when an effect runs twice in StrictMode', async () => {
    const refresh = jest.fn().mockResolvedValue(authResult);
    const restore = createSessionRestorer(gatewayWith(refresh));

    const [first, second] = await Promise.all([restore(), restore()]);

    expect(first).toEqual(authResult);
    expect(second).toEqual(authResult);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
