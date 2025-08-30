import { MeetingCard } from '@/app/(pages)/meeting/components/MeetingCard';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { getTimezoneFromCountryAndState } from '@/app/utils/date.utils';
import { Country } from 'country-state-city';
import moment from 'moment';

interface IProps {
  projectData: IBidManagement;
}

export function ProjectSummary(props: IProps) {
  const { projectData } = props;
  const currency = useCurrencyFormatter();

  return (
    <div className=" mt-6 mb-4 mx-4  p-5 bg-white rounded-lg border shadow-lg">
      <div>
        <TertiaryHeading
          title="Overview"
          className="text-[20px] leading-[30px]"
        />
        <fieldset className="border-[2px] mt-[21px] space-y-4 p-4  rounded-lg border-dashed border-[#aeafb8] relative">
          <legend className="text-[#667085] text-[14px] leading-6 absolute -top-4 z-10 bg-white w-fit px-2">
            Basic Information
          </legend>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Project Name"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.projectName}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Address"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.address}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Zip Code"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.zipCode}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="City"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {`${projectData?.city}, ${Country.getCountryByCode(projectData.country)?.name}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Bid Due"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(projectData.bidDueDate).format('DD MMM YYYY, hh:mm')}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Start Date: "
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(projectData.estimatedStartDate).format(
                  'DD MMM YYYY, hh:mm'
                )}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Completion Date"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {moment(projectData.estimatedCompletionDate).format(
                  'DD MMM YYYY, hh:mm'
                )}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Time Zone"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {'Eastern Time'}
                {getTimezoneFromCountryAndState(
                  projectData.country,
                  projectData.state
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-2">
              <SenaryHeading
                title="Duration"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.estimatedDuration + ' ' + projectData.durationType}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Square Footage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.squareFootage}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Project Value"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {currency.format(projectData.projectValue)}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Stage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[14px] leading-6 font-normal py-[7px] px-3 bg-[#ECFDF3] rounded-md w-fit text-[#027A48]">
                {projectData.stage}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[8px]">
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Project Type"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {projectData.projectType?.map((pt) => (
                    <p
                      key={pt}
                      className="px-[12px] rounded py-[7px] bg-schestiLightPrimary text-[#475467] text-[14px] leading-4"
                    >
                      {pt}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Project Building Use"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="justify-center grid gap-3 grid-cols-3 items-center">
                  {projectData.projectBuildingUse.map((building) => (
                    <p
                      key={building}
                      className="px-[12px] rounded py-[7px] bg-schestiLightPrimary text-[#475467] text-[14px] leading-4"
                    >
                      {building}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-[8px]">
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Construction Type"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {projectData.constructionTypes.map((ct) => (
                    <p
                      key={ct}
                      className="px-[12px] rounded py-[7px] bg-schestiLightPrimary text-[#475467] text-[14px] leading-4"
                    >
                      {ct}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <SenaryHeading
                title="Project Description"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {projectData.description}
              </p>
            </div>
            {projectData.specialInstructions.length ? (
              <div className="space-y-2">
                <SenaryHeading
                  title="Special Instructions"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />
                <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                  {projectData.specialInstructions}
                </p>
              </div>
            ) : null}
          </div>
        </fieldset>

        {projectData ? (
          <fieldset className="border-[2px] mt-[21px] space-y-4 p-4  rounded-lg border-dashed border-[#aeafb8] relative">
            <legend className="text-[#667085] text-[14px] leading-6 absolute -top-4 z-10 bg-white w-fit px-2">
              Event
            </legend>

            {projectData.preBiddingMeeting &&
            projectData.preBiddingMeeting.isChecked ? (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <SenaryHeading
                    title={'Pre-Bid Meeting'}
                    className="text-[14px] leading-[22px] text-[#344054] font-normal"
                  />

                  {projectData.preBiddingMeeting.isMandatory ? (
                    <SenaryHeading
                      title={'(Mandatory)'}
                      className="text-[14px] leading-[22px] text-[#F32051] font-normal"
                    />
                  ) : null}
                </div>

                {projectData.preBiddingMeeting.type === 'Onsite' ? (
                  <div className="flex flex-col">
                    <SenaryHeading
                      title={`${projectData.preBiddingMeeting.location ? projectData.preBiddingMeeting.location : ''}`}
                      className="text-[14px] leading-[22px] text-[#3A4856] font-semibold"
                    />

                    <div className="flex items-center space-x-2">
                      <SenaryHeading
                        // 12 March, 2024 format
                        title={`${moment(projectData.preBiddingMeeting.date).format('DD MMMM, YYYY')}`}
                        className="text-xs leading-[22px] text-[#929FB1] font-normal"
                      />
                      <SenaryHeading
                        title={`${projectData.preBiddingMeeting.time}`}
                        className="text-xs leading-[22px] text-[#929FB1] font-normal"
                      />
                    </div>
                    <SenaryHeading
                      title={`${projectData.preBiddingMeeting.instruction}`}
                      className="text-xs leading-[22px] text-[#3A4856] font-normal"
                    />
                  </div>
                ) : typeof projectData.preBiddingMeeting.meeting ===
                  'string' ? null : (
                  <MeetingCard
                    item={projectData.preBiddingMeeting.meeting!}
                    shouldShowJoin
                  />
                )}

                <div className="border-b border-[#DFDFDF] my-2"></div>
              </div>
            ) : null}

            {projectData.siteWalkthrough &&
            projectData.siteWalkthrough.isChecked ? (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <SenaryHeading
                    title={'Site Walkthrough'}
                    className="text-[14px] leading-[22px] text-[#344054] font-normal"
                  />

                  {projectData.siteWalkthrough.isMandatory ? (
                    <SenaryHeading
                      title={'(Mandatory)'}
                      className="text-[14px] leading-[22px] text-[#F32051] font-normal"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <SenaryHeading
                    title={`${projectData.siteWalkthrough.location ? projectData.siteWalkthrough.location : ''}`}
                    className="text-[14px] leading-[22px] text-[#3A4856] font-semibold"
                  />

                  <div className="flex items-center space-x-2">
                    <SenaryHeading
                      // 12 March, 2024 format
                      title={`${moment(projectData.siteWalkthrough.date).format('DD MMMM, YYYY')}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                    <SenaryHeading
                      title={`${projectData.siteWalkthrough.time}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                  </div>
                  <SenaryHeading
                    title={`${projectData.siteWalkthrough.instruction}`}
                    className="text-xs leading-[22px] text-[#3A4856] font-normal"
                  />
                </div>

                <div className="border-b border-[#DFDFDF] my-2"></div>
              </div>
            ) : null}

            {projectData.rfiDeadline && projectData.rfiDeadline.isChecked ? (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <SenaryHeading
                    title={'RFI Deadline '}
                    className="text-[14px] leading-[22px] text-[#344054] font-normal"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <SenaryHeading
                      // 12 March, 2024 format
                      title={`${moment(projectData.rfiDeadline.date).format('DD MMMM, YYYY')}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                    <SenaryHeading
                      title={`${projectData.rfiDeadline.time}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </fieldset>
        ) : null}
      </div>
    </div>
  );
}
