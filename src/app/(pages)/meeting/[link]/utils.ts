import { IMeeting } from '@/app/interfaces/meeting.type';
import moment from 'moment';
import momentTz from 'moment-timezone';

// write a function which accepts meeting and check if the meeting has  started and meeting isnot ended
// if the meeting has started and meeting is not ended return true else return false
// if the meeting has not started return false
// if the meeting has ended return false
export function isMeetingActive(meeting: IMeeting) {
  const current = moment();
  const start = moment(meeting.startDate);
  const end = moment(meeting.endDate);
  return current.isBetween(start, end);
}

export function isMeetingEnded(meeting: IMeeting) {
  const current = moment();
  const end = moment(meeting.endDate);
  return current.isAfter(end);
}

export function isMeetingNotStarted(meeting: IMeeting) {
  const systemTime = moment();

  // Detect the system's time zone
  const SYSTEM_TIME_ZONE = momentTz.tz.guess();

  // Convert the meeting's start time to the system's time zone
  const meetingStartTimeInSystemTZ = moment
    .tz(meeting.startDate, meeting.timezone) // Start time in meeting's timezone
    .tz(SYSTEM_TIME_ZONE); // Convert to system's timezone

  // Compare the current time with the meeting's start time
  return systemTime.isBefore(meetingStartTimeInSystemTZ);
}
