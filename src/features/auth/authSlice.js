import { createSlice } from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState = {
  userData: null, // user data object (e.g., email, id, etc.)
  isAuthenticated: false, // is user already login?
  isLoading: true, // is authentication process loading?
};

const authSlice = createSlice({
  name: "auth", // name of the slice
  initialState, // initial state for the slice
  // Reducers for handling authentication actions
  reducers: {
    // Action to log in the user and set the user data
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
      state.isLoading = false;
    },
    // Action to log out the user and clear the user data
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
