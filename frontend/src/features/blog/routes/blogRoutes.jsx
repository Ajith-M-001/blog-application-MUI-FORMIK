import { Route } from "react-router";
import ProtectedRoute from "../../../app/routes/ProtectedRoute";
import { GUARD_TYPE } from "../../../shared/constants/constants";
import { lazy } from "react";

// Lazy load blog components for better performance
const PreviewBlog = lazy(() => import("../pages/PreviewBlog"));
const BlogForm = lazy(() => import("../pages/BlogForm"));

export const blogRoutes = (
  <>
    {/* Authentication Routes for non-authenticated users */}
    <Route element={<ProtectedRoute type={GUARD_TYPE.AUTH} redirectTo="/" />}>
      <Route path="edit-blog/:slug" element={<BlogForm />} />
      <Route path="create-blog" element={<BlogForm />} />
      <Route path="preview-blog" element={<PreviewBlog />} />
    </Route>
  </>
);

// import { lazy } from "react";
// import { Route } from "react-router";
// import ProtectedRoute from "../../../app/routes/ProtectedRoute";
// import { GUARD_TYPE } from "../../../shared/constants/constants";

// // Lazy load components
// const BlogForm = lazy(() => import("../pages/BlogForm"));
// const CreateBlog = lazy(() => import("../pages/CreateBlog"));
// const PreviewBlog = lazy(() => import("../pages/PreviewBlog"));

// export const blogRoutes = [
//   {
//     path: "edit-blog/:slug",
//     element: <BlogForm />,
//     guard: { type: GUARD_TYPE.AUTH, redirectTo: "/" },
//   },
//   {
//     path: "create-blog",
//     element: <BlogForm />,
//     guard: { type: GUARD_TYPE.AUTH, redirectTo: "/" },
//   },
//   {
//     path: "preview-blog",
//     element: <PreviewBlog />,
//     guard: { type: GUARD_TYPE.AUTH, redirectTo: "/" },
//   },
// ];

// // Render routes with ProtectedRoute
// export const renderBlogRoutes = () =>
//   blogRoutes.map(({ path, element, guard }) => (
//     <Route
//       key={path}
//       path={path}
//       element={
//         <ProtectedRoute type={guard.type} redirectTo={guard.redirectTo}>
//           {element}
//         </ProtectedRoute>
//       }
//     />
//   ));
