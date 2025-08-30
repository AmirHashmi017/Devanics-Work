'use client';
import Button from '@/app/component/customButton/button';
import SecondaryHeading from '@/app/component/headings/Secondary';
import QuinaryHeading from '@/app/component/headings/quinary';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { HttpService } from '@/app/services/base.service';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { getLoggedInUserDetails } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePricing } from '../usePricing';

import { ISubriptionHistory } from '@/app/interfaces/subscription-history.interface';
import subscriptionHistoryService from '@/app/services/subscription-history.service';
import { AxiosError } from 'axios';
import { Skeleton } from 'antd';
const Congratulations = () => {
  const router = useRouterHook();
  const token = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();
  const pricingHook = usePricing();

  const [data, setData] = useState<ISubriptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
    return () => {
      pricingHook.clearStorage();
    };
  }, [token]);

  useEffect(() => {
    dispatch(getLoggedInUserDetails({}));
  }, []);

  useEffect(() => {
    fetchSubscriptionHistory();
  }, []);

  async function fetchSubscriptionHistory() {
    setIsLoading(true);
    try {
      const response =
        await subscriptionHistoryService.httpGetAllSubscriptionHistory();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function isSubscribingFirstTime() {
    return data.length === 1;
  }

  return (
    <section className="h-[100vh] grid place-items-center rounded-lg">
      <div
        className={`flex flex-col items-center shadow-quaternaryDrama w-[460px] 
       rounded-lg px-7 relative bg-white`}
      >
        <div
          className="rounded-s absolute top-3 right-3 block cursor-pointer
        active:border border-[gray]
        
        "
        >
          <Image
            src={'/closeicon.svg'}
            alt="modal icon"
            width={18}
            height={18}
          />
        </div>
        {/* logo */}
        <Image src={'/Modal.png'} alt="modal icon" width={200} height={100} />
        <SecondaryHeading
          className={'mt-[20px] mb-[12px'}
          title=" Congratulations!"
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <QuinaryHeading
            className={'font-normal text-slateGray my-2'}
            title={
              isSubscribingFirstTime()
                ? ' Your account is successfully created.'
                : ' Your account is successfully upgraded.'
            }
          />
        )}
        <Button
          text={'Okay!'}
          className="my-3"
          onClick={() => router.push('/dashboard')}
        />
      </div>
    </section>
  );
};

export default Congratulations;
