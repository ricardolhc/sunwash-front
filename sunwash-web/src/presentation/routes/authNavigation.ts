import type { Location } from 'react-router-dom';
import type { User } from '../../domain/User';
import { getDashboardRoute, ROUTES } from '../../shared/constants/routes';

export const getPostAuthRoute = (user: User, from?: Location | string | null): string => {
  if (typeof from === 'string' && from) {
    return from;
  }

  if (from && typeof from === 'object' && 'pathname' in from && from.pathname) {
    return from.pathname + (from.search ?? '');
  }

  return getDashboardRoute(user.role);
};

export const getProtectedRedirectRoute = (role?: User['role'] | null): string => (
  role === 'ADMIN' ? ROUTES.ADMIN : ROUTES.PANEL
);
