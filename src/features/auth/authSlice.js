import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/supabase/auth/auth.service";

// Fetch user counts for the admin dashboard
export const fetchUserStats = createAsyncThunk(
  "auth/fetchUserStats",
  async () => {
    return await authService.getUserStats();
  },
);

const initialState = {
  userData: null,
  isAuthenticated: false,
  isLoading: true,
  totalUsers: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalAdmins: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save user data after login
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
      state.isLoading = false;
    },
    // Clear user data on logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.isLoading = false;
    },
    // Show or hide the loading spinner
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
