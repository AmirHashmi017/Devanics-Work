'use client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import { Tabs } from 'antd';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import CustomButton from '@/app/component/customButton/button';
import SecondaryHeading from '@/app/component/headings/Secondary';
import { UpcomingComponent } from './components/UpComing';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchMeetings } from '@/redux/meeting/meeting.thunk';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { HttpService } from '@/app/services/base.service';
import { CreateMeeting } from './components/CreateMeeting';
import { PreviousMeetings } from './components/PreviousMeeting';
import { withAuth } from '@/app/hoc/withAuth';

const UPCOMING_MEETING_KEY = 'Upcoming Meeting';
const PREVIOUS_MEETING_KEY = 'Previous Meeting';

const Meeting = () => {
  const token = useSelector(selectToken);
  const [tab, setTab] = useState(UPCOMING_MEETING_KEY);
  const meetings = useSelector((state: RootState) => state.meetings.data);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const fetchMeetingsCB = useCallback(async () => {
    await dispatch(fetchMeetings({}));
  }, [dispatch]);

  useEffect(() => {
    fetchMeetingsCB();
  }, []);

  return (
    <section className="mt-6 mb-[39px] md:ms-[69px] md:me-[59px] mx-4 rounded-xl ">
      <CreateMeeting
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
      />
      <div className="flex items-center justify-between my-3 ">
        <SecondaryHeading title="Meeting" />
        <CustomButton
          text="Schedule a meeting"
          icon="/white-calendar.svg"
          iconwidth={20}
          iconheight={20}
          className="!w-48 !text-xs !text-white"
          onClick={() => setShowModal(true)}
        />
      </div>
      <div className="w-full mb-4 shadow rounded p-3 bg-white">
        <Tabs
          defaultActiveKey={UPCOMING_MEETING_KEY}
          destroyInactiveTabPane
          onChange={(type) => {
            setTab(type);
          }}
          items={[UPCOMING_MEETING_KEY, PREVIOUS_MEETING_KEY].map((type) => {
            return {
              key: type,

              label: (
                <QuaternaryHeading
                  title={type}
                  className={`${
                    tab === type
                      ? 'text-schestiPrimary'
                      : 'text-schestiPrimaryBlack'
                  }`}
                />
              ),
              tabKey: type,
              children:
                tab === UPCOMING_MEETING_KEY ? (
                  <UpcomingComponent
                    state={meetings}
                    onOpenModal={() => setShowModal(true)}
                  />
                ) : (
                  <PreviousMeetings meetings={meetings} />
                ),
              style: {},
            };
          })}
        />
      </div>
    </section>
  );
};

export default withAuth(Meeting);
