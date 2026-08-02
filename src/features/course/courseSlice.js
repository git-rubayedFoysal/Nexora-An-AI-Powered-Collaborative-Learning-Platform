import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import courseService from "../../services/supabase/course/course.service";
import courseStorage from "../../services/supabase/course/course.storage";
import authService from "../../services/supabase/auth/auth.service";

// Build a file path for the course thumbnail
// Example: userId/timestamp-name.jpg
async function generateThumbnailPath(thumbnailFile) {
  if (!thumbnailFile) throw new Error("Thumbnail file is required.");

  const user = await authService.getUser();
  if (!user) throw new Error("User not found.");

  const extension = thumbnailFile.name.split(".").pop()?.toLowerCase();
  const fileName = thumbnailFile.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return `${user.id}/${Date.now()}-${fileName}.${extension}`;
}

const initialState = {
  featureCourses: [],
  courses: [],
  teacherCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  allCourses: [],
  totalCourses: 0,
  publishedCourses: 0,
  draftCourses: 0,
  archivedCourses: 0,
};

// Create a new course with an optional thumbnail
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async ({ courseData, thumbnailFile }) => {
    let path = null;
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

// Update a course and replace the thumbnail if a new one is picked
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ courseId, courseData, thumbnailFile, oldThumbnailPath }) => {
    let path = oldThumbnailPath;
    if (thumbnailFile) {
      const filePath = await generateThumbnailPath(thumbnailFile);
      path = await courseStorage.uploadThumbnail(thumbnailFile, filePath);
      if (oldThumbnailPath) {
        await courseStorage.deleteThumbnail(oldThumbnailPath);
      }
    }
    return await courseService.updateCourse(courseId, {
      ...courseData,
      thumbnail_url: path,
    });
  },
);

// Delete a course and its thumbnail
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ courseId, filePath }) => {
    if (filePath) {
      await courseStorage.deleteThumbnail(filePath);
    }
    await courseService.deleteCourse(courseId);
    return courseId;
  },
);

// Get a single course by ID
export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (courseId) => {
    return await courseService.getCourseById(courseId);
  },
);

// Get published courses for the catalog
export const fetchPublishedCourses = createAsyncThunk(
  "course/fetchPublishedCourses",
  async ({ page = 1, search = "" }) => {
    return await courseService.getPublishedCourses({ page, search });
  },
);

// Get courses created by the current teacher
export const fetchTeacherCourses = createAsyncThunk(
  "course/fetchTeacherCourses",
  async ({ page = 1, search = "" }) => {
    return await courseService.getTeacherCourses({ page, search });
  },
);

// Get all courses (admin only)
export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async ({ page = 1, search = "" }) => {
    return await courseService.getAllCourses({ page, search });
  },
);

// Get course counts by status for the admin dashboard
export const fetchCourseStats = createAsyncThunk(
  "course/fetchCourseStats",
  async () => {
    return await courseService.getCourseStats();
  },
);

// Get the latest published courses for the homepage
export const fetchFeatureCourses = createAsyncThunk(
  "course/fetchFeatureCourses",
  async () => {
    return await courseService.getFeaturedCourses();
  },
);

export const updateCourseStats = createAsyncThunk(
  "course/updateCourseStats",
  async (courseId) => {
    return await courseService.updateCourseStats(courseId);
  },
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
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

    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the old entry and add the updated one
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

    builder
      .addCase(fetchPublishedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedCourses.fulfilled, (state, action) => {
        state.loading = false;
        const { courses, total } = action.payload;
        const { page } = action.meta.arg;
        // Page 1 = fresh load, page 2+ = load more
        if (page === 1) {
          state.courses = courses ?? [];
        } else {
          state.courses = [...state.courses, ...(courses ?? [])];
        }
        state.totalCourses = total;
      })
      .addCase(fetchPublishedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

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

    builder
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        const { courses, total } = action.payload;
        const { page } = action.meta.arg;
        if (page === 1) {
          state.teacherCourses = courses ?? [];
        } else {
          state.teacherCourses = [...state.teacherCourses, ...(courses ?? [])];
        }
        state.totalCourses = total;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        const { courses, total } = action.payload;
        const { page } = action.meta.arg;
        if (page === 1) {
          state.allCourses = courses ?? [];
        } else {
          state.allCourses = [...state.allCourses, ...(courses ?? [])];
        }
        state.totalCourses = total;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    builder.addCase(fetchCourseStats.fulfilled, (state, action) => {
      state.totalCourses = action.payload.totalCourses;
      state.publishedCourses = action.payload.publishedCourses;
      state.draftCourses = action.payload.draftCourses;
      state.archivedCourses = action.payload.archivedCourses;
    });

    builder
      .addCase(fetchFeatureCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatureCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.featureCourses = action.payload ?? [];
      })
      .addCase(fetchFeatureCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    builder
      .addCase(updateCourseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseStats.fulfilled, (state, action) => {
        state.loading = false;
        const { id, lesson_count, duration } = action.payload;
        // Patch only lesson_count and duration, keep users join and other data
        const patch = (courses) =>
          courses.map((c) =>
            c.id === id ? { ...c, lesson_count, duration } : c,
          );
        state.courses = patch(state.courses);
        state.teacherCourses = patch(state.teacherCourses);
        state.allCourses = patch(state.allCourses);
        if (state.selectedCourse?.id === id) {
          state.selectedCourse = { ...state.selectedCourse, lesson_count, duration };
        }
      })
      .addCase(updateCourseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default courseSlice.reducer;
