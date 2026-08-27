import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteSpinner } from '../../shared/components/RouteSpinner';
import { useAuth } from '../context/useAuth';
import { getDashboardRoute } from '../../shared/constants/routes';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { status, user } = useAuth();

  if (status === 'loading') {
    return <RouteSpinner />;
  }

  if (status === 'authenticated' && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <>{children}</>;
};
