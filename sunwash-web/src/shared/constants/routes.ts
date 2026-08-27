import type { User } from '../../domain/User';

export const ROUTES = {
  HOME: '/',
  SCHEDULE: '/agendar',
  CHECKOUT: '/checkout',
  PANEL: '/painel',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/cadastro',
} as const;

export type AppRoutes = (typeof ROUTES)[keyof typeof ROUTES];

export const getDashboardRoute = (role?: User['role'] | null): AppRoutes => (
  role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.PANEL
);
