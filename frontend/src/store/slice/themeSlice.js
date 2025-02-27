const initialThemeState = {
  isDarkTheme: true,
};

export const createThemeSlice = (set) => ({
  ...initialThemeState, // Spread the state instead of nesting it
  toggleTheme: () =>
    set(
      (state) => ({ isDarkTheme: !state.isDarkTheme }), // Return new state object
      false,
      "theme/toggleTheme"
    ),
});
