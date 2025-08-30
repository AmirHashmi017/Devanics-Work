import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialClientInvoiceState from './client-invoice.initialState';
import {
  deleteClientInvoiceRequest,
  fetchClientInvoices,
} from './client-invoice.thunk';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';

export const clientInvoiceSlice = createSlice({
  name: 'client-invoices',
  initialState: initialClientInvoiceState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchClientInvoices.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      fetchClientInvoices.fulfilled,
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

    builder.addCase(fetchClientInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteClientInvoiceRequest.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      deleteClientInvoiceRequest.fulfilled,
      (
        state,
        action: PayloadAction<IResponseInterface<{ invoice: IAIAInvoice }>>
      ) => {
        state.loading = false;
        state.message = action.payload.message;
        state.statusCode = action.payload.statusCode;
        state.data = state.data.filter(
          (invoice) => invoice._id !== action.payload.data!.invoice._id
        );
      }
    );

    builder.addCase(deleteClientInvoiceRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default clientInvoiceSlice.reducer;
