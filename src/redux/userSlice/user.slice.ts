import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: () => {},
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
