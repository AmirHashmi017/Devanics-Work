import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialCompanyClientState from './companyClient.initialState';
import { fetchCompanyClients, deleteCompanyClient } from '../company.thunk';
import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';

export const companySlice = createSlice({
  name: 'clients',
  initialState: initialCompanyClientState,
  reducers: {
    insertManyClientsAction: (state, action: PayloadAction<IClient[]>) => {
      state.data = [...action.payload, ...state.data];
    },
  },
  extraReducers: (builder) => {
    // fetch all clients
    builder.addCase(fetchCompanyClients.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCompanyClients.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data.clients;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchCompanyClients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteCompanyClient.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCompanyClient.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data.client._id
      );
    });

    builder.addCase(deleteCompanyClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const { insertManyClientsAction } = companySlice.actions;
export default companySlice.reducer;
