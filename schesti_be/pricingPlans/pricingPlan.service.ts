import { Request } from 'express';
import { ResponseMessage } from '../../enums/resMessage.enum';
import pricingPlanModel from './pricingPlan.model';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import { stripe } from '../../helper/stripe.helper';
import IPricingPlan, { LocalizedPrice } from './pricingPlan.interface';
import Users from '../../modules/user/user.model';
import { PricingPlanDto } from './pricingPlan.dto';
import { createPaymobSubscriptionPlan } from '../../helper/paymob';
import { config } from '../../config/config';
import { 
  validateCurrencySupport, 
  checkCurrencySupport 
} from '../../helper/currencySupport.helper';
import { CustomError } from '../../errors/custom.error';

class PricingPlanService {
  async addNewPricingPlan(req: Request) {
    const { 
      planName, 
      type, 
      basePrice, 
      duration, 
      localizedPricing,
      isInternal 
    } = req.body as PricingPlanDto;

    // Check if plan already exists
    let pricingPlan: IPricingPlan = await pricingPlanModel.findOne({ 
      planName, 
      type 
    });
    
    if (pricingPlan) {
      throw new CustomError(
        EHttpStatus.CONFLICT,
        ResponseMessage.ALREADY_PLAN_EXIST
      );
    }

    if (isInternal) {
      pricingPlan = new pricingPlanModel({
        ...req.body,
        baseCurrency: 'USD',
        localizedPricing: localizedPricing.map(lp => ({
          ...lp,
          stripeSupported: false,
          paymobSupported: false,
        })),
      });
      await pricingPlan.save();
      
      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.CREATED,
        data: { pricingPlan },
      };
    }

    const validatedPricing: LocalizedPrice[] = [];
    const unsupportedCurrencies: string[] = [];

    for (const localPrice of localizedPricing) {
      try {
        const currencySupport = validateCurrencySupport(localPrice.currency);
        
        validatedPricing.push({
          country: localPrice.country,
          countryCode: localPrice.countryCode,
          currency: localPrice.currency,
          price: localPrice.price,
          stripeSupported: currencySupport.stripeSupported,
          paymobSupported: currencySupport.paymobSupported,
        });
      } catch (error) {
        unsupportedCurrencies.push(
          `${localPrice.currency} (${localPrice.country})`
        );
      }
    }


