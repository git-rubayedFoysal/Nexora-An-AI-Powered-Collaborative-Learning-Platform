import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import enrollService from "../../services/supabase/enrollment/enroll.service";

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  myEnrollments: [],       // Courses the current student is enrolled in (with courses join)
  courseEnrollments: [],   // Students enrolled in a specific course (teacher/admin view)
  currentEnrollment: null, // Current user's enrollment for the course being viewed
  loading: false,          // Global loading state for async actions
  error: null,             // Last error message from async actions
  totalCourses: 0,         // Total enrolled courses count (for pagination)
};

// ─── Thunks ─────────────────────────────────────────────────────────────────

/**
 * Enroll the current user in a course.
 * Checks for existing enrollment before inserting (prevents duplicates).
 * Returns the raw enrollment row (no courses join).
 */
export const enrollCourse = createAsyncThunk(
  "enroll/enrollCourse",
  async (courseId) => {
    return await enrollService.enrollCourse(courseId);
  },
);

/**
 * Remove the current user's enrollment from a course.
 * Returns the courseId for state cleanup.
 */
export const unenrollCourse = createAsyncThunk(
  "enroll/unenrollCourse",
  async (courseId) => {
    await enrollService.unenrollCourse(courseId);
    return courseId;
  },
);

/**
 * Fetch the current user's enrollment for a specific course.
 * Used by CourseDetails to determine if the user is enrolled.
 * Returns null if not enrolled.
 */
export const fetchEnrollment = createAsyncThunk(
  "enroll/fetchEnrollment",
  async (courseId) => {
    return await enrollService.getEnrollment(courseId);
  },
);

/**
 * Fetch the current student's enrolled courses (with pagination).
 * Returns { courses: [...], total: number }.
 * courses[] includes the full course object via Supabase join.
 */
export const fetchMyEnrollments = createAsyncThunk(
  "enroll/fetchMyEnrollments",
  async ({ page = 1 }) => {
    return await enrollService.getMyEnrollments({ page });
  },
);

/**
 * Fetch all students enrolled in a specific course (teacher/admin view).
 * Returns enrollment rows with user info via Supabase join.
 */
export const fetchCourseEnrollments = createAsyncThunk(
  "enroll/fetchCourseEnrollments",
  async (courseId) => {
    return await enrollService.getCourseEnrollments(courseId);
  },
);

/**
 * Update the progress percentage for the current user's enrollment.
 * Automatically sets status to "completed" when progress >= 100.
 */
export const updateProgress = createAsyncThunk(
  "enroll/updateProgress",
  async ({ courseId, progress }) => {
    return await enrollService.updateProgress(courseId, progress);
  },
);

// ─── Slice ──────────────────────────────────────────────────────────────────

const enrollSlice = createSlice({
  name: "enroll",
  initialState,
  extraReducers: (builder) => {
    // ── enrollCourse ─────────────────────────────────────────────────────
    // On success: only set currentEnrollment. Don't push raw enrollment into
    // myEnrollments because it lacks the courses join and would cause
    // duplicates or broken UI when fetchMyEnrollments runs later.
    builder
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnrollment = action.payload;
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // ── unenrollCourse ───────────────────────────────────────────────────
    // On success: remove the enrollment from myEnrollments list and clear
    // currentEnrollment if it matches the unenrolled course.
    builder
      .addCase(unenrollCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments = state.myEnrollments.filter(
          (enroll) => enroll.course_id !== action.payload,
        );
        if (state.currentEnrollment?.course_id === action.payload) {
          state.currentEnrollment = null;
        }
      })
      .addCase(unenrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // ── fetchEnrollment ──────────────────────────────────────────────────
    // On success: set currentEnrollment (or null if not enrolled).
    builder
      .addCase(fetchEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnrollment = action.payload;
      })
      .addCase(fetchEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // ── fetchMyEnrollments ───────────────────────────────────────────────
    // On success: replaces entire array for page 1, appends for page > 1.
    // The payload.courses[] includes full course data via Supabase join.
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        const { courses, total } = action.payload;
        const { page } = action.meta.arg;

        if (page === 1) {
          // Initial load or refresh — replace entire list
          state.myEnrollments = courses ?? [];
        } else {
          // Load More — append to existing list
          state.myEnrollments = [...state.myEnrollments, ...(courses ?? [])];
        }

        state.totalCourses = total;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // ── fetchCourseEnrollments ───────────────────────────────────────────
    // On success: replace the entire courseEnrollments list.
    // Used by CourseDetails "Enrolled Students" tab (teacher/admin only).
    builder
      .addCase(fetchCourseEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.courseEnrollments = action.payload ?? [];
      })
      .addCase(fetchCourseEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // ── updateProgress ───────────────────────────────────────────────────
    // On success: updates the enrollment in all three state locations
    // (currentEnrollment, myEnrollments, courseEnrollments) if the
    // course_id matches. Keeps all views in sync.
    builder
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;

        // Update currentEnrollment if it's the same course
        if (state.currentEnrollment?.course_id === action.payload.course_id) {
          state.currentEnrollment = action.payload;
        }

        // Update the matching enrollment in myEnrollments list
        state.myEnrollments = state.myEnrollments.map((enrollment) =>
          enrollment.course_id === action.payload.course_id
            ? action.payload
            : enrollment,
        );

        // Update the matching enrollment in courseEnrollments list
        state.courseEnrollments = state.courseEnrollments.map((enrollment) =>
          enrollment.course_id === action.payload.course_id
            ? action.payload
            : enrollment,
        );
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default enrollSlice.reducer;
