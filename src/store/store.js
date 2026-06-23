import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";

// Create the Redux store and configure it with the auth reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
