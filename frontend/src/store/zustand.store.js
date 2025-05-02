import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { createThemeSlice } from "./slice/themeSlice";
import { createBlogSlice } from "./slice/blogSlice";
import { createUserSlice } from "./slice/userSlice";

let useStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createThemeSlice(...a),
        ...createBlogSlice(...a),
        ...createUserSlice(...a),
      })),
      {
        name: "Nexus-store",
        version: 1,
        partialize: (state) => ({
          theme: state.theme,
          user: state.user,
          blog: state.blog,
        }),
      }
    )
  )
);

export default useStore;

// Custom hooks for consuming the theme slice
export const useIsDarkTheme = () =>
  useStore((state) => state.theme.isDarkTheme);
export const useThemeActions = () => useStore((state) => state.themeActions);

// Custom hooks for consuming the user slice
export const useUserData = () => useStore((state) => state.user.userData);
export const useIsAuthenticated = () =>
  useStore((state) => state.user.isAuthenticated);
export const useUserActions = () => useStore((state) => state.userActions);

// Custom hooks for consuming the blog slice
export const useBlogData = () => useStore((state) => state.blog);
export const useBlogActions = () => useStore((state) => state.blogActions);
