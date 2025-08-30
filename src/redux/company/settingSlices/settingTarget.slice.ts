import { createSlice } from '@reduxjs/toolkit';
import initialSettingTargetsState from './setting.initialState';
import { deleteSettingTarget, fetchSettingTargets } from './setting.thunk';
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';

export const settingSlice = createSlice({
  name: 'setting/targets',
  initialState: initialSettingTargetsState,
  reducers: {
    addSettingTargetData: (state, { payload }) => {
      state.data.push(payload);
    },
    updateSettingTargetData: (state, { payload }) => {
      state.data = state.data.map((targetData: ISettingTarget) => {
        if (targetData._id === payload._id) {
          return payload;
        } else {
          return targetData;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettingTargets.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSettingTargets.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (action.payload.data) {
        state.data = action.payload.data;
      }
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchSettingTargets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteSettingTarget.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSettingTarget.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deleteSettingTarget.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { addSettingTargetData, updateSettingTargetData } =
  settingSlice.actions;

export default settingSlice.reducer;
