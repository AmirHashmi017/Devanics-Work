import { CreateMeeting } from '@/app/(pages)/meeting/components/CreateMeeting';
import { MeetingCard } from '@/app/(pages)/meeting/components/MeetingCard';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import type { FormikProps } from 'formik';
import Image from 'next/image';
import { useState } from 'react';

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
          <div className="w-[190px] flex items-center py-2 px-[14px] rounded-lg cursor-pointer border border-schestiLightPrimary bg-schestiLightPrimary">
            <Image
              src={'/calender-cyan.svg'}
              alt="calendar"
              width={15}
              height={16}
            />
            <span className="text-schestiPrimary text-[14px] leading-5 font-semibold  ml-2">
              {'Meeting is scheduled'}
            </span>
          </div>
        ) : formik.values.preBiddingMeeting?.meeting ? (
          <MeetingCard
            item={formik.values.preBiddingMeeting.meeting}
            shouldShowJoin={false}
          />
        ) : (
          <>
            <div
              onClick={() => setShowModal(true)}
              className="w-[190px] flex items-center py-2 px-[14px] rounded-lg cursor-pointer border border-schestiLightPrimary bg-schestiLightPrimary"
            >
              <Image
                src={'/calender-cyan.svg'}
                alt="calendar"
                width={15}
                height={16}
              />
              <span className="text-schestiPrimary text-[14px] leading-5 font-semibold  ml-2">
                {'Schedule a meeting'}
              </span>
            </div>
            {/* @ts-ignore */}
            {formik.errors.preBiddingMeeting?.meeting ? (
              <div className="text-red-500 text-xs">
                {/* @ts-ignore */}*
                {formik.errors.preBiddingMeeting?.meeting as string}
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
