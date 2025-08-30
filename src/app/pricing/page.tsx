'use client';
import { LandingNavbar } from '../component/navbar/LandingNavbar';
import ToggleBtn from '@/app/(pages)/settings/plans/plans/components/toggleBtn';
import SwitchBtn from '@/app/(pages)/settings/plans/plans/components/switchbtn';
import LandingFooter from '../component/footer/LandingFooter';
import { Collapse, ConfigProvider, Skeleton, theme } from 'antd';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { IPricingPlan } from '../interfaces/pricing-plan.interface';
import {
  selectPricingPlans,
  selectPricingPlansError,
  selectPricingPlansLoading,
} from '@/redux/pricingPlanSlice/pricingPlan.selector';
import { fetchPricingPlan } from '@/redux/pricingPlanSlice/pricingPlan.thunk';
import SinglePlan from '../(pages)/settings/plans/plans/components/plan/plan';
import { GatewayToEfficiency } from '../component/landing/GatewayToEfficiency';
import { RequestForPost } from '../component/landing/RequestForPost';
import { useRouterHook } from '../hooks/useRouterHook';

export default function PricingPage() {
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };
  const [planType, setPlanType] = useState('Individual');
  const dispatch = useDispatch<AppDispatch>();
  const [pricingPlansData, setPricingPlansData] = useState(
    [] as IPricingPlan[]
  );
  const [isDuration, setIsDuration] = useState('monthly');
  const router = useRouterHook();
  const plansData = useSelector(selectPricingPlans);
  const isLoading = useSelector(selectPricingPlansLoading);
  const isError = useSelector(selectPricingPlansError);

  const handlePlanType = (event: ChangeEvent<HTMLInputElement>) => {
    const currentPlanType = event.target.checked ? 'Individual' : 'Enterprise';
    const newPlansData = plansData.pricingPlans.filter(
      ({ type, duration }: IPricingPlan) =>
        type === currentPlanType && duration === isDuration
    );
    setPlanType(currentPlanType);
    setPricingPlansData(newPlansData);
  };

  const handlePlanDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const currentPlanDuration = event.target.checked ? 'yearly' : 'monthly';
    const newPlansData = plansData.pricingPlans.filter(
      ({ duration, type }: IPricingPlan) =>
        duration === currentPlanDuration && type === planType
    );
    setIsDuration(currentPlanDuration);
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

  useEffect(() => {
    pricingPlansHandler();
  }, []);

  return (
    <section>
      <main
        style={{
          background: 'linear-gradient(180deg, #8449EB 0%, #6A56F6 100%)',
        }}
        className="h-[501px] relative"
      >
        <LandingNavbar />
        <div className="mt-[101px] xl:mx-auto xl:w-[1063px]">
          <h1 className="text-center font-extrabold text-white text-[48px] leading-[57px] xl:text-[64px] xl:leading-[80px]">
            Pricing
          </h1>
          <p className="text-center text-white xl:w-[774px] leading-[30px] text-[18px] xl:leading-[44px] font-light xl:text-[24px] xl:mx-auto my-[26px]">
            Pricing built for businesses of all sizes.
            <br />
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </main>

      <div className="px-[20px] lg:px-[100px] xl:px-[200px] mt-[50px] xl:mt-[151px]">
        <div className="xl:w-[966.356px] xl:mx-auto">
          <h3 className="text-[#EF9F28] text-center text-[24px] font-medium leading-[32px]">
            Craft Your Success
          </h3>
          <h1 className="mx-auto text-[#1D2939] text-center font-bold mt-[15px] leading-[48px] text-[36.121px]">
            Exclusive Schesti Subscriptions, A gateway to Unparalleled
            Excellence in Field Service Dynamics.
          </h1>
        </div>

        <div className="pt-[65px]">
          <div>
            <div className="flex  align-items-center justify-center">
              <ToggleBtn planType={planType} onChange={handlePlanType} />
            </div>
            <div className="flex mt-[32px] justify-center items-center">
              <SwitchBtn
                isDuration={isDuration}
                onChange={handlePlanDuration}
              />
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <Skeleton />
            ) : isError ? (
              <p>Something Went Wrong</p>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 sm:grid-cols-2 gap-5">
                {pricingPlansData?.map(
                  (plan: IPricingPlan, index: React.Key | null | undefined) => {
                    return (
                      <SinglePlan
                        key={index}
                        {...plan}
                        setSelectedPlan={() => {
                          router.push('/register');
                        }}
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <RequestForPost />

      <div className="py-20 px-[20px] lg:px-[100px] xl:px-[200px]">
        <h3 className="text-[#EF9F28] text-center text-[24px] font-medium leading-[32px]">
          FAQ
        </h3>
        <h1 className="text-center font-bold pt-[20px] text-[36px] leading-[44px] xl:text-[40px] xl:leading-[60px] text-[#1D2939]">
          {"You've"} got questions. {"We've"} got answers.
        </h1>

        <div className="p-2 rounded-lg mt-[57px]">
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  headerBg: 'white',
                },
              },
            }}
          >
            <Collapse
              bordered={false}
              style={{ background: token.colorBgContainer }}
              items={[
                {
                  key: '0',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      How do I update my payment information?
                    </h3>
                  ),
                  children: (
                    <p>
                      {` Updating your payment information is quick and easy. Simply log in to your account and navigate to the "Payment Settings" or "Billing Information" section. From there, you can update your credit card details, billing address, or preferred payment method. Ensure that all information entered is accurate and up-to-date to avoid any payment processing issues. If you encounter any difficulties or require assistance, our customer support team is available to guide you through the process and address any concerns you may have.`}
                    </p>
                  ),
                  style: panelStyle,
                },
                {
                  key: '1',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      What payment methods do you accept?
                    </h3>
                  ),
                  children: (
                    <p>
                      We accept payments through major credit cards, including
                      Visa, Mastercard, and American Express. Additionally, we
                      also support PayPal for secure online transactions.
                    </p>
                  ),
                  style: panelStyle,
                },
                {
                  key: '2',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      How long does shipping take?
                    </h3>
                  ),
                  children: (
                    <p>
                      Shipping times vary depending on your location and the
                      shipping method chosen at checkout. Typically, orders are
                      processed and shipped within 1-2 business days. For more
                      precise delivery estimates, please refer to our shipping
                      policy.
                    </p>
                  ),
                  style: panelStyle,
                },
                {
                  key: '3',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      What is your return policy?
                    </h3>
                  ),

                  children: (
                    <p>
                      We offer a hassle-free return policy within 30 days of
                      purchase. If {"you're"} not completely satisfied with your
                      order, you can return the item(s) for a full refund or
                      exchange. Please review our return policy for detailed
                      instructions and eligibility criteria.
                    </p>
                  ),
                  style: panelStyle,
                },
                {
                  key: '4',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      How can I track my order?
                    </h3>
                  ),
                  style: panelStyle,
                  children: (
                    <p>
                      Once your order has been shipped, you will receive a
                      tracking number via email. You can use this tracking
                      number to monitor the status of your delivery and track
                      its progress until it reaches your doorstep.
                      Alternatively, you can log in to your account to view your
                      order history and track your shipments.
                    </p>
                  ),
                },
                {
                  key: '5',
                  label: (
                    <h3 className="text-[#344054] text-[17px] leading-[36px] font-normal">
                      Are your products environmentally friendly?
                    </h3>
                  ),
                  style: panelStyle,
                  children: (
                    <p>
                      We are committed to sustainability and environmental
                      responsibility. Many of our products are sourced from
                      eco-friendly materials and manufactured using
                      environmentally conscious practices. Look for our{' '}
                      {`"green"`} label on products that meet our sustainability
                      standards. For more information, please see our
                      environmental policy.
                    </p>
                  ),
                },
              ]}
              expandIconPosition="end"
            />
          </ConfigProvider>
        </div>
      </div>

      <GatewayToEfficiency />

      <LandingFooter />
    </section>
  );
}
