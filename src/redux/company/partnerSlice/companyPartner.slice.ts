import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialState from './companyPartner.initialState';
import { fetchCompanyPartner, deleteCompanyPartner } from '../company.thunk';
import { IPartner } from '@/app/interfaces/companyInterfaces/companyClient.interface';

export const partnerSlice = createSlice({
  name: 'partners',
  initialState: initialState,
  reducers: {
    insertManyPartnersAction: (state, action: PayloadAction<IPartner[]>) => {
      if (state.data) {
        state.data = [...action.payload, ...state.data];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanyPartner.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCompanyPartner.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data.partners;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchCompanyPartner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteCompanyPartner.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCompanyPartner.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data.partner._id
      );
    });

    builder.addCase(deleteCompanyPartner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { insertManyPartnersAction } = partnerSlice.actions;

export default partnerSlice.reducer;
