import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    const apiError = new Error(message || 'Nao foi possivel comunicar com a API.') as Error & { status?: number };
    apiError.status = error.response?.status;
    return Promise.reject(apiError);
  },
);

export const numericId = (id: string): number => {
  const match = id.match(/(\d+)$/);
  if (!match) throw new Error(`ID invalido: ${id}`);
  return Number(match[1]);
};

export const isNotFound = (error: unknown): boolean =>
  error instanceof Error && (error as Error & { status?: number }).status === 404;
