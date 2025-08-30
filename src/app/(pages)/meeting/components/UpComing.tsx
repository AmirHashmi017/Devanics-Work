import moment from 'moment';
import { IMeeting } from '@/app/interfaces/meeting.type';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Skeleton } from 'antd';
import { NoMeetings } from './NoMeetings';
import { getClientLocalTimezone } from '@/app/utils/date.utils';
import { MeetingCard } from './MeetingCard';

type Props = {
  state: IMeeting[];
  onOpenModal: () => void;
};

export function UpcomingComponent({ state, onOpenModal }: Props) {
  const meetingsLoading = useSelector(
    (state: RootState) => state.meetings.loading
  );

  if (meetingsLoading) {
    return <Skeleton active className="mt-6" />;
  }

  if (state.length === 0) {
    return <NoMeetings onClick={onOpenModal} />;
  }
  const meetings = state.filter((item) => {
    const current = moment.tz(getClientLocalTimezone());

    // Convert meeting end time to user's local timezone
    const endMeetingInUserTimezone = moment
      .tz(item.endDate, item.timezone)
      .clone()
      .tz(getClientLocalTimezone());

    // Check if current time (user's timezone) is before the meeting end time (converted to user's timezone)
    const isBeforeEnd = current.isBefore(endMeetingInUserTimezone);
    return isBeforeEnd;
  });
  return (
    <div>
      {meetings.length === 0 ? (
        <NoMeetings onClick={onOpenModal} />
      ) : (
        meetings
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
          .map((item) => {
            return <MeetingCard item={item} key={item._id} shouldShowEdit />;
          })
      )}
    </div>
  );
}
