import { DummyAuthGateway } from './DummyAuthGateway';

describe('DummyAuthGateway', () => {
  test('logs in seeded users and exposes the active session', async () => {
    const gateway = new DummyAuthGateway();

    const result = await gateway.login({
      email: 'ana@example.com',
      password: 'senha123',
    });

    expect(result.user.email).toBe('ana@example.com');
    expect(result.user.role).toBe('USER');
    await expect(gateway.refresh()).resolves.toMatchObject({
      user: { email: 'ana@example.com' },
    });
    await expect(gateway.me()).resolves.toMatchObject({
      email: 'ana@example.com',
    });
  });

  test('registers a new user and logs the new session in automatically', async () => {
    const gateway = new DummyAuthGateway();

    const result = await gateway.register({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'senha123',
    });

    expect(result.user.email).toBe('maria@example.com');
    expect(result.user.role).toBe('USER');
    await expect(gateway.refresh()).resolves.toMatchObject({
      user: { email: 'maria@example.com' },
    });
  });

  test('logs out and clears the active session', async () => {
    const gateway = new DummyAuthGateway();

    await gateway.login({
      email: 'ana@example.com',
      password: 'senha123',
    });

    await gateway.logout();

    await expect(gateway.refresh()).rejects.toThrow('Sessão inexistente');
    await expect(gateway.me()).rejects.toThrow('Sessão inexistente');
  });
});
