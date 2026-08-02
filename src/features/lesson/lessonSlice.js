import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabase/supabaseClient";
import lessonService from "../../services/supabase/lesson/lesson.service";
import lessonStorage from "../../services/supabase/lesson/lesson.storage";
import authService from "../../services/supabase/auth/auth.service";

// Build a file path for uploading lesson files
// Example: userId/courseId/moduleId/name-timestamp.mp4
async function generateFilePath(fileName, file, moduleId, courseId) {
  const user = await authService.getUser();
  if (!user) throw new Error("User not found.");

  const extension = file.name.split(".").pop()?.toLowerCase();
  const sanitizedName = (fileName || file.name)
    .replace(/\.[^/.]+$/, "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  const uniqueName = `${sanitizedName}-${Date.now()}`;

  return `${user.id}/${courseId}/${moduleId}/${uniqueName}.${extension}`;
}

const initialState = {
  lessons: [],
  selectedLesson: null,
  loading: false,
  error: null,
};

// Create a new lesson with video (required) and PDF (optional)
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
    if (!videoFile) throw new Error("Lesson video is required.");
    if (!videoFile.type.startsWith("video/"))
      throw new Error("Invalid video file.");
    if (pdfFile && pdfFile.type !== "application/pdf")
      throw new Error("Invalid PDF file.");

    let videoPath = null;
    let pdfPath = null;

    try {
      // Get courseId from the module record
      const { data, error } = await supabase
        .from("modules")
        .select("course_id")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      const courseId = data.course_id;

      // Upload video to storage
      if (videoFile) {
        const videoFilePath = await generateFilePath(
          videoName,
          videoFile,
          moduleId,
          courseId,
        );
        videoPath = await lessonStorage.uploadVideo(videoFilePath, videoFile);
      }

      // Upload PDF to storage
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
      // Delete uploaded files if something goes wrong
      if (videoPath) await lessonStorage.deleteVideo(videoPath);
      if (pdfPath) await lessonStorage.deletePdf(pdfPath);
      throw error;
    }
  },
);

// Get all lessons for a module
export const fetchModuleLessons = createAsyncThunk(
  "lesson/fetchModuleLessons",
  async ({ moduleId }) => {
    return lessonService.getModuleLessons({ moduleId });
  },
);

// Get a single lesson by ID
export const fetchLessonById = createAsyncThunk(
  "lesson/fetchLessonById",
  async ({ lessonId }) => {
    return lessonService.getLessonById({ lessonId });
  },
);

// Update lesson info (title, description, etc.)
export const updateLesson = createAsyncThunk(
  "lesson/updateLesson",
  async ({ lessonId, lessonData }) => {
    return lessonService.updateLesson({ lessonId, lessonData });
  },
);

// Update lesson with optional file replacements (video, PDF)
// Uploads new files, deletes old ones, updates DB record
export const updateLessonWithFiles = createAsyncThunk(
  "lesson/updateLessonWithFiles",
  async ({
    lessonId,
    moduleId,
    lessonData,
    videoFile = null,
    videoName = null,
    pdfFile = null,
    pdfName = null,
  }) => {
    let newVideoPath = null;
    let newPdfPath = null;

    try {
      // Get courseId from the module record
      const { data: modData, error: modError } = await supabase
        .from("modules")
        .select("course_id")
        .eq("id", moduleId)
        .single();
      if (modError) throw modError;
      const courseId = modData.course_id;

      // Replace video if a new file was provided
      if (videoFile) {
        const videoFilePath = await generateFilePath(
          videoName,
          videoFile,
          moduleId,
          courseId,
        );
        newVideoPath = await lessonStorage.uploadVideo(
          videoFilePath,
          videoFile,
        );
        // Delete old video from storage
        if (lessonData.old_video_path) {
          await lessonStorage.deleteVideo(lessonData.old_video_path);
        }
        lessonData.video_path = newVideoPath;
        lessonData.video_name = videoName;
      }

      // Replace PDF if a new file was provided
      if (pdfFile) {
        const pdfFilePath = await generateFilePath(
          pdfName,
          pdfFile,
          moduleId,
          courseId,
        );
        newPdfPath = await lessonStorage.uploadPdf(pdfFilePath, pdfFile);
        // Delete old PDF from storage
        if (lessonData.old_pdf_path) {
          await lessonStorage.deletePdf(lessonData.old_pdf_path);
        }
        lessonData.pdf_path = newPdfPath;
        lessonData.pdf_name = pdfName;
      }

      // Remove internal fields before DB update
      delete lessonData.old_video_path;
      delete lessonData.old_pdf_path;

      return lessonService.updateLesson({ lessonId, lessonData });
    } catch (error) {
      // Rollback uploaded files if DB update fails
      if (newVideoPath) await lessonStorage.deleteVideo(newVideoPath);
      if (newPdfPath) await lessonStorage.deletePdf(newPdfPath);
      throw error;
    }
  },
);

// Save new lesson order after drag and drop
export const updateLessonPositions = createAsyncThunk(
  "lesson/updateLessonPositions",
  async ({ reorderedLessons }) => {
    await lessonService.updateLessonPositions({ reorderedLessons });
    return reorderedLessons;
  },
);

// Delete a lesson and its files from storage
export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async ({ lessonId, videoPath, pdfPath }) => {
    await lessonService.deleteLesson({ lessonId });
    if (videoPath) await lessonStorage.deleteVideo(videoPath);
    if (pdfPath) await lessonStorage.deletePdf(pdfPath);
    return lessonId;
  },
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  extraReducers: (builder) => {
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

    builder
      .addCase(updateLessonWithFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonWithFiles.fulfilled, (state, action) => {
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
      .addCase(updateLessonWithFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    builder
      .addCase(updateLessonPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLessonPositions.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(({ id, position }) => {
          const lesson = state.lessons.find((l) => l.id === id);
          if (lesson) lesson.position = position;
        });
        state.lessons.sort((a, b) => a.position - b.position);
      })
      .addCase(updateLessonPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

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
