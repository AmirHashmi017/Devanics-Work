import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialBidsState from './bids.initialState';
import { fetchExploringProjects, fetchInvitedProjects } from './bids.thunk';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';

export const bidsManagementSlice = createSlice({
  name: 'bids',
  initialState: initialBidsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvitedProjects.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      fetchInvitedProjects.fulfilled,
      (
        state,
        action: PayloadAction<IResponseInterface<{ invoices: IAIAInvoice[] }>>
      ) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data!.invoices;
        state.statusCode = action.payload.statusCode;
      }
    );

    builder.addCase(fetchExploringProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchExploringProjects.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      fetchExploringProjects.fulfilled,
      (state, action: PayloadAction<IResponseInterface>) => {
        state.loading = false;
        state.message = action.payload.message;
        state.statusCode = action.payload.statusCode;
        // state.data = state.data.filter(
        //   (invoice) => invoice._id !== action.payload.data!.invoice._id
        // );
      }
    );

    // builder.addCase(fetchExploringProjects.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });
  },
});

export default bidsManagementSlice.reducer;
