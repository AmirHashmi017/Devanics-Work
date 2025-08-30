import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const takeoffPresetSelector = (state: RootState) => state.takeoff;

// takeoff preset redux data
export const selectTakeoffPresetLoading = createSelector(
  [takeoffPresetSelector],
  (takeoffPreset) => takeoffPreset.loading
);

export const selectTakeoffPreset = createSelector(
  [takeoffPresetSelector],
  (takeoffPreset) => takeoffPreset.data
);
