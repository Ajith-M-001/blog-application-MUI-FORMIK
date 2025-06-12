// user.store.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";

const INITIAL_USER_STATE = Object.freeze({
  userData: null,
  isAuthenticated: false,
});

const useUserStore = create(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set) => ({
          user: { ...INITIAL_USER_STATE },
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
                  state.user = { ...INITIAL_USER_STATE };
                },
                false,
                "user/clearUserData"
              ),
            setIsAuthenticated: (value) =>
              set(
                (state) => {
                  state.user.isAuthenticated = value;
                },
                false,
                "user/setIsAuthenticated"
              ),
          },
        })),
        {
          name: "user-store",
          version: 1,
          partialize: (state) => ({ user: state.user }),
        }
      ),
      { name: "UserStore" }
    )
  )
);

// Selectors
export const useUserData = () => useUserStore((state) => state.user.userData);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.user.isAuthenticated);
export const useUserActions = () => useUserStore((state) => state.userActions);

export default useUserStore;
