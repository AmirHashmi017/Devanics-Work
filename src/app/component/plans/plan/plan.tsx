'use client';
import Button from '@/app/component/customButton/button';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { authService } from '@/app/services/auth.service';
import {
  getDualPlanPrice,
  getPlanFeatureKeyByValue,
} from '@/app/utils/plans.utils';
import {
  tertiaryHeading,
  quinaryHeading,
  minHeading,
} from '@/globals/tailwindvariables';
import { getLoggedInUserDetails } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import { Badge } from 'antd';
import { AxiosError } from 'axios';

import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

type Props = {
  user?: IUserInterface;
  onClick?: () => void;
} & IPricingPlan;

const SinglePlan = (props: Props) => {
  const router = useRouterHook();
  const dispatch = useDispatch<AppDispatch>();
  const [isFreePlanloading, setIsFreePlanloading] = useState(false);

  const { planName, planDescription, features, duration, _id } = props;

  const pricingPackageSelectionHandler = async (props: Props) => {
    if (props.isInternal) {
      setIsFreePlanloading(true);
      try {
        const response = await authService.httpSubscribeToFreePlan(props._id);
        if (response.data) {
          toast.success('Plan subscribed successfully');
          // dispatch(getLoggedInUserDetails({}));
          router.push(`/congratulation`);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setIsFreePlanloading(false);
      }
    } else {
      localStorage.setItem('pricingPlan', JSON.stringify(props));
      router.push(`/payment`);
    }
  };

  const stripeUpgradeMutation = useMutation(
    ['upgradePlan'],
    async (planId: string) => {
      return authService.httpUpgradeStripeMutation({ planId });
    },
    {
      onSuccess(data) {
        if (data.statusCode >= 400) {
          toast.error(data.message);
          return;
        }
        toast.success('Plan upgraded successfully');
        dispatch(getLoggedInUserDetails({}));
      },
      onError(error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err.message);
      },
    }
  );

  const BTN =
    props.user &&
    props.user.subscription &&
    props.user.subscription.planId &&
    props.user.subscription.status === 'active' ? (
      <Button
        text={
          (props.user.subscription.planId as IPricingPlan)._id === _id
            ? 'Current Plan'
            : 'Upgrade'
        }
        className="text-white self-stretch w-full"
        onClick={() => {
          if (
            _id &&
            (props.user?.subscription?.planId as IPricingPlan)._id !== _id
          ) {
            stripeUpgradeMutation.mutate(_id);
          }
        }}
        isLoading={stripeUpgradeMutation.isLoading}
      />
    ) : (
      <Button
        text={'Buy'}
        className="text-white self-stretch w-full"
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          } else {
            pricingPackageSelectionHandler(props);
          }
        }}
        isLoading={isFreePlanloading}
      />
    );

  const child = (
    <div
      className={`p-8 rounded-[20px] bg-white items-center h-full flex flex-col justify-between shadow-secondaryShadow gap-5`}
    >
      <div className=" flex flex-col gap-8 items-start w-full">
        <h2 className={`${tertiaryHeading} text-graphiteGray`}>{planName}</h2>
        {getDualPlanPrice(props).map((price) => {
          return (
            <div className="flex items-center w-full" key={price}>
              <span
                className="
            tracking-[-0.72px] font-semibold
            text-[42px] leading-[46px] !text-goldenrodYellow"
              >
                {price}
              </span>
              <p className={`${minHeading} text-lightdark  font-normal`}>
                /{duration}
              </p>
            </div>
          );
        })}
        <p className={`${quinaryHeading} text-lightdark2 whitespace-pre-wrap`}>
          {planDescription}
        </p>
        <div className="w-full h-px bg-mistyWhite"></div>
        <h4 className={`${tertiaryHeading} font-normal text-ebonyGray`}>
          Features
        </h4>
        <div className="flex gap-2 flex-col">
          {features
            ?.split(',')
            .filter((f) => !f.includes('social') && !f.includes('daily-work'))
            ?.map((benefit, index) => (
              <Fragment key={index}>
                <div className="self-start flex gap-2 items-center">
                  <Image
                    src={'/tickcyan.svg'}
                    width={20}
                    height={20}
                    className="rounded-md"
                    alt="tick icon"
                  />
                  <label
                    htmlFor={benefit}
                    className={twMerge(
                      `${quinaryHeading} text-ebonyGray leading-normal`
                    )}
                  >
                    {getPlanFeatureKeyByValue(benefit)}
                  </label>
                </div>
              </Fragment>
            ))}

          {['/social-media', '/daily-work'].map((benefit, index) => (
            <Fragment key={index}>
              <div className="self-start flex gap-2 items-center">
                <Image
                  src={'/tickcyan.svg'}
                  width={20}
                  height={20}
                  className="rounded-md"
                  alt="tick icon"
                />
                <label
                  htmlFor={benefit}
                  className={twMerge(
                    `${quinaryHeading} text-ebonyGray leading-normal`
                  )}
                >
                  {getPlanFeatureKeyByValue(benefit)}
                </label>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="w-full">{BTN}</div>
    </div>
  );

  return props.freeTrailDays ? (
    <div className="h-full">
      <Badge.Ribbon
        text={`Free for ${props.freeTrailDays} days`}
        rootClassName="h-full"
      >
        {child}
      </Badge.Ribbon>
    </div>
  ) : (
    child
  );
};

export default SinglePlan;
