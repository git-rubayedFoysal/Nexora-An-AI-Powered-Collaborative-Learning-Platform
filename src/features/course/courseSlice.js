import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import courseService from "../../services/supabase/course/course.service";
import courseStorage from "../../services/supabase/course/course.storage";
import authService from "../../services/supabase/auth/auth.service";

// Function to create a unique path for the thumbnail file
async function generateThumbnailPath(thumbnailFile) {
  // Get current teacher
  const {
    data: { user },
    error,
  } = await authService.getUser();

  if (error) throw error;

  // Create storage path
  return `${user.id}/${Date.now()}-${thumbnailFile.name}`;
}

// Initial state for the course slice
const initialState = {
  courses: [],
  teacherCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  allCourses: [],
};

// Thunk for creating a course with optional thumbnail upload
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async ({ courseData, thumbnailFile }) => {
    let path = null;
    // upload thumbnail into bucket
    if (thumbnailFile) {
      const filePath = await generateThumbnailPath(thumbnailFile);
      path = await courseStorage.uploadThumbnail(thumbnailFile, filePath);
    }
    return await courseService.createCourse({
      ...courseData,
      thumbnail_url: path,
    });
  },
);

// Thunk for updating a course with optional thumbnail upload
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, courseData, thumbnailFile, oldThumbnailPath }) => {
    let path = oldThumbnailPath;
    if (thumbnailFile) {
      const filePath = await generateThumbnailPath(thumbnailFile);
      // upload new thumbnail
      path = await courseStorage.uploadThumbnail(thumbnailFile, filePath);
      // delete old thumbnail
      if (oldThumbnailPath) {
        await courseStorage.deleteThumbnail(oldThumbnailPath);
      }
    }
    // update course
    return await courseService.updateCourse(courseId, {
      ...courseData,
      thumbnail_url: path,
    });
  },
);

// Thunk for deleting a course with thumbnail cleanup
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ courseId, filePath }) => {
    // delete thumbnail
    if (filePath) {
      await courseStorage.deleteThumbnail(filePath);
    }
    await courseService.deleteCourse(courseId);
    return courseId;
  },
);

// Thunk for fetching a course by its ID
export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (courseId) => {
    return await courseService.getCourseById(courseId);
  },
);

// Thunk for fetching published courses from supabase
export const fetchPublishedCourses = createAsyncThunk(
  "course/fetchPublishedCourses",
  async () => {
    return await courseService.getPublishedCourses();
  },
);

// Thunk for fetching teacher courses from supabase
export const fetchTeacherCourses = createAsyncThunk(
  "course/fetchTeacherCourses",
  async () => {
    return await courseService.getTeacherCourses();
  },
);

// Thunk for fetching all courses from supabase
export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async () => {
    return await courseService.getAllCourses();
  },
);

// Create the course slice with reducers for handling async actions
const courseSlice = createSlice({
  name: "course",
  initialState,
  // Extra reducers for handling async actions
  extraReducers: (builder) => {
    // create course
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === "published") {
          state.courses.push(action.payload);
        }
        state.teacherCourses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // update course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course.id !== action.payload.id,
        );
        if (action.payload.status === "published") {
          state.courses.push(action.payload);
        }
        state.teacherCourses = state.teacherCourses.filter(
          (course) => course.id !== action.payload.id,
        );
        state.teacherCourses.push(action.payload);
        state.selectedCourse = action.payload;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // delete course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;

        state.courses = state.courses.filter(
          (course) => course.id !== action.payload,
        );

        state.teacherCourses = state.teacherCourses.filter(
          (course) => course.id !== action.payload,
        );

        if (state.selectedCourse?.id === action.payload) {
          state.selectedCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetch Published Courses
    builder
      .addCase(fetchPublishedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload ?? [];
      })
      .addCase(fetchPublishedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetch course by ID
    builder
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetch teacher courses
    builder
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherCourses = action.payload ?? [];
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    // fetch all courses
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourses = action.payload ?? [];
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default courseSlice.reducer;
