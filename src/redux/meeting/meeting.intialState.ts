import { IMeeting } from '@/app/interfaces/meeting.type';

type IMeetingState = {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: IMeeting[];
};

export const initalMeetingState: IMeetingState = {
  loading: false,
  error: null,
  message: null,
  statusCode: null,
  data: [],
};
