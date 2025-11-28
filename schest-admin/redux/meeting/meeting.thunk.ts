import { createAsyncThunk } from '@reduxjs/toolkit';
import { meetingService } from 'src/services/meeting.service';

type FetchMeetingParams = {};

export const fetchMeetings = createAsyncThunk(
  'meeting/all',
  async (a: FetchMeetingParams, { rejectWithValue }) => {
    try {
      const response = await meetingService.httpGetMeetings();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while fetching the invoices'
      );
    }
  }
);

export const fetchMeeting = createAsyncThunk(
  'meeting/roomName/:roomName',
  async (params: { roomName: string }, { rejectWithValue }) => {
    try {
      const response = await meetingService.httpGetMeetingByRoomName(
        params.roomName
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while fetching the invoices'
      );
    }
  }
);
