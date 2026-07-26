import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moduleService from "../../services/supabase/module/module.service";

const initialState = {
  modules: [],
  selectedModule: null,
  loading: false,
  error: null,
};

// Thunk for create module
export const createModule = createAsyncThunk(
  "module/createModule",
  async ({ courseId, title, description, position }) => {
    return moduleService.createModule({
      courseId,
      title,
      description,
      position,
    });
  },
);

// Thunk for fetch course modules
export const fetchCourseModules = createAsyncThunk(
  "module/fetchCourseModules",
  async ({ courseId }) => {
    return moduleService.getCourseModules({ courseId });
  },
);

// Thunk for fetch a module by ID
export const fetchModuleById = createAsyncThunk(
  "module/fetchModuleById",
  async ({ moduleId }) => {
    return moduleService.getModuleById({ moduleId });
  },
);

// Thunk for update module
export const updateModule = createAsyncThunk(
  "module/updateModule",
  async ({ moduleId, moduleData }) => {
    return moduleService.updateModule({ moduleId, moduleData });
  },
);

// Thunk for delete module
export const deleteModule = createAsyncThunk(
  "module/deleteModule",
  async ({ moduleId }) => {
    await moduleService.deleteModule({ moduleId });
    return moduleId;
  },
);

// Thunk for updatePosition
export const updateModulePositions = createAsyncThunk(
  "module/updateModulePositions",
  async ({ reorderedModules }) => {
    await moduleService.updateModulePositions({ reorderedModules });
    return reorderedModules;
  },
);

const moduleSlice = createSlice({
  name: "module",
  initialState,
  extraReducers: (builder) => {
    // create module
    builder
      .addCase(createModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.modules.push(action.payload);
        }
        state.modules.sort((a, b) => a.position - b.position);
      })
      .addCase(createModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // get modules of a course
    builder
      .addCase(fetchCourseModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.modules = action.payload;
          state.selectedModule = null;
        }
      })
      .addCase(fetchCourseModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // get a single module by ID
    builder
      .addCase(fetchModuleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedModule = action.payload;
        }
      })
      .addCase(fetchModuleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // update module
    builder
      .addCase(updateModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.modules.findIndex(
          (module) => module.id === action.payload.id,
        );

        if (index !== -1) {
          state.modules[index] = action.payload;
        }

        state.modules.sort((a, b) => a.position - b.position);

        if (state.selectedModule?.id === action.payload.id) {
          state.selectedModule = action.payload;
        }
      })
      .addCase(updateModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // delete module
    builder
      .addCase(deleteModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = state.modules.filter(
          (module) => module.id !== action.payload,
        );

        if (state.selectedModule?.id === action.payload) {
          state.selectedModule = null;
        }
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    // update module position
    builder
      .addCase(updateModulePositions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModulePositions.fulfilled, (state, action) => {
        state.loading = false;
        const reordered = action.payload;
        reordered.forEach(({ id, position }) => {
          const mod = state.modules.find((m) => m.id === id);
          if (mod) mod.position = position;
        });
        state.modules.sort((a, b) => a.position - b.position);
      })
      .addCase(updateModulePositions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default moduleSlice.reducer;
