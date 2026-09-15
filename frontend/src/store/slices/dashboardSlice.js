import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getStats();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    statistics: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
