import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import lessonService from "../../services/supabase/lesson/lesson.service";

const initialState = {
  lessons: [],
  selectedLesson: null,
  loading: false,
  error: null,
};

// Thunk for create lesson
export const createLesson = createAsyncThunk(
  "lesson/createLesson",
  async ({
    moduleId,
    title,
    description,
    videoPath,
    videoName,
    pdfPath,
    pdfName,
    isPreview,
    duration,
    position,
  }) => {
    return lessonService.createLesson({
      moduleId,
      title,
      description,
      videoPath,
      videoName,
      pdfPath,
      pdfName,
      isPreview,
      duration,
      position,
    });
  },
);

// Thunk for get all lessons of a module
export const fetchModuleLessons = createAsyncThunk(
  "lesson/fetchModuleLessons",
  async ({ moduleId }) => {
    return lessonService.getModuleLessons({ moduleId });
  },
);

// Thunk for get a lesson by ID
export const fetchLessonById = createAsyncThunk(
  "lesson/fetchLessonById",
  async ({ lessonId }) => {
    return lessonService.getLessonById({ lessonId });
  },
);

// Thunk for update lesson
export const updateLesson = createAsyncThunk(
  "lesson/updateLesson",
  async ({ lessonId, lessonData }) => {
    return lessonService.updateLesson({ lessonId, lessonData });
  },
);

// Thunk for update lesson position
export const updateLessonPositions = createAsyncThunk(
  "lesson/updateLessonPositions",
  async ({ reorderedLessons }) => {
    await lessonService.updateLessonPositions({ reorderedLessons });
    return reorderedLessons;
  },
);

// Thunk for delete lesson
export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async ({ lessonId }) => {
    await lessonService.deleteLesson({ lessonId });
    return lessonId;
  },
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  extraReducers: (builder) => {
    // create lesson
    builder
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.lessons.push(action.payload);
        state.lessons.sort((a, b) => a.position - b.position);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // get module lessons
    builder
      .addCase(fetchModuleLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleLessons.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.lessons = action.payload;
          state.selectedLesson = null;
        }
      })
      .addCase(fetchModuleLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // get a lesson by ID
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedLesson = action.payload;
        }
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // update a lesson
    builder
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(
          (lesson) => lesson.id === action.payload.id,
        );

        if (index !== -1) {
          state.lessons[index] = action.payload;
        }

        state.lessons.sort((a, b) => a.position - b.position);
        if (state.selectedLesson?.id === action.payload.id) {
          state.selectedLesson = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // update lessons position
    builder
      .addCase(updateLessonPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonPositions.fulfilled, (state, action) => {
        state.loading = false;
        const reordered = action.payload;

        reordered.forEach(({ id, position }) => {
          const lesson = state.lessons.find((l) => l.id === id);
          if (lesson) {
            lesson.position = position;
          }
        });
        state.lessons.sort((a, b) => a.position - b.position);
      })
      .addCase(updateLessonPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    // delete lesson
    builder
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(
          (lesson) => lesson.id !== action.payload,
        );

        if (state.selectedLesson?.id === action.payload) {
          state.selectedLesson = null;
        }
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default lessonSlice.reducer;
