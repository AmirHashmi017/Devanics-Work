import { ConfigProvider, Tabs } from 'antd';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ProjectSummary } from './components/ProjectSummary';
import { ProjectBids } from './components/ProjectBids';
import { ProjectDesignTeam } from './components/ProjectDesignTeam';
import { ProjectAcitivityAndStatusTracking } from './components/ProjectActivityAndStatusTracking';
import { ProjectDocuments } from './components/ProjectDocuments';
import { ProjectRFICenter } from './components/ProjectRFICenter';
import { ProjectIntro } from './components/ProjectIntro';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from 'src/redux/store';
import { bidManagementOwnerActions } from 'src/redux/bid-management/owner.slice';
import Description from 'src/components/discription';
import QuaternaryHeading from 'src/components/Headings/Quaternary';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';

const SUMMARY = 'Summary';
const BIDS = 'Bids';
const DESIGN_TEAM = 'Project Team';
const ACTIVITY_AND_STATUS_TRACKING = 'Activity & Status Tracking';
const DOCUMENTS = 'Documents';
const RFI_CENTER = 'RFI Center';

function ViewProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState(SUMMARY);
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  useEffect(() => {
    return () => {
      dispatch(bidManagementOwnerActions.setProjectAction(null));
    };
  }, []);

  return (
    <section className="">
      <div className="flex gap-4 items-center mt-6 mb-4  mx-4 ">
        <img
          src={'/assets/icons/home.svg'}
          alt="home icon"
          width={20}
          height={20}
        />
        <img
          src={'/assets/icons/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Posted Project"
          className="font-base text-slateGray"
        />
        <img
          src={'/assets/icons/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <Description
          title="Overview"
          className="font-semibold text-schestiPrimary cursor-pointer underline"
        />
      </div>

      <div className="bg-white mb-[39px] md:px-[64px] py-5">
        {/* Project Intro */}
        <ProjectIntro id={params.id!} />

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
                BIDS,
                DESIGN_TEAM,
                ACTIVITY_AND_STATUS_TRACKING,
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

      {activeTab === SUMMARY ? <ProjectSummary /> : null}
      {activeTab === BIDS ? <ProjectBids projectId={params.id!} /> : null}
      {activeTab === DESIGN_TEAM ? <ProjectDesignTeam /> : null}
      {activeTab === ACTIVITY_AND_STATUS_TRACKING ? (
        <ProjectAcitivityAndStatusTracking projectId={params.id!} />
      ) : null}
      {activeTab === DOCUMENTS ? <ProjectDocuments id={params.id!} /> : null}
      {activeTab === RFI_CENTER ? (
        <ProjectRFICenter projectId={params.id!} />
      ) : null}
    </section>
  );
}

export default ViewProjectDetailsPage;
