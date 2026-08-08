import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import submissionService from "../../services/supabase/assignment/submission.service";
import submissionStorage from "../../services/supabase/assignment/submission.storage";
import assignmentService from "../../services/supabase/assignment/assignment.service";
import authService from "../../services/supabase/auth/auth.service";

function generateFilePath(fileName, file, studentId, courseId, assignmentId) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  const sanitizedName = (fileName || file.name)
    .replace(/\.[^/.]+$/, "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  const uniqueName = `${sanitizedName}-${Date.now()}`;

  return `${courseId}/${assignmentId}/${studentId}/${uniqueName}.${extension}`;
}

const initialState = {
  // One specific submission
  submission: null,

  // Current student's submission for one assignment
  mySubmission: null,

  // All submissions belonging to current student
  mySubmissions: [],

  // Submissions loaded for teacher's Grade Center
  assignmentSubmissions: [],

  loading: false,
  error: null,
};

/* ============================================================
   SUBMIT ASSIGNMENT
============================================================ */

export const submitAssignment = createAsyncThunk(
  "assignmentSubmission/submitAssignment",
  async (
    { assignmentId, submissionText, fileName = null, file = null },
    { rejectWithValue },
  ) => {
    let filePath = null;

    try {
      const user = await authService.getUser();

      if (!user) {
        throw new Error("User not found.");
      }

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
      if (filePath) {
        try {
          await submissionStorage.deleteSubmission(filePath);
        } catch (storageError) {
          console.error("FAILED TO DELETE UPLOADED FILE:", storageError);
        }
      }

      return rejectWithValue(error.message || "Failed to submit assignment.");
    }
  },
);

/* ============================================================
   UPDATE SUBMISSION
============================================================ */

/*
  IMPORTANT:

  This thunk only updates the DATABASE.

  File replacement is handled in the component:
  1. Upload new file
  2. Update database with new path
  3. Delete old file

  That keeps storage handling separate from this database thunk.
*/

