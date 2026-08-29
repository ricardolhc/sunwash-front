import type {
  AuthGateway,
  AuthResult,
  LoginInput,
  RegisterInput,
} from "../../application/gateway/AuthGateway";
import type { User } from "../../domain/User";
import { api } from "../http/api";

export class HttpAuthGateway implements AuthGateway {
  async register(input: RegisterInput): Promise<AuthResult> {
    const response = await api.post<AuthResult>("/auth/register", input, {
      withCredentials: true,
    });
    return response.data;
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const response = await api.post<AuthResult>("/auth/login", input, {
      withCredentials: true,
    });
    return response.data;
  }

  async refresh(): Promise<AuthResult> {
    const response = await api.post<AuthResult>("/auth/refresh", undefined, {
      withCredentials: true,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post("/auth/logout", undefined, {
      withCredentials: true,
    });
  }

  async me(): Promise<User> {
    const response = await api.get<User>("/me");
    return response.data;
  }
}
