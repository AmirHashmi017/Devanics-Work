'use client';
import Description from '@/app/component/description';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { withAuth } from '@/app/hoc/withAuth';
import { ConfigProvider, Tabs } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProjectSummary } from './components/ProjectSummary';
import { ProjectBids } from './components/ProjectBids';
import { ProjectDesignTeam } from './components/ProjectDesignTeam';
import { ProjectAcitivityAndStatusTracking } from './components/ProjectActivityAndStatusTracking';
import { ProjectDocuments } from './components/ProjectDocuments';
import { ProjectRFICenter } from './components/ProjectRFICenter';
import { ProjectIntro } from './components/ProjectIntro';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { bidManagementOwnerActions } from '@/redux/bid-management/owner.slice';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const SUMMARY = 'Summary';
const BIDS = 'Bids';
const DESIGN_TEAM = 'Project Team';
const ACTIVITY_AND_STATUS_TRACKING = 'Activity & Status Tracking';
const DOCUMENTS = 'Documents';
const RFI_CENTER = 'RFI Center';

function OwnerProjectDetailsPage() {
  const [activeTab, setActiveTab] = useState(SUMMARY);
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouterHook();

  useEffect(() => {
    return () => {
      dispatch(bidManagementOwnerActions.setProjectAction(null));
    };
  }, []);

  return (
    <section className="">
      <div className="flex gap-4 items-center mt-6 mb-4  mx-4 ">
        <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Posted Project"
          className="font-base text-slateGray hover:underline cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <Image
          src={'/chevron-right.svg'}
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
        <ProjectIntro id={params.id} />

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
      {activeTab === BIDS ? <ProjectBids projectId={params.id} /> : null}
      {activeTab === DESIGN_TEAM ? <ProjectDesignTeam /> : null}
      {activeTab === ACTIVITY_AND_STATUS_TRACKING ? (
        <ProjectAcitivityAndStatusTracking projectId={params.id} />
      ) : null}
      {activeTab === DOCUMENTS ? <ProjectDocuments id={params.id} /> : null}
      {activeTab === RFI_CENTER ? (
        <ProjectRFICenter projectId={params.id} />
      ) : null}
    </section>
  );
}

export default withAuth(OwnerProjectDetailsPage);
