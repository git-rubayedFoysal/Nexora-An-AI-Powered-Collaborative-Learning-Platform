// Redux slice for assignment submissions (submit, update, delete, fetch, grade).
// Coordinates the database service (submission service), file storage
// (submission storage), plus auth and assignment lookups.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import submissionService from "../../services/supabase/assignment/submission.service";
import submissionStorage from "../../services/supabase/assignment/submission.storage";
import assignmentService from "../../services/supabase/assignment/assignment.service";
import authService from "../../services/supabase/auth/auth.service";

// Build a unique storage path for a submission file:
// <courseId>/<assignmentId>/<studentId>/<sanitized-name>-<timestamp>.<ext>
function generateFilePath(fileName, file, studentId, courseId, assignmentId) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  // Strip the original extension and sanitize the name for safe storage use
  const sanitizedName = (fileName || file.name)
    .replace(/\.[^/.]+$/, "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  // Timestamp suffix prevents filename collisions
  const uniqueName = `${sanitizedName}-${Date.now()}`;

  return `${courseId}/${assignmentId}/${studentId}/${uniqueName}.${extension}`;
}

// Slice state:
// - submission:             a single submission (e.g. teacher viewing one)
// - mySubmission:           the current student's submission for one assignment
// - mySubmissions:          all of the current student's submissions
// - assignmentSubmissions:  all submissions for an assignment (teacher view)
// - loading / error:        request status for async thunks
const initialState = {
  submission: null,
  mySubmission: null,
  mySubmissions: [],
  assignmentSubmissions: [],

  loading: false,
  error: null,
};

// Submit an assignment: resolve the current user and course, upload the
// optional file, then create the submission row. Deletes the file on failure.
export const submitAssignment = createAsyncThunk(
  "assignmentSubmission/submitAssignment",
  async ({ assignmentId, submissionText, fileName = null, file = null }) => {
    let filePath = null;

    try {
      const user = await authService.getUser();
      if (!user) throw new Error("User not found.");
      const studentId = user.id;

      const assignment = await assignmentService.getAssignment({
        assignmentId,
      });
      const courseId = assignment.modules.course_id;

      if (file) {
        filePath = generateFilePath(
          fileName,
          file,
          studentId,
          courseId,
          assignmentId,
        );
      }

      if (filePath) {
        await submissionStorage.uploadSubmission(filePath, file);
      }

      return await submissionService.submitAssignment({
        assignmentId,
        studentId,
        submissionText,
        fileName,
        filePath,
      });
    } catch (error) {
      if (filePath) await submissionStorage.deleteSubmission(filePath);
      throw error;
    }
  },
);

// Update an existing submission's text and file metadata (no upload here)
export const updateSubmission = createAsyncThunk(
  "assignmentSubmission/updateSubmission",
  async ({ submissionId, submissionText, fileName, filePath }) => {
    return await submissionService.updateSubmission({
      submissionId,
      submissionText,
      fileName,
      filePath,
    });
  },
);

// Delete a submission; returns its id so the reducer can remove it from state
export const deleteSubmission = createAsyncThunk(
  "assignmentSubmission/deleteSubmission",
  async ({ submissionId }) => {
    await submissionService.deleteSubmission({ submissionId });
    return submissionId;
  },
);

// Fetch the current student's submission for a given assignment
export const fetchMySubmission = createAsyncThunk(
  "assignmentSubmission/fetchMySubmission",
  async ({ assignmentId }) => {
    const user = await authService.getUser();
    if (!user) throw new Error("User not found.");
    const studentId = user.id;

    return await submissionService.getMySubmission({ assignmentId, studentId });
  },
);

// Fetch all submissions made by the current student
export const fetchMySubmissions = createAsyncThunk(
  "assignmentSubmission/fetchMySubmissions",
  async () => {
    const user = await authService.getUser();
    if (!user) throw new Error("User not found.");
    const studentId = user.id;

    return await submissionService.getMySubmissions({ studentId });
  },
);

