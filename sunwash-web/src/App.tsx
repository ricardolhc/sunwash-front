import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './shared/constants/routes';
import { LandingPage } from './presentation/pages/LandingPage';
import { SchedulePage } from './presentation/pages/SchedulePage';
import { CheckoutPage } from './presentation/pages/CheckoutPage';
import { ClientDashboardPage } from './presentation/pages/ClientDashboardPage';
import { AdminDashboardPage } from './presentation/pages/AdminDashboardPage';
import { ReportsPage } from './presentation/pages/ReportsPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RegisterPage } from './presentation/pages/RegisterPage';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';
import { PublicOnlyRoute } from './presentation/routes/PublicOnlyRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route
          path={ROUTES.LOGIN}
          element={(
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path={ROUTES.REGISTER}
          element={(
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path={ROUTES.PANEL}
          element={(
            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
              <ClientDashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path={ROUTES.ADMIN}
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path={ROUTES.REPORTS}
          element={(
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReportsPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
