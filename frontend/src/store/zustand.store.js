import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { createThemeSlice } from "./slice/themeSlice";
import { createUserSlice } from "./slice/userSlice";
import { createBlogSlice } from "./slice/blogSlice";

const useStore = create(
  devtools(
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
  )
);

export default useStore;
