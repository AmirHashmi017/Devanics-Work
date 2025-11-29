'use client';
import { Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import SwitchBtn from './switchbtn';
import SinglePlan from './plan/plan';
import ToggleBtn from './toggleBtn';
import { AppDispatch } from '@/redux/store';
import { HttpService } from '@/app/services/base.service';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { fetchPricingPlan } from '@/redux/pricingPlanSlice/pricingPlan.thunk';
import {
  selectPricingPlans,
  selectPricingPlansError,
  selectPricingPlansLoading,
} from '@/redux/pricingPlanSlice/pricingPlan.selector';
import { useUser } from '@/app/hooks/useUser';

const PaymentPlans = () => {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);
  const plansData = useSelector(selectPricingPlans);
  const isLoading = useSelector(selectPricingPlansLoading);
  const isError = useSelector(selectPricingPlansError);

  const [planType, setPlanType] = useState('Individual');

  const [pricingPlansData, setPricingPlansData] = useState(
    [] as IPricingPlan[]
  );
  const [isDuration, setIsDuration] = useState('monthly');
  const user = useUser();

  useEffect(() => {
    pricingPlansHandler();
  }, []);

  const handlePlanType = (planType: string) => {
    // planType === 'Individual' | 'Educational' | 'Enterprise'
    const newPlansData = plansData.pricingPlans.filter(
      ({ type, duration }: IPricingPlan) =>
        type === planType && duration === isDuration
    );
    setPlanType(planType);
    setPricingPlansData(newPlansData);
  };
  const pricingPlansHandler = useCallback(async () => {
    const {
      payload: {
        statusCode,
        data: { pricingPlans },
      },
    }: any = await dispatch(fetchPricingPlan({ page: 1, limit: 10 }));
    if (statusCode === 200) {
      setPricingPlansData(
        pricingPlans.filter(
          ({ type, duration }: IPricingPlan) =>
            type === 'Individual' && duration === isDuration
        )
      );
    }
  }, []);

  const internalPlans = pricingPlansData.filter(
    (plan) => plan.isInternal === true
  );
  const otherPlans = pricingPlansData
    .filter((plan) => plan.isInternal !== true)
    .filter((plan) => plan.duration === isDuration);

  const handlePlanDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const currentPlanDuration = event.target.checked ? 'yearly' : 'monthly';
    const newPlansData = plansData.pricingPlans.filter(
      ({ duration, type }: IPricingPlan) =>
        duration === currentPlanDuration && type === planType
    );
    setIsDuration(currentPlanDuration);
    setPricingPlansData(newPlansData);
  };

  return (
    <>
      <div className="w-full h-px bg-mistyWhite mt-4 mb-6"></div>
      <div className="flex w-full align-items-center justify-center">
        <ToggleBtn planType={planType} onChange={handlePlanType} />
      </div>
      <div className="flex w-full align-items-center justify-center my-6">
        <SwitchBtn isDuration={isDuration} onChange={handlePlanDuration} />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <p>Something Went Wrong</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
          {internalPlans
            .concat(otherPlans)
            ?.map((plan: IPricingPlan, index: React.Key | null | undefined) => {
              return (
                <SinglePlan
                  key={index}
                  {...plan}
                  user={user ? user : undefined}
                />
              );
            })}
        </div>
      )}
    </>
  );
};

export default PaymentPlans;
