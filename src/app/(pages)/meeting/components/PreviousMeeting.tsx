import { IMeeting } from '@/app/interfaces/meeting.type';
import NoDataComponent from '@/app/component/noData';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import moment from 'moment-timezone';
import QuinaryHeading from '@/app/component/headings/quinary';
import { getClientLocalTimezone } from '@/app/utils/date.utils';

type Props = {
  meetings: IMeeting[];
};
export function PreviousMeetings({ meetings }: Props) {
  meetings = meetings.filter((m) => {
    const current = moment.tz(getClientLocalTimezone());
    const endMeeting = moment(m.endDate).tz(m.timezone);
    return current.isAfter(endMeeting);
  });
  return meetings.length === 0 ? (
    <NoDataComponent
      link=""
      title="You did not have any previous meeting"
      description="There are no meeting."
      btnText=""
      isButton={false}
    />
  ) : (
    meetings.map((item, index) => {
      return (
        <div
          key={index}
          className="flex justify-between shadow p-3 my-2 rounded-lg bg-white"
        >
          <div className="space-y-1">
            <SenaryHeading
              title={moment(item.startDate).format('MMMM Do, YYYY')}
              className="text-[#475467]"
            />
            <QuinaryHeading
              title={item.topic}
              className="text-[#475467] font-semibold"
            />
            <div className="flex items-center space-x-3">
              <QuinaryHeading
                title={item.link}
                className="font-medium text-[#667085]"
              />
            </div>
            <SenaryHeading
              title={`Time: ${moment(item.startDate).format('h:mm a')} ${
                item.timezone
              }`}
              className="text-[#667085]"
            />
          </div>
        </div>
      );
    })
  );
}
