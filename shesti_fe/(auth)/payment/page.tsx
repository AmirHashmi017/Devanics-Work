'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Switch } from 'antd';
import { loadStripe } from '@stripe/stripe-js';

// Components & Hooks
import NavBar from '@/app/(pages)/(auth)/authNavbar';
import Progessbar from '@/app/component/progressBar';
import TertiaryHeading from '@/app/component/headings/tertiary';
import SecondaryHeading from '@/app/component/headings/Secondary';
import ModalComponent from '@/app/component/modal';
import { Popups } from '../../bid-management/components/Popups';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';

// Services & Utils
import { authService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { usePricing } from '../usePricing';
import { useUser } from '@/app/hooks/useUser';
import { HttpService } from '@/app/services/base.service';
import { selectToken } from '@/redux/authSlices/auth.selector';
import { useSelector } from 'react-redux';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Payment = () => {
  const router = useRouterHook();
  const user = useUser();
  const token = useSelector(selectToken);
  const pricingHook = usePricing();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [showPaymobModal, setShowPaymobModal] = useState(false);

  // Load plan from storage (set in /plans page)
  useEffect(() => {
    const plan = pricingHook.getValueFromStorage();
    if (!plan) {
      toast.error('No plan selected');
      router.push('/plans');
      return;
    }
    setSelectedPlan(plan);
  }, []);

  // Set auth token
  useEffect(() => {
    if (token) HttpService.setToken(token);
  }, [token]);

  // Safe price display
  const getPrice = () => {
    if (!selectedPlan) return '0';
    const price = Number(selectedPlan.displayPrice ?? selectedPlan.basePrice ?? 0);
    const currency = selectedPlan.displayCurrency || selectedPlan.baseCurrency || 'USD';
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${price.toLocaleString()}`;
  };

  const getCurrencySymbol = () => {
    const currency = selectedPlan?.displayCurrency || selectedPlan?.baseCurrency || 'USD';
    return currency === 'USD' ? '$' : currency;
  };

  // Stripe Checkout
  const handleStripePayment = async () => {
  const stripe = await stripePromise;
  if (!stripe || !selectedPlan) return;

  try {
    const res = await authService.httpStripeCheckout({
      planID: selectedPlan._id,
      autoRenew,
    });

    // SAFE WAY — no TypeScript errors, works with any field name
    const sessionId = 
      (res.data as any)?.sessionId || 
      (res.data as any)?.session_id || 
      (res.data as any)?.id || 
      (res.data as any)?.checkoutSessionId;

    if (!sessionId) {
      toast.error('Payment session not received. Please try again.');
      console.error('Stripe response:', res.data);
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: sessionId as string,
    });

    if (result.error) {
      toast.error(result.error.message || 'Failed to redirect to checkout');
    }
  } catch (err: any) {
    console.error('Stripe error:', err);
    toast.error(
      err.response?.data?.message || 
      err.message || 
      'Payment failed. Please try again.'
    );
  }
};

  // Paymob Checkout
  const handlePaymobPayment = async () => {
    if (!selectedPlan) return;

    try {
      const res = await authService.httpPaymobCheckout({
        planID: selectedPlan._id,
        autoRenew,
        // You can pass discounted price later when promo is added
      });

      window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${res.data?.client_secret}`;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Paymob checkout failed');
    }
  };

  if (!selectedPlan) return null;

  const isPaymobPreferred = selectedPlan.preferredPaymentMethod === 'Paymob';
  const isStripePreferred = selectedPlan.preferredPaymentMethod === 'Stripe';

  return (
    <>
      <NavBar />

      {/* Paymob Confirmation Modal */}
      <ModalComponent open={showPaymobModal} setOpen={setShowPaymobModal} width="600px">
        <Popups title="Confirm Payment" onClose={() => setShowPaymobModal(false)}>
          <div className="p-6 text-center space-y-6">
            <div>
              <TertiaryHeading title="Subscribe to" />
              <SecondaryHeading title={selectedPlan.planName} className="!text-[#101828]" />
            </div>

            <div className="text-5xl font-bold text-goldenrodYellow">
              {getPrice()}
              <span className="text-2xl text-gray-500 ml-2">
                /{selectedPlan.duration === 'monthly' ? 'month' : 'year'}
              </span>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Plan Price</span>
                <span className="font-medium">{getPrice()}</span>
              </div>
              <div className="flex justify-between py-3 border-b font-semibold text-lg">
                <span>Total Due Today</span>
                <span>{getPrice()}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <WhiteButton text="Cancel" onClick={() => setShowPaymobModal(false)} />
              <CustomButton text="Pay with Card" onClick={handlePaymobPayment} />
            </div>
          </div>
        </Popups>
      </ModalComponent>

      <section className="px-16 py-9 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Payment Summary</h2>
          <button
            onClick={() => {
              router.back();
              pricingHook.clearStorage();
            }}
            className="text-blue-600 underline text-sm"
          >
            Go back
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 my-8" />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Plan Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <TertiaryHeading title="Subscribe to" />
              <SecondaryHeading title={selectedPlan.planName} className="!text-[#101828]" />
            </div>

            <div className="text-5xl font-bold text-goldenrodYellow">
              {getPrice()}
              <span className="text-2xl text-gray-500 ml-3">
                /{selectedPlan.duration === 'monthly' ? 'month' : 'year'}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Plan Price</span>
                <span className="font-semibold">{getPrice()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t">
                <span>Total</span>
                <span>{getPrice()}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Methods */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <SecondaryHeading title="Select Payment Method" className="!text-[#344054]" />
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Auto-renew</span>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={autoRenew}
                  onChange={setAutoRenew}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Stripe Card */}
              {isStripePreferred || !isPaymobPreferred ? (
                <div
                  onClick={handleStripePayment}
                  className="cursor-pointer bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow"
                >
                  <Image src="/stripe.svg" alt="Stripe" width={200} height={80} />
                  <p className="text-gray-600 mt-4">
                    Pay with Visa, MasterCard, Amex & more
                  </p>
                </div>
              ) : null}

              {/* Paymob Card */}
              {isPaymobPreferred ? (
                <div
                  onClick={() => setShowPaymobModal(true)}
                  className="cursor-pointer bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow"
                >
                  <Image src="/paymobLogo.png" alt="Paymob" width={200} height={80} />
                  <p className="text-gray-600 mt-4">
                    Pay with local cards (Egypt, KSA, UAE, etc)
                  </p>
                </div>
              ) : null}

              {/* Fallback if no payment method */}
              {!isStripePreferred && !isPaymobPreferred && (
                <div className="text-center text-gray-500 py-12">
                  No payment method available for your region.
                </div>
              )}
            </div>
          </div>
        </div>

        <Progessbar progress="75%" step={3} className="mt-16" />
      </section>
    </>
  );
};

export default Payment;