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
      // console.log("caling the refreshAuthToken :");
      const newToken = await refreshToken(); // Call API to refresh

      if (!newToken) {
        return thunkAPI.rejectWithValue("Token refresh failed");
      }

      // Set new token for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return newToken;
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue("Token refresh failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      // console.log("Fetching current user...");
      const response = await getCurrentUser();
      console.log("Current user response:", response.data);
      if (response) return response.data;
    } catch (error) { // handle the error before the Axios interceptor gets a chance to handle it.
       // Manually refreshing token
      if (error.response?.status === 401) {
        // console.log("Token expired, attempting to refresh...");
        try {
          const newToken = await thunkAPI.dispatch(refreshAuthToken()).unwrap();
          if (newToken) {
            // console.log("Token refreshed, retrying fetchCurrentUser...");
            return await getCurrentUser(); // Retry fetching user
          }
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);
          return thunkAPI.rejectWithValue("Token refresh failed");
        }
      }
    }
    return thunkAPI.rejectWithValue("Failed to fetch user");
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    console.log("authhslice: dat:", userData)
    const response = await login(userData); // Calls the API function
    if (!response.success) return thunkAPI.rejectWithValue(response.message); // If error, send it to Redux state
    return response; // Otherwise, return the user data to store it in Redux state
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    const response = await logout();
    if (!response.success) return thunkAPI.rejectWithValue(response.message);
    return null; // Clears user state
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    const response = await register(userData); // Calls the API function
    if (!response.success) return thunkAPI.rejectWithValue(response.message); // If error, send it to Redux state
    return response.data; // Otherwise, return the user data to store it in Redux state
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
        state.error = null; // Clear previous error before making a new request
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isLoading = false;
        // console.log("Access Token from Redux:", action.payload.data.accessToken);
        
        api.defaults.headers.common["Authorization"] = `Bearer ${action.payload.data.accessToken}`;
        console.log("Set Authorization Header:", api.defaults.headers.common["Authorization"]);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
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
        state.token = null;
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
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        
        api.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`;
      })
      
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
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
        state.token = null;
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


