import moment from 'moment';
import { voidFc } from 'src/utils/types';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useUser } from 'src/hooks/useUser';

type Props = {
  onClick?: voidFc;
  showName?: boolean;
  feeling?: string;
  date?: string;
  name?: string;
  avatar?: string;
  isOwner?: boolean;
  from?: string;
};
const Profile = ({
  name,
  feeling,
  showName = true,
  date,
  onClick = () => {},
  avatar = '/assets/icons/profileAvatar.png',
  isOwner = false,
  from = '',
}: Props) => {
  const user = useUser();
  const fullName = name || user?.socialName || user?.name || '';
  const userAvatar =
    avatar ||
    user?.socialAvatar ||
    user?.avatar ||
    '/assets/icons/profileAvatar.png';

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
      <img
        src={userAvatar}
        className="size-9 rounded-full object-cover"
        alt={name}
      />
      <div>
        <div className="flex gap-2 items-start">
          {showName && (
            <p className="font-bold text-xs text-graphiteGray">{fullName}</p>
          )}
          {from && <p className="text-xs text-graphiteGray"> from {from}</p>}
          {feeling && (
            <p className="text-xs text-graphiteGray">
              - {feeling && `is feeling ${feeling}`}.
            </p>
          )}
          {isOwner && (
            <sup className="bg-schestiPrimary text-xs font-medium text-white rounded-sm p-1">
              you
            </sup>
          )}
        </div>
        {date && (
          <p
            className={twMerge(
              clsx('mt-1.5 text-coolGray text-[10px]', isOwner && 'mt-0')
            )}
          >
            {moment(date).fromNow()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
