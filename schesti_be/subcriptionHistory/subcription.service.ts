import { ResponseMessage } from '../../enums/resMessage.enum';
import SubcriptionHistory from './subcriptionHistory.model';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import { Request } from 'express';
import Users from '../../modules/user/user.model';
import { stripe } from '../../helper/stripe.helper';
import PricingPlans from '../../modules/pricingPlans/pricingPlan.model';
import Stripe from 'stripe';

class SubcriptionHistoryService {
  async subcriptionHistories() {
    const subcriptions = await SubcriptionHistory.find({})
      .populate('planId')
      .populate('user')
      .sort({ createdAt: -1 });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { subcriptions },
    };
  }

  async getUserSubscriptions(req: Request) {
    const { _id } = req.payload;
    const user = await Users.findById(_id);

    if (!user) {
      return {
        message: ResponseMessage.SUBSCRIPTION_NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: [],
      };
    }
    let result = [];

    if (user.stripeCustomerId) {
      const invoices = await this.getAllInvoices(user.stripeCustomerId);

      const data = invoices.map(async (invoice) => {
        const line: any = invoice.lines.data[0];
        const planId = line.price.product as string;
        const plan = await stripe.products.retrieve(planId, {});
        return {
          transactionId: invoice.id,
          planName: plan.name,
          // will be updated later
          type: 'Stripe',
          periodStart: new Date(line.period.start * 1000).toISOString(),
          periodEnd: new Date(line.period.end * 1000).toISOString(),
          amount: Math.floor(
            (line.amount - line.discount_amounts[0]?.amount || 0) / 100
          ),
          currency: line.price.currency,
        };
      });
      result = await Promise.all(data);
    }

    const freeSubscriptions = await SubcriptionHistory.find({
      user: _id,
      paymentMethod: 'None',
    }).populate('planId');

    const freeSubscriptionsData = freeSubscriptions.map((subscription) => {
      return {
        transactionId: subscription._id,
        // @ts-ignore
        planName: subscription.planId.planName,
        type: 'Free',
        // @ts-ignore
        periodStart: subscription.currentPeriodStart,
        // @ts-ignore
        periodEnd: subscription.canceledAt
          ? // @ts-ignore
            subscription.canceledAt
          : // @ts-ignore
            subscription.currentPeriodEnd,
        amount: 0,
        currency: 'USD',
      };
    });
    const paymobSubscriptions = await SubcriptionHistory.find({
      user: _id,
      paymentMethod: 'Paymob',
    }).populate('planId');

    const paymobSubscriptionsData = paymobSubscriptions.map((subscription) => {
      return {
        transactionId: subscription._id,
        // @ts-ignore
        planName: subscription.planId.planName,
        type: 'Paymob',
        // @ts-ignore
        periodStart: subscription.currentPeriodStart,
        // @ts-ignore
        periodEnd: subscription.canceledAt
          ? // @ts-ignore
            subscription.canceledAt
          : // @ts-ignore
            subscription.currentPeriodEnd,
        amount: subscription.amount,
        currency: 'EGP',
      };
    });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: result
        .concat(freeSubscriptionsData)
        .concat(paymobSubscriptionsData),
    };
  }

  private async getAllInvoices(customerId: string) {
    let allInvoices: Stripe.Invoice[] = [];
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 100, // Stripe's maximum limit per request is 100
        starting_after: startingAfter ? startingAfter : undefined,
      });

      allInvoices = allInvoices.concat(invoices.data);
      hasMore = invoices.has_more;
      if (hasMore) {
        startingAfter = invoices.data[invoices.data.length - 1].id;
      }
    }

    return allInvoices;
  }
}

export default new SubcriptionHistoryService();
