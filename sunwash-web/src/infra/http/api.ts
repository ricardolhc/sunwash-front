import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthResult } from '../../application/gateway/AuthGateway';
import { expireSession, getAccessToken, setAccessToken } from './authToken';

declare const __VITE_API_URL__: string;

export const API_BASE_URL = typeof __VITE_API_URL__ === 'string' ? __VITE_API_URL__ : '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retriedAfterRefresh?: boolean;
}

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = api.post<AuthResult>('/auth/refresh', undefined, { withCredentials: true })
      .then((response) => {
        setAccessToken(response.data.accessToken);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const isAuthRequest = (url: string | undefined): boolean => url?.startsWith('/auth/') ?? false;

const toApiError = (error: AxiosError<{ message?: string; error?: string }>): Error & { status?: number } => {
  if (error instanceof Error && 'status' in error) {
    return error as Error & { status?: number };
  }

  const message = error.response?.data?.message || error.response?.data?.error || error.message;
  const apiError = new Error(message || 'Nao foi possivel comunicar com a API.') as Error & { status?: number };
  apiError.status = error.response?.status;
  return apiError;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const request = error.config as RetriableRequestConfig | undefined;
    const canRefresh = error.response?.status === 401 && request && !request._retriedAfterRefresh && !isAuthRequest(request.url);

    if (canRefresh) {
      request._retriedAfterRefresh = true;
      try {
        await refreshAccessToken();
        return api(request);
      } catch (refreshError) {
        expireSession();
        return Promise.reject(toApiError(refreshError as AxiosError<{ message?: string; error?: string }>));
      }
    }

    return Promise.reject(toApiError(error));
  },
);

export const numericId = (id: string): number => {
  const match = id.match(/(\d+)$/);
  if (!match) throw new Error(`ID invalido: ${id}`);
  return Number(match[1]);
};

export const isNotFound = (error: unknown): boolean =>
  error instanceof Error && (error as Error & { status?: number }).status === 404;
