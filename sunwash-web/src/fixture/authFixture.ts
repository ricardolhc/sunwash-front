import authDummy from '../infra/gateway/dummy/auth.json';
import type { User } from '../domain/User';

export interface AuthFixtureUser extends User {
  password: string;
}

export interface AuthFixture {
  users: AuthFixtureUser[];
}

export const authFixture = authDummy as AuthFixture;

export const mockAuthUsers: AuthFixtureUser[] = authFixture.users;
