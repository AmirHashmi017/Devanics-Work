import SenaryHeading from '@/app/component/headings/senaryHeading';
import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';

type Props = {
  fetchDashboardState: IDashboardStats | undefined;
};

export function ProjectDetails({ fetchDashboardState }: Props) {
  return (
    <div className="px-5 space-y-5">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <span className="w-3 h-3 bg-midnightBlue2" />
          <SenaryHeading title="Takeoff Project" />
        </div>
        <SenaryHeading
          title={`${fetchDashboardState?.totalTakeoff}`}
          className="font-medium"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <span className="w-3 h-3 bg-lavenderPurple" />

          <SenaryHeading title="Estimate Project" />
        </div>

        <SenaryHeading
          title={`${fetchDashboardState?.totalGeneratedEstimates}`}
          className="font-medium"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <span className="w-3 h-3 bg-[#36B37E]" />

          <SenaryHeading title="Invoices " />
        </div>

        <SenaryHeading
          title={`${fetchDashboardState?.totalInvoices}`}
          className="font-medium"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-goldenrodYellow" />

          <SenaryHeading title="Scheduled Project" />
        </div>
        <SenaryHeading
          title={`${fetchDashboardState?.totalSchedules}`}
          className="font-medium"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-[#B58905]" />

          <SenaryHeading title="Meeting" />
        </div>
        <SenaryHeading
          title={`${fetchDashboardState?.totalMeetings}`}
          className="font-medium"
        />
      </div>
    </div>
  );
}
