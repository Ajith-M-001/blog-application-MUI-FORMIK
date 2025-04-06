import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FallBackLoader } from "./components/Loaders/FallBackLoader";
import { ProtectedRoute } from "./components/routes/ProtectedOtpRoute";
import { NoAuthRoute } from "./components/routes/NoAuthRoute";

// Lazy load

const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OtpVerificationPage = lazy(() => import("./pages/OtpVerificationPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<FallBackLoader />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route element={<NoAuthRoute />}>
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
              </Route>
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route
                path="reset-password"
                element={
                  <ProtectedRoute
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
                    requiredState={["contactType", "contactValue"]}
                  >
                    <OtpVerificationPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
