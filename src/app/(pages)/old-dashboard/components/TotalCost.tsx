import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';
import Image from 'next/image';

type Props = {
  fetchDashboardState: IDashboardStats | undefined;
};

export function TotalCost({ fetchDashboardState }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 my-3">
      <div className="flex justify-between items-center bg-white shadow-lg rounded-md p-4 border border-t">
        <div className="space-y-2">
          <h2 className="text-[#EF9F28] font-semibold text-[30px] leading-[38px]">
            {fetchDashboardState?.totalGeneratedEstimates}
          </h2>
          <h3
            className={'text-[#344054] text-[18px] leading-[26px] font-normal'}
          >
            Total Estimates
          </h3>
        </div>
        <div>
          <Image
            src={'/total-estimate.svg'}
            alt="Picture of the author"
            width={50}
            height={50}
          />
        </div>
      </div>
      <div className="flex justify-between items-center bg-white shadow-lg rounded-md p-4 border border-t">
        <div className="space-y-2">
          <h2 className="text-[#EF9F28] font-semibold text-[30px] leading-[38px]">
            {fetchDashboardState?.totalTakeoff}
          </h2>
          <h3
            className={'text-[#344054] text-[18px] leading-[26px] font-normal'}
          >
            Total Takeoff
          </h3>
        </div>
        <div>
          <Image
            src={'/total-takeoff.svg'}
            alt="Picture of the author"
            width={50}
            height={50}
            className="text-[#8449EB]"
          />
        </div>
      </div>
      <div className="flex justify-between items-center bg-white shadow-lg rounded-md border border-t p-4">
        <div className="space-y-2">
          <h2 className="text-[#EF9F28] font-semibold text-[30px] leading-[38px]">
            {fetchDashboardState?.totalSchedules}
          </h2>
          <h3
            className={'text-[#344054] text-[18px] leading-[26px] font-normal'}
          >
            Project Scheduled
          </h3>
        </div>
        <div>
          <Image
            src={'/total-scheduled.svg'}
            alt="Picture of the author"
            width={50}
            height={50}
            className="text-[#8449EB]"
          />
        </div>
      </div>
      <div className="flex justify-between items-center bg-white border border-t shadow-lg rounded-md p-4">
        <div className="space-y-2">
          <h2 className="text-[#EF9F28] font-semibold text-[30px] leading-[38px]">
            {fetchDashboardState?.totalClients}
          </h2>
          <h3
            className={'text-[#344054] text-[18px] leading-[26px] font-normal'}
          >
            Total Clients
          </h3>
        </div>
        <div>
          <Image
            src={'/total-clients.png'}
            alt="Picture of the author"
            width={50}
            height={50}
            className="text-[#8449EB]"
          />
        </div>
      </div>
    </div>
  );
}
