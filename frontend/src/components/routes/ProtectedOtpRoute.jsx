import { useShallow } from "zustand/react/shallow";
import useStore from "../../store/zustand.store";
import { Navigate, Outlet } from "react-router";

const ProtectedOtpRoute = () => {
  const { needsOtpVerification } = useStore(
    useShallow((state) => ({
      needsOtpVerification: state.needsOtpVerification,
    }))
  );
  return needsOtpVerification ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedOtpRoute;
