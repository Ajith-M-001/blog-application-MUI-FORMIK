import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "../../store/zustand.store";

const NoAuthRoute = () => {


  const  isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export { NoAuthRoute };

