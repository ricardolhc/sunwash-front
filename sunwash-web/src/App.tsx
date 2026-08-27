import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./shared/constants/routes";
import { LandingPage } from "./presentation/pages/LandingPage";
import { SchedulePage } from "./presentation/pages/SchedulePage";
import { CheckoutPage } from "./presentation/pages/CheckoutPage";
import { ClientDashboardPage } from "./presentation/pages/ClientDashboardPage";
import { AdminDashboardPage } from "./presentation/pages/AdminDashboardPage";

const routes = [
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: ROUTES.SCHEDULE,
    element: <SchedulePage />,
  },
  {
    path: ROUTES.CHECKOUT,
    element: <CheckoutPage />,
  },
  {
    path: ROUTES.PANEL,
    element: <ClientDashboardPage />,
  },
  {
    path: ROUTES.ADMIN,
    element: <AdminDashboardPage />,
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
