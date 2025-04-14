// src/components/routes/AuthProtectedRoute.tsx
import { useShallow } from "zustand/react/shallow";
import useStore from "../../store/zustand.store";
import { Navigate, Outlet, useLocation } from "react-router";

const AuthProtectedRoute = () => {
  const { isAuthenticated } = useStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace state={{ from: location }} />
  );
};

export { AuthProtectedRoute };
