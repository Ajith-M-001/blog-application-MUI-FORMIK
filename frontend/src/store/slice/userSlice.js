const INITIAL_USER_STATE = {
  userData: {},
};

export const createUserSlice = (set) => ({
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
          state.user.userData = null; // Reset the userData property to null
        },
        false,
        "user/clearUserData"
      ),
  },
});
