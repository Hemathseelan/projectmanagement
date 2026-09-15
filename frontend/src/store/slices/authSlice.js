import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

function extractError(err) {
  return err.response?.data?.message || 'Something went wrong. Please try again.';
}

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authService.register(payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await authService.login(payload);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile();
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('taskflow_token') : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('taskflow_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        localStorage.setItem('taskflow_token', action.payload.data.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        localStorage.setItem('taskflow_token', action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