export const updateSubmission = createAsyncThunk(
  "assignmentSubmission/updateSubmission",
  async (
    { submissionId, submissionText, fileName, filePath },
    { rejectWithValue },
  ) => {
    try {
      return await submissionService.updateSubmission({
        submissionId,
        submissionText,
        fileName,
        filePath,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update submission.");
    }
  },
);

/* ============================================================
   DELETE SUBMISSION
============================================================ */

export const deleteSubmission = createAsyncThunk(
  "assignmentSubmission/deleteSubmission",
  async ({ submissionId }, { rejectWithValue }) => {
    try {
      /*
        IMPORTANT:
        If submissionService.deleteSubmission only deletes
        the database row, the storage file remains.

        We need the submission first so we know file_path.
      */

      const submission = await submissionService.getSubmission({
        submissionId,
      });

      await submissionService.deleteSubmission({
        submissionId,
      });

      if (submission?.file_path) {
        try {
          await submissionStorage.deleteSubmission(submission.file_path);
        } catch (storageError) {
          console.error("FAILED TO DELETE SUBMISSION FILE:", storageError);
        }
      }

      return submissionId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete submission.");
    }
  },
);

/* ============================================================
   FETCH MY SUBMISSION
============================================================ */

export const fetchMySubmission = createAsyncThunk(
  "assignmentSubmission/fetchMySubmission",
  async ({ assignmentId }, { rejectWithValue }) => {
    try {
      const user = await authService.getUser();

      if (!user) {
        throw new Error("User not found.");
      }

      return await submissionService.getMySubmission({
        assignmentId,
        studentId: user.id,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch submission.");
    }
  },
);

/* ============================================================
   FETCH ALL MY SUBMISSIONS
============================================================ */

export const fetchMySubmissions = createAsyncThunk(
  "assignmentSubmission/fetchMySubmissions",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getUser();

      if (!user) {
        throw new Error("User not found.");
      }

      return await submissionService.getMySubmissions({
        studentId: user.id,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch submissions.");
    }
  },
);

/* ============================================================
   FETCH ASSIGNMENT SUBMISSIONS
============================================================ */

export const fetchAssignmentSubmissions = createAsyncThunk(
  "assignmentSubmission/fetchAssignmentSubmissions",
  async ({ assignmentId }, { rejectWithValue }) => {
    try {
      return await submissionService.getAssignmentSubmissions({
        assignmentId,
      });
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch assignment submissions.",
      );
    }
  },
);

/* ============================================================
   FETCH SINGLE SUBMISSION
============================================================ */

export const fetchSubmission = createAsyncThunk(
  "assignmentSubmission/fetchSubmission",
  async ({ submissionId }, { rejectWithValue }) => {
    try {
      return await submissionService.getSubmission({
        submissionId,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch submission.");
    }
  },
);

/* ============================================================
   GRADE SUBMISSION
============================================================ */

export const gradeSubmission = createAsyncThunk(
  "assignmentSubmission/gradeSubmission",
  async ({ submissionId, score, feedback }, { rejectWithValue }) => {
    try {
      return await submissionService.gradeSubmission({
        submissionId,
        score,
        feedback,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Failed to grade submission.");
    }
  },
);

/* ============================================================
   SLICE
============================================================ */

const assignmentSubmissionSlice = createSlice({
  name: "assignmentSubmission",

  initialState,

  reducers: {
    clearAssignmentSubmissions: (state) => {
      state.assignmentSubmissions = [];
    },

    clearSubmissionError: (state) => {
      state.error = null;
    },

    clearSubmission: (state) => {
      state.submission = null;
    },

    clearMySubmission: (state) => {
      state.mySubmission = null;
    },
  },

  extraReducers: (builder) => {
    /* ========================================================
       SUBMIT
    ======================================================== */

    builder
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;

        const submission = action.payload;

        state.mySubmission = submission;

        const index = state.mySubmissions.findIndex(
          (sub) => sub.id === submission.id,
        );

        if (index === -1) {
          state.mySubmissions.unshift(submission);
        } else {
          state.mySubmissions[index] = submission;
        }

        const assignmentIndex = state.assignmentSubmissions.findIndex(
          (sub) => sub.id === submission.id,
        );

        if (assignmentIndex !== -1) {
          state.assignmentSubmissions[assignmentIndex] = submission;
        }
      })

      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to submit assignment.";
      });

    /* ========================================================
       UPDATE
    ======================================================== */

    builder
      .addCase(updateSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSubmission.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        /*
            Single submission
          */

        if (state.submission?.id === updated.id) {
          state.submission = updated;
        }

        /*
            Current student's submission
          */

        if (state.mySubmission?.id === updated.id) {
          state.mySubmission = updated;
        }

        /*
            Current student's submissions
          */

        const myIndex = state.mySubmissions.findIndex(
          (sub) => sub.id === updated.id,
        );

        if (myIndex !== -1) {
          state.mySubmissions[myIndex] = updated;
        }

        /*
            Teacher Grade Center
          */

        const assignmentIndex = state.assignmentSubmissions.findIndex(
          (sub) => sub.id === updated.id,
        );

        if (assignmentIndex !== -1) {
          state.assignmentSubmissions[assignmentIndex] = updated;
        }
      })

      .addCase(updateSubmission.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to update submission.";
      });

    /* ========================================================
       DELETE
    ======================================================== */

    builder
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;

        const submissionId = action.payload;

        /*
            Clear single submission
          */

        if (state.submission?.id === submissionId) {
          state.submission = null;
        }

        /*
            Clear current student's submission
          */

        if (state.mySubmission?.id === submissionId) {
          state.mySubmission = null;
        }

        /*
            Remove from student's list
          */

        state.mySubmissions = state.mySubmissions.filter(
          (sub) => sub.id !== submissionId,
        );

        /*
            Remove from teacher Grade Center
          */

        state.assignmentSubmissions = state.assignmentSubmissions.filter(
          (sub) => sub.id !== submissionId,
        );
      })

      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete submission.";
      });

    /* ========================================================
       FETCH MY SUBMISSION
    ======================================================== */

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

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch submission.";
      });

    /* ========================================================
       FETCH MY SUBMISSIONS
    ======================================================== */

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

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch submissions.";
      });

    /* ========================================================
       FETCH ASSIGNMENT SUBMISSIONS
    ======================================================== */

    builder
      .addCase(fetchAssignmentSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAssignmentSubmissions.fulfilled, (state, action) => {
        state.loading = false;

        const incoming = action.payload || [];

        /*
            Merge submissions without duplicates.

            Important because GradeCenter may fetch
            submissions for multiple assignments.
          */

        const existingIds = new Set(
          state.assignmentSubmissions.map((sub) => sub.id),
        );

        const newSubmissions = incoming.filter(
          (sub) => !existingIds.has(sub.id),
        );

        state.assignmentSubmissions.push(...newSubmissions);
      })

      .addCase(fetchAssignmentSubmissions.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch assignment submissions.";
      });

    /* ========================================================
       FETCH SINGLE SUBMISSION
    ======================================================== */

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

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch submission.";
      });

    /* ========================================================
       GRADE
    ======================================================== */

    builder
      .addCase(gradeSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        /*
            Single submission
          */

        if (state.submission?.id === updated.id) {
          state.submission = updated;
        }

        /*
            Current student's submission
          */

        if (state.mySubmission?.id === updated.id) {
          state.mySubmission = updated;
        }

        /*
            Student submissions
          */

        const myIndex = state.mySubmissions.findIndex(
          (sub) => sub.id === updated.id,
        );

        if (myIndex !== -1) {
          state.mySubmissions[myIndex] = updated;
        }

        /*
            Teacher Grade Center
          */

        const assignmentIndex = state.assignmentSubmissions.findIndex(
          (sub) => sub.id === updated.id,
        );

        if (assignmentIndex !== -1) {
          state.assignmentSubmissions[assignmentIndex] = updated;
        }
      })

      .addCase(gradeSubmission.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to grade submission.";
      });
  },
});

export const {
  clearAssignmentSubmissions,
  clearSubmissionError,
  clearSubmission,
  clearMySubmission,
} = assignmentSubmissionSlice.actions;

export default assignmentSubmissionSlice.reducer;
