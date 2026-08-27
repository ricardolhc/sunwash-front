import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '../../domain/User';
import { ROUTES } from '../../shared/constants/routes';
import { RouteSpinner } from '../../shared/components/RouteSpinner';
import { useAuth } from '../context/useAuth';
import { getProtectedRedirectRoute } from './authNavigation';

interface ProtectedRouteProps {
  allowedRoles: User['role'][];
  children: ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { status, user } = useAuth();

  if (status === 'loading') {
    return <RouteSpinner />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getProtectedRedirectRoute(user.role)} replace />;
  }

  return <>{children}</>;
};
