'use client';
import CustomButton from '@/app/component/customButton/button';
import { IMeeting } from '@/app/interfaces/meeting.type';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { Skeleton } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MeetingMessage } from './Message';
import { isMeetingActive, isMeetingNotStarted } from './utils';
import ModalComponent from '@/app/component/modal';
import { LinkMessage } from './LinkMessage';
import moment from 'moment';
import Description from '@/app/component/description';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { meetingService } from '@/app/services/meeting.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

function JoinMeeting() {
  const { link: roomName } = useParams();
  const router = useRouterHook();
  const [meeting, setMeeting] = useState<null | IMeeting>(null);
  const [loading, setIsLoading] = useState(false);

  const fetchMeetingByRoomname = async () => {
    if (roomName) {
      setIsLoading(true);
      try {
        const response = await meetingService.httpGetMeetingByRoomName(
          roomName as string
        );
        if (response.data && response.data.meeting) {
          setMeeting(response.data.meeting);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          err.response?.data.message || 'Error while fetching meeting'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMeetingByRoomname();
  }, []);

  if (loading) {
    return <Skeleton active className="m-6" />;
  }

  if (!meeting) {
    return (
      <MeetingMessage
        title="No meeting found"
        description="There is no scheduled meeting."
      >
        <CustomButton
          className="mt-7"
          text={'Go Back'}
          onClick={() => router.back()}
        />
      </MeetingMessage>
    );
  }

  return (
    <div>
      <div className="h-screen">
        {
          // isMeetingEnded(meeting) ? (
          //   <ModalComponent
          //     open={!isMeetingActive(meeting)}
          //     setOpen={() => { }}
          //     title="Meeting Expired/InActive"
          //     width="40%"
          //   >
          //     <LinkMessage
          //       title="Link Expired"
          //       description="Your meeting link is expired. You can contact with admin"
          //       onClose={() => router.push('/meeting')}
          //     >
          //       <div></div>
          //     </LinkMessage>
          //   </ModalComponent>
          // ) :
          isMeetingNotStarted(meeting) ? (
            <ModalComponent
              open={!isMeetingActive(meeting)}
              setOpen={() => {}}
              title="Meeting link is not active"
              width="40%"
            >
              <LinkMessage
                type="inactive"
                title="Meeting link is not active"
                description="Please wait for meeting start time to active the link. Refresh the page to check the meeting status."
                onClose={() => {
                  // Refresh the page
                  router.refresh();
                }}
                btnText="Refresh"
              >
                <Description
                  title={`Meeting time: ${moment(meeting.startDate).format(
                    'ddd, MMM DD, YYYY, hh:mm A'
                  )}`}
                />
              </LinkMessage>
            </ModalComponent>
          ) : null
        }
        <JaaSMeeting
          appId={process.env.NEXT_PUBLIC_JITSI_APP_ID as string}
          roomName={meeting.roomName}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: true,
          }}
          spinner={() => <div>Loading...</div>}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100vh';
            iframeRef.style.width = '100%';
          }}
          onReadyToClose={() => {
            router.push('/meeting');
          }}
        />
      </div>
    </div>
  );
}

// export default withAuth(JoinMeeting);
export default JoinMeeting;
