import type { AuthGateway } from '../../application/gateway/AuthGateway';
import { DummyAuthGateway } from './DummyAuthGateway';
import { HttpAuthGateway } from './HttpAuthGateway';

export const createAuthGateway = (useHttpAuth: boolean, authGateway?: AuthGateway): AuthGateway => (
  authGateway ?? (useHttpAuth ? new HttpAuthGateway() : new DummyAuthGateway())
);
