import PropTypes from "prop-types";
import { useLocation, Navigate } from "react-router";

const ProtectedRoute = ({ children, requiredState }) => {
  const location = useLocation();

  const isRouteProtected = requiredState.every(
    (state) => location.state?.[state]
  );

  return isRouteProtected ? children : <Navigate to="/about" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredState: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export { ProtectedRoute };
