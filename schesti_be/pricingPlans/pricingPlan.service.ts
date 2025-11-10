import { Request } from 'express';
import { ResponseMessage } from '../../enums/resMessage.enum';
import pricingPlanModel from './pricingPlan.model';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import { stripe } from '../../helper/stripe.helper';
import * as paypal from '../../helper/paypal';
import IPricingPlan from './pricingPlan.interface';
import Users from '../../modules/user/user.model';
import { PricingPlanDto } from './pricingPlan.dto';
import { createPaymobSubscriptionPlan } from '../../helper/paymob';
import { config } from '../../config/config';

class PricingPlanService {
  async addNewPricingPlan(req: Request) {
    const { planName, type } = req.body as PricingPlanDto;
    let pricingPlan: IPricingPlan;
    pricingPlan = await pricingPlanModel.findOne({ planName, type });
    if (pricingPlan) {
      return {
        message: ResponseMessage.ALREADY_PLAN_EXIST,
        statusCode: EHttpStatus.CONFLICT,
      };
    }
    pricingPlan = new pricingPlanModel({
      ...req.body,
    });

    if (!req.body.isInternal) {
      const stripeProduct = await stripe.products.create({
        name: pricingPlan.planName,
        description: pricingPlan.planDescription,
        id: String(pricingPlan._id),
        metadata: {
          trialDays: pricingPlan.freeTrailDays,
          planType: pricingPlan.type,
        },
      });

      const result = await createPaymobSubscriptionPlan({
        name: pricingPlan.planName,
        amount_cents: pricingPlan.egpPrice * 100,
        frequency: pricingPlan.duration === 'yearly' ? 365 : 30,
        integration: Number(config.PAYMOB_INTEGRATION_ID),
        is_active: true,
        plan_type: 'rent',
        use_transaction_amount: true,
        webhook_url: `${config.PAYMOB_WEBHOOK_END_POINT}/paymob-webhook`,
      });

      pricingPlan.paymob = result;

      const stripePrice = await stripe.prices.create({
        unit_amount: pricingPlan.price * 100,
        currency: 'usd',
        recurring: {
          interval: pricingPlan.duration === 'yearly' ? 'year' : 'month',
        },
        product: stripeProduct.id,
        metadata: {
          planId: pricingPlan._id.toString(),
        },
      });

      pricingPlan.stripeProductId = stripeProduct.id;
      pricingPlan.stripePriceId = stripePrice.id;

      if (pricingPlan.egpPrice) {
        const stripeEGPPrice = await stripe.prices.create({
          unit_amount: pricingPlan.egpPrice * 100,
          currency: 'egp',
          recurring: {
            interval: pricingPlan.duration === 'yearly' ? 'year' : 'month',
          },
          product: stripeProduct.id,
          metadata: {
            planId: pricingPlan._id.toString(),
          },
        });
        pricingPlan.stripeEGPPriceId = stripeEGPPrice.id;
      }

      // const paypalProduct = await paypal.PaypalProduct.createProduct({
      //   category: 'SOFTWARE',
      //   description: pricingPlan.planDescription,
      //   name: pricingPlan.planName,
      //   type: 'SERVICE',
      //   id: `P-${pricingPlan._id.toString()}`,
      // });

      // const billingCycles = [];
      // if (pricingPlan.freeTrailDays && pricingPlan.freeTrailDays > 0) {
      //   billingCycles.push({
      //     frequency: {
      //       interval_unit: 'DAY',
      //       interval_count: pricingPlan.freeTrailDays,
      //     },
      //     tenure_type: 'TRIAL',
      //     sequence: 1,
      //     total_cycles: 1,
      //     pricing_scheme: {
      //       fixed_price: { value: '0', currency_code: 'USD' }, // Free trial
      //     },
      //   });
      //   billingCycles.push({
      //     frequency: {
      //       interval_unit: pricingPlan.duration === 'yearly' ? 'YEAR' : 'MONTH',
      //       interval_count: 1,
      //     },
      //     tenure_type: 'REGULAR',
      //     sequence: 2,
      //     total_cycles: 0, // 0 = infinite
      //     pricing_scheme: {
      //       fixed_price: {
      //         value: pricingPlan.price.toString(),
      //         currency_code: 'USD',
      //       },
      //     },
      //   });
      // } else {
      //   billingCycles.push({
      //     frequency: {
      //       interval_unit: pricingPlan.duration === 'yearly' ? 'YEAR' : 'MONTH',
      //       interval_count: 1,
      //     },
      //     tenure_type: 'REGULAR',
      //     sequence: 1,
      //     total_cycles: 0, // 0 = infinite
      //     pricing_scheme: {
      //       fixed_price: {
      //         value: pricingPlan.price.toString(),
      //         currency_code: 'USD',
      //       },
      //     },
      //   });
      // }

      // const paypalPlan = await paypal.PaypalSubscriptionPlan.create({
      //   name: pricingPlan.planName,
      //   product_id: paypalProduct.id,
      //   description: pricingPlan.planDescription,
      //   billing_cycles: billingCycles,
      //   payment_preferences: {
      //     setup_fee: {
      //       value: '0',
      //       currency_code: 'USD',
      //     },
      //     setup_fee_failure_action: 'CANCEL',
      //     payment_failure_threshold: 3,
      //     auto_bill_outstanding: true,
      //   },
      // });

      // pricingPlan.paypalProductId = paypalProduct.id;
      // pricingPlan.paypalPlanId = paypalPlan.id;
    }

    await pricingPlan.save();
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.CREATED,
      data: { pricingPlan },
    };
  }

  // here is pagination is pending regarding total pricing plan
  async getAllPricingPlans(req: Request) {
    let pricingPlans = await pricingPlanModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlans },
    };
  }

  async getPricingPlansForAdmin(req: Request) {
    let pricingPlans = await pricingPlanModel.find({}).sort({ createdAt: -1 });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlans },
    };
  }
  async getUserPricingPlan(req: Request) {
    const { _id } = req.payload;
    const user = await Users.findById(_id);

    if (!user) {
      return {
        statusCode: EHttpStatus.UNAUTHORIZED,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }

    if (!user.planId) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PLAN_NOT_FOUND,
      };
    }
    const plan = await pricingPlanModel.findById(user.planId);

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { plan },
    };
  }

  async updatePricingPlan(req: Request) {
    const { planId } = req.params;

    let pricingPlan = await pricingPlanModel.findByIdAndUpdate(
      planId,
      req.body,
      { new: true }
    );

    if (!pricingPlan) {
      return {
        message: ResponseMessage.REJECT,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    if (!req.body.isInternal) {
      try {
        await stripe.products.update(pricingPlan.stripeProductId, {
          name: pricingPlan.planName,
          description: pricingPlan.planDescription,
          metadata: {
            planType: pricingPlan.type,
          },
        });
      } catch (error) {
        console.log('Update pricing plan for stripe error', error);
      }
      // if (pricingPlan.paypalPlanId) {
      //   try {
      //     await paypal.PaypalSubscriptionPlan.update(pricingPlan.paypalPlanId, {
      //       name: pricingPlan.planName,
      //       description: pricingPlan.planDescription,
      //     });
      //   } catch (error) {
      //     console.log('Update pricing plan for paypal error', error);
      //   }
      // }
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlan },
    };
  }

  async deletePricingPlan(req: Request) {
    const { planId } = req.params;

    let pricingPlan = await pricingPlanModel.findByIdAndDelete(planId);

    if (!pricingPlan) {
      return {
        message: ResponseMessage.REJECT,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlan },
    };
  }
  async updatePricingPlanStatus(req: Request) {
    const { planId } = req.params;
    let pricingPlan: IPricingPlan;
    pricingPlan = await pricingPlanModel.findById(planId);

    if (!pricingPlan) {
      return {
        message: ResponseMessage.REJECT,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    pricingPlan = await pricingPlanModel.findByIdAndUpdate(
      planId,
      { isActive: !pricingPlan.isActive },
      { new: true }
    );

    if (!pricingPlan.isInternal) {
      await stripe.products.update(pricingPlan.stripeProductId, {
        active: pricingPlan.isActive,
      });
      await stripe.prices.update(pricingPlan.stripePriceId, {
        active: pricingPlan.isActive,
      });

      // try {
      //   if (pricingPlan.isActive) {
      //     await paypal.PaypalSubscriptionPlan.activate(
      //       pricingPlan.paypalPlanId
      //     );
      //   } else {
      //     await paypal.PaypalSubscriptionPlan.deactivate(
      //       pricingPlan.paypalPlanId
      //     );
      //   }
      // } catch (error) {
      //   console.log(this.updatePricingPlanStatus, 'Error for Paypal', error);
      // }
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlan },
    };
  }
}

export default new PricingPlanService();
