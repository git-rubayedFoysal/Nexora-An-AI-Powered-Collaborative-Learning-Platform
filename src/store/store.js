import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import courseReducer from "../features/course/courseSlice.js";
import enrollReducer from "../features/enroll/enrollSlice.js";
import moduleReducer from "../features/module/moduleSlice.js";
import lessonReducer from "../features/lesson/lessonSlice.js";
import lessonProgressReducer from "../features/lessonProgress/lessonProgressSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    enroll: enrollReducer,
    module: moduleReducer,
    lesson: lessonReducer,
    lessonProgress: lessonProgressReducer,
  },
});