    if (unsupportedCurrencies.length > 0) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        `The following currencies are not supported by Stripe or Paymob: ${unsupportedCurrencies.join(', ')}. ` +
        `Please use supported currencies or mark the plan as internal.`
      );
    }

    pricingPlan = new pricingPlanModel({
      ...req.body,
      baseCurrency: 'USD',
      localizedPricing: validatedPricing,
    });

    try {
      const stripeProduct = await stripe.products.create({
        name: pricingPlan.planName,
        description: pricingPlan.planDescription,
        id: String(pricingPlan._id),
        metadata: {
          trialDays: pricingPlan.freeTrailDays,
          planType: pricingPlan.type,
        },
      });

      pricingPlan.stripeProductId = stripeProduct.id;

      const baseStripePrice = await stripe.prices.create({
        unit_amount: Math.round(pricingPlan.basePrice * 100),
        currency: 'usd',
        recurring: {
          interval: pricingPlan.duration === 'yearly' ? 'year' : 'month',
        },
        product: stripeProduct.id,
        metadata: {
          planId: pricingPlan._id.toString(),
          localized: 'false',
        },
      });

      pricingPlan.stripePriceId = baseStripePrice.id;
    } catch (error) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        `Failed to create Stripe base product: ${error.message}`
      );
    }

    for (let i = 0; i < validatedPricing.length; i++) {
      const localPrice = validatedPricing[i];

      if (localPrice.stripeSupported) {
        try {
          const stripePrice = await stripe.prices.create({
            unit_amount: Math.round(localPrice.price * 100),
            currency: localPrice.currency.toLowerCase(),
            recurring: {
              interval: pricingPlan.duration === 'yearly' ? 'year' : 'month',
            },
            product: pricingPlan.stripeProductId,
            metadata: {
              planId: pricingPlan._id.toString(),
              country: localPrice.country,
              countryCode: localPrice.countryCode,
              localized: 'true',
            },
          });

          validatedPricing[i].stripePriceId = stripePrice.id;
          console.log(` Stripe price created for ${localPrice.currency}: ${stripePrice.id}`);
        } catch (error) {
          console.error(` Failed to create Stripe price for ${localPrice.currency}:`, error.message);
          
        }
      }

      if (localPrice.paymobSupported) {
        try {
          const paymobPlan = await createPaymobSubscriptionPlan({
            name: `${pricingPlan.planName} - ${localPrice.country}`,
            amount_cents: Math.round(localPrice.price * 100),
            frequency: pricingPlan.duration === 'yearly' ? 365 : 30,
            integration: Number(config.PAYMOB_INTEGRATION_ID),
            is_active: true,
            plan_type: 'rent',
            use_transaction_amount: true,
            webhook_url: `${config.PAYMOB_WEBHOOK_END_POINT}/paymob-webhook`,
          });

          validatedPricing[i].paymobPlanId = paymobPlan.id;
          console.log(` Paymob plan created for ${localPrice.currency}: ${paymobPlan.id}`);
        } catch (error) {
          console.error(` Failed to create Paymob plan for ${localPrice.currency}:`, error.message);
          
        }
      }
    }

    pricingPlan.localizedPricing = validatedPricing;
    await pricingPlan.save();

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.CREATED,
      data: { pricingPlan },
    };
  }

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

      // Update all localized Stripe prices
      for (const localPrice of pricingPlan.localizedPricing) {
        if (localPrice.stripePriceId) {
          try {
            await stripe.prices.update(localPrice.stripePriceId, {
              active: pricingPlan.isActive,
            });
          } catch (error) {
            console.log(`Error updating Stripe price for ${localPrice.currency}:`, error);
          }
        }
      }
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { pricingPlan },
    };
  }
  async getPricingPlansByCountry(req: Request) {
  const { countryCode } = req.params;
  const { duration, type } = req.query as { duration?: string; type?: string };

  const query: any = { isActive: true };
  if (duration) query.duration = duration;
  if (type) query.type = type;

  const allPlans = await pricingPlanModel
    .find(query)
    .sort({ createdAt: -1 })
    .lean();

  if (allPlans.length === 0) {
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: {
        pricingPlans: [],
        countryCode: countryCode.toUpperCase(),
        hasLocalPricing: false,
      },
    };
  }

  const plansWithLocalPricing = allPlans
    .map((plan: any) => {
      const localized = plan.localizedPricing?.find(
        (lp: LocalizedPrice) =>
          lp.countryCode?.toUpperCase() === countryCode.toUpperCase()
      );

      if (localized) {
        return {
          ...plan,
          displayPrice: localized.price,
          displayCurrency: localized.currency.toUpperCase(),
          localizedPriceData: localized,
          paymentMethods: [
            ...(localized.stripeSupported ? ['Stripe'] : []),
            ...(localized.paymobSupported ? ['Paymob'] : []),
          ].filter(Boolean),
          preferredPaymentMethod: localized.paymobSupported ? 'Paymob' : 'Stripe',
        };
      }
      return null;
    })
    .filter(Boolean);

  const hasLocalPricing = plansWithLocalPricing.length > 0;
  const finalPlans = hasLocalPricing
    ? plansWithLocalPricing
    : allPlans.map((plan: any) => ({
        ...plan,
        displayPrice: plan.basePrice,
        displayCurrency: 'USD',
        localizedPriceData: null,
        paymentMethods: ['Stripe'], 
        preferredPaymentMethod: 'Stripe',
      }));

  return {
    message: ResponseMessage.SUCCESSFUL,
    statusCode: EHttpStatus.OK,
    data: {
      pricingPlans: finalPlans,
      countryCode: countryCode.toUpperCase(),
      hasLocalPricing,
    },
  };
}
}

export default new PricingPlanService();