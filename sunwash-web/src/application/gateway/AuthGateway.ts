import type { User } from '../../domain/User';

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
  phone?: string;
}

export interface AuthGateway {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  refresh(): Promise<AuthResult>;
  logout(): Promise<void>;
  me(): Promise<User>;
}
