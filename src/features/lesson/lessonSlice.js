import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase/supabaseClient";
import lessonService from "../../services/supabase/lesson/lesson.service";
import lessonStorage from "../../services/supabase/lesson/lesson.storage";

// generate uniqe file path for video
function generateFilePath(fileName, file, moduleId, courseId) {
  // extract extention
  const extension = file.name.split(".").pop()?.toLowerCase();

  // sanitized file name(remove space and invalid charecters)
  const sanitizedName = (fileName || file.name)
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  // create unique file name
  const uniqueName = `${sanitizedName}-${Date.now()}`;

  // return uniqe filepath
  return `${courseId}/${moduleId}/${uniqueName}.${extension}`;
}

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
    videoFile,
    videoName,
    pdfFile = null,
    pdfName = null,
    isPreview,
    duration,
    position,
  }) => {
    // Video (Required)
    if (!videoFile) {
      throw new Error("Lesson video is required.");
    }

    if (!videoFile.type.startsWith("video/")) {
      throw new Error("Invalid video file.");
    }

    // PDF (Optional)
    if (pdfFile && pdfFile.type !== "application/pdf") {
      throw new Error("Invalid PDF file.");
    }

    let videoPath = null;
    let pdfPath = null;

    try {
      // fetch courseId from modules table
      const { data, error } = await supabase
        .from("modules")
        .select("course_id")
        .eq("id", moduleId)
        .single();

      if (error) throw error;
      const courseId = data.course_id;
      // upload video on bucket
      if (videoFile) {
        const videoFilePath = await generateFilePath(
          videoName,
          videoFile,
          moduleId,
          courseId,
        );

        videoPath = await lessonStorage.uploadVideo(videoFilePath, videoFile);
      }

      // upload pdf on bucket
      if (pdfFile) {
        const pdfFilePath = await generateFilePath(
          pdfName,
          pdfFile,
          moduleId,
          courseId,
        );

        pdfPath = await lessonStorage.uploadPdf(pdfFilePath, pdfFile);
      }

      const lesson = await lessonService.createLesson({
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
      return lesson;
    } catch (error) {
      if (videoPath) {
        await lessonStorage.deleteVideo(videoPath);
      }

      if (pdfPath) {
        await lessonStorage.deletePdf(pdfPath);
      }

      throw error;
    }
  };,
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
  async ({ lessonId, videoPath, pdfPath }) => {
    // delete lesson
    await lessonService.deleteLesson({ lessonId });
    // delete video
    if (videoPath) {
      await lessonStorage.deleteVideo(videoPath);
    }
    // delete pdf
    if (pdfPath) {
      await lessonStorage.deletePdf(pdfPath);
    }
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
