'use client';

import React, { useCallback, useEffect } from 'react';

// module imports
import Image from 'next/image';
import moment from 'moment';
import { Dropdown, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '@/app/component/customButton/button';
import Description from '@/app/component/description';
import QuinaryHeading from '@/app/component/headings/quinary';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { AppDispatch } from '@/redux/store';
import {
  selectSupportTickets,
  selectSupportTicketsLoading,
} from '@/redux/supportTickets/supportTicketSelector';
import {
  deleteSupportTicket,
  fetchSupportTickets,
} from '@/redux/supportTickets/supportTicket.thunk';
import { ISupportTicket } from '@/app/interfaces/supportTicket.interface';
import SettingSidebar from '../verticleBar';
import NoData from './components/NoData';
import { withAuth } from '@/app/hoc/withAuth';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const SupportTickets = () => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();

  const supportTicketsData = useSelector(selectSupportTickets);
  const supportTicketsLoading = useSelector(selectSupportTicketsLoading);

  const fetchSupportTicketsHandler = useCallback(async () => {
    await dispatch(fetchSupportTickets({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    fetchSupportTicketsHandler();
  }, [fetchSupportTicketsHandler]);

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: <p>Edit</p>,
    },
    {
      key: 'delete',
      label: <p>Delete</p>,
    },
    {
      key: 'details',
      label: <p>Details</p>,
    },
  ];

  const handleDropdownItemClick = async (
    key: string,
    supportTicket: ISupportTicket
  ) => {
    if (key == 'delete') {
      await dispatch(deleteSupportTicket(supportTicket._id!));
    } else if (key == 'edit') {
      router.push(`/settings/supporttickets/edit/${supportTicket._id}`);
    } else if (key == 'details') {
      router.push(`/settings/supporttickets/${supportTicket._id}`);
    }
  };

  return (
    <SettingSidebar>
      <section className="w-full bg-white p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <TertiaryHeading title="Support Ticket" />
          <CustomButton
            text="Create New Ticket"
            className="!w-auto "
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => router.push('/settings/supporttickets/create')}
          />
        </div>
        {supportTicketsLoading ? (
          <div className="flex flex-col w-full mt-5">
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : supportTicketsData?.length === 0 ? (
          <NoData
            onClick={() => router.push('/settings/supporttickets/create')}
          />
        ) : (
          supportTicketsData?.map(
            (supportTicket: ISupportTicket, i: number) => {
              const { _id, createdAt, title, description, updatedAt, status } =
                supportTicket;
              return (
                <div
                  key={i}
                  className="shadow-primaryGlow rounded-2xl flex flex-col p-4 mt-6 bg-white cursor-pointer"
                  onClick={() => {
                    if (status !== 'open') {
                      router.push(
                        `/settings/supporttickets/${supportTicket._id}`
                      );
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Description
                        title={`Ticket # ${_id}`}
                        className="text-steelGray font-semibold"
                      />
                      {status == 'open' ? (
                        <p className="bg-lightblue rounded-xl px-2">
                          <span className="text-xs text-darkblue font-normal">
                            Open
                          </span>
                        </p>
                      ) : (
                        <p className="bg-red-600 rounded-xl px-2 pt-0.5">
                          <span className="text-xs text-white font-normal">
                            Closed
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Description
                        title={moment(createdAt).startOf('minute').fromNow()}
                        className="text-lightenGreyish"
                      />
                      {status == 'open' ? (
                        <Dropdown
                          menu={{
                            items,
                            onClick: (event) => {
                              const { key } = event;
                              handleDropdownItemClick(key, supportTicket);
                            },
                          }}
                          placement="bottomRight"
                        >
                          <Image
                            src="/more-horizontal.svg"
                            width={24}
                            height={6}
                            alt="options"
                            className="cursor-pointer"
                          />
                        </Dropdown>
                      ) : null}
                    </div>
                  </div>
                  <QuinaryHeading
                    title={title}
                    className="text-base font-medium mt-3"
                  />
                  <Description
                    className="text-steelGray mt-2"
                    title={description}
                  />
                  <div className="flex items-center gap-7 mt-5">
                    <p className="text-xs text-slateGray font-normal flex gap-1">
                      <Image
                        src="/calendar.svg"
                        alt="date"
                        width={12}
                        height={12}
                      />
                      Date: {moment(createdAt).format('ll')}
                    </p>
                    <p className="text-xs text-slateGray font-normal flex gap-1 items-center">
                      <Image
                        src="/reply-rounded.svg"
                        alt="date"
                        width={16}
                        height={14}
                      />
                      Last reply: {moment(updatedAt).format('ll')}
                    </p>
                  </div>
                </div>
              );
            }
          )
        )}
      </section>
    </SettingSidebar>
  );
};

export default withAuth(SupportTickets);
