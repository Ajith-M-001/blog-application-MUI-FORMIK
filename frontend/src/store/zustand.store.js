import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { createThemeSlice } from "./slice/themeSlice";
import { createUserSlice } from "./slice/userSlice";
import { createBlogSlice } from "./slice/blogSlice";

let useStore = create(
  persist(
    immer((...a) => ({
      ...createThemeSlice(...a),
      ...createUserSlice(...a),
      ...createBlogSlice(...a),
    })),
    {
      name: "Nexus-store",
      version: 1,
      enabled: true,
    }
  )
);

// Conditionally enable DevTools in development only
if (import.meta.env.VITE_APP_ENV === "development") {
  useStore = devtools(useStore);
}

// Custom hooks for consuming the theme slice
export const useIsDarkTheme = () =>
  useStore((state) => state.theme.isDarkTheme);
export const useThemeActions = () => useStore((state) => state.themeActions);

// Custom hooks for consuming the user slice
export const useUserData = () => useStore((state) => state.user.userData);
export const useUserActions = () => useStore((state) => state.userActions);

// Custom hooks for consuming the blog slice
export const useBlogData = () => useStore((state) => state.blog);
export const useBlogActions = () => useStore((state) => state.blogActions);
