/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { toast } from 'react-toastify';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// module imports
import { authService } from '@/app/services/auth.service';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
// import { AxiosError } from 'axios';

interface IInitialOotions {
  clientId: any;
  currency: string;
  intent: string;
}

let initialOptions: IInitialOotions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
};
type Props = {
  selectedPlan: IPricingPlan;
  autoRenew: boolean;
  setMessage(_message: string): void;
};
const PaypalIntegration = ({ selectedPlan, autoRenew, setMessage }: Props) => {
  const createOrder = async ({
    autoRenew,
    planID,
  }: {
    autoRenew: boolean;
    planID: string;
  }) => {
    console.log('autoRenew', autoRenew, planID);
    // try {
    //   const response: any = await authService.httpPaypalCreateOrder({
    //     autoRenew: autoRenew,
    //     planID: planID,
    //   });
    //   return response.data;
    // } catch (error) {
    //   const err = error as AxiosError<{ message: string }>
    //   toast.error(err.response?.data.message);
    // }
  };

  const onApprove = async (data: {
    orderID: string;
    subscriptionID: string;
    facilitatorAccessToken?: string;
    paymentSource: string;
  }) => {
    // await authService.httpPaypalCaptureOrder(data);

    // setMessage("Your payment was successful. Please wait for confirmation email");
    setMessage('');

    // if (response.data.status === 201) {
    //   router.push('/congratulation');
    // } else {
    //   toast.error('Something went wrong');
    // }
    return Promise.resolve('success');
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: initialOptions.clientId,
        'enable-funding': 'paylater,card',
        'disable-funding': '',
        'data-sdk-integration-source': 'integrationbuilder_sc',
        vault: 'true',
        intent: 'subscription',
      }}
    >
      <PayPalButtons
        // onApprove={async (data) => await onApprove({
        //   orderID: data.orderID,
        //   paymentSource: "paypal",
        //   subscriptionID: data.subscriptionID!,
        //   facilitatorAccessToken: data.facilitatorAccessToken
        // })}
        onApprove={async (data) => {
          console.log('Approved Data', data);

          await onApprove({
            orderID: data.orderID,
            paymentSource: 'paypal',
            subscriptionID: data.subscriptionID!,
            facilitatorAccessToken: data.facilitatorAccessToken,
          });
        }}
        onError={() => {
          toast.error('Paypal Error: Unable to process payment');
        }}
        // createSubscription={async () =>
        //   await createOrder({ autoRenew, planID: selectedPlan?._id })
        // }
        style={{ layout: 'horizontal' }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalIntegration;
