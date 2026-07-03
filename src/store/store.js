import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import courseReducer from "../features/course/courseSlice.js";

// Create the Redux store and configure it with the auth and course reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
});
