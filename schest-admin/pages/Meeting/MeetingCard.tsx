import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useCopyToClipboard } from 'usehooks-ts';
import { IMeeting } from 'src/interfaces/meeting.type';
import { dayjs } from 'src/utils/date.utils';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import QuinaryHeading from 'src/components/Headings/Quinary';

type Props = {
  item: IMeeting;
  showJoinButton?: boolean;
};
const TIME_TO_ENABLE = 15; // minutes

export function MeetingCard({ item, showJoinButton = true }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [copiedText, copy] = useCopyToClipboard();

  function enableJoin15MinutesLeft(item: IMeeting) {
    const today = dayjs();
    const meetingDate = dayjs(item.startDate);
    const diff = meetingDate.diff(today, 'minute');
    return diff <= TIME_TO_ENABLE;
  }

  async function handleCopy(text: string) {
    try {
      await copy(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  }
  return (
    <div className="flex justify-between shadow p-3 my-2 rounded-lg bg-white">
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
          <img
            src={'/assets/icons/copy.svg'}
            alt="copy icon"
            className="cursor-pointer text-xs"
            onClick={() => handleCopy(item.link)}
          />
        </div>
        <SenaryHeading
          title={`Time: ${moment(item.startDate)
            .tz(item.timezone)
            .format('h:mm a')} ${item.timezone}`}
          className="text-[#667085]"
        />
      </div>
      <div>
        {!showJoinButton ? null : !enableJoin15MinutesLeft(item) ? (
          <WhiteButton className="!w-20" text="Join" />
        ) : (
          <CustomButton
            className={`!w-20`}
            text={'Join'}
            onClick={() => {
              window.open(`${item.link}`, '_blank');
            }}
          />
        )}
      </div>
    </div>
  );
}
