// Enrollment Redux slice — enroll, unenroll, fetch enrollments, update progress
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import enrollService from "../../services/supabase/enrollment/enroll.service";

// Initial state
const initialState = {
  myEnrollments: [],       // Courses the current student is enrolled in (with courses join)
  courseEnrollments: [],   // Students enrolled in a specific course (teacher/admin view)
  currentEnrollment: null, // Current user's enrollment for the course being viewed
  loading: false,          // Global loading state for async actions
  error: null,             // Last error message from async actions
  totalCourses: 0,         // Total enrolled courses count (for pagination)
};

// Thunks

/**
 * Enroll in a course — checks for duplicates before inserting.
 */
export const enrollCourse = createAsyncThunk(
  "enroll/enrollCourse",
  async (courseId) => {
    return await enrollService.enrollCourse(courseId);
  },
);

/**
 * Unenroll from a course — removes the enrollment row.
 */
export const unenrollCourse = createAsyncThunk(
  "enroll/unenrollCourse",
  async (courseId) => {
    await enrollService.unenrollCourse(courseId);
    return courseId;
  },
);

/**
 * Check if current user is enrolled in a course.
 */
export const fetchEnrollment = createAsyncThunk(
  "enroll/fetchEnrollment",
  async (courseId) => {
    return await enrollService.getEnrollment(courseId);
  },
);

/**
 * Fetch student's enrolled courses (paginated).
 */
export const fetchMyEnrollments = createAsyncThunk(
  "enroll/fetchMyEnrollments",
  async ({ page = 1 }) => {
    return await enrollService.getMyEnrollments({ page });
  },
);

/**
 * Fetch all students enrolled in a course (teacher/admin view).
 */
export const fetchCourseEnrollments = createAsyncThunk(
  "enroll/fetchCourseEnrollments",
  async (courseId) => {
    return await enrollService.getCourseEnrollments(courseId);
  },
);

/**
 * Update enrollment progress — auto-sets "completed" when >= 100.
 */
export const updateProgress = createAsyncThunk(
  "enroll/updateProgress",
  async ({ courseId, progress }) => {
    return await enrollService.updateProgress(courseId, progress);
  },
);

// Slice

const enrollSlice = createSlice({
  name: "enroll",
  initialState,
  extraReducers: (builder) => {
    // enrollCourse handlers
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

    // unenrollCourse handlers
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

    // fetchEnrollment handlers
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

    // fetchMyEnrollments handlers — page 1 replaces, page > 1 appends
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

    // fetchCourseEnrollments handlers
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

    // updateProgress handlers — syncs all three state locations
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

        if (!action.payload) return;

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
