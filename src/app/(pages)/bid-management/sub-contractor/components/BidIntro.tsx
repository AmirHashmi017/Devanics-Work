import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { ISaveUserBid } from '@/app/interfaces/bid-management/bid-management.interface';

import { Country } from 'country-state-city';
import moment from 'moment';
import Image from 'next/image';

type Props = {
  bid: ISaveUserBid;
  onClick?: () => void;
  isSelected?: boolean;
};
export function BidIntro({ bid, onClick, isSelected }: Props) {
  const isArchiveDate = bid.archiveType && bid.archiveType.length > 0;
  const currency = useCurrencyFormatter({
    currency:
      typeof bid.projectId === 'string' ? undefined : bid.projectId.currency,
  });
  return (
    <div
      className={`mt-3 rounded-lg ${isSelected ? 'bg-[#e0e3e6]' : 'bg-[#F2F4F7]'}  border border-[#E8E3EF] p-4 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Image src={'/trade.svg'} width={18} height={18} alt="trade icon" />
        <SenaryHeading
          title={
            typeof bid.projectId === 'string' ? '' : bid.projectId.projectName
          }
          className="font-medium text-[#001556] text-base leading-6"
        />
      </div>
      <div className="mt-[17px] flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="space-y-2">
            <SenaryHeading
              title="Posted:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={moment(bid.createdAt).format('DD MMM YYYY, hh:mm')}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>
          <div className="space-y-2">
            <SenaryHeading
              title="Bid Date:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={moment(
                typeof bid.projectId === 'string' ? '' : bid.projectId.createdAt
              ).format('DD MMM YYYY, hh:mm')}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>
          {isArchiveDate ? (
            <div className="space-y-2">
              <SenaryHeading
                title="Archive Date:"
                className="text-[#475467] font-normal text-xs leading-4"
              />

              <SenaryHeading
                title={moment(
                  typeof bid.projectId === 'string' ? '' : bid.updatedAt
                ).format('DD MMM YYYY, hh:mm')}
                className="text-[#475467] font-semibold text-xs leading-4"
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <SenaryHeading
              title="Location:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={`${typeof bid.projectId === 'string' ? '' : bid.projectId.city}, ${Country.getCountryByCode(typeof bid.projectId === 'string' ? '' : bid.projectId.country)?.name}`}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>
          <div className="space-y-2">
            <SenaryHeading
              title="Project value: "
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={currency.format(
                typeof bid.projectId === 'string'
                  ? 0
                  : (bid.projectId.projectValue as number)
              )}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>

          {typeof bid.projectId === 'string' ? (
            ''
          ) : bid.projectId.stage ? (
            <div className="rounded-full bg-schestiLightPrimary py-[5px] px-[11px]">
              <SenaryHeading
                title={
                  typeof bid.projectId === 'string' ? '' : bid.projectId.stage
                }
                className="text-schestiPrimary font-normal text-xs leading-4"
              />
            </div>
          ) : null}
        </div>
        <Image
          src={'/forward-arrow.svg'}
          width={46}
          height={36}
          alt="forward arrow icon"
          className="cursor-pointer"
          onClick={onClick}
        />
      </div>
    </div>
  );
}
