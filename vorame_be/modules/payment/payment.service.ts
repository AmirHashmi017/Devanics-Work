import { stripe } from "../../helper/stripe.helper";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Request } from "express";
import Plan from "../../modules/plan/plan.model";
import Users from "../../modules/user/user.model";
import Stripe from "stripe";
import { CreatePaymentIntentDto, VerifyPromoCodeDto } from "./payment.dto";
import { IPlanPromotion } from "../../modules/plan/plan-promotion.model";
import PromoCode, {
  IPromoCode,
} from "../../modules/promo-code/promo-code.model";
import moment from "moment";
import PurchaseHistory from "../purchase-history/purchase-history.model";

class PaymentService {
  async createPaymentIntent(req: Request) {
    const id = req.payload._id;
    const body = req.body as CreatePaymentIntentDto;
    const planId = body.planId;
    const withPromotion = body.withPromotion || false;
    const promoCodeId = body.promoCode || null;

    const plan = await Plan.findById(planId);
    if (!plan || plan.status === "inactive") {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PLAN_NOT_EXISTS,
      };
    }

    const user = await Users.findById(id);
    if (!user) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }
    const price = await stripe.prices.retrieve(plan.priceId);
    if (!price) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PLAN_NOT_EXISTS,
      };
    }

    let stripeCustomerId: string;

    if (user.stripeCustomerId) {
      stripeCustomerId = user.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }
    let ephemeral = await stripe.ephemeralKeys.create(
      { customer: stripeCustomerId },
      { apiVersion: "2020-08-27" }
    );

    let ephemeralKey = ephemeral.secret;
    // create  a coupon of discount

    let discountCoupon: Stripe.Coupon | null = null;

    if (plan.discount > 0) {
      discountCoupon = await stripe.coupons.create({
        percent_off: plan.discount,
        max_redemptions: 1,
      });
    }

    /* The line `let promotionDiscountAmount = 0;` is initializing a variable
        `promotionDiscountAmount` with a value of 0. This variable is used to store the amount of
        discount that will be applied to the payment based on any promotion associated with the
        selected plan. It is set to 0 initially and will be updated with the actual discount amount
        if a promotion is applied during the payment process. */
    let promotionDiscountAmount = 0;

    /* `await plan.populate("promotion");` is a Mongoose method used to populate a reference to
        another document in a collection. In this case, it is populating the "promotion" field in
        the "plan" document. */
    await plan.populate("promotion");

    /* The line `let planPromotion: IPlanPromotion | null = plan.promotion as IPlanPromotion;` is
        declaring a variable `planPromotion` and initializing it with the value of `plan.promotion`
        casted as type `IPlanPromotion` or `null` if the cast is not successful. */
    let planPromotion: IPlanPromotion | null = plan.promotion as IPlanPromotion;
    /* The code snippet `if (withPromotion && planPromotion) {
            promotionDiscountAmount = planPromotion.discount;
        }else {
            planPromotion = null;
        }` is checking if the `withPromotion` flag is true and if there is a valid `planPromotion`
        associated with the selected plan. */
    if (withPromotion && planPromotion) {
      promotionDiscountAmount = planPromotion.discount;
    } else {
      /* `planPromotion = null;` is assigning a value of `null` to the variable `planPromotion`.
            This line of code is executed when the condition `if (withPromotion && planPromotion)`
            evaluates to `false`, meaning that either the `withPromotion` flag is `false` or there
            is no valid `planPromotion` associated with the selected plan. By setting
            `planPromotion` to `null`, it ensures that the variable does not hold any reference to
            an invalid or non-existent promotion, effectively resetting it to a null state for
            further processing in the code logic. */
      planPromotion = null;
    }

    let validPromoCodeData = promoCodeId
      ? await this.findPromoCodeById(promoCodeId, planId)
      : null;

    if (validPromoCodeData && !validPromoCodeData.data) {
      return validPromoCodeData;
    }

    let adjustedAmount = price.unit_amount; // Original price amount in cents

    if (validPromoCodeData && validPromoCodeData.data) {
      const promoCode = validPromoCodeData.data;

      // Apply the promo code discount
      if (promoCode.type === "percentage") {
        const percentageDiscount = Math.floor(
          (price.unit_amount * promoCode.amount) / 100
        ); // Calculate discount in cents
        adjustedAmount -= percentageDiscount;
      } else if (promoCode.type === "price") {
        // Convert flat amount discount from dollars to cents
        const flatDiscount = promoCode.amount * 100;
        adjustedAmount -= flatDiscount;
      }
    }

    // Apply the plan's promotion discount (if applicable)
    if (promotionDiscountAmount > 0) {
      if (planPromotion && planPromotion.type === "percentage") {
        const percentageDiscount = Math.floor(
          (adjustedAmount * promotionDiscountAmount) / 100
        ); // Calculate in cents
        adjustedAmount -= percentageDiscount;
      } else if (planPromotion && planPromotion.type === "flat") {
        const flatDiscount = promotionDiscountAmount * 100;
        adjustedAmount -= flatDiscount;
      }
    }

    // Ensure the adjusted amount does not go below zero
    adjustedAmount = Math.max(adjustedAmount, 0);

    let paymentIntentSecret: string;
    if (!price.recurring) {
      const customer = await stripe.customers.update(stripeCustomerId, {
        coupon: discountCoupon ? discountCoupon.id : undefined,
      });
      const pi = await stripe.paymentIntents.create({
        // add  discount
        amount: adjustedAmount,
        currency: price.currency,
        customer: customer.id,
        payment_method_types: ["card"],
        receipt_email: user.email,
        metadata: {
          userId: id,
          planId: planId,
        },
      });

      paymentIntentSecret = pi.client_secret;
    } else {
      let discountOnPromotion = planPromotion
        ? await stripe.coupons.create({
          percent_off:
            planPromotion.type === "percentage"
              ? planPromotion.discount
              : undefined,
          max_redemptions: 1,
          amount_off:
            planPromotion.type === "flat"
              ? planPromotion.discount * 100
              : undefined,
          currency: planPromotion.type === "flat" ? "usd" : undefined,
          metadata: {
            promotionId: planPromotion.id.toString(),
            planId: planId,
          },
        })
        : null;

      /* The above TypeScript code is attempting to access the `stripeCouponId` property from the
            `validPromoCodeData.data` object. The `?.` is the optional chaining operator in
            TypeScript, which allows accessing properties of an object that may be undefined or null
            without causing an error. If `validPromoCodeData.data` is null or undefined, the
            expression will short-circuit and return undefined. */
      const userPromotionCouponId = validPromoCodeData?.data?.stripeCouponId;

      const discounts = discountCoupon ? [{ coupon: discountCoupon.id }] : [];
      if (discountOnPromotion) {
        discounts.push({
          coupon: discountOnPromotion.id,
        });
      }

      if (userPromotionCouponId) {
        discounts.push({
          coupon: userPromotionCouponId,
        });
      }

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [
          {
            price: plan.priceId,
            //@ts-ignore
            discounts,
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: id,
          planId: planId,
        },
      });

      user.stripeSubscriptionId = subscription.id;

      await user.save();

      paymentIntentSecret = (
        (subscription.latest_invoice as Stripe.Invoice)
          .payment_intent as Stripe.PaymentIntent
      ).client_secret;
    }

    return {
      statusCode: EHttpStatus.OK,
      data: {
        paymentIntent: paymentIntentSecret,
        customer: stripeCustomerId,
        ephemeralKey,
      },
    };
  }

  async verifyPromoCode(req: Request) {
    const body = req.body as VerifyPromoCodeDto;
    const result = await this.isValidPromoCode(body.promoCode, body.planId);
    return result;
  }

  private async isValidPromoCode(code: string, planId: string) {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_NOT_FOUND,
        data: null,
      };
    }

    if (promoCode.appliedTo.toString() !== planId) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_NOT_APPLIED_TO_PLAN,
        data: null,
      };
    }

    const isPromoCodeStarted = moment(promoCode.startDate).isBefore(moment());

    if (!isPromoCodeStarted) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_IS_NOT_ACTIVE,
        data: null,
      };
    }

    const isExpired = moment(promoCode.endDate).isBefore(moment());
    if (isExpired) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_IS_EXPIRED,
        data: null,
      };
    }
    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.PROMO_CODE_IS_ACCEPTED,
      data: promoCode,
    };
  }

  private async findPromoCodeById(promoCodeId: string, planId: string) {
    const promoCode = await PromoCode.findById(promoCodeId);

    if (!promoCode) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_NOT_FOUND,
        data: null,
      };
    }

    if (promoCode.appliedTo.toString() !== planId) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_NOT_APPLIED_TO_PLAN,
        data: null,
      };
    }

    const isPromoCodeStarted = moment(promoCode.startDate).isBefore(moment());

    if (!isPromoCodeStarted) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_IS_NOT_ACTIVE,
        data: null,
      };
    }

    const isExpired = moment(promoCode.endDate).isBefore(moment());
    if (isExpired) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PROMO_CODE_IS_EXPIRED,
        data: null,
      };
    }
    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.PROMO_CODE_IS_ACCEPTED,
      data: promoCode,
    };
  }


  async cancelSubscription(req: Request) {
    const reason = req.body.reason;

    const { _id } = req.payload;

    const user = await Users.findById(_id);
    if (!user) {
      return {
        message: ResponseMessage.USER_NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }
    const purchaseHistory = await PurchaseHistory.findById(user.subscription);
    if (!purchaseHistory) {
      return {
        message: ResponseMessage.SUBSCRIPTION_NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
      }
    }
    if (purchaseHistory.status !== 'active') {
      return {
        message: ResponseMessage.SUBSCRIPTION_NOT_FOUND_OR_INACTIVE,
        statusCode: EHttpStatus.BAD_REQUEST,
      }
    }

    // That means the subscription is for lifetime
    // There is no end on subscription
    if (!purchaseHistory.endDate) {
      purchaseHistory.status = 'cancelled';
      purchaseHistory.reason = reason;
      purchaseHistory.expirationAt = new Date();
      await purchaseHistory.save();
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: purchaseHistory
      }
    }

    try {
      const subscription = await stripe.subscriptions.cancel(purchaseHistory.subscriptionId);
      purchaseHistory.reason = reason;
      await purchaseHistory.save();

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
      }
    } catch (error) {
      return {
        message: ResponseMessage.SUBSCRIPTION_NOT_CANCELLED,
        statusCode: EHttpStatus.BAD_REQUEST,
      }
    }
  }

  private getAmountFromPromoCode(promoCode: IPromoCode, price: number) {
    if (promoCode.type === "percentage") {
      return (price * (100 - promoCode.amount)) / 100;
    } else {
      return promoCode.amount;
    }
  }
}

export default new PaymentService();
