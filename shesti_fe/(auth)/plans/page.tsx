'use client';
import TertiaryHeading from '@/app/component/headings/tertiary';
import PaymentPlans from '@/app/component/plans';
import Progessbar from '@/app/component/progressBar';
import AuthBar from '@/app/(pages)/(auth)/authNavbar';
import { usePricing } from '../usePricing';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/hooks/useUser';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { SubscriptionExpiredAlert } from './SubscriptionExpiredAlert';
import { useUserInvitationPlanVisited } from '@/app/hooks/useUserInvitationPlanVisited';
const Plans = () => {
  const pricingHook = usePricing();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const router = useRouterHook();
  const userInvitationPlanVisited = useUserInvitationPlanVisited();

  useEffect(() => {
    setIsLoading(true);
    if (pricingHook.getValueFromStorage()) {
      router.push('/payment');
    }
    if (user && pricingHook.data && pricingHook.data.length > 0) {
      if (user.invitation && !userInvitationPlanVisited.data) {
        const plan = pricingHook.data.find(
          (item) => item._id === user.invitation?.planId
        );
        if (plan) {
          pricingHook.setValueToStorage(plan);
          userInvitationPlanVisited.setValueToStorage(plan._id);
          router.push('/payment');
        }
      }
    }
    setIsLoading(false);
  }, [user, pricingHook.data, userInvitationPlanVisited.data]);

  return (
    <>
      <AuthBar />
      <div className="flex flex-col mx-4 md:mx-24 justify-center flex-wrap mt-12">
        <div className="w-[500px] mx-auto">
          <SubscriptionExpiredAlert user={user} />
        </div>
        <div className="w-full flex justify-between items-center">
          <TertiaryHeading className={'mt-1 mb-2'} title="Select Your Plan" />
          {/* <Link href="/dashboard" className='text-schestiPrimary hover:text-schestiSecondary cursor-pointer'>Skip for now</Link> */}
        </div>
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          <PaymentPlans />
        </Spin>
        <Progessbar progress={'50%'} step={2} />
      </div>
    </>
  );
};

export default Plans;
