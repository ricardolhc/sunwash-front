import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './shared/constants/routes';
import { LandingPage } from './presentation/pages/LandingPage';
import { SchedulePage } from './presentation/pages/SchedulePage';
import { CheckoutPage } from './presentation/pages/CheckoutPage';
import { ClientDashboardPage } from './presentation/pages/ClientDashboardPage';
import { AdminDashboardPage } from './presentation/pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.SCHEDULE} element={<SchedulePage />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route path={ROUTES.PANEL} element={<ClientDashboardPage />} />
        <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
