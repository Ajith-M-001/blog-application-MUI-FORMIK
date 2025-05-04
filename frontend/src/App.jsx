import { BrowserRouter, Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FallBackLoader } from "./components/Loaders/FallBackLoader";
import { ProtectedRoute } from "./components/routes/ProtectedOtpRoute";
import { NoAuthRoute } from "./components/routes/NoAuthRoute";
import { AuthProtectedRoute } from "./components/routes/AuthProtectedRoute";
import BlogFormProvider from "./pages/Blog/components/BlogFormProvider";

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
const PreviewBlog = lazy(() => import("./pages/Blog/PreviewBlog"));
const CreateBlog = lazy(() => import("./pages/Blog/CreateBlog"));

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<FallBackLoader />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              {/* Authentication Protected Routes */}
              <Route element={<NoAuthRoute />}>
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
              </Route>

              {/* Other Routes */}
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
            {/* Authenticated User Protected Routes */}
            <Route element={<AuthProtectedRoute />}>
              <Route
                path="create-blog"
                element={
                  <BlogFormProvider>
                    <CreateBlog />
                  </BlogFormProvider>
                }
              />
              <Route
                path="preview-blog"
                element={
                  <BlogFormProvider>
                    <PreviewBlog />
                  </BlogFormProvider>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
