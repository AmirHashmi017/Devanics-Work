'use client';
import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { withAuth } from '@/app/hoc/withAuth';
import { ConfigProvider, Skeleton, Spin, Tabs } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProjectSummary } from '../components/ProjectSummary';
import { ProjectDesignTeam } from '../components/ProjectDesignTeam';
import { ProjectDocuments } from '../components/ProjectDocuments';
import { ProjectRFICenter } from '../components/ProjectRFICenter';
import { ProjectBiddingTeam } from '../components/ProjectBiddingTeam';
import { useParams, useSearchParams } from 'next/navigation';
import { bidManagementService } from '@/app/services/bid-management.service';
import { useQuery } from 'react-query';
import moment from 'moment';
import { Routes } from '@/app/utils/plans.utils';
import { isEmpty } from 'lodash';
import { proposalService } from '@/app/services/proposal.service';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const SUMMARY = 'Summary';
const DESIGN_TEAM = 'Project Team';
const BIDDING_TEAM = 'Bidding Team';
const DOCUMENTS = 'Documents';
const RFI_CENTER = 'RFI Center';

function OwnerProjectDetailsPage() {
  const params: any = useParams();
  const { projectId } = params;
  const router = useRouterHook();
  const [bidSubmittedDetails, setBidSubmittedDetails] =
    useState<Array<any> | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const searchParams = useSearchParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [paginationSettings, setPaginationSettings] = useState<{
    page: number;
    limit: number;
  }>({
    page: 1,
    limit: 3,
  });
  const [activeTab, setActiveTab] = useState(SUMMARY);

  const fetchProjectDetails = async () => {
    return bidManagementService.httpGetOwnerProjectById(
      projectId,
      paginationSettings
    );
  };
  const { data, isLoading } = useQuery(
    ['project-details'],
    fetchProjectDetails
  );

  useEffect(() => {
    if (!isEmpty(data?.data?.project)) {
      const bid = data?.data?.project;
      getProjectProposalDetails(bid?._id);
    }
  }, [data?.data?.project]);

  useEffect(() => {
    // check if tab is present in the url
    const tab = searchParams.get('tab');
    // set the active tab based on the tab in the url
    if (tab && tab === DOCUMENTS) {
      // set the active tab to documents
      setActiveTab(DOCUMENTS);
    }
  }, [searchParams]);

  const getProjectProposalDetails = async (bidProjectId: any) => {
    setIsDetailsLoading(true);
    setBidSubmittedDetails(null);
    try {
      const { data }: any =
        await proposalService.httpGetProposalDetailsByProjectId(bidProjectId);
      if (data && data.bidDetails) {
        setIsDetailsLoading(false);
        setBidSubmittedDetails(data?.bidDetails);
      }
    } catch (err) {
      setIsDetailsLoading(false);
      console.log('could not get project proposal details', err);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  let projectData: any = {};
  if (data && data.data) {
    projectData = data.data?.project;
  }

  return (
    <section className="">
      <div className="flex gap-4 items-center mt-6 mb-4 mx-4 ">
        <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Bid Management"
          className="font-base text-slateGray"
        />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Find Project"
          className="font-base text-slateGray"
        />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <Description
          title="Project Details"
          className="font-semibold text-schestiPrimary cursor-pointer underline"
        />
      </div>

      <div className="bg-white mb-[39px] md:px-[64px] py-5">
        {/* Project Intro */}
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <SenaryHeading
              title={projectData?.projectName}
              className="text-[#1D2939] text-2xl font-semibold leading-9"
            />
            <div className="flex space-x-4 items-center text-[#667085] text-base leading-6 font-normal">
              <SenaryHeading
                title={moment(projectData?.createdAt).format(
                  'DD MMM YYYY, hh:mm'
                )}
              />
              <SenaryHeading
                title={moment(projectData?.bidDueDate).format(
                  'DD MMM YYYY, hh:mm'
                )}
              />
            </div>
          </div>

          <Spin
            spinning={isDetailsLoading}
            indicator={<LoadingOutlined spin />}
          >
            {bidSubmittedDetails && !bidSubmittedDetails.length ? (
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <CustomButton
                  text="Submit a bid"
                  className="!w-40"
                  onClick={() => {
                    router.push(
                      `${Routes['Bid Management'].Submit}/${projectId}`
                    );
                  }}
                />
              </div>
            ) : null}
          </Spin>
        </div>

        {/* Tabs */}
        <div className="mt-3">
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  inkBarColor: '#EF9F28',
                },
              },
            }}
          >
            <Tabs
              size="large"
              onChange={(key) => {
                setActiveTab(key);
              }}
              activeKey={activeTab}
              tabBarGutter={90}
              items={[
                SUMMARY,
                DESIGN_TEAM,
                BIDDING_TEAM,
                DOCUMENTS,
                RFI_CENTER,
              ].map((tab) => ({
                key: tab,
                label: (
                  <QuaternaryHeading
                    title={tab}
                    className={`!w-full ${
                      activeTab === tab ? 'text-schestiPrimary' : 'text-black'
                    }`}
                  />
                ),
                tabKey: tab,
              }))}
            />
          </ConfigProvider>
        </div>
      </div>

      {activeTab === SUMMARY ? (
        <ProjectSummary projectData={projectData} />
      ) : null}
      {activeTab === DESIGN_TEAM ? (
        <ProjectDesignTeam projectData={projectData} />
      ) : null}
      {activeTab === BIDDING_TEAM ? (
        <ProjectBiddingTeam projectData={projectData} />
      ) : null}

      {activeTab === DOCUMENTS ? (
        <ProjectDocuments projectData={projectData} />
      ) : null}
      {activeTab === RFI_CENTER ? (
        <ProjectRFICenter projectId={projectId} />
      ) : null}
    </section>
  );
}

export default withAuth(OwnerProjectDetailsPage);
