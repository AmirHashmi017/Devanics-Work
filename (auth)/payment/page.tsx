'use client';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Switch } from 'antd';

// module imports
import { minHeading, secondaryHeading } from '@/globals/tailwindvariables';
import Progessbar from '@/app/component/progressBar';
import NavBar from '@/app/(pages)/(auth)/authNavbar';
// import PaypalInteration from './paypalIntegration';
import { authService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';
import TertiaryHeading from '@/app/component/headings/tertiary';
import SecondaryHeading from '@/app/component/headings/Secondary';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { useSelector } from 'react-redux';
import { HttpService } from '@/app/services/base.service';
import { useRouterHook } from '@/app/hooks/useRouterHook';
// import PaypalIntegration from './paypalIntegration';
import { usePricing } from '../usePricing';
import { AxiosError } from 'axios';
import { useUser } from '@/app/hooks/useUser';
import { displayPlanPrice } from '@/app/utils/plans.utils';
import ModalComponent from '@/app/component/modal';
import { Popups } from '../../bid-management/components/Popups';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import promoService from '@/app/services/promo.service';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const PromoCodeValidationSchema = Yup.object().shape({
  promoCode: Yup.string().required('Promo code is required'),
});

const Payment = () => {
  const router = useRouterHook();
  const [successMessage, setSuccessMessage] = useState('');
  const user = useUser();
  const token = useSelector(selectToken);
  const [showPaymobModal, setShowPaymobModal] = useState(false);
  const currencyFormatter = useCurrencyFormatter({
    currency: {
      code: 'EGP',
      symbol: 'EGP',
      locale: 'en',
      date: new Date(),
    },
  });

  useLayoutEffect(() => {
    if (token) {
      console.log(token)
      HttpService.setToken(token);
    }
  }, [token]);

  const [selectedPLan, setSelectedPLan] = useState<IPricingPlan>();
  const [autoRenew, setAutoRenew] = useState(true);
  const pricingHook = usePricing();

  const promoCodeMutation = useMutation(
    ['apply', 'promocode'],
    (values: { promoCode: string }) =>
      promoService.httpApplyPromoCode({
        ...values,
        originalPrice: selectedPLan?.egpPrice || 0,
      }),
    {
      onError(error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to apply promo code');
      },
    }
  );

  const promoFormik = useFormik({
    initialValues: {
      promoCode: '',
    },
    onSubmit(values) {
      promoCodeMutation.mutate(values);
    },
    validationSchema: PromoCodeValidationSchema,
  });

  useEffect(() => {
    let pricingPlan = pricingHook.getValueFromStorage();
    if (!pricingPlan) {
      router.push('/plans');
      pricingHook.clearStorage();
    }
    setSelectedPLan(pricingPlan);
  }, []);

  const stripePaymentHandler = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
    if (!stripe) {
      return;
    }
    try {
      const response: any = await authService.httpStripeCheckout({
        planID: selectedPLan?._id,
        autoRenew: autoRenew,
      });
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      console.log({ stripeResult: result });
      if (result.error) {
        toast.error('Something went wrong');
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log({ err });
      toast.error(err.response?.data.message);
    }
  };

  async function handlePaymobCardPayment(discountedPrice?: number) {
    try {
      const response = await authService.httpPaymobCheckout({
        planID: selectedPLan?._id,
        autoRenew: autoRenew,
        price: discountedPrice,
      });
      if (response.data) {
        window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${response.data.client_secret}`;
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    }
  }

  return (
    <>
      <NavBar />
      {/* Paymob Modal */}
      <ModalComponent open={showPaymobModal} setOpen={setShowPaymobModal}>
        <Popups title="Checkout" onClose={() => setShowPaymobModal(false)}>
          <div className="flex bg-white rounded-lg flex-col gap-5  rounded-s max-w-lg w-full p-6">
            <div>
              <TertiaryHeading title="Subscribe to" />
              <SecondaryHeading
                title={selectedPLan?.planName!}
                className="!text-[#101828]"
              />
            </div>
            {selectedPLan && selectedPLan.egpPrice ? (
              <div className="flex items-center">
                <span className="tracking-[-0.72px] font-semibold text-[40px] leading-[52px] !text-goldenrodYellow">
                  {selectedPLan ? displayPlanPrice(selectedPLan, 'EG') : null}
                </span>
                <p
                  className={`${minHeading} !text-[18px] !text-[#98A2B3]  font-normal`}
                >
                  /{selectedPLan?.duration}
                </p>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <label className="text-4 text-[#6A6A6A]">
                Promo Code (Optional)
              </label>
              <input
                className="border border-doveGray px-3 py-4 rounded-md"
                type="text"
                name="promoCode"
                placeholder="Enter Promo Code"
                value={promoFormik.values.promoCode}
                onChange={promoFormik.handleChange}
                onBlur={promoFormik.handleBlur}
              />
              {promoFormik.errors.promoCode && (
                <p className="text-red-500 text-xs">
                  {promoFormik.errors.promoCode}
                </p>
              )}
              <CustomButton
                text="Apply"
                className="!w-fit"
                onClick={promoFormik.handleSubmit}
              />
            </div>
            <div className="">
              <div className="flex align-center justify-between border-b-[1px] py-4">
                <p className="text-[#667085] text-[18px]">Plan Price</p>
                <h6 className="text-[#1D2939] text-[18px]">
                  {selectedPLan ? displayPlanPrice(selectedPLan, 'EG') : null}
                </h6>
              </div>
              <div className="flex align-center justify-between border-b-[1px] py-4">
                <p className="text-[#667085] text-[18px]">Discount</p>
                <h6 className="text-[#1D2939] text-[18px]">
                  {promoCodeMutation.data?.data?.type === 'percentage'
                    ? `${promoCodeMutation.data?.data?.discount}%`
                    : currencyFormatter.format(
                        promoCodeMutation.data?.data?.discount || 0.0
                      )}
                </h6>
              </div>
              <div className="flex align-center justify-between border-b-[1px] py-4">
                <p className="text-[#667085] text-[18px]">Total</p>
                <h6 className="text-[#1D2939] text-[18px]">
                  {selectedPLan
                    ? currencyFormatter.format(
                        promoCodeMutation.data?.data?.discountedPrice ||
                          selectedPLan?.egpPrice ||
                          0
                      )
                    : null}
                </h6>
              </div>

              <div className="flex justify-end mt-2 gap-3">
                <WhiteButton
                  text="Cancel"
                  className="!w-fit"
                  onClick={() => setShowPaymobModal(false)}
                />
                <CustomButton
                  text="Pay"
                  className="!w-fit"
                  onClick={() =>
                    handlePaymobCardPayment(
                      promoCodeMutation.data?.data?.discountedPrice
                    )
                  }
                />
              </div>
            </div>
          </div>
        </Popups>
      </ModalComponent>

      <section className=" px-16 p-9">
        {successMessage ? (
          <div className="my-2">
            <Alert
              message="Payment Successful"
              description={successMessage}
              type="success"
              action={
                <Space direction="vertical">
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      router.push('/login');
                    }}
                  >
                    Login
                  </Button>
                </Space>
              }
              closable
              onClose={() => {
                setSuccessMessage('');
              }}
            />
          </div>
        ) : null}
        <div className="">
          <div className="space-y-2">
            <h2 className={secondaryHeading}>Payment Summary</h2>
            <p
              className={
                'text-obsidian-black font-semibold text-sm cursor-pointer underline underline-offset-4  w-fit leading-8  '
              }
              onClick={() => {
                // router.push('/plans');
                router.back();
                pricingHook.clearStorage();
              }}
            >
              Go back
            </p>
          </div>
          <div className="w-full h-0.5 bg-mistyWhite mt-4 mb-10"></div>
          <div className="flex gap-10">
            <div className="flex bg-white rounded-lg flex-col gap-5 shadow-md rounded-s max-w-lg w-full p-6">
              <div>
                <TertiaryHeading title="Subscribe to" />
                <SecondaryHeading
                  title={selectedPLan?.planName!}
                  className="!text-[#101828]"
                />
              </div>
              <div className="flex items-center">
                <span className="tracking-[-0.72px] font-semibold text-[40px] leading-[52px] !text-goldenrodYellow">
                  {selectedPLan ? displayPlanPrice(selectedPLan) : null}
                </span>
                <p
                  className={`${minHeading} !text-[18px] !text-[#98A2B3]  font-normal`}
                >
                  /{selectedPLan?.duration}
                </p>
              </div>
              {selectedPLan && selectedPLan.egpPrice ? (
                <div className="flex items-center">
                  <span className="tracking-[-0.72px] font-semibold text-[40px] leading-[52px] !text-goldenrodYellow">
                    {selectedPLan ? displayPlanPrice(selectedPLan, 'EG') : null}
                  </span>
                  <p
                    className={`${minHeading} !text-[18px] !text-[#98A2B3]  font-normal`}
                  >
                    /{selectedPLan?.duration}
                  </p>
                </div>
              ) : null}
              {/* <div className="flex flex-col">
                <label className="text-4 text-[#6A6A6A] mb-2">Promo Code</label>
                <input
                  className="border border-doveGray px-3 py-4 rounded-md"
                  type="text"
                  placeholder="Enter Promo Code"
                />
              </div> */}
              <div className="">
                <div className="flex align-center justify-between border-b-[1px] py-4">
                  <p className="text-[#667085] text-[18px]">Plan Price</p>
                  <h6 className="text-[#1D2939] text-[18px]">
                    {selectedPLan
                      ? displayPlanPrice(selectedPLan, user?.country)
                      : null}
                  </h6>
                </div>
                <div className="flex align-center justify-between border-b-[1px] py-4">
                  <p className="text-[#667085] text-[18px]">Discount</p>
                  <h6 className="text-[#1D2939] text-[18px]">00.00</h6>
                </div>
                <div className="flex align-center justify-between border-b-[1px] py-4">
                  <p className="text-[#667085] text-[18px]">Total</p>
                  <h6 className="text-[#1D2939] text-[18px]">
                    {selectedPLan
                      ? displayPlanPrice(selectedPLan, user?.country)
                      : null}
                  </h6>
                </div>
                {/* <h5 className="text-[#1D2939] text-[18px] mt-4">$40.00</h5> */}
              </div>
            </div>
            <div className="w-full flex flex-col">
              <div className="flex align-center justify-between">
                <SecondaryHeading
                  title="Select Payment Method"
                  className="!text-[#344054]"
                />
                <div className="flex align-center gap-3">
                  <p className="text-[#667085] text-[16px]">
                    Enable auto-payment to renew subscription
                  </p>

                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                    onChange={(checked) => setAutoRenew(checked)}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <div
                  className="h-52 flex flex-col justify-center items-center gap-2 w-full shadow-md  my-6  bg-white rounded-lg cursor-pointer"
                  onClick={stripePaymentHandler}
                >
                  <Image
                    src={'/stripe.svg'}
                    alt={'stripe icon'}
                    width={190}
                    height={80}
                  />
                  <p className="text-sm text-schestiLightBlack">
                    We accept Visa, MasterCard, American Express and other major
                    credit and debit cards.
                  </p>
                </div>

                <div
                  className="h-52 flex flex-col justify-center items-center gap-2 w-full shadow-md  my-6  bg-white rounded-lg cursor-pointer"
                  onClick={() => setShowPaymobModal(true)}
                >
                  <Image
                    src={'/paymobLogo.png'}
                    alt={'paymobLogo icon'}
                    width={190}
                    height={80}
                  />
                  <p className="text-sm text-schestiLightBlack">
                    We accept Visa, MasterCard, American Express and other major
                    credit and debit cards.
                  </p>
                </div>
                {/* <div className="h-52 grid place-items-center bg-white w-full shadow-md   rounded-s">
                  {selectedPLan ? (
                    <PaypalIntegration
                      autoRenew={autoRenew}
                      selectedPlan={selectedPLan}
                      setMessage={setSuccessMessage}
                    />
                  ) : null}

                  
                </div> */}
              </div>
            </div>
          </div>

          <Progessbar progress={'75%'} step={3} className="mt-12" />
        </div>
      </section>
    </>
  );
};

export default Payment;
