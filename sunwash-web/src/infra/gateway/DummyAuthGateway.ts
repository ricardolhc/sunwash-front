import type { AuthGateway, AuthResult, LoginInput, RegisterInput } from '../../application/gateway/AuthGateway';
import type { User } from '../../domain/User';
import { authFixture, type AuthFixtureUser } from '../../fixture/authFixture';

const tokenType = 'Bearer';
const expiresIn = 60 * 60;

const cloneUser = (user: AuthFixtureUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export class DummyAuthGateway implements AuthGateway {
  private users: AuthFixtureUser[];

  private activeUserEmail: string | null;

  private nextUserId: number;

  constructor(seedUsers: AuthFixtureUser[] = authFixture.users) {
    this.users = seedUsers.map((user) => ({ ...user }));
    this.activeUserEmail = null;
    this.nextUserId = this.users.length + 1;
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    if (this.users.some((user) => user.email === input.email)) {
      throw new Error('E-mail já cadastrado');
    }

    const user: AuthFixtureUser = {
      id: `user-${this.nextUserId++}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.password,
      role: 'USER',
    };

    this.users.push(user);
    this.activeUserEmail = user.email;
    return this.buildAuthResult(user);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = this.users.find((candidate) =>
      candidate.email === input.email && candidate.password === input.password);

    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }

    this.activeUserEmail = user.email;
    return this.buildAuthResult(user);
  }

  async refresh(): Promise<AuthResult> {
    const user = this.getActiveUser();
    return this.buildAuthResult(user);
  }

  async logout(): Promise<void> {
    this.activeUserEmail = null;
  }

  async me(): Promise<User> {
    return cloneUser(this.getActiveUser());
  }

  private getActiveUser(): AuthFixtureUser {
    if (!this.activeUserEmail) {
      throw new Error('Sessão inexistente');
    }

    const user = this.users.find((candidate) => candidate.email === this.activeUserEmail);
    if (!user) {
      throw new Error('Sessão inexistente');
    }

    return user;
  }

  private buildAuthResult(user: AuthFixtureUser): AuthResult {
    return {
      accessToken: `dummy-access-token-${user.id}`,
      tokenType,
      expiresIn,
      user: cloneUser(user),
    };
  }
}
