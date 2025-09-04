// slices/projectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null, // You can define your initial state here
  selectedObs: "",
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectData: (state, action) => {
      state.data = action.payload;
    },
    setSelectedOBS: (state, action) => {
      state.selectedObs = action.payload;
    },
  },
});

export const { setProjectData, setSelectedOBS } = projectSlice.actions;
export default projectSlice.reducer;
