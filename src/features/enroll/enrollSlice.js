import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import enrollService from "../../services/supabase/enrollment/enroll.service";

// Initial state for the enrollment slice
const initialState = {
  myEnrollments: [],
  courseEnrollments: [],
  currentEnrollment: null,
  loading: false,
  error: null,
};

// Thunk for enrollCourse
export const enrollCourse = createAsyncThunk(
  "enroll/enrollCourse",
  async (courseId) => {
    return await enrollService.enrollCourse(courseId);
  },
);

// Thunk for unenrollCourse
export const unenrollCourse = createAsyncThunk(
  "enroll/unenrollCourse",
  async (courseId) => {
    await enrollService.unenrollCourse(courseId);
    return courseId;
  },
);

// Thunk for check enrollment for a course
export const fetchEnrollment = createAsyncThunk(
  "enroll/fetchEnrollment",
  async (courseId) => {
    return await enrollService.getEnrollment(courseId);
  },
);

// Thunk for fetch my enrollments
export const fetchMyEnrollments = createAsyncThunk(
  "enroll/fetchMyEnrollments",
  async () => {
    return await enrollService.getMyEnrollments();
  },
);

// Thunk for fetching enrollments of a course
export const fetchCourseEnrollments = createAsyncThunk(
  "enroll/fetchCourseEnrollments",
  async (courseId) => {
    return await enrollService.getCourseEnrollments(courseId);
  },
);

// Thunk for updating enrollment progress
export const updateProgress = createAsyncThunk(
  "enroll/updateProgress",
  async ({ courseId, progress }) => {
    return await enrollService.updateProgress(courseId, progress);
  },
);

// Create enrollment slice
const enrollSlice = createSlice({
  name: "enroll",
  initialState,
  extraReducers: (builder) => {
    // enroll course
    builder
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments.push(action.payload);
        state.currentEnrollment = action.payload;
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // unenroll course
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

        //  unenroll course === current enroll course => make it null
        if (state.currentEnrollment?.course_id === action.payload) {
          state.currentEnrollment = null;
        }
      })
      .addCase(unenrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetch student's enrollment for a course
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

    // fetch my enrollments
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments = action.payload ?? [];
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetch enrollments of a course
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

    // update course progress
    builder
      .addCase(updateProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEnrollment?.course_id === action.payload.course_id) {
          state.currentEnrollment = action.payload;
        }

        // update myEnrollments
        state.myEnrollments = state.myEnrollments.map((enrollment) =>
          enrollment.course_id === action.payload.course_id
            ? action.payload
            : enrollment,
        );

        // update course enrollments
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
