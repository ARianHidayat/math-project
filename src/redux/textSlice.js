import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    text: "Halo tuan",
};

export const textSlice = createSlice({
    name: "text",
    initialState,
    reducers: {
        updateText: (state,action) => {
            state.text = action.payload;
        },
        resetText: (state) => {
            state.text = "";
        },
    },
});

export const {updateText,resetText} = textSlice.actions;

export default textSlice.reducer;