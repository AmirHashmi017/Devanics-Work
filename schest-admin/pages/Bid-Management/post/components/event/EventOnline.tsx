import type { FormikProps } from 'formik';
import { useState } from 'react';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';
import { CreateMeeting } from 'src/pages/Meeting/CreateMeeting';
import { MeetingCard } from 'src/pages/Meeting/MeetingCard';

type Props = {
  formik: FormikProps<IBidManagement>;
};

export function EventOnlineForm({ formik }: Props) {
  const [showModal, setShowModal] = useState(false);

  if (
    formik.values.preBiddingMeeting?.isChecked &&
    formik.values.preBiddingMeeting?.type === 'Online'
  ) {
    return (
      <div className="space-y-2 mt-3">
        {typeof formik.values.preBiddingMeeting?.meeting === 'string' ? (
          <div className="w-[190px] flex items-center py-2 px-[14px] rounded-lg cursor-pointer border border-[#F9F5FF] bg-schestiLightPrimary">
            <img
              src={'/assets/icons/calendar-cyan.svg'}
              alt="calendar"
              className="text-base"
            />
            <span className="text-schestiPrimary text-[14px] leading-5 font-semibold  ml-2">
              {'Meeting is scheduled'}
            </span>
          </div>
        ) : formik.values.preBiddingMeeting?.meeting ? (
          <MeetingCard
            item={formik.values.preBiddingMeeting.meeting}
            showJoinButton={false}
          />
        ) : (
          <>
            <div
              onClick={() => setShowModal(true)}
              className="w-[190px] flex items-center py-2 px-[14px] rounded-lg cursor-pointer border border-[#F9F5FF] bg-schestiLightPrimary"
            >
              <img
                src={'/assets/icons/calendar-cyan.svg'}
                alt="calendar"
                className="text-base"
              />
              <span className="text-schestiPrimary text-[14px] leading-5 font-semibold  ml-2">
                {'Schedule a meeting'}
              </span>
            </div>
            {/* @ts-ignore */}
            {formik.errors.preBiddingMeeting?.meeting ? (
              <div className="text-red-500 text-xs">
                *{(formik.errors.preBiddingMeeting as any)?.meeting}
              </div>
            ) : null}
          </>
        )}
        <CreateMeeting
          setShowModal={() => setShowModal(false)}
          showModal={showModal}
          onSuccess={(_meeting) => {
            formik.setFieldValue('preBiddingMeeting.meeting', _meeting);
          }}
          isInviteOptional
        />
      </div>
    );
  }
  return null;
}
