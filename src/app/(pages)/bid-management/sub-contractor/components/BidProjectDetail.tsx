import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import {
  IBidManagement,
  IBidProjectReport,
} from '@/app/interfaces/bid-management/bid-management.interface';

import { Country } from 'country-state-city';
import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import { CiFlag1 } from 'react-icons/ci';
import { ReportTheProjectModal } from '../../components/ReportTheProject';
type Props = {
  bid: IBidManagement;
  onClick?: () => void;
  isSelected?: boolean;
  selectedBid: any;
  reportedProjects?: IBidProjectReport[];
};
export function BidProjectDetail({
  bid,
  onClick,
  isSelected,
  reportedProjects,
}: Props) {
  const currency = useCurrencyFormatter({ currency: bid.currency });
  const [showReportModal, setShowReportModal] = useState(false);

  const isTheProjectReported =
    reportedProjects && reportedProjects.length
      ? reportedProjects.find(
          (p) => typeof p.project === 'string' && p.project == bid._id
        )
      : false;

  return (
    <div
      className={`mt-3 rounded-lg ${isSelected ? 'bg-[#e0e3e6]' : 'bg-[#F2F4F7]'}  border border-[#E8E3EF] p-4 cursor-pointer`}
      onClick={onClick}
    >
      {/* Report the project modal */}
      <ReportTheProjectModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        project={bid._id}
      />
      {/* Report the project modal */}

      <div className="flex items-center space-x-3">
        <Image src={'/trade.svg'} width={18} height={18} alt="trade icon" />
        <SenaryHeading
          title={bid.projectName}
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
              title={moment(bid.bidDueDate).format('DD MMM YYYY, hh:mm')}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>
          <div className="space-y-2">
            <SenaryHeading
              title="Location:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={`${bid?.city}, ${Country.getCountryByCode(bid.country)?.name}`}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>
          <div className="space-y-2">
            <SenaryHeading
              title="Project value: "
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={currency.format(bid?.projectValue as number)}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>

          <div className="rounded-full bg-schestiLightPrimary py-[5px] px-[11px]">
            <SenaryHeading
              title={bid.stage}
              className="text-schestiPrimary font-normal text-xs leading-4"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CiFlag1
            className={`${isTheProjectReported ? 'text-schestiPrimary' : 'text-[#667085] hover:text-schestiPrimary'}  stroke-2 text-xl `}
            onClick={(e) => {
              if (isTheProjectReported) {
                return;
              }
              e.stopPropagation();
              e.preventDefault();
              setShowReportModal(true);
            }}
          />
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
    </div>
  );
}
