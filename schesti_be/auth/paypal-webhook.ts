import { Request, Response } from 'express';

import { config } from '../../config/config';
import axios from 'axios';
import { BasePaypal } from '../../helper/paypal/base';
import Users from '../../modules/user/user.model';
import SubscriptionHistory from '../../modules/subcriptionHistory/subcriptionHistory.model';
import moment from 'moment';
import PricingPlans from '../../modules/pricingPlans/pricingPlan.model';
import { render } from '@react-email/render';
import NewSubscriptionPlanPurchaseEmail from '../../emails/auth/NewSubscriptionPlanPurchaseEmail';
import { ResponseMessage } from '../../enums/resMessage.enum';
import { EMails } from '../../contants/EMail';
import SESMail from '../../helper/SESMail';
import * as paypal from '../../helper/paypal';

class VerifyPaypalWebhookService extends BasePaypal {
  async verify(req: Request, payload: any) {
    console.log('Token', this.accessToken);
    const url =
      'https://api-m.paypal.com/v1/notifications/verify-webhook-signature';
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    console.log('RESPONSE', response.data);
    return response.data;
  }
}
// const VerifyWebhook = new VerifyPaypalWebhookService();
// console.log("Got Paypal Notification");
// const payload = {
//     transmission_id: headers['paypal-transmission-id'],
//     transmission_time: headers['paypal-transmission-time'],
//     cert_url: headers['paypal-cert-url'],
//     auth_algo: headers['paypal-auth-algo'],
//     transmission_sig: headers['paypal-transmission-sig'],
//     webhook_id: config.PAYPAL_WEBHOOK_ID, // Your webhook ID
//     webhook_event: {
//         event_version: event.event_version,
//         resource_version: event.resource_version,
//     },
// };
export type PayPalEventType =
  | 'BILLING.SUBSCRIPTION.CREATED'
  | 'BILLING.SUBSCRIPTION.ACTIVATED'
  | 'PAYMENT.SALE.COMPLETED';

export interface PayPalEvent<T> {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: PayPalEventType;
  summary?: string;
  resource: T;
  links: PayPalLink[];
}

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
  encType?: string;
}

// 1. Subscription Created Resource
export interface SubscriptionCreatedResource {
  id: string;
  plan_id: string;
  status: 'APPROVAL_PENDING' | 'ACTIVE';
  start_time: string;
  quantity: string;
  plan_overridden: boolean;
  create_time: string;
  subscriber: SubscriberInfo;
  links: PayPalLink[];
}

interface SubscriberInfo {
  email_address: string;
  name: {
    given_name: string;
    surname: string;
  };
  payer_id: string;
}

