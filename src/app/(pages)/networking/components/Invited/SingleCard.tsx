import React, { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { SetInvitedClient } from '@/redux/network/network.slice';
import { networkingService } from '@/app/services/networking.service';

type Props = {
  invitedOn: string;
  invitedEmail: string;
};
const InvitedCard = ({ invitedOn, invitedEmail }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const removeInvitedClient = async () => {
    try {
      setIsLoading(true);
      await networkingService.httpRemoveInvitedClient(invitedEmail);
      setIsLoading(false);
      dispatch(SetInvitedClient());
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'error...');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 col-span-2 mb-4 shadow rounded-xl p-4 bg-white relative">
      <div className="flex gap-2 profile-section items-center">
        <Image
          src="/profileAvatar.png"
          alt={invitedEmail}
          width={36}
          height={36}
        />
        <p className="text-#1D2939 mt-0.5 text-[10px]">{invitedEmail}</p>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-monsoon text-[10px]">InvitedCard on:</p>
        <p className="text-[10px] text-rangoonGreen font-medium mt-0.5">
          {moment(invitedOn).format('DD-YY-YYYY')}
        </p>
      </div>

      <div className="flex gap-4 justify-between">
        <button
          disabled={isLoading}
          className="text-[8px] cursor-pointer p-2 w-1/2 rounded-lg border border-schestiPrimary text-schestiPrimary bg-transparent font-semibold"
          onClick={removeInvitedClient}
        >
          {isLoading ? 'Decline...' : 'Decline'}{' '}
        </button>
        <button className="text-[8px] cursor-pointer p-2 w-1/2 rounded-lg bg-schestiPrimary font-semibold text-white">
          Send Reminder{' '}
        </button>
      </div>
    </div>
  );
};

export default InvitedCard;
