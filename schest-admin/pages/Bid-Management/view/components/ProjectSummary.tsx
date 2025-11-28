import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { useTrades } from 'src/hooks/useTrades';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';
import { ITrade } from 'src/interfaces/trade.interface';
import { MeetingCard } from 'src/pages/Meeting/MeetingCard';
import { RootState } from 'src/redux/store';
import { UsCurrencyFormat } from 'src/utils/common';
import { getTimezoneFromCountryAndState } from 'src/utils/date.utils';

type Props = {
  project?: IBidManagement;
};
export function ProjectSummary({ project }: Props) {
  const bid = useSelector((state: RootState) =>
    project ? project : state.bidManagementOwner.project
  );
  const { tradesQuery, tradeCategoryFilters } = useTrades();

  const projectTrades = bid
    ? _.filter(tradesQuery.data?.data?.trades, (trade) =>
        (bid.selectedTrades as unknown as string).includes(trade._id)
      )
    : [];

  function filterTradesByParent(id: string, trades: ITrade[]) {
    return trades.filter((trade) => trade.tradeCategoryId._id === id);
  }

  return (
    <div className=" mt-6 mb-4  mx-4  p-5 bg-white rounded-lg border shadow-lg">
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
                {bid ? bid.projectName : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Address"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid ? bid.address : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Zip Code"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid ? bid.zipCode : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="City"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid ? bid.city : ''}
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
                {/* 12 March, 2024 format */}
                {bid
                  ? moment(bid.bidDueDate).format('DD MMMM, YYYY hh:mm')
                  : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Start Date: "
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid
                  ? moment(bid.estimatedStartDate).format('DD MMMM, YYYY hh:mm')
                  : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Estimated Completion Date"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid
                  ? moment(bid.estimatedCompletionDate).format(
                      'DD MMMM, YYYY hh:mm'
                    )
                  : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Time Zone"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid
                  ? getTimezoneFromCountryAndState(bid.country, bid.state)
                  : ''}
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
                {bid ? `${bid.estimatedDuration} ${bid.durationType}` : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Square Footage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid ? bid.squareFootage : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Project Value"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                {bid ? UsCurrencyFormat.format(bid.projectValue) : ''}
              </p>
            </div>
            <div className="space-y-2">
              <SenaryHeading
                title="Stage"
                className="text-[14px] leading-6 text-[#98A2B3] font-normal"
              />
              {bid ? (
                <p className="text-[14px] leading-6 font-normal py-[7px] px-3 bg-[#ECFDF3] rounded-md w-fit text-[#027A48]">
                  {bid.stage}
                </p>
              ) : null}
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
                  {bid
                    ? bid.projectType.map((pt) => (
                        <p
                          key={pt}
                          className="px-[12px] rounded py-[7px] bg-[#F2F4F7] text-[#475467] text-[14px] leading-4"
                        >
                          {pt}
                        </p>
                      ))
                    : ''}
                </div>
              </div>
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Project Building Use"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {bid
                    ? bid.projectBuildingUse.map((building) => (
                        <p
                          key={building}
                          className="px-[12px] rounded py-[7px] bg-[#F2F4F7] text-[#475467] text-[14px] leading-4"
                        >
                          {building}
                        </p>
                      ))
                    : ''}
                </div>
              </div>
            </div>

            <div className="space-y-[8px] self-center">
              <div className="space-y-[8px]">
                <SenaryHeading
                  title="Construction Type"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />

                <div className="flex items-center space-x-3">
                  {bid
                    ? bid.constructionTypes.map((ct) => (
                        <p
                          key={ct}
                          className="px-[12px] rounded py-[7px] bg-[#F2F4F7] text-[#475467] text-[14px] leading-4"
                        >
                          {ct}
                        </p>
                      ))
                    : ''}
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
                {bid ? bid.description : ''}
              </p>
            </div>
            {bid && bid.specialInstructions.length ? (
              <div className="space-y-2">
                <SenaryHeading
                  title="Special Instructions"
                  className="text-[14px] leading-6 text-[#98A2B3] font-normal"
                />
                <p className="text-[#344054] text-[14px] leading-6 font-medium ">
                  {bid.specialInstructions}
                </p>
              </div>
            ) : null}
          </div>
        </fieldset>

        <fieldset className="border-[2px] mt-[21px] space-y-4 p-4  rounded-lg border-dashed border-[#aeafb8] relative">
          <legend className="text-[#667085] text-[14px] leading-6 absolute -top-4 z-10 bg-white w-fit px-2">
            Trades
          </legend>

          {tradeCategoryFilters.map((parent) => {
            return (
              <div key={parent.value} className="my-2">
                <div className="border-b border-[#DFDFDF]">
                  <SenaryHeading
                    title={parent.label}
                    className="text-xs leading-[30px] text-[#344054] font-normal"
                  />
                </div>
                <div className="flex items-center mt-2 gap-4">
                  {filterTradesByParent(parent.value, projectTrades).map(
                    (trade) => {
                      return (
                        <p
                          key={trade._id}
                          className="py-2 text-center px-[13px] bg-[#F2F4F7] rounded-full text-[#667085] text-[14px] leading-[14px] font-normal"
                        >
                          {trade.name}
                        </p>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </fieldset>

        {bid ? (
          <fieldset className="border-[2px] mt-[21px] space-y-4 p-4  rounded-lg border-dashed border-[#aeafb8] relative">
            <legend className="text-[#667085] text-[14px] leading-6 absolute -top-4 z-10 bg-white w-fit px-2">
              Event
            </legend>

            {bid.preBiddingMeeting && bid.preBiddingMeeting.isChecked ? (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <SenaryHeading
                    title={'Pre-Bid Meeting'}
                    className="text-[14px] leading-[22px] text-[#344054] font-normal"
                  />

                  {bid.preBiddingMeeting.isMandatory ? (
                    <SenaryHeading
                      title={'(Mandatory)'}
                      className="text-[14px] leading-[22px] text-[#F32051] font-normal"
                    />
                  ) : null}
                </div>

                {bid.preBiddingMeeting.type === 'Onsite' ? (
                  <div className="flex flex-col">
                    <SenaryHeading
                      title={`${
                        bid.preBiddingMeeting.location
                          ? bid.preBiddingMeeting.location
                          : ''
                      }`}
                      className="text-[14px] leading-[22px] text-[#3A4856] font-semibold"
                    />

                    <div className="flex items-center space-x-2">
                      <SenaryHeading
                        // 12 March, 2024 format
                        title={`${moment(bid.preBiddingMeeting.date).format(
                          'DD MMMM, YYYY'
                        )}`}
                        className="text-xs leading-[22px] text-[#929FB1] font-normal"
                      />
                      <SenaryHeading
                        title={`${bid.preBiddingMeeting.time}`}
                        className="text-xs leading-[22px] text-[#929FB1] font-normal"
                      />
                    </div>
                    <SenaryHeading
                      title={`${bid.preBiddingMeeting.instruction}`}
                      className="text-xs leading-[22px] text-[#3A4856] font-normal"
                    />
                  </div>
                ) : typeof bid.preBiddingMeeting.meeting === 'string' ? null : (
                  <MeetingCard item={bid.preBiddingMeeting.meeting!} />
                )}

                <div className="border-b border-[#DFDFDF] my-2"></div>
              </div>
            ) : null}

            {bid.siteWalkthrough && bid.siteWalkthrough.isChecked ? (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <SenaryHeading
                    title={'Site Walkthrough'}
                    className="text-[14px] leading-[22px] text-[#344054] font-normal"
                  />

                  {bid.siteWalkthrough.isMandatory ? (
                    <SenaryHeading
                      title={'(Mandatory)'}
                      className="text-[14px] leading-[22px] text-[#F32051] font-normal"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <SenaryHeading
                    title={`${
                      bid.siteWalkthrough.location
                        ? bid.siteWalkthrough.location
                        : ''
                    }`}
                    className="text-[14px] leading-[22px] text-[#3A4856] font-semibold"
                  />

                  <div className="flex items-center space-x-2">
                    <SenaryHeading
                      // 12 March, 2024 format
                      title={`${moment(bid.siteWalkthrough.date).format(
                        'DD MMMM, YYYY'
                      )}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                    <SenaryHeading
                      title={`${bid.siteWalkthrough.time}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                  </div>
                  <SenaryHeading
                    title={`${bid.siteWalkthrough.instruction}`}
                    className="text-xs leading-[22px] text-[#3A4856] font-normal"
                  />
                </div>

                <div className="border-b border-[#DFDFDF] my-2"></div>
              </div>
            ) : null}

            {bid.rfiDeadline && bid.rfiDeadline.isChecked ? (
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
                      title={`${moment(bid.rfiDeadline.date).format(
                        'DD MMMM, YYYY'
                      )}`}
                      className="text-xs leading-[22px] text-[#929FB1] font-normal"
                    />
                    <SenaryHeading
                      title={`${bid.rfiDeadline.time}`}
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
