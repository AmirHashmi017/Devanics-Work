import { USER_ROLES_ENUM } from '@/app/constants/constant';
import { IPublicNetworkingMember } from '@/app/interfaces/public-networking.interface';
import _ from 'lodash';

type Props = {
  item: IPublicNetworkingMember;
};
export function MemberCard({ item }: Props) {
  return (
    <div className="w-full col-span-1 items-center mb-4 shadow rounded-xl p-4 bg-white relative">
      <div className="flex items-center gap-2">
        <img
          src={'/profileAvatar.png'}
          alt="role"
          className="rounded-full size-9"
        />

        <div>
          <p className="text-ebonyClay font-semibold text-sm w-[80%] text-nowrap">
            {_.truncate(item.name, { length: 10, omission: '...' })}
          </p>
          <p className="text-schestiPrimary capitalize mt-1 text-[8px] bg-schestiLightPrimary rounded-[163px] py-0.5 px-2">
            {item.role}
          </p>
        </div>
      </div>

      <div className="contact-detail-section mt-2">
        {item.role !== USER_ROLES_ENUM.OWNER ? (
          <div className="flex items-center mt-0.5 gap-1.5">
            <img src="/phone-call-01.svg" className="size-3" alt="role" />
            <p className="text-ebonyClay text-xs">{item.phone ?? '...'}</p>
          </div>
        ) : null}

        <div className="flex items-center mt-0.5 gap-1.5">
          <img
            src="/mail-03.svg"
            className="cursor-pointer size-3"
            alt="role"
          />
          <p className="text-ebonyClay text-xs">{item.email}</p>
        </div>
        <div className="flex items-center mt-0.5 gap-1.5">
          <img src="/users-01.svg" alt="role" className="size-3" />
          <p className="text-xs text-goldenrodYellow border-b border-goldenrodYellow">
            {' '}
            {item.teamMembers ? `${item.teamMembers} team members` : '...'}
          </p>
        </div>
      </div>

      <div className="address-section">
        <div className="mt-2">
          <p className="text-monsoon text-xs">
            {item.role !== USER_ROLES_ENUM.PROFESSOR &&
            item.role !== USER_ROLES_ENUM.STUDENT
              ? 'Company'
              : 'University'}
          </p>
          <p className="text-xs text-abyssalBlack font-medium mt-0.5">
            {item.role !== USER_ROLES_ENUM.PROFESSOR &&
            item.role !== USER_ROLES_ENUM.STUDENT
              ? item.company
              : item.universityName}
          </p>
        </div>
        <div className="mt-2">
          <p className="text-monsoon text-xs">Address</p>
          <p className="text-xs text-abyssalBlack font-medium mt-0.5">
            {item.address ?? '...'}
          </p>
        </div>
      </div>

      <div className="matching-trades-section mt-3">
        {item.trades ? (
          <div>
            <p className="text-monsoon text-xs">
              Trades ({item.trades.split(',').length}):
            </p>

            <div className="flex gap-2 flex-wrap mt-1">
              {item.trades.split(',').map((trade: string, i: number) => (
                <p
                  key={i}
                  className="text-graphiteGray mt-1 text-[8px] bg-schestiLightPrimary rounded-[163px] py-0.5 px-2"
                >
                  {trade}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
