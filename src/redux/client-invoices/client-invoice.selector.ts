import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const clientInvoicesSelector = (state: RootState) =>
  state.clientInvoices;

// support invoices redux data
export const selectClientInvoicesLoading = createSelector(
  [clientInvoicesSelector],
  (invoices) => invoices.loading
);

export const selectClientInvoices = createSelector(
  [clientInvoicesSelector],
  (invoices) => invoices.data
);
