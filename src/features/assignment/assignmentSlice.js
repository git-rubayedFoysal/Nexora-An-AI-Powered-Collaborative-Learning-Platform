// Redux slice for assignments (create, read, update, delete, reorder).
// Handles both the database rows (assignment service) and file uploads
// (assignment storage), keeping Redux state in sync.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import assignmentService from "../../services/supabase/assignment/assignment.service";
import assignmentStorage from "../../services/supabase/assignment/assignment.storage";
import { supabase } from "../../services/supabase/supabaseClient";

// Build a unique storage path for an attachment:
// <courseId>/<moduleId>/<assignmentId>/<sanitized-name>-<timestamp>.<ext>
function generateFilePath(
  attachmentName,
  attachmentFile,
  moduleId,
  courseId,
  assignmentId,
) {
  const extension = attachmentFile.name.split(".").pop()?.toLowerCase();
  // Strip the original extension and sanitize the name for safe storage use
  const sanitizedName = (attachmentName || attachmentFile.name)
    .replace(/\.[^/.]+$/, "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  // Timestamp suffix prevents filename collisions
  const uniqueName = `${sanitizedName}-${Date.now()}`;

  return `${courseId}/${moduleId}/${assignmentId}/${uniqueName}.${extension}`;
}

// Slice state:
// - assignment:            single assignment (currently selected/edited)
// - moduleAssignments:     assignments belonging to one module
// - courseAssignments:     all assignments across a course
// - loading / error:       request status for async thunks
const initialState = {
  assignment: null,
  moduleAssignments: [],
  courseAssignments: [],

  loading: false,
  error: null,
};

// Create a new assignment: inserts the row, uploads an optional attachment,
// then stores the attachment metadata back on the assignment record.
export const createAssignment = createAsyncThunk(
  "assignment/createAssignment",
  async ({
    moduleId,
    title,
    description,
    instructions,
    attachmentName = null,
    attachmentFile = null,
    dueDate,
    maxScore,
    position,
  }) => {
    let attachmentPath = null;
    let assignmentId = null;

    try {
      // Resolve the course the module belongs to (needed for the storage path)
      const { data, error } = await supabase
        .from("modules")
        .select("course_id")
        .eq("id", moduleId)
        .single();

      if (error) throw error;
      const courseId = data.course_id;

      // 1. Insert the assignment row so we have its id for the file path
      const assignment = await assignmentService.createAssignment({
        moduleId,
        title,
        description,
        instructions,
        dueDate,
        maxScore,
        position,
      });
      assignmentId = assignment.id;

      // 2. Upload the attachment (if any) to storage under a generated path
      if (attachmentFile) {
        attachmentPath = generateFilePath(
          attachmentName,
          attachmentFile,
          moduleId,
          courseId,
          assignmentId,
        );
      }

      if (attachmentPath) {
        await assignmentStorage.uploadAttachment(
          attachmentPath,
          attachmentFile,
        );
      }

      // 3. Store the attachment metadata back on the assignment row
      return await assignmentService.updateAssignment({
        assignmentId,
        assignmentData: {
          attachmentName,
          attachmentPath,
        },
      });
    } catch (error) {
      // Roll back on failure: remove the uploaded file and the row
      if (attachmentPath) {
        await assignmentStorage.deleteAttachment(attachmentPath);
      }

      if (assignmentId) {
        await assignmentService.deleteAssignment({ assignmentId });
      }
      throw error;
    }
  },
);

// Update an existing assignment's fields (no file handling here)
export const updateAssignment = createAsyncThunk(
  "assignment/updateAssignment",
  async ({ assignmentId, assignmentData }) => {
    return await assignmentService.updateAssignment({
      assignmentId,
      assignmentData,
    });
  },
);

// Delete an assignment and it's attechment; returns its id so the reducer can remove it from state
export const deleteAssignment = createAsyncThunk(
  "assignment/deleteAssignment",
  async ({ assignmentId, attachmentPath }) => {
    if (attachmentPath) {
      await assignmentStorage.deleteAttachment(attachmentPath);
    }
    await assignmentService.deleteAssignment({ assignmentId });
    return assignmentId;
  },
);

// Fetch a single assignment by id
export const fetchAssignment = createAsyncThunk(
  "assignment/fetchAssignment",
  async ({ assignmentId }) => {
    return await assignmentService.getAssignment({ assignmentId });
  },
);

// Fetch all assignments for a module
export const fetchModuleAssignments = createAsyncThunk(
  "assignment/fetchModuleAssignments",
  async ({ moduleId }) => {
    return await assignmentService.getModuleAssignments({ moduleId });
  },
);

// Fetch all assignments across a course
export const fetchCourseAssignments = createAsyncThunk(
  "assignment/fetchCourseAssignments",
  async ({ courseId }) => {
    return assignmentService.getCourseAssignments({ courseId });
  },
);

// Persist a new ordering after drag and drop; returns the reordered list
export const updateAssignmentPositions = createAsyncThunk(
  "assignment/updateAssignmentPositions",
  async ({ reorderedAssignments }) => {
    await assignmentService.updateAssignmentPositions({ reorderedAssignments });
    return reorderedAssignments;
  },
);

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  extraReducers: (builder) => {
    // createAssignment: push the new assignment into moduleAssignments, sorted
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.moduleAssignments.push(action.payload);
          state.moduleAssignments.sort((a, b) => a.position - b.position);
        }
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // updateAssignment: replace the matching assignment in place and re-sort
    builder
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.moduleAssignments.findIndex(
          (assignment) => assignment.id === action.payload.id,
        );
        if (index !== -1) {
          state.moduleAssignments[index] = action.payload;
        }
        state.moduleAssignments.sort((a, b) => a.position - b.position);

        if (state.assignment?.id === action.payload.id) {
          state.assignment = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // deleteAssignment: filter the removed assignment out of state
    builder
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleAssignments = state.moduleAssignments.filter(
          (assignment) => assignment.id !== action.payload,
        );
        if (state.assignment?.id === action.payload) {
          state.assignment = null;
        }
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchAssignment: store the single fetched assignment
    builder
      .addCase(fetchAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = action.payload;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchModuleAssignments: replace the module assignment list
    builder
      .addCase(fetchModuleAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.moduleAssignments = action.payload;
      })
      .addCase(fetchModuleAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // fetchCourseAssignments: replace the course assignment list
    builder
      .addCase(fetchCourseAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.courseAssignments = action.payload;
      })
      .addCase(fetchCourseAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // updateAssignmentPositions: apply the new positions and re-sort
    builder
      .addCase(updateAssignmentPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentPositions.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(({ id, position }) => {
          const assignment = state.moduleAssignments.find(
            (ass) => ass.id === id,
          );

          if (assignment) assignment.position = position;
        });
        state.moduleAssignments.sort((a, b) => a.position - b.position);
      })
      .addCase(updateAssignmentPositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default assignmentSlice.reducer;
