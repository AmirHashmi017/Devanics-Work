import { Skeleton, Tabs } from 'antd';
import { AxiosError } from 'axios';
import momentTimezone from 'moment-timezone';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Description from 'src/components/discription';
import QuaternaryHeading from 'src/components/Headings/Quaternary';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import NoData from 'src/components/noData';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import { bidManagementService } from 'src/services/bid-management.service';
import { getTimezoneFromCountryAndState } from 'src/utils/date.utils';
import { ProjectSummary } from '../view/components/ProjectSummary';
import { ProjectDesignTeam } from '../view/components/ProjectDesignTeam';
import { ProjectDocuments } from './components/ProjectDocuments';
import { ProjectRFICenter } from './components/ProjectRFICenter';

const SUMMARY = 'Summary';
const DESIGN_TEAM = 'Project Team';
const DOCUMENTS = 'Documents';
const RFI_CENTER = 'RFI Center';

export function ProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState(SUMMARY);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [project, setProject] = useState<IBidManagement | null>(null);
  const params = useParams<{ id: string }>();
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (params.id) {
      fetchProjectHandler(params.id);
    }
  }, [params.id]);
  const fetchProjectHandler = async (projectId: string) => {
    setIsDetailsLoading(true);
    try {
      const response = await bidManagementService.httpGetProjectById(projectId);
      if (response.data && response.data.project) {
        setProject(response.data.project);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  if (isDetailsLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }
  if (!project) {
    return (
      <NoData
        title="No Project Found"
        description="There is no project with this id"
        link="/projects/find"
      />
    );
  }

  return (
    <div>
      <div className="mt-6 mb-[39px] mx-4 ">
        <div className="flex gap-4 items-center">
          <img
            src={'/assets/icons/home.svg'}
            alt="home icon"
            className="text-base"
          />
          <img
            src={'/assets/icons/chevron-right.svg'}
            alt="chevron-right icon"
            className="text-sm"
          />
          <Description
            title="Bid Management"
            className="font-base text-slateGray"
          />
          <img
            src={'/assets/icons/chevron-right.svg'}
            alt="chevron-right icon"
            className="text-sm"
          />

          <Description
            title="Find Project"
            className="font-base text-slateGray"
          />
          <img
            src={'/assets/icons/chevron-right.svg'}
            alt="chevron-right icon"
            className="text-sm"
          />

          <Description
            title="Details"
            className="font-semibold text-schestiPrimary cursor-pointer underline"
          />
        </div>
      </div>

      <div className="bg-white mb-[39px] md:px-[64px] py-5">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <SenaryHeading
              title={project.projectName}
              className="text-[#1D2939] text-2xl font-semibold leading-9"
            />
            <div className="flex space-x-4 items-center text-[#667085] text-base leading-6 font-normal">
              <SenaryHeading
                title={`Creation Date: ${momentTimezone(
                  project.createdAt
                ).format('MM/DD/YYYY hh:mm A')}`}
              />
              <SenaryHeading
                title={`Bid Date: ${
                  momentTimezone(project.bidDueDate).format(
                    'MM/DD/YYYY hh:mm A'
                  ) +
                  ' ' +
                  getTimezoneFromCountryAndState(project.country, project.state)
                } `}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Tabs
            size="large"
            onChange={(key) => {
              setActiveTab(key);
            }}
            activeKey={activeTab}
            tabBarGutter={90}
            items={[SUMMARY, DESIGN_TEAM, DOCUMENTS, RFI_CENTER].map((tab) => ({
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
        </div>
      </div>
      {activeTab === SUMMARY ? <ProjectSummary project={project} /> : null}
      {activeTab === DESIGN_TEAM ? (
        <ProjectDesignTeam project={project} />
      ) : null}
      {activeTab === DOCUMENTS ? <ProjectDocuments project={project} /> : null}
      {activeTab === RFI_CENTER ? (
        <ProjectRFICenter projectId={project._id} />
      ) : null}
    </div>
  );
}