// Fetch all submissions belonging to an assignment (teacher/instructor view)
export const fetchAssignmentSubmissions = createAsyncThunk(
  "assignmentSubmission/fetchAssignmentSubmissions",
  async ({ assignmentId }) => {
    return await submissionService.getAssignmentSubmissions({ assignmentId });
  },
);

// Fetch a single submission by id
export const fetchSubmission = createAsyncThunk(
  "assignmentSubmission/fetchSubmission",
  async ({ submissionId }) => {
    return await submissionService.getSubmission({ submissionId });
  },
);

// Grade a submission by setting its score and feedback
export const gradeSubmission = createAsyncThunk(
  "assignmentSubmission/gradeSubmission",
  async ({ submissionId, score, feedback }) => {
    return await submissionService.gradeSubmission({
      submissionId,
      score,
      feedback,
    });
  },
);

const assignmentSubmissionSlice = createSlice({
  name: "assignmentSubmission",
  initialState,
  extraReducers: (builder) => {
    // submitAssignment: store the new submission and prepend to mySubmissions
    builder
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubmission = action.payload;
        const exists = state.mySubmissions.some(
          (s) => s.id === action.payload.id,
        );

        if (!exists) {
          state.mySubmissions.unshift(action.payload);
        }
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // updateSubmission: patch the updated submission across all relevant lists
    builder
      .addCase(updateSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubmission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.mySubmission?.id === action.payload.id) {
          state.mySubmission = action.payload;
        }

        if (state.submission?.id === action.payload.id) {
          state.submission = action.payload;
        }

        const myIndex = state.mySubmissions.findIndex(
          (sub) => sub.id === action.payload.id,
        );
        if (myIndex !== -1) {
          state.mySubmissions[myIndex] = action.payload;
        }

        const assignmentIndex = state.assignmentSubmissions.findIndex(
          (sub) => sub.id === action.payload.id,
        );
        if (assignmentIndex !== -1) {
          state.assignmentSubmissions[assignmentIndex] = action.payload;
        }
      })
      .addCase(updateSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // deleteSubmission: clear any references and filter the submission out
    builder
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.mySubmission?.id === action.payload) {
          state.mySubmission = null;
        }

        if (state.submission?.id === action.payload) {
          state.submission = null;
        }

        state.mySubmissions = state.mySubmissions.filter(
          (sub) => sub.id !== action.payload,
        );

        state.assignmentSubmissions = state.assignmentSubmissions.filter(
          (sub) => sub.id !== action.payload,
        );
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchMySubmission: store the current student's submission
    builder
      .addCase(fetchMySubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubmission = action.payload;
      })
      .addCase(fetchMySubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchMySubmissions: replace the student's submission list
    builder
      .addCase(fetchMySubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubmissions = action.payload;
      })
      .addCase(fetchMySubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchAssignmentSubmissions: replace the per-assignment submission list
    builder
      .addCase(fetchAssignmentSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentSubmissions = action.payload;
      })
      .addCase(fetchAssignmentSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchSubmission: store the single fetched submission
    builder
      .addCase(fetchSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.submission = action.payload;
      })
      .addCase(fetchSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // gradeSubmission: apply the graded result to the matching submissions
    builder
      .addCase(gradeSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.loading = false;
        if (state.mySubmission?.id === action.payload.id) {
          state.mySubmission = action.payload;
        }

        if (state.submission?.id === action.payload.id) {
          state.submission = action.payload;
        }

        const index = state.mySubmissions.findIndex(
          (sub) => sub.id === action.payload.id,
        );
        if (index !== -1) {
          state.mySubmissions[index] = action.payload;
        }

        const idx = state.assignmentSubmissions.findIndex(
          (sub) => sub.id === action.payload.id,
        );
        if (idx !== -1) {
          state.assignmentSubmissions[idx] = action.payload;
        }
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default assignmentSubmissionSlice.reducer;
