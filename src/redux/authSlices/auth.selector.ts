import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// entire auth state
export const selectAuth = (state: RootState) => state.auth;

// Define the selector to get the user object
export const selectUser = createSelector([selectAuth], (auth) => auth.user);

// Define the selector to get the token
export const selectToken = createSelector([selectAuth], (auth) => auth.token);

// Define the selector to get the loading state
export const selectLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

// Define the selector to get the error
export const selectError = createSelector([selectAuth], (auth) => auth.error);