// 2. Payment Sale Completed Resource
export interface PaymentSaleCompletedResource {
  id: string;
  state: 'completed';
  amount: {
    total: string;
    currency: string;
    details: {
      subtotal: string;
    };
  };
  payment_mode: 'INSTANT_TRANSFER';
  transaction_fee: {
    currency: string;
    value: string;
  };
  protection_eligibility: string;
  protection_eligibility_type: string;
  billing_agreement_id: string;
  invoice_number: string;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

// 3. Subscription Activated Resource
export interface SubscriptionActivatedResource {
  id: string;
  plan_id: string;
  status: 'ACTIVE';
  quantity: string;
  plan_overridden: boolean;
  create_time: string;
  start_time: string;
  update_time: string;
  subscriber: SubscriberInfo;
  billing_info: BillingInfo;
  links: PayPalLink[];
}

interface BillingInfo {
  outstanding_balance: CurrencyAmount;
  cycle_executions: CycleExecution[];
  last_payment?: {
    amount: CurrencyAmount;
    time: string;
  };
  next_billing_time: string;
  failed_payments_count: number;
}

interface CycleExecution {
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  cycles_completed: number;
  cycles_remaining: number;
  current_pricing_scheme_version: number;
  total_cycles: number;
}

interface CurrencyAmount {
  currency_code: string;
  value: string;
}

// Union Type for All Event Resources
export type PayPalEventResource =
  | SubscriptionCreatedResource
  | SubscriptionActivatedResource
  | PaymentSaleCompletedResource;

// Main Event Type with Generic Handling
export type PayPalWebhookEvent = PayPalEvent<PayPalEventResource>;

export async function paypalWebhook(req: Request, res: Response) {
  try {
    const { headers } = req;
    const event = req.body as PayPalWebhookEvent;

    console.log('event_type', event.event_type);
    console.log('event_resource', JSON.stringify(event.resource));

    switch (event.event_type) {
      /**
       * A subscription has been created. The status of the subscription is `pending` until the first payment is made.
       * The subscription will be automatically activated when the first payment is successful.
       */
      case 'BILLING.SUBSCRIPTION.CREATED':
        {
          const resource = event.resource as SubscriptionCreatedResource;
        }
        break;
      /**
       * A payment has been completed successfully.
       */
      case 'PAYMENT.SALE.COMPLETED':
        {
        }
        break;
      /**
       * A subscription has been activated.
       */
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        {
          const resource = event.resource as SubscriptionActivatedResource;
          const user: any = await Users.findOne({
            subscriptionId: resource.id,
          });

          if (user) {
            try {
              const isTrialing = checkTrialExecuting(resource);

              // console.log("Is Trial active", isTrialing);

              const plan = await PricingPlans.findOne({
                paypalPlanId: resource.plan_id,
              });

              const subcriptionHistory = new SubscriptionHistory({
                customerId: resource.subscriber.payer_id,
                paymentMethod: 'PayPal',
                subscriptionId: resource.id,
                planId: plan._id.toString(),
                amount: resource.billing_info.last_payment
                  ? Number(resource.billing_info.last_payment.amount.value)
                  : 0.0,
                user: user._id.toString(),
                status: 'active',
                //  "start_time": "2024-10-28T10:35:17Z",
                currentPeriodStart: moment(resource.start_time).toDate(),
                currentPeriodEnd: moment(
                  resource.billing_info.next_billing_time
                ).toDate(),
              });

              user.isPaymentConfirm = true;
              user.subscription = subcriptionHistory._id;
              user.subscriptionId = resource.id;
              user.method = 'Paypal';
              if (isTrialing) {
                user.trial = {
                  startDate: moment(resource.start_time).toDate(),
                  endDate: moment(
                    resource.billing_info.next_billing_time
                  ).toDate(),
                };
              }

              await user.save();

              const userMailOptions = {
                to: user.email,
                subject: isTrialing ? 'Trial Started' : 'Subscription Started',
                html: render(
                  NewSubscriptionPlanPurchaseEmail({
                    user: {
                      name: user.name,
                      email: user.email,
                    },
                    plan: {
                      name: plan.planName,
                      startDate: moment(resource.start_time).format(
                        'DD-MM-YYYY hh:mm:ss'
                      ),
                      endDate: moment(
                        resource.billing_info.next_billing_time
                      ).format('MM-DD-YYYY hh:mm:ss'),
                      price: isTrialing ? 0 : Number(plan.price),
                      automaticRenewal: user.isAutoPayment,
                      nextBillingDate: moment(
                        resource.billing_info.next_billing_time
                      ).format('MM-DD-YYYY hh:mm:ss'),
                    },
                    cardTitle: isTrialing ? 'Trial Started' : undefined,
                  })
                ),
              };

              const adminMailOptions = {
                to: config.ADMIN_MAIL,
                subject: ResponseMessage.SUBCRIPTION_EMAIL,
                html: EMails['ADMIN_SUBCRIPTION']({
                  name: plan.planName,
                  email: user.email,
                }),
              };

              const userPromise = SESMail.sendMail(userMailOptions);
              const adminPromise = SESMail.sendMail(adminMailOptions);

              await Promise.all([userPromise, adminPromise]);
              // if (!isTrialing && user.isAutoPayment) {
              //     await paypal.PaypalSubscription.suspend(user.subscriptionId, "The user turned off subscription");
              // }
            } catch (error) {
              console.log('Error In paypal active event', error);
            }
          }
        }
        break;
      default:
        break;
    }
    return res.status(200).send('Webhook verified');
  } catch (error) {
    console.log('error paypal webhook', error?.response?.data);
    res.status(500).send('Internal server error');
  }
}

function checkTrialExecuting(resource: SubscriptionActivatedResource) {
  const trialCycle = resource.billing_info.cycle_executions.find(
    (cycle) => cycle.tenure_type === 'TRIAL'
  );
  if (trialCycle) {
    if (trialCycle.cycles_remaining > 0) {
      return true;
    } else {
      // If no remaining cycles, check next billing time
      const nextBillingTime = moment(resource.billing_info.next_billing_time);
      const currentTime = moment();

      // If current time is before next billing time, the trial is over
      return currentTime.isBefore(nextBillingTime);
    }
  }

  return false;
}
