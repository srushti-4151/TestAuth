import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { addDish, updatedish, deleteDish, getdishes } from "../api/dishApi.js";

export const addDishThunk = createAsyncThunk(
  "dish/addDish",
  async (data, { rejectWithValue }) => {
    try {
      const response = await addDish(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "error in adddish thunk"
      );
    }
  }
);

export const updateDish = createAsyncThunk(
    "dish/updateDish",
    async({dishId, data}, { rejectWithValue }) => {
        try{
            const response = await updatedish(dishId, data)
            return response.data;
        }catch(error){
            return rejectWithValue(error?.response?.data?.mesage || "eror in updat dish thhunk")
        }
    }
)
export const removeDish = createAsyncThunk(
    "dish/removeDish",
    async(dishId, { rejectWithValue }) => {
        try{
            const response = await deleteDish(dishId)
            return response.data;
        }catch(error){
            return rejectWithValue(error?.response?.data?.mesage || "eror in updat dish thhunk")
        }
    }
)

export const getdish = createAsyncThunk(
    "dish/getdish",
    async(_, { rejectWithValue }) => {
        try{
            const response = await getdishes()
            return response.data;
        }catch(error){
            return rejectWithValue(error?.response?.data?.mesage || "eror in updat dish thhunk")
        }
    }
)


const initialState = {
  dishes: [],
  loading: false,
  error: null,
};

const dishSlice = createSlice({
  name: "dish",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(addDishThunk.fulfilled, (state, action) => {
        state.dishes.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addDishThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDishThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //gets
      .addCase(getdish.fulfilled, (state, action) => {
        state.dishes = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getdish.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getdish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete
      .addCase(removeDish.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeDish.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update
      .addCase(updateDish.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDish.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default dishSlice.reducer
