import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import lessonProgressService from "../../services/supabase/lesson/lessonProgress.service";
import authService from "../../services/supabase/auth/auth.service";

/* -------------------------------------------------------------------------- */
/*                               Async Thunks                                 */
/* -------------------------------------------------------------------------- */

/**
 * Mark a lesson as completed.
 */
export const markLessonComplete = createAsyncThunk(
  "lessonProgress/markLessonComplete",
  async ({ lessonId }) => {
    const user = await authService.getUser();
    if (!user) throw Error("User not found!");

    return await lessonProgressService.markLessonComplete({
      studentId: user.id,
      lessonId,
    });
  },
);

/**
 * Mark a lesson as incomplete.
 */
export const markLessonIncomplete = createAsyncThunk(
  "lessonProgress/markLessonIncomplete",
  async ({ lessonId }) => {
    const user = await authService.getUser();
    if (!user) throw Error("User not found!");

    await lessonProgressService.markLessonIncomplete({
      studentId: user.id,
      lessonId,
    });
    return lessonId;
  },
);

/**
 * Fetch all completed lessons for a course.
 */
export const fetchCompletedLessonsByCourse = createAsyncThunk(
  "lessonProgress/fetchCompletedLessonsByCourse",
  async ({ courseId }) => {
    const user = await authService.getUser();
    if (!user) throw Error("User not found!");

    return await lessonProgressService.getCompletedLessonsByCourse({
      studentId: user.id,
      courseId,
    });
  },
);

/**
 * Fetch progress for a single lesson.
 */
export const fetchLessonProgress = createAsyncThunk(
  "lessonProgress/fetchLessonProgress",
  async ({ lessonId }) => {
    const user = await authService.getUser();
    if (!user) throw Error("User not found!");

    return await lessonProgressService.getLessonProgress({
      studentId: user.id,
      lessonId,
    });
  },
);

/* -------------------------------------------------------------------------- */
/*                               Initial State                                */
/* -------------------------------------------------------------------------- */

const initialState = {
  lessonProgress: null,
  completedLessons: [],

  loading: false,
  error: null,
};

/* -------------------------------------------------------------------------- */
/*                                   Slice                                    */
/* -------------------------------------------------------------------------- */

const lessonProgressSlice = createSlice({
  name: "lessonProgress",
  initialState,
  reducers: {
    clearLessonProgress(state) {
      state.lessonProgress = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ------------------------- Mark Lesson Complete ------------------------ */

      .addCase(markLessonComplete.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic: update UI immediately
        const { lessonId } = action.meta.arg;
        const exists = state.completedLessons.some(
          (lesson) => lesson.lesson_id === lessonId,
        );
        if (!exists) {
          state.completedLessons.push({ lesson_id: lessonId });
        }
        state.lessonProgress = { lesson_id: lessonId, completed: true };
      })

      .addCase(markLessonComplete.fulfilled, (state, action) => {
        state.loading = false;
        // Confirm with actual server data (completed_at, etc.)
        state.lessonProgress = action.payload;
      })

      .addCase(markLessonComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
        // Roll back optimistic update
        const { lessonId } = action.meta.arg;
        state.completedLessons = state.completedLessons.filter(
          (lesson) => lesson.lesson_id !== lessonId,
        );
        state.lessonProgress = null;
      })

      /* ------------------------ Mark Lesson Incomplete ----------------------- */

      .addCase(markLessonIncomplete.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic: update UI immediately
        const { lessonId } = action.meta.arg;
        state.completedLessons = state.completedLessons.filter(
          (lesson) => lesson.lesson_id !== lessonId,
        );
        state.lessonProgress = null;
      })

      .addCase(markLessonIncomplete.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(markLessonIncomplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
        // Roll back optimistic update
        const { lessonId } = action.meta.arg;
        const exists = state.completedLessons.some(
          (lesson) => lesson.lesson_id === lessonId,
        );
        if (!exists) {
          state.completedLessons.push({ lesson_id: lessonId });
        }
        state.lessonProgress = { lesson_id: lessonId, completed: true };
      })

      /* ---------------------- Fetch Completed Lessons ------------------------ */

      .addCase(fetchCompletedLessonsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCompletedLessonsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.completedLessons = action.payload;
      })

      .addCase(fetchCompletedLessonsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

      /* ------------------------- Fetch Lesson Progress ----------------------- */

      .addCase(fetchLessonProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLessonProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonProgress = action.payload;
      })

      .addCase(fetchLessonProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearLessonProgress } = lessonProgressSlice.actions;
export default lessonProgressSlice.reducer;
