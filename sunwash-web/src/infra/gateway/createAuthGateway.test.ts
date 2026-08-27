import { DummyAuthGateway } from './DummyAuthGateway';
import { HttpAuthGateway } from './HttpAuthGateway';
import { createAuthGateway } from './createAuthGateway';

describe('createAuthGateway', () => {
  test('defaults to the dummy gateway for local testing', () => {
    expect(createAuthGateway(false)).toBeInstanceOf(DummyAuthGateway);
  });

  test('can opt into the HTTP gateway for backend-driven auth', () => {
    expect(createAuthGateway(true)).toBeInstanceOf(HttpAuthGateway);
  });
});
