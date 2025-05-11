// src/features/auth/routes/index.jsx
import { lazy } from "react";
import { Route } from "react-router";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";

const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const OtpVerificationPage = lazy(() => import("../pages/OtpVerificationPage"));

export const authRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route
      element={<ProtectedRoute type={GUARD_TYPE.NO_AUTH} redirectTo="/" />}
    >
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Route>

    {/* Routes with specific state requirements */}
    <Route
      path="reset-password"
      element={
        <ProtectedRoute
          redirectTo="/"
          requiredState={["reset", "contactType", "contactValue"]}
        >
          <ResetPassword />
        </ProtectedRoute>
      }
    />
    <Route
      path="otp-verification"
      element={
        <ProtectedRoute
          redirectTo="/"
          requiredState={["contactType", "contactValue"]}
        >
          <OtpVerificationPage />
        </ProtectedRoute>
      }
    />
  </>
);
