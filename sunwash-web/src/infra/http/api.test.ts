import type { InternalAxiosRequestConfig } from 'axios';
import { api } from './api';
import { clearAccessToken, getAccessToken, setAccessToken } from './authToken';

const authResult = {
  accessToken: 'refreshed-token',
  tokenType: 'Bearer',
  expiresIn: 900,
  user: {
    id: '1',
    name: 'Ana',
    email: 'ana@example.com',
    role: 'USER' as const,
  },
};

const unauthorized = (config: InternalAxiosRequestConfig) => ({
  config,
  response: {
    data: { message: 'Unauthorized' },
    status: 401,
  },
  message: 'Unauthorized',
});

describe('api', () => {
  afterEach(() => {
    clearAccessToken();
    api.defaults.adapter = undefined;
  });

  test('sends credentials and the in-memory access token on requests', async () => {
    setAccessToken('session-token');
    const adapter = jest.fn(async (config: InternalAxiosRequestConfig) => ({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }));
    api.defaults.adapter = adapter;

    await api.get('/appointments');

    const config = adapter.mock.calls[0][0] as InternalAxiosRequestConfig;
    expect(config.withCredentials).toBe(true);
    expect(config.headers.Authorization).toBe('Bearer session-token');
  });

  test('shares one refresh for concurrent unauthorized requests and retries each request once', async () => {
    setAccessToken('expired-token');
    let refreshCalls = 0;
    const requests = new Map<string, number>();
    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCalls += 1;
        return { data: authResult, status: 200, statusText: 'OK', headers: {}, config };
      }

      const calls = (requests.get(config.url ?? '') ?? 0) + 1;
      requests.set(config.url ?? '', calls);
      if (calls === 1) throw unauthorized(config);

      return { data: { path: config.url }, status: 200, statusText: 'OK', headers: {}, config };
    };

    const [first, second] = await Promise.all([
      api.get('/appointments/1'),
      api.get('/appointments/2'),
    ]);

    expect(refreshCalls).toBe(1);
    expect(requests.get('/appointments/1')).toBe(2);
    expect(requests.get('/appointments/2')).toBe(2);
    expect(first.data).toEqual({ path: '/appointments/1' });
    expect(second.data).toEqual({ path: '/appointments/2' });
  });

  test('does not retry a request more than once after a successful refresh', async () => {
    let refreshCalls = 0;
    let protectedCalls = 0;
    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCalls += 1;
        return { data: authResult, status: 200, statusText: 'OK', headers: {}, config };
      }

      protectedCalls += 1;
      throw unauthorized(config);
    };

    await expect(api.get('/appointments')).rejects.toMatchObject({ status: 401 });

    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(2);
  });

  test('clears the access token when refresh fails', async () => {
    setAccessToken('expired-token');
    api.defaults.adapter = async (config) => {
      throw unauthorized(config);
    };

    await expect(api.get('/appointments')).rejects.toMatchObject({ status: 401 });

    expect(getAccessToken()).toBeNull();
  });
});
