import { Navigate, Outlet, useLocation } from "react-router";
import { GUARD_TYPE } from "../../shared/constants/constants";
import PropTypes from "prop-types";
import { useIsAuthenticated } from "../../shared/store/userStore";

const ProtectedRoute = ({
  type = GUARD_TYPE.AUTH,
  redirectTo = "/sign-in",
  requiredState = [],
}) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // ✅ Check if required state exists
  const hasRequiredState =
    requiredState.length === 0 ||
    requiredState.every((key) => location.state?.[key] !== undefined);

  if (!hasRequiredState) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (type === GUARD_TYPE.AUTH && !isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (type === GUARD_TYPE.NO_AUTH && isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  type: PropTypes.oneOf(Object.values(GUARD_TYPE)),
  redirectTo: PropTypes.string,
  requiredState: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
