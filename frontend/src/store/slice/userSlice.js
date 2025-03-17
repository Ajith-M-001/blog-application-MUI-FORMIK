const initialUserState = {
  isAuthenticated: false,
  user: null,
};

export const createUserSlice = (set) => ({
  ...initialUserState, // Spread the state instead of nesting it
  setIsAuthenticated: (isAuthenticated) =>
    set(() => ({ isAuthenticated }), false, "user/setIsAuthenticated"),
  setUser: (user) => set(() => ({ user }), false, "user/setUser"),
  clearUser: () => set(() => ({ user: null }), false, "user/clearUser"),
});
