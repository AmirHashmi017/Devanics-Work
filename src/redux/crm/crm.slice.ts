import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { crmInitialState } from './crm.initialState';
import { getCrmItemsThunk, updateCrmItemStatusThunk } from './crm.thunk';
import { CrmType } from '@/app/interfaces/crm/crm.interface';

export const crmVendorSlice = createSlice({
  initialState: crmInitialState,
  name: 'crm',
  reducers: {
    removeCrmItemAction: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((item) => item._id !== action.payload);
    },

    insertManyCrmItemAction: (state, action: PayloadAction<CrmType[]>) => {
      state.data = [...action.payload, ...state.data];
    },
  },
  extraReducers(builder) {
    builder.addCase(getCrmItemsThunk.pending, (state) => {
      state.loading = true;
      state.error = '';
    });

    builder.addCase(getCrmItemsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(getCrmItemsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      if (action.payload) {
        state[action.meta.arg.module] = action.payload.data;
      }
      state.error = undefined;
    });

    builder.addCase(updateCrmItemStatusThunk.pending, (state) => {
      state.isUpdatingStatus = true;
    });

    builder.addCase(updateCrmItemStatusThunk.rejected, (state) => {
      state.isUpdatingStatus = false;
    });

    builder.addCase(updateCrmItemStatusThunk.fulfilled, (state, action) => {
      state.isUpdatingStatus = false;
      state.data = state.data.map((item) => {
        if (action.payload.data && item._id === action.payload.data._id) {
          return action.payload.data;
        }
        return item;
      });
    });
  },
});
export const { removeCrmItemAction, insertManyCrmItemAction } =
  crmVendorSlice.actions;
export default crmVendorSlice.reducer;
