import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  api,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  register,
} from "../api/AuthApi.js";

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const newToken = await refreshToken();
      if (!newToken) {
        return thunkAPI.rejectWithValue("Token refresh failed");
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      return newToken;
    } catch (error) {
      console.log("Error refreshing token:", error);
      return thunkAPI.rejectWithValue("Token refresh failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await getCurrentUser();
      if (response) return response.data;
      return thunkAPI.rejectWithValue("Failed to fetch user");
    } catch (error) {
      console.log("Error fetching user:", error);
      return thunkAPI.rejectWithValue("Failed to fetch user");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await login(userData);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      console.log("Error during login:", error);
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await logout();
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }
      return null;
    } catch (error) {
      console.log("Error during logout:", error);
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await register(userData);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      console.log("Error during registration:", error);
      return thunkAPI.rejectWithValue("Registration failed");
    }
  }
);


const initialState = {
  isAuthenticated: false,
  user: null,
  // token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.isLoading = false;
        
        api.defaults.headers.common["Authorization"] = `Bearer ${action.payload.data.accessToken}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload;
      })

      
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = "Failed to authenticate user";
      })

      //regi
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isLoading= false,
        state.error = "Failed to authenticate user";
      })

      // Refresh Token
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.error = null;
        
        api.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`;
      })
      
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = "Token refresh failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;
        delete api.defaults.headers.common["Authorization"]; 
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Logout failed";
      })
    },
});

export default authSlice.reducer;


