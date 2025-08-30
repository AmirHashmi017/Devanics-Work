import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const supportTicketSelector = (state: RootState) => state.supportTickets;

// support ticket redux data
export const selectSupportTicketsLoading = createSelector(
  [supportTicketSelector],
  (supportTickets) => supportTickets.loading
);

export const selectSupportTickets = createSelector(
  [supportTicketSelector],
  (supportTickets) => supportTickets.data
);
