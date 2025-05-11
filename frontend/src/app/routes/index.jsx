import { Routes, Route, BrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { FallBackLoader } from "../../shared/components/Loaders/FallBackLoader";
import AppLayout from "../layouts/AppLayout";
import { authRoutes } from "../../features/auth/routes/AuthRoutes";
import { ErrorBoundary } from "../../shared/components/ErrorBoundary/ErrorBoundary";

// Lazy load public pages
const Home = lazy(() => import("../../pages/Home"));
const About = lazy(() => import("../../pages/About"));
const Contact = lazy(() => import("../../pages/Contact"));
const NotFound = lazy(() => import("../../pages/NotFound"));

const AppRoutes = () => {
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

              {/* Auth Routes */}
              {authRoutes}

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRoutes;
