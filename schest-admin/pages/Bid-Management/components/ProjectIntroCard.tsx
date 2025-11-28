import { State } from 'country-state-city';
import moment from 'moment';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { useCurrencyFormatter } from 'src/hooks/useCurrencyFormatter';
import { AdminGetAllProjectsType } from 'src/interfaces/bid-management/bid-management.interface';
import { UsCurrencyFormat } from 'src/utils/common';

type Project = AdminGetAllProjectsType['projects'][0];

type Props = {
  project: Project;
  selectedProject: Project | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
};
export function ProjectIntroCard({
  project,
  selectedProject,
  setSelectedProject,
}: Props) {
  const bidUser = project.user;
  const currency = useCurrencyFormatter();
  return (
    <div
      key={project._id}
      className={`mt-3 rounded-lg ${
        selectedProject?._id === project._id ? '!bg-[#F2F4F7]' : '!bg-white'
      } bg-white shadow-lg hover:bg-[#e5def0] border border-[#E8E3EF] p-4 cursor-pointer`}
      onClick={() => {
        if (selectedProject && selectedProject._id === project._id) {
          setSelectedProject(null);
        } else {
          setSelectedProject(project);
        }
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={'/assets/icons/trade.svg'}
            width={18}
            height={18}
            alt="trade icon"
          />
          <SenaryHeading
            title={project.projectName}
            className="font-medium text-[#001556] text-base leading-6"
          />
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="mt-[17px] flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="space-y-2">
            <SenaryHeading
              title="Posted:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={moment(project.createdAt).format('DD MMM YYYY, h:mm:A')}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>

          <div className="space-y-2">
            <SenaryHeading
              title="Bid Date:"
              className="text-[#475467] font-normal text-xs leading-4"
            />

            <SenaryHeading
              title={moment(project.bidDueDate).format('DD MMM YYYY, h:mm:A')}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>

          <div className="space-y-2">
            <SenaryHeading
              title="Location:"
              className="text-[#475467] font-normal text-xs leading-4"
            />
            <SenaryHeading
              title={`${State.getStateByCodeAndCountry(
                project.state,
                project.country
              )?.name}, ${project.city}`}
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
                project.projectValue,
                project.currency?.locale,
                project.currency?.code
              )}
              className="text-[#475467] font-semibold text-xs leading-4"
            />
          </div>

          <div className="space-y-2">
            <SenaryHeading
              title="Stage:"
              className="text-[#475467] font-normal text-xs leading-4"
            />
            <SenaryHeading
              title={project.stage}
              className=" bg-schestiLightPrimary text-center text-schestiPrimary py-1 px-2 rounded-full font-semibold text-[10px] leading-4"
            />
          </div>
        </div>
        <img
          src={'/assets/icons/forward-arrow.svg'}
          width={46}
          height={36}
          alt="forward arrow icon"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
