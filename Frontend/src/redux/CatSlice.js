import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCat, deleteCate, getCate, updateCate } from "../api/CatApi.js";

export const addCateThunk = createAsyncThunk(
  "category/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addCat(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Faied to addcategory"
      );
    }
  }
);

export const getCateThunk = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCate();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "error on getcatethunk"
      );
    }
  }
);

export const updateCateThunk = createAsyncThunk(
  "category/updateCate",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCate(id, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "update failed");
    }
  }
);

export const deleteCateThunk = createAsyncThunk(
  "category/deleteCate",
  async (cateId, { rejectWithValue }) => {
    try {
      const res = await deleteCate(cateId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "error in delete cat thunk"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cateSlice = createSlice({
  name: "category",
  initialState,

  extraReducers: (builder) => {
    builder
      //add
      .addCase(addCateThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
        // state.items = action.payload || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(addCateThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //fetch
      .addCase(getCateThunk.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(getCateThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //edit
      .addCase(updateCateThunk.fulfilled, (state, action) => {
        // const index = state.items.findIndex(c => c._id === action.payload._id)
        // if(index !== -1) state.items[index] = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCateThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteCateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCateThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cateSlice.reducer;
