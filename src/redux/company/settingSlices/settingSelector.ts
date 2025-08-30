import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectSettingTarget = (state: RootState) => state.settingTargets;
export const materialsTarget = (state: RootState) => state.materials;

// setting targets
export const selectSettingTargetsLoading = createSelector(
  [selectSettingTarget],
  (settingTargets) => settingTargets.loading
);

export const selectSettingTargets = createSelector(
  [selectSettingTarget],
  (settingTargets) => settingTargets.data
);

// setting materials
export const reduxMaterialsLoading = createSelector(
  [materialsTarget],
  (materials) => materials.loading
);

export const reduxMaterialsData = createSelector(
  [materialsTarget],
  (materials) => materials.data
);
