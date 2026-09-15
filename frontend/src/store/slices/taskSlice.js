import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

function extractError(err) {
  return err.response?.data?.message || 'Failed to load tasks';
}

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await taskService.list(params);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    return await taskService.create(payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await taskService.update(id, payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await taskService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: { search: '', status: '', priority: '' },
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  reducers: {
    setTaskFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTaskError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta || state.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.data.id);
        if (idx !== -1) state.items[idx] = action.payload.data;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setTaskFilters, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
