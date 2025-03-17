import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { createThemeSlice } from "./slice/themeSlice";
import { createUserSlice } from "./slice/userSlice";

const useStore = create(
  devtools(
    persist(
      immer((...a) => ({
        ...createThemeSlice(...a),
        ...createUserSlice(...a),
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
