import { ResponseMessage } from "../../enums/resMessage.enum";
import Plan from "./plan.model";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { Request } from "express";
import { stripe } from "../../helper/stripe.helper";
import { UpdatePlanDto, UpdatePlanStatusDto } from "./dto/plan.dto";
import { CreatePlanPromotionDto, UpdatePlanPromotionDto } from "./dto/plan-promotion.dto";
import PlanPromotion from "./plan-promotion.model";
import { SearchQuery } from "../../utils";

class PlanService {
    async createPlan(req: Request) {
        const body = req.body;
        const { _id } = req.payload;
        const plan = await Plan.create({
            ...body,
            user: _id
        });

        const product = await stripe.products.create({
            name: plan.name,
            description: plan.description,
            metadata: {
                planId: plan._id.toString() as string,
                duration: plan.duration
            },
            type: "service",

        });

        plan.productId = product.id;

        await plan.save();

        const price = await stripe.prices.create({
            unit_amount: plan.price * 100,
            currency: "usd",
            recurring: plan.duration !== -1 ? {
                interval: 'month',
                interval_count: plan.duration
            } : undefined, // Recurring if it's not lifetime
            product: product.id,
            metadata: {
                planId: plan._id.toString() as string,
                duration: plan.duration
            },

        });

        plan.priceId = price.id;
        await plan.save();

        return {
            message: ResponseMessage.PLAN_CREATED,
            statusCode: EHttpStatus.CREATED,
            data: plan
        }
    }

    async getAllPricingPlans(req: Request) {
        let pricingPlans = await Plan
            .find({ status: "active" })
            .sort({ createdAt: -1 })
            .populate("promotion");

        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: pricingPlans,
        };
    }


    async deletePricingPlan(req: Request) {
        const { id } = req.params;

        let pricingPlan = await Plan.findByIdAndDelete(id);

        if (!pricingPlan) {
            return {
                message: ResponseMessage.REJECT,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }

        await stripe.products.update(pricingPlan.productId, {
            active: false,

        });

        await stripe.prices.update(pricingPlan.priceId, {
            active: false,
        });

        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: pricingPlan,
        };
    }
    async updatePricingPlanStatus(req: Request) {
        const { id } = req.params;
        const body = req.body as UpdatePlanStatusDto;
        let pricingPlan = await Plan.findById(id);

        if (!pricingPlan) {
            return {
                message: ResponseMessage.REJECT,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }

        pricingPlan.status = body.status === "inactive" ? "inactive" : "active";
        await pricingPlan.save();

        // let isActive = pricingPlan.status === "active" ? true : false

        // await stripe.products.update(pricingPlan.productId, {
        //     active: isActive,
        // });
        // await stripe.prices.update(pricingPlan.priceId, {
        //     active: isActive,
        // });

        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: pricingPlan,
        };
    }

    async updatePlan(req: Request) {
        const { id } = req.params;
        const body = req.body as UpdatePlanDto;

        let plan = await Plan.findById(id);
        if (!plan) {
            return {
                message: ResponseMessage.REJECT,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }
        if (body.name) {
            plan.name = body.name;
        }
        if (body.description) {
            plan.description = body.description;
        }

        await plan.save();
        try {
            await stripe.products.update(plan.productId, {
                name: plan.name,
            })
        } catch (error) {
            console.log("Error  while updating plan on stripe", error);
        }

        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: plan
        }
    }


    // Promotions for Plans

    async createPromotionForPlan(req: Request) {
        const planId = req.params.planId;
        const { _id } = req.payload;

        const plan: any = await Plan.findById(planId);

        if (!plan) {
            return {
                message: ResponseMessage.REJECT,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }

        if (plan.promotion) {
            return {
                message: ResponseMessage.PLAN_PROMOTION_ALREADY_EXISTS,
                statusCode: EHttpStatus.BAD_REQUEST
            }
        }
        const planPromotion = await PlanPromotion.findOne({ planId });
        if (planPromotion) {
            return {
                message: ResponseMessage.PLAN_PROMOTION_ALREADY_EXISTS,
                statusCode: EHttpStatus.BAD_REQUEST
            }
        }

        const body = req.body as CreatePlanPromotionDto;

        const promotion = await PlanPromotion.create({
            ...body,
            planId,
            user: _id
        });

        plan.promotion = promotion._id;
        await plan.save();
        return {
            message: ResponseMessage.PLAN_PROMOTION_CREATED,
            statusCode: EHttpStatus.CREATED,
            data: promotion
        }
    }


    async updatePromotionForPlan(req: Request) {

        const promotionId = req.params.promotionId;
        const body = req.body as UpdatePlanPromotionDto;

        const promotion = await PlanPromotion.findById(promotionId);
        if (!promotion) {
            return {
                message: ResponseMessage.PLAN_PROMOTION_NOT_FOUND,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }

        if (body.planId !== promotion.planId.toString()) {

            const isExisting = await PlanPromotion.findOne({
                planId: body.planId
            });
            if (isExisting) {
                return {
                    message: ResponseMessage.PLAN_PROMOTION_ALREADY_EXISTS,
                    statusCode: EHttpStatus.BAD_REQUEST
                }
            }


            /* This block of code is handling the update of a promotion for a plan. Here's a breakdown
            of what it does: */
            let plan: any = await Plan.findById(promotion.planId);
            /* This block of code is checking if the variable `plan` exists and is truthy. If `plan`
            exists, it sets the `promotion` property of the `plan` object to `null` and then saves
            the changes to the database by calling `await plan.save()`. This effectively removes any
            existing promotion associated with the plan. */
            if (plan) {
                plan.promotion = null;
                await plan.save();
            }
            /* This block of code is handling the update of a promotion for a plan. Here's a breakdown
            of what it does: */
            promotion.planId = body.planId;
            plan = await Plan.findById(body.planId);
            plan.promotion = promotion._id;
            await plan.save();
            await promotion.save();
        }
        const updatedPromotion = await PlanPromotion.findByIdAndUpdate(promotionId, body, { new: true });
        return {
            message: ResponseMessage.PLAN_PROMOTION_UPDATED,
            statusCode: EHttpStatus.OK,
            data: updatedPromotion
        }

    }

    async deletePromotionForPlan(req: Request) {

        const promotionId = req.params.promotionId;

        const promotion = await PlanPromotion.findById(promotionId);
        if (!promotion) {
            return {
                message: ResponseMessage.PLAN_PROMOTION_NOT_FOUND,
                statusCode: EHttpStatus.NOT_FOUND,
            };
        }

        const deletedPromotion = await PlanPromotion.findByIdAndDelete(promotionId);
        const plan = await Plan.findById(deletedPromotion.planId);
        if (plan) {
            plan.promotion = null;
            await plan.save();
        }
        return {
            message: ResponseMessage.PLAN_PROMOTION_DELETED,
            statusCode: EHttpStatus.OK,
            data: deletedPromotion
        }

    }

    async promotionList({ query }) {
        const { searchTerm } = query;
        const promotions = await PlanPromotion.find(SearchQuery(searchTerm, ['title', 'type'])).populate("planId");
        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: promotions
        }
    }
}

export default new PlanService();