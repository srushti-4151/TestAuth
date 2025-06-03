import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})
