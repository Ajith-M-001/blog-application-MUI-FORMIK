// src/components/routes/AuthProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "../../store/zustand.store";

const AuthProtectedRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace state={{ from: location }} />
  );
};

export { AuthProtectedRoute };
