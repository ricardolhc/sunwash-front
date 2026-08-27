import { clearAccessToken, expireSession, getAccessToken, setAccessToken, setSessionExpiredHandler } from './authToken';

describe('authToken', () => {
  afterEach(() => {
    clearAccessToken();
    setSessionExpiredHandler(undefined);
  });

  test('keeps the access token only in module memory', () => {
    setAccessToken('access-token');

    expect(getAccessToken()).toBe('access-token');

    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });

  test('notifies the active session when it expires', () => {
    const onExpired = jest.fn();
    setAccessToken('access-token');
    setSessionExpiredHandler(onExpired);

    expireSession();

    expect(getAccessToken()).toBeNull();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });
});
