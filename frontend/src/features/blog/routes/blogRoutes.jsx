import { Route } from "react-router";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import CreateBlog from "../pages/CreateBlog";
import PreviewBlog from "../pages/PreviewBlog";
import BlogFormProvider from "../providers/BlogFormProvider";

export const blogRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route element={<ProtectedRoute type={GUARD_TYPE.AUTH} redirectTo="/" />}>
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
  </>
);
