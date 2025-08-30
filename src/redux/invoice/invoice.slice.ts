import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import initialInvoiceState from './invoice.initialState';
import {
  deleteContractorInvoiceRequest,
  fetchSubcontractorInvoices,
} from './invoice.thunk';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: initialInvoiceState,
  reducers: {
    updateContractorInvoiceAction: (
      state,
      action: PayloadAction<{ invoice: IInvoice }>
    ) => {
      const oldInvoices = [...state.data];
      const newInvoices = oldInvoices.map((invoice) => {
        if (invoice._id === action.payload.invoice._id) {
          return action.payload.invoice;
        }
        return invoice;
      });
      state.data = newInvoices;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubcontractorInvoices.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      fetchSubcontractorInvoices.fulfilled,
      (
        state,
        action: PayloadAction<IResponseInterface<{ invoices: IInvoice[] }>>
      ) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data!.invoices;
        state.statusCode = action.payload.statusCode;
      }
    );

    builder.addCase(fetchSubcontractorInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteContractorInvoiceRequest.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      deleteContractorInvoiceRequest.fulfilled,
      (state, action) => {
        console.log(action.payload);
        state.loading = false;
        const invoices = state.data.filter(
          (item: any) => item?._id !== action.payload.data?.invoice._id
        );
        state.data = invoices;
      }
    );

    builder.addCase(
      deleteContractorInvoiceRequest.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
    );
  },
});

export const { updateContractorInvoiceAction } = invoiceSlice.actions;

export default invoiceSlice.reducer;
