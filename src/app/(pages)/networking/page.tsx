'use client';
import React, { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import SearchFilters from './components/SearchFilters';
import SchestiNetwork from './components/SchestiNetwork';
import MyNetwork from './components/MyNework';
import Invited from './components/Invited';
import ModalComponent from '@/app/component/modal';
import CustomEmailTemplate from '@/app/component/customEmailTemplete';
import { networkingService } from '@/app/services/networking.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { SetInvitedClient } from '@/redux/network/network.slice';
import { withAuth } from '@/app/hoc/withAuth';
import { PublicNetwork } from './components/PublicNetwork';

const networkInfo = [
  {
    title: 'Public Network',
    Component: <PublicNetwork />,
  },
  {
    title: 'Schesti Network',
    Component: <SchestiNetwork />,
  },
  {
    title: 'My Network',
    Component: <MyNetwork />,
  },
  {
    title: 'Invited',
    Component: <Invited />,
  },
];

export type NetworkSearchTypes = {
  searchText: string;
  locationText: string;
};

const Networking = () => {
  const [currentNetwork, setCurrentNetwork] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const Networks = [PublicNetwork, SchestiNetwork, MyNetwork, Invited];
  const NetworkComponent = Networks[currentNetwork];
  const dispatch = useDispatch();

  const networkEmailInviteHandler = async (bodyObject: FormData) => {
    const toEmail = bodyObject.get('to');
    bodyObject.delete('cc');

    try {
      const response = await networkingService.httpAddInvitedClient(
        toEmail as string
      );
      if (response) {
        const response =
          await networkingService.httpNetworkingEmailSender(bodyObject);

        if (response.statusCode == 200) {
          setShowEmailModal(false);
          dispatch(SetInvitedClient());
          toast.success('Email sent successfully');
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    }
  };

  return (
    <section className="my-4 grid grid-cols-6 mx-8 px-4 gap-6">
      <div className="col-span-2 w-full">
        <SearchFilters />
      </div>
      <div className="col-span-4 mt-3.5">
        <div className="flex gap-3 justify-between items-center">
          <div className="w-full flex gap-3 col-span-2 items-center max-w-full shadow rounded-xl p-2 bg-white">
            {networkInfo.map(({ title }, i) => (
              <button
                key={i}
                onClick={() => setCurrentNetwork(i)}
                className={twMerge(
                  clsx(
                    'text-sm cursor-pointer bg-transparent text-graphiteGray py-2 px-3 rounded-md',
                    i === currentNetwork &&
                      'bg-schestiPrimary text-white font-semibold'
                  )
                )}
              >
                {title}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            className="text-schestiPrimary flex items-center gap-2 bg-schestiLightPrimary border border-schestiLightPrimary rounded-md font-semibold py-2 px-4 cursor-pointer"
          >
            <span className="text-xl">+</span> Invite
          </button>
        </div>
        <NetworkComponent />
      </div>
      <ModalComponent setOpen={setShowEmailModal} open={showEmailModal}>
        <CustomEmailTemplate
          isFileUploadShow={true}
          to=""
          shouldUpdateTo
          cc={false}
          invite
          setEmailModal={setShowEmailModal}
          submitHandler={networkEmailInviteHandler}
        />
      </ModalComponent>
    </section>
  );
};

export default withAuth(Networking);
