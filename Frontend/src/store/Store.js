import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice.js"
import cateeReducer from "../redux/CatSlice.js"
import dishReducer from "../redux/DishSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cate: cateeReducer,
        dish : dishReducer,
    }
})
