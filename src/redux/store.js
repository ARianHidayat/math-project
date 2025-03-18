import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import textReducer from "./textSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        text: textReducer,
    }
})