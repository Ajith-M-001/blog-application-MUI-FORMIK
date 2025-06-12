// theme.store.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";

const INITIAL_THEME_STATE = Object.freeze({
  isDarkTheme: true,
});

const useThemeStore = create(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set) => ({
          theme: { ...INITIAL_THEME_STATE },
          themeActions: {
            toggleTheme: () =>
              set(
                (state) => {
                  state.theme.isDarkTheme = !state.theme.isDarkTheme;
                },
                false,
                "theme/toggleTheme"
              ),
          },
        })),
        {
          name: "theme-store",
          version: 1,
          partialize: (state) => ({ theme: state.theme }),
        }
      ),
      { name: "ThemeStore" }
    )
  )
);

// Selectors
export const useIsDarkTheme = () =>
  useThemeStore((state) => state.theme.isDarkTheme);
export const useThemeActions = () =>
  useThemeStore((state) => state.themeActions);
