import { createSlice } from '@reduxjs/toolkit';
import initialSettingTargetsState from './setting.initialState';
import { deleteMaterial, fetchMaterials } from './setting.thunk';

export const materialSlice = createSlice({
  name: 'setting/materials',
  initialState: initialSettingTargetsState,
  reducers: {
    updateMaterialData: (state, { payload }) => {
      state.data = state.data.map((materialData: any) => {
        if (materialData._id === payload._id) {
          return payload;
        } else {
          return materialData;
        }
      });
    },

    deleteMaterialData: (state, { payload }) => {
      state.data = state.data.filter((item: any) => item?._id !== payload._id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMaterials.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchMaterials.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchMaterials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteMaterial.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteMaterial.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deleteMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { updateMaterialData, deleteMaterialData } = materialSlice.actions;

export default materialSlice.reducer;
