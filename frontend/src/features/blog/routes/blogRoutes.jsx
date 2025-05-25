import { Route } from "react-router";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import { lazy } from "react";
import BlogForm from "../pages/BlogForm";

// Lazy load blog components for better performance
const CreateBlog = lazy(() => import("../pages/CreateBlog"));
const PreviewBlog = lazy(() => import("../pages/PreviewBlog"));

export const blogRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route element={<ProtectedRoute type={GUARD_TYPE.AUTH} redirectTo="/" />}>
      <Route path="create-blog" element={<CreateBlog />} />
      <Route path="edit-blog/:slug" element={<BlogForm />} />
      <Route path="create-blog1" element={<BlogForm />} />
      <Route path="preview-blog" element={<PreviewBlog />} />
    </Route>
  </>
);
