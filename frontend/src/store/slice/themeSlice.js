const INITIAL_THEME_STATE = {
  isDarkTheme: true,
};

export const createThemeSlice = (set) => ({
  theme: INITIAL_THEME_STATE,
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
});
