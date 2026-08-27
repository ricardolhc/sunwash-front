export const ROUTES = {
  HOME: '/',
  SCHEDULE: '/agendar',
  CHECKOUT: '/checkout',
  PANEL: '/painel',
  ADMIN: '/admin',
} as const;

export type AppRoutes = (typeof ROUTES)[keyof typeof ROUTES];
