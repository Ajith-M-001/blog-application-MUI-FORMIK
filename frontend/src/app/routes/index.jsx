import { Routes, Route, BrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { FallBackLoader } from "../../shared/components/Loaders/FallBackLoader";
import AppLayout from "../layouts/AppLayout";
import { authRoutes } from "../../features/auth/routes/AuthRoutes";
import { ErrorBoundary } from "../../shared/components/ErrorBoundary/ErrorBoundary";
import { blogRoutes } from "../../features/blog/routes/blogRoutes";
import Unauthorized from "../../pages/Unauthorized";
import MyForm1 from "../../pages/MyForm1";
import MyForm from "../../pages/Myform";
import MyForm2 from "../../pages/MyForm2";
import MyForm3 from "../../pages/MyForm3";

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

              <Route path="my-form" element={<MyForm2 />} />
              {/* Auth Routes */}
              {authRoutes}

              <Route path="unauthorized" element={<Unauthorized />} />
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
            {blogRoutes}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRoutes;
