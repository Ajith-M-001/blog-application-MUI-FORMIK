import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const INITIAL_USER_STATE = {
  userData: null,
  isAuthenticated: false,
};

const useUserStore = create(
  devtools(
    persist(
      immer((set) => ({
        user: INITIAL_USER_STATE,
        userActions: {
          setUserData: (data) =>
            set(
              (state) => {
                state.user.userData = data;
              },
              false,
              "user/setUserData"
            ),

          clearUserData: () =>
            set(
              (state) => {
                state.user.userData = null;
              },
              false,
              "user/clearUserData"
            ),

          setIsAuthenticated: (data) =>
            set(
              (state) => {
                state.user.isAuthenticated = data;
              },
              false,
              "user/setIsAuthenticated"
            ),
        },
      })),
      {
        name: "user-store", // localStorage key
        partialize: (state) => ({
          user: state.user,
        }),
      }
    ),
    { name: "UserStore" } // For Redux DevTools extension
  )
);

// 🔸 Selectors (custom hooks)
export const useUserData = () => useUserStore((state) => state.user.userData);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.user.isAuthenticated);
export const useUserActions = () => useUserStore((state) => state.userActions);

export default useUserStore;
