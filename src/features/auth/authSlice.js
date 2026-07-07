import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/supabase/auth/auth.service";

export const fetchUserStats = createAsyncThunk(
  "auth/fetchUserStats",
  async () => {
    return await authService.getUserStats();
  },
);

// Initial state for the auth slice
const initialState = {
  userData: null, // user data object (e.g., email, id, etc.)
  isAuthenticated: false, // is user already login?
  isLoading: true, // is authentication process loading?

  totalUsers: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalAdmins: 0,
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
  extraReducers: (builder) => {
    builder.addCase(fetchUserStats.fulfilled, (state, action) => {
      state.totalUsers = action.payload.totalUsers;
      state.totalStudents = action.payload.totalStudents;
      state.totalTeachers = action.payload.totalTeachers;
      state.totalAdmins = action.payload.totalAdmins;
    });
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
