'use client';
// import Button from '@/app/component/customButton/button';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { useUser } from '@/app/hooks/useUser';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { getPlanFeatureKeyByValue } from '@/app/utils/plans.utils';
import { calculateProgressBarPercentage } from '@/app/utils/utils';
// import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import {
  tertiaryHeading,
  quinaryHeading,
  minHeading,
} from '@/globals/tailwindvariables';
import { Skeleton } from 'antd';
import moment from 'moment';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChangeAutoRenewel } from './ChangeAutoRenewel';
import { useUserSubscription } from '@/app/hooks/useUserSubscription';
import { SuspendPaymobSubscription } from './SuspendPaymobSubscription';

// interface Props extends IPricingPlan {
//   isYearly: boolean;
// }

type Props = {
  onUpgradeClick?: () => void;
};

const MySubscription = ({ onUpgradeClick }: Props) => {
  const [isLoading] = useState(false);
  const userData = useUser();
  const { userSubscription, isActive, paymentMethod, isSuspended } =
    useUserSubscription();

  const plan = userData
    ? (userData.subscription!.planId as IPricingPlan)
    : null;

  let features = plan ? plan.features.split(',') : [];

  const remainingDays =
    userSubscription && userSubscription.status === 'active'
      ? moment(userSubscription.currentPeriodEnd).diff(moment(), 'days')
      : userSubscription && userSubscription.status === 'trialing'
        ? moment(userSubscription.periodEnd).diff(moment(), 'days')
        : 0;

  return (
    <>
      <div className="flex justify-between items-center">
        <TertiaryHeading
          title="My Subscriptions"
          className="text-graphiteGray"
        />

        {isActive &&
        !isSuspended() &&
        paymentMethod &&
        paymentMethod === 'Paymob' ? (
          <SuspendPaymobSubscription />
        ) : isActive && paymentMethod === 'Stripe' ? (
          <ChangeAutoRenewel />
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5 mt-3">
        <div
          className={`p-8 rounded-[20px] items-center flex flex-col justify-between ${!userData ? 'h-[500px]' : ''}  bg-white shadow-secondaryShadow gap-5`}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <div className=" flex flex-col h-full gap-3 items-start w-full">
                <div className="space-y-2">
                  <h2 className={`${tertiaryHeading} text-graphiteGray`}>
                    {plan?.planName}
                  </h2>
                  <div className="flex items-center w-full">
                    <span className="tracking-[-0.72px] font-semibold text-[42px] leading-[46px] !text-schestiWarning">
                      ${plan?.price}
                    </span>
                    <p className={`${minHeading} text-lightdark  font-normal`}>
                      /{plan?.duration}
                    </p>
                  </div>
                  {plan?.egpPrice ? (
                    <div className="flex items-center w-full">
                      <span className="tracking-[-0.72px] font-semibold text-[42px] leading-[46px] !text-schestiWarning">
                        EGP {plan?.egpPrice}
                      </span>
                      <p
                        className={`${minHeading} text-lightdark  font-normal`}
                      >
                        /{plan?.duration}
                      </p>
                    </div>
                  ) : null}
                  <p className={`${quinaryHeading} text-lightdark2`}>
                    {plan?.planDescription}
                  </p>
                </div>

                <div className="w-full">
                  <div className="relative w-full">
                    <div
                      style={{
                        width: `${calculateProgressBarPercentage(31, remainingDays)}%`,
                      }}
                      className="h-3 absolute rounded-lg z-10 bg-schestiWarning"
                    />
                    <div className="h-3 w-full absolute rounded-lg bg-slate-200" />
                  </div>

                  <div className="flex mt-5 justify-end w-full">
                    {remainingDays ? (
                      <p className="font-semibold text-[14px]  text-[#EC2224]">{`Expires in ${remainingDays} day${
                        remainingDays !== 1 ? 's' : ''
                      }`}</p>
                    ) : null}
                  </div>
                </div>

                {/* <p className="text-end text-vividRed font-semibold w-full">
              Expires in 14 days left
            </p> */}

                <div className="space-y-2">
                  <h4
                    className={`${tertiaryHeading} font-normal text-ebonyGray`}
                  >
                    Features
                  </h4>
                  <div className="flex gap-4 flex-col">
                    {features
                      .concat(['/social-media', '/daily-work'])
                      .map((benefit: any, index: any) => (
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
              </div>

              <div className="flex justify-end w-full">
                <div
                  onClick={onUpgradeClick}
                  className="flex space-x-2 items-center mt-5 cursor-pointer"
                >
                  <p className="text-schestiPrimaryBlack font-semibold  text-base leading-6">
                    Upgrade Now
                  </p>
                  <Image
                    src={'/top-right-arrow.svg'}
                    width={12}
                    height={12}
                    alt="arrow right"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MySubscription;
