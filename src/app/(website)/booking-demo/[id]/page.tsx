'use client';
import { useQuery } from 'react-query';
import bookingDemoService from '@/app/services/booking-demo.service';
import { useParams } from 'next/navigation';
import { Skeleton } from 'antd';
import NoData from '@/app/component/noData';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import ModalComponent from '@/app/component/modal';
import { IBookingDemo } from '@/app/interfaces/booking-demo.interface';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { LinkMessage } from '@/app/(pages)/meeting/[link]/LinkMessage';
import Description from '@/app/component/description';

function isDemoActive(booking: IBookingDemo) {
  const current = moment();
  const time = moment(booking.time, 'hh:mmA');
  const hour = time.get('hour');
  const minute = time.get('minute');
  const start = moment(booking.date);
  start.set({
    hour,
    minute,
  });
  const end = moment(moment(start.clone()).add(30, 'minutes'));
  return current.isBetween(start, end);
}

function isBookingDemoNotStarted(booking: IBookingDemo) {
  const systemTime = moment();
  const time = moment(booking.time, 'hh:mmA');
  const hour = time.get('hour');
  const minute = time.get('minute');
  const startDate = moment(booking.date);
  startDate.set({
    hour,
    minute,
  });

  // Detect the system's time zone
  const SYSTEM_TIME_ZONE = momentTz.tz.guess();

  // Convert the meeting's start time to the system's time zone
  const bookingDemoStartTimeInSystemTZ = moment
    .tz(startDate, booking.timezone.value) // Start time in meeting's timezone
    .tz(SYSTEM_TIME_ZONE); // Convert to system's timezone

  // Compare the current time with the meeting's start time
  return systemTime.isBefore(bookingDemoStartTimeInSystemTZ);
}

export default function BookingDemoMeetingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouterHook();
  const bookingDemoQuery = useQuery(
    ['booking-demo', params.id],
    () => bookingDemoService.httpGetBookingDemo(params.id),
    {
      enabled: !!params.id,
    }
  );

  if (bookingDemoQuery.isLoading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!bookingDemoQuery.data?.data) {
    return (
      <NoData
        btnText="Book a Demo"
        link="/booking-demo"
        title="No Scheduled Demo Found"
        description="You can book a demo meeting with us to get a better understanding of our services and how we can help you."
      />
    );
  }

  return (
    <div className="h-screen">
      {isBookingDemoNotStarted(bookingDemoQuery.data?.data!) ? (
        <ModalComponent
          open={!isDemoActive(bookingDemoQuery.data?.data!)}
          setOpen={() => {}}
          title="Demo link is not active"
          width="40%"
        >
          <LinkMessage
            type="inactive"
            title="Demo link is not active"
            description="Please wait for demo start time to active the link. Refresh the page to check the demo status."
            onClose={() => {
              // Refresh the page
              router.refresh();
            }}
            btnText="Refresh"
          >
            <Description
              title={`Demo time: ${moment(
                bookingDemoQuery.data?.data.time,
                'hh:mmA'
              )
                .set({
                  date: moment(bookingDemoQuery.data?.data.date).get('date'),
                })
                .format('ddd, MMM DD, YYYY, hh:mm A')}`}
            />
          </LinkMessage>
        </ModalComponent>
      ) : null}
      <JaaSMeeting
        appId={process.env.NEXT_PUBLIC_JITSI_APP_ID as string}
        roomName={`Demo ${bookingDemoQuery.data?.data.firstName}`}
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
          router.push('/');
        }}
      />
    </div>
  );
}
