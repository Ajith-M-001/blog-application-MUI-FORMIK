import { Route } from "react-router";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import { lazy } from "react";
import CreateBlog1 from "../pages/CreateBlog1";

// Lazy load blog components for better performance
const CreateBlog = lazy(() => import("../pages/CreateBlog"));
const PreviewBlog = lazy(() => import("../pages/PreviewBlog"));

export const blogRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route element={<ProtectedRoute type={GUARD_TYPE.AUTH} redirectTo="/" />}>
      <Route path="create-blog" element={<CreateBlog />} />
      <Route path="create-blog1" element={<CreateBlog1 />} />
      <Route path="preview-blog" element={<PreviewBlog />} />
    </Route>
  </>
);
