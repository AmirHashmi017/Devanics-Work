import { createSlice } from '@reduxjs/toolkit';
import initialSupportTicketsState from './supportTickets.initialState';
import {
  deleteSupportTicket,
  fetchSupportTickets,
} from './supportTicket.thunk';

export const supportTicketSlice = createSlice({
  name: 'supportTickets',
  initialState: initialSupportTicketsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSupportTickets.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSupportTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchSupportTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteSupportTicket.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSupportTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deleteSupportTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default supportTicketSlice.reducer;
