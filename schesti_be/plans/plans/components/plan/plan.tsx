'use client';
import { usePricing } from '@/app/(pages)/(auth)/usePricing';
import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import Button from '@/app/component/customButton/button';
import ModalComponent from '@/app/component/modal';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useUser } from '@/app/hooks/useUser';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { authService } from '@/app/services/auth.service';
import {
  displayPlanPrice,
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

interface Props extends IPricingPlan {
  setSelectedPlan: any;
  user?: IUser;
}
const SinglePlan = (props: Props) => {
  const {
    planName,
    price,
    planDescription,
    features,
    duration,
    setSelectedPlan,
    _id,
    isInternal,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const user = useUser();
  const pricingHook = usePricing();
  const router = useRouterHook();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlanState] = useState<Props | null>(null);

  const stripeUpgradeMutation = useMutation(
    ['upgradePlan'],
    async (data: IPricingPlan) => {
      if (data.isInternal) {
        return upgradeToFreePlan(data._id);
      }
      return authService.httpUpgradeStripeMutation({ planId: data._id });
    },
    {
      onSuccess() {
        toast.success('Plan upgraded successfully');
        dispatch(getLoggedInUserDetails({}));
        setSelectedPlanState(null);
        setShowConfirmation(false);
      },
      onError(error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err.message);
      },
    }
  );

  async function upgradeToFreePlan(planId: string) {
    if (isInternal) {
      setIsLoading(true);
      try {
        const response = await authService.httpSubscribeToFreePlan(planId);
        if (response.data) {
          toast.success('Plan subscribed successfully');
          dispatch(getLoggedInUserDetails({}));
        }
        return response.data;
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Cannot upgrade from free plan.');
    }
  }

  const userPlanId =
    (user?.subscription &&
      user.subscription.planId &&
      (user.subscription.planId as IPricingPlan)._id) ||
    '';
  const BTN =
    user && user.subscription ? (
      <Button
        text={userPlanId === _id ? 'Subscribed' : 'Upgrade'}
        className={`text-white disabled:cursor-not-allowed ${userPlanId === _id ? '!bg-schestiLightPrimary !text-schestiPrimaryBlack !border-schestiLightPrimary' : ''} self-stretch w-full`}
        disabled={userPlanId === _id}
        onClick={() => {
          if (_id && userPlanId !== _id) {
            /**
             * If user is currently in trial period and the plan is not an internal one,
             * redirect the user to the payment page.
             * If the user is not in trial and does not have an active subscription,
             * redirect the user to the payment page.
             */

            if (user.subscription?.paymentMethod === 'Paymob' && !isInternal) {
              pricingHook.setValueToStorage(props);
              router.push('/payment');
            } else if (
              user.subscription?.status === 'trialing' &&
              !isInternal
            ) {
              pricingHook.setValueToStorage(props);
              router.push('/payment');
            } else if (!user.subscription!.subscriptionId && !isInternal) {
              pricingHook.setValueToStorage(props);
              router.push('/payment');
            } else {
              setShowConfirmation(true);
              setSelectedPlanState(props);
            }
          } else {
            toast.success('You are already on this plan');
          }
        }}
        isLoading={stripeUpgradeMutation.isLoading || isLoading}
      />
    ) : (
      <Button
        text={'Buy'}
        className="text-white self-stretch w-full"
        onClick={() => {
          setSelectedPlan({ planName, price, duration });
          pricingHook.setValueToStorage(props);
          router.push('/payment');
        }}
      />
    );

  const child = (
    <div
      className={`p-8 rounded-[20px] items-center h-full flex flex-col justify-between bg-white shadow-secondaryShadow gap-5`}
    >
      {showConfirmation && selectedPlan ? (
        <ModalComponent
          open={showConfirmation}
          setOpen={setShowConfirmation}
          width="600px"
        >
          <Popups
            title="Upgrade Confirmation"
            onClose={() => {
              setShowConfirmation(false);
              setSelectedPlan(null);
            }}
          >
            <div className="flex flex-col gap-6">
              <p className="text-graphiteGray text-center">
                Are you sure you want to upgrade to {planName} plan? It will
                cost {displayPlanPrice(props, user?.country)} per month and will
                cancel your current plan.
              </p>
              <div className="flex gap-4 justify-end">
                <Button
                  text={'Cancel'}
                  className="text-schestiPrimary !bg-white w-fit"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPlan(null);
                  }}
                />
                <Button
                  text={'Upgrade'}
                  className="text-white  w-fit"
                  onClick={() => {
                    stripeUpgradeMutation.mutate(selectedPlan);
                  }}
                  isLoading={stripeUpgradeMutation.isLoading}
                />
              </div>
            </div>
          </Popups>
        </ModalComponent>
      ) : null}
      <div className=" flex flex-col gap-8 items-start w-full">
        <h2 className={`${tertiaryHeading} text-graphiteGray`}>{planName}</h2>
        <div className="flex items-center w-full">
          <span
            className="
            tracking-[-0.72px] font-semibold
            text-[42px] leading-[46px] !text-goldenrodYellow"
          >
            {displayPlanPrice(props, user?.country)}
          </span>
          <p className={`${minHeading} text-lightdark  font-normal`}>
            /{duration}
          </p>
        </div>
        {props.egpPrice ? (
          <div className="flex items-center w-full">
            <span
              className="
            tracking-[-0.72px] font-semibold
            text-[35px] leading-[46px] !text-goldenrodYellow text-wrap"
            >
              {displayPlanPrice(props, 'EG')}
            </span>
            <p className={`${minHeading} text-lightdark  font-normal`}>
              /{duration}
            </p>
          </div>
        ) : null}
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
