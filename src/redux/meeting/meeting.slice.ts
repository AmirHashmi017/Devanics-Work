import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initalMeetingState } from './meeting.intialState';
import { RootState } from '../store';
import { fetchMeetings } from './meeting.thunk';
import { IMeeting } from '@/app/interfaces/meeting.type';

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState: initalMeetingState,
  reducers: {
    addNewMeetingAction(state, action: PayloadAction<IMeeting>) {
      state.data.push(action.payload);
    },
    deleteMeetingAction(state, action: PayloadAction<string>) {
      state.data = state.data.filter(
        (meeting) => meeting._id !== action.payload
      );
    },
    updateMeetingAction(state, action: PayloadAction<IMeeting>) {
      state.data = state.data.map((meeting) => {
        if (meeting._id === action.payload._id) {
          return action.payload;
        }
        return meeting;
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMeetings.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data?.meetings || [];
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchMeetings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(fetchMeetings.pending, (state) => {
      state.loading = true;
    });
  },
});
export const { addNewMeetingAction, deleteMeetingAction, updateMeetingAction } =
  meetingSlice.actions;
export const selectMeetings = (state: RootState) => state.meetings.data;
export default meetingSlice.reducer;
