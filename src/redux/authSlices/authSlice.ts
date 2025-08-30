import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialAuthState from './auth.initialState';
import {
  login,
  updateProfileHandler,
  loginWithGoogle,
  addCompanyDetail,
  getLoggedInUserDetails,
  addVerificationDetails,
  addSelectedTrades,
  verifyUserEmail,
  updateUserCurrencyThunk,
} from './auth.thunk';
import { isEmpty } from 'lodash';

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.error = initialAuthState.error;
      state.loading = initialAuthState.loading;
      state.message = initialAuthState.message;
      state.token = initialAuthState.token;
      state.user = initialAuthState.user;
    },
    setUserAction: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.token = action.payload?.token;
      state.message = action.payload.message;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateProfileHandler.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateProfileHandler.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.message = action.payload.message;
    });

    builder.addCase(updateProfileHandler.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.token = action.payload?.token;
      state.message = action.payload.message;
    });

    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(addCompanyDetail.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addCompanyDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.token = action.payload?.token;
      state.message = action.payload.message;
    });

    builder.addCase(addCompanyDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // User Email Verification
    builder.addCase(verifyUserEmail.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(verifyUserEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      console.log('action.pay', action.payload);
      state.token = action.payload?.token;
      state.message = action.payload.message;
      if (!isEmpty(action.payload.data?.user)) {
        window.location.href = `/companydetails/${action.payload.data.user?._id}`;
      }
    });

    builder.addCase(verifyUserEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      window.location.href = '/login';
    });

    builder.addCase(getLoggedInUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getLoggedInUserDetails.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getLoggedInUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.token = action.payload?.token;
      state.message = action.payload.message;
    });

    builder.addCase(addVerificationDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addVerificationDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      // state.token = action.payload?.token;
      state.message = action.payload.message;
    });
    builder.addCase(addVerificationDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(addSelectedTrades.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addSelectedTrades.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.message = action.payload.message;
    });
    builder.addCase(addSelectedTrades.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(updateUserCurrencyThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateUserCurrencyThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user.user = action.payload.data;
      state.message = action.payload.message;
    });

    builder.addCase(updateUserCurrencyThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { logout, setUserAction, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
