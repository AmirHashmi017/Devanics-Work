import { NextFunction, Request, Response } from 'express';
import PricingPlans from '../../modules/pricingPlans/pricingPlan.model';
import SubscriptionHistory from '../../modules/subcriptionHistory/subcriptionHistory.model';
import Users from '../../modules/user/user.model';
import { config } from '../../config/config';
import { render } from '@react-email/render';
import NewSubscriptionPlanPurchaseEmail from '../../emails/auth/NewSubscriptionPlanPurchaseEmail';
import moment from 'moment';
import { ResponseMessage } from '../../enums/resMessage.enum';
import { EMails } from '../../contants/EMail';
import { sendEmail as sendEmailViaMailchimp } from '../../helper/mailship';
import SignUpEmail from '../../emails/auth/SignUpEmail';
import { PaymobTransaction } from './types';
import SubscriptionCancellationEmail from '../../emails/auth/SubscriptionCancellationEmail';
import { cancelUserSubscriptionOnPaymob } from '.';

type SubscriptionWebhook = {
  subscription_data: {
    id: number;
    client_info: {
      email: string;
      full_name: string;
      phone_number: string;
    };
    frequency: number;
    created_at: string;
    updated_at: string;
    name: string;
    reminder_days: number | null;
    retrial_days: number | null;
    plan_id: number;
    state: 'active';
    amount_cents: number;
    starts_at: string;
    next_billing: string;
    reminder_date: string | null;
    ends_at: string | null;
    resumed_at: string | null;
    suspended_at: string | null;
    webhook_url: string;
    integration: number;
    initial_transaction: number;
  };
  transaction_id: number;
  trigger_type: 'Subscription Created' | 'suspended';
  hmac: string;
  paymob_request_id: string;
  card_data: {
    token: string;
    masked_pan: string;
  };
};

export async function paymobWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body = req.body as SubscriptionWebhook | PaymobTransaction;
  console.log('paymobWebhook called', req.body);
  console.log(
    'paymobWebhook called Extras',
    req.body?.obj?.payment_key_claims?.extra
  );

  if ('trigger_type' in body && body.trigger_type === 'Subscription Created') {
    const user = await Users.findOne({
      email: body.subscription_data.client_info.email,
    });

    if (user) {
      const plan = await PricingPlans.findOne({
        'paymob.id': body.subscription_data.plan_id,
      });

      if (plan) {
        const subscriptionHistroy = await SubscriptionHistory.create({
          planId: plan._id,
          user: user._id,
          customerId: '',
          paymentMethod: 'Paymob',
          status: 'active',
          currentPeriodStart: body.subscription_data.created_at,
          currentPeriodEnd: body.subscription_data.next_billing,
          subscriptionId: body.subscription_data.id,
          amount: body.subscription_data.amount_cents / 100,
        });
        user.subscription = subscriptionHistroy._id as any;

        await user.save();

        try {
          // Email message options
          const userPromise = sendEmailViaMailchimp({
            to: user.email,
            subject: 'Subscription Started',
            html: render(
              NewSubscriptionPlanPurchaseEmail({
                user: {
                  name: user.name,
                  email: user.email,
                },
                plan: {
                  name: plan.planName,
                  startDate: moment(body.subscription_data.created_at).format(
                    'MM-DD-YYYY hh:mm:ss'
                  ),
                  endDate: moment(body.subscription_data.next_billing).format(
                    'MM-DD-YYYY hh:mm:ss'
                  ),
                  price: body.subscription_data.amount_cents / 100,
                  automaticRenewal: user.isAutoPayment,
                  nextBillingDate: moment(
                    body.subscription_data.next_billing
                  ).format('MM-DD-YYYY hh:mm:ss'),
                },
                cardTitle: 'Subscription Started',
                currency: 'EGP',
                locale: 'en-GB',
              })
            ),
          });

          const adminPromise = sendEmailViaMailchimp({
            to: config.ADMIN_MAIL,
            subject: ResponseMessage.SUBCRIPTION_EMAIL,
            html: EMails['ADMIN_SUBCRIPTION']({
              name: plan.planName,
              email: user.email,
            }),
          });

          await Promise.all([userPromise, adminPromise]);
          try {
            // Email message options
            await sendEmailViaMailchimp({
              to: user.email,
              subject: 'Welcome to Schesti Technologies, Inc.',
              html: render(
                SignUpEmail({
                  user: {
                    email: user.email,
                    name: user.name,
                  },
                })
              ),
            });
            console.log('Email sent successfully', SignUpEmail.name);
          } catch (error) {
            console.log('error from sending email', SignUpEmail.name, error);
          }
        } catch (error) {
          console.log(
            'Error While sending subscription email to user and admin in Paymob webhook',
            error
          );
        }
      }
    }
  }
  // if it is transaction
  else if ('type' in body && body.type === 'TRANSACTION') {
    if (body.obj.payment_key_claims && body.obj.payment_key_claims.extra) {
      const extras = body.obj.payment_key_claims.extra;
      if ('oldSubscription' in extras) {
        console.log('CANCELING OLD SUBSCRIPTION');
        // That means we have to cancel the old plan
        const oldSubscription = await SubscriptionHistory.findById(
          extras.oldSubscription
        );
        if (oldSubscription) {
          const userDetail = await Users.findById(oldSubscription.user);
          const selectedPlan = await PricingPlans.findById(extras.planId);
          try {
            const canceledSubscription = await cancelUserSubscriptionOnPaymob(
              Number(oldSubscription.subscriptionId)
            );
            console.log(
              'RESPONSE FROM PAYMOB ON CANCELED SUBSCRIPTION',
              canceledSubscription
            );
            await sendEmailViaMailchimp({
              to: userDetail.email,
              subject:
                'Your Previous Subscription Plan Has Been Successfully Canceled!',
              html: render(
                SubscriptionCancellationEmail({
                  user: {
                    name: userDetail.name,
                  },
                  plan: {
                    name: selectedPlan.planName,
                  },
                })
              ),
            });
            console.log('SUBSCRIPTION CANCELED ON PAYMOB');
          } catch (error) {
            console.log(
              'Error sending email on subscription Cancelation at Paymob',
              error
            );
          }
        }
      }
    }
  }
  res.status(200).json({ message: 'success' });
  next();
}
