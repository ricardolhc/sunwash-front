jest.mock('../http/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { api } from '../http/api';
import { HttpAuthGateway } from './HttpAuthGateway';

const user = {
  id: '1',
  name: 'Ana',
  email: 'ana@example.com',
  phone: '11999999999',
  role: 'USER' as const,
};

const authResult = {
  accessToken: 'access-token',
  tokenType: 'Bearer',
  expiresIn: 900,
  user,
};

describe('HttpAuthGateway', () => {
  const post = api.post as jest.Mock;
  const get = api.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registers with the configured auth route and returns the auth result', async () => {
    post.mockResolvedValue({ data: authResult });

    const result = await new HttpAuthGateway().register({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'senha-segura',
      phone: '11999999999',
    });

    expect(post).toHaveBeenCalledWith('/auth/register', {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'senha-segura',
      phone: '11999999999',
    });
    expect(result).toEqual(authResult);
  });

  test('logs in with the configured auth route and returns the auth result', async () => {
    post.mockResolvedValue({ data: authResult });

    const result = await new HttpAuthGateway().login({
      email: 'ana@example.com',
      password: 'senha-segura',
    });

    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: 'ana@example.com',
      password: 'senha-segura',
    });
    expect(result).toEqual(authResult);
  });

  test('refreshes through the configured auth route and returns the auth result', async () => {
    post.mockResolvedValue({ data: authResult });

    const result = await new HttpAuthGateway().refresh();

    expect(post).toHaveBeenCalledWith('/auth/refresh');
    expect(result).toEqual(authResult);
  });

  test('logs out through the configured auth route', async () => {
    post.mockResolvedValue({ data: undefined });

    await new HttpAuthGateway().logout();

    expect(post).toHaveBeenCalledWith('/auth/logout');
  });

  test('gets the current user through the configured api route', async () => {
    get.mockResolvedValue({ data: user });

    const result = await new HttpAuthGateway().me();

    expect(get).toHaveBeenCalledWith('/me');
    expect(result).toEqual(user);
  });
});
