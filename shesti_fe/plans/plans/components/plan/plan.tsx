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
import { getLoggedInUserDetails } from '@/redux/authSlices/auth.thunk';
import { AppDispatch } from '@/redux/store';
import { Badge } from 'antd';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

interface Props extends IPricingPlan {
  setSelectedPlan: any;
  user?: IUser;
  // New props from Plans component
  displayPrice: number;
  displayCurrency: string;
  preferredPaymentMethod?: string;
  country?: { code: string; name: string; currency: string };
}

const SinglePlan = (props: Props) => {
  const {
    planName,
    planDescription,
    features,
    duration,
    setSelectedPlan,
    _id,
    isInternal,
    freeTrailDays,
    displayPrice,
    displayCurrency,
    preferredPaymentMethod,
    country,
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
        setShowConfirmation(false);
      },
      onError(error: any) {
        toast.error(error.response?.data?.message || error.message);
      },
    }
  );

  async function upgradeToFreePlan(planId: string) {
    if (!isInternal) {
      toast.error('This is not a free plan');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.httpSubscribeToFreePlan(planId);
      toast.success('Successfully subscribed to free plan');
      dispatch(getLoggedInUserDetails({}));
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  }

  const userPlanId = 
  typeof user?.subscription?.planId === 'string'
    ? user.subscription.planId
    : user?.subscription?.planId?._id || '';

  const handleUpgradeClick = () => {
    if (userPlanId === _id) {
      toast.success('You are already on this plan');
      return;
    }

    if (!user) {
      pricingHook.setValueToStorage(props);
      router.push('/payment');
      return;
    }

    // Paymob user trying to buy non-internal plan
    if (user.subscription?.paymentMethod === 'Paymob' && !isInternal) {
      pricingHook.setValueToStorage(props);
      router.push('/payment');
      return;
    }

    // Trial user or no active subscription
    if (user.subscription?.status === 'trialing' || !user.subscription?.subscriptionId) {
      pricingHook.setValueToStorage(props);
      router.push('/payment');
      return;
    }

    // Existing paid user → show confirmation
    setSelectedPlanState(props);
    setShowConfirmation(true);
  };

  const BTN = user ? (
    <Button
      text={userPlanId === _id ? 'Current Plan' : 'Upgrade Now'}
      className={twMerge(
        'w-full text-white font-semibold py-3 rounded-lg transition',
        userPlanId === _id
          ? 'bg-green-600 cursor-not-allowed opacity-80'
          : 'bg-[#007AB6] hover:bg-[#006094]'
      )}
      disabled={userPlanId === _id}
      onClick={handleUpgradeClick}
      isLoading={stripeUpgradeMutation.isLoading || isLoading}
    />
  ) : (
    <Button
      text="Get Started"
      className="w-full bg-[#007AB6] hover:bg-[#006094] text-white font-semibold py-3 rounded-lg"
      onClick={() => {
        pricingHook.setValueToStorage(props);
        router.push('/payment');
      }}
    />
  );

  const child = (
    <div className="p-8 rounded-[20px] bg-white shadow-secondaryShadow flex flex-col justify-between h-full gap-6">
      {/* Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <ModalComponent open={showConfirmation} setOpen={setShowConfirmation} width="600px">
          <Popups
            title="Confirm Plan Upgrade"
            onClose={() => setShowConfirmation(false)}
          >
            <div className="flex flex-col gap-6 text-center">
              <p className="text-graphiteGray">
  You are about to upgrade to the <strong>{planName}</strong> plan.
  <br />
  This will cost{' '}
  <strong>
    {displayCurrency === 'USD' || !displayCurrency ? '$' : displayCurrency}{' '}
    {Number(displayPrice ?? (props as any).basePrice ?? 0).toLocaleString()}
  </strong>{' '}
  per {duration === 'monthly' ? 'month' : 'year'}.
</p>
              <div className="flex gap-4 justify-end">
                <Button text="Cancel" className="!bg-gray-200 text-gray-700" onClick={() => setShowConfirmation(false)} />
                <Button
                  text="Confirm Upgrade"
                  className="text-white"
                  onClick={() => stripeUpgradeMutation.mutate(selectedPlan)}
                  isLoading={stripeUpgradeMutation.isLoading}
                />
              </div>
            </div>
          </Popups>
        </ModalComponent>
      )}

      <div className="flex flex-col gap-8 w-full">
        <h2 className="text-2xl font-bold text-graphiteGray">{planName}</h2>

        {/* Dynamic Price Display */}
        <div className="flex items-end gap-2">
  <span className="text-5xl font-bold text-goldenrodYellow tracking-tight">
    {/* Safe currency */}
    {displayCurrency === 'USD' || !displayCurrency ? '$' : displayCurrency}
    {' '}
    {/* Safe price – will NEVER crash */}
    {Number(displayPrice ?? (props as any).basePrice ?? 0).toLocaleString()}
  </span>
  <span className="text-lg text-lightdark mb-1">
    /{duration === 'monthly' ? 'month' : 'year'}
  </span>
</div>

        {preferredPaymentMethod && preferredPaymentMethod === 'Paymob' && (
          <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full w-fit">
            Paymob Available
          </div>
        )}

        <p className="text-lightdark2 text-sm leading-relaxed">{planDescription}</p>

        <div className="w-full h-px bg-mistyWhite my-2"></div>

        <h4 className="font-semibold text-ebonyGray">What’s Included</h4>

        <div className="space-y-3">
          {features
            ?.split(',')
            .filter((f) => !f.includes('social') && !f.includes('daily-work'))
            .map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <Image src="/tickcyan.svg" width={20} height={20} alt="check" />
                <span className="text-ebonyGray text-sm">
                  {benefit.trim()}
                </span>
              </div>
            ))}

          {['Unlimited Social Media Posts', 'Daily Work Management'].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Image src="/tickcyan.svg" width={20} height={20} alt="check" />
              <span className="text-ebonyGray text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-6">{BTN}</div>
    </div>
  );

  return freeTrailDays ? (
    <div className="h-full">
      <Badge.Ribbon
        text={`Free Trial – ${freeTrailDays} Days`}
        color="#007AB6"
        className="text-sm font-medium"
      >
        {child}
      </Badge.Ribbon>
    </div>
  ) : (
    child
  );
};

export default SinglePlan;