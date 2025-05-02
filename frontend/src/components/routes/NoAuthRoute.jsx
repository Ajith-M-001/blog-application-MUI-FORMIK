import { useIsAuthenticated } from "../../store/zustand.store";
import { Navigate, Outlet, useLocation } from "react-router";

const NoAuthRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export { NoAuthRoute };
