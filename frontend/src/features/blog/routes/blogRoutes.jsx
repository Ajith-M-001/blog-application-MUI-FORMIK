import { Route } from "react-router";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import BlogFormProvider from "../providers/BlogFormProvider";
import { lazy, Suspense } from "react";
import { FallBackLoader } from "../../../shared/components/Loaders/FallBackLoader";

// Lazy load blog components for better performance
const CreateBlog = lazy(() => import("../pages/CreateBlog"));
const PreviewBlog = lazy(() => import("../pages/PreviewBlog"));

export const blogRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route element={<ProtectedRoute type={GUARD_TYPE.AUTH} redirectTo="/" />}>
      <Route
        path="create-blog"
        element={
          <BlogFormProvider>
            <Suspense fallback={<FallBackLoader />}>
              <CreateBlog />
            </Suspense>
          </BlogFormProvider>
        }
      />
      <Route
        path="preview-blog"
        element={
          <BlogFormProvider>
            <Suspense fallback={<FallBackLoader />}>
              <PreviewBlog />
            </Suspense>
          </BlogFormProvider>
        }
      />
    </Route>
  </>
);
