import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

function extractError(err) {
  return err.response?.data?.message || 'Failed to load projects';
}

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await projectService.list(params);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    return await projectService.getById(id);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    return await projectService.create(payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await projectService.update(id, payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  reducers: {
    clearSelectedProject(state) {
      state.selected = null;
    },
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta || state.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload.data;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.data.id);
        if (idx !== -1) state.items[idx] = action.payload.data;
        if (state.selected?.id === action.payload.data.id) state.selected = action.payload.data;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProject, clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
