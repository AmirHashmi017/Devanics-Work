import { createSlice } from '@reduxjs/toolkit';
import initialTakeoffPresetState from './takeoff.initialState';

import { deletePreset, fetchTakeoffPreset } from './takeoff.thunk';

export const takeoffPresetSlice = createSlice({
  name: 'takeoffPreset',
  initialState: initialTakeoffPresetState,
  reducers: {
    addNewTakeoffPresetData: (state, { payload }) => {
      state.data.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTakeoffPreset.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchTakeoffPreset.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchTakeoffPreset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deletePreset.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deletePreset.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deletePreset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { addNewTakeoffPresetData } = takeoffPresetSlice.actions;

export default takeoffPresetSlice.reducer;
