import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Request } from "express";
import PromoCode from "./promo-code.model";
import { stripe } from "../../helper/stripe.helper";
import { CreatePromoCodeDto, } from "./dto/promo-code.dto";
import Plan from "../../modules/plan/plan.model";
import moment from "moment";
import { SearchQuery } from "../../utils";
class PromoCodeService {

    async create(req: Request) {
        const { _id } = req.payload;
        const body = req.body as CreatePromoCodeDto;

        const isNotEndDateValid = moment(body.endDate).isBefore(moment());

        if (isNotEndDateValid) {
            return {
                statusCode: EHttpStatus.BAD_REQUEST,
                message: "End date should be greater than current date",
            }
        }

        const plan = await Plan.findById(body.appliedTo);

        if (!plan) {
            return {
                statusCode: EHttpStatus.BAD_REQUEST,
                message: ResponseMessage.PLAN_NOT_FOUND,
            }
        }


        let isExisting = await PromoCode.findOne({ code: body.code });
        if (isExisting) {
            return {
                statusCode: EHttpStatus.BAD_REQUEST,
                message: ResponseMessage.PROMO_ALREADY_EXISTS,
            }
        }

        isExisting = await PromoCode.findOne({ code: body.code, appliedTo: plan._id });

        if (isExisting) {
            return {
                statusCode: EHttpStatus.BAD_REQUEST,
                message: ResponseMessage.PROMO_ALREADY_EXISTS,
            }
        }


        const promo = await PromoCode.create({
            ...body,
            user: _id
        });

        const coupon = await stripe.coupons.create({
            name: "coupon-" + promo._id.toString(),
            percent_off: promo.type === 'percentage' ? promo.amount : undefined,
            amount_off: promo.type === 'price' ? promo.amount * 100 : undefined,
            applies_to: {
                products: [plan.productId]
            },
            currency: promo.type === 'price' ? "usd" : undefined,
            duration: "forever"
        })

        const expiresAt = Math.floor(new Date(promo.endDate).getTime() / 1000);

        const stripePromotionCode = await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: promo.code,
            expires_at: expiresAt,
            metadata: {
                couponId: coupon.id,
                // db promo id
                promoId: promo._id.toString()
            },
        });

        promo.stripeCouponId = coupon.id;
        promo.stripePromoCodeId = stripePromotionCode.id;
        await promo.save();
        return {
            message: ResponseMessage.PROMO_CODE_CREATED,
            statusCode: EHttpStatus.OK,
            data: promo
        }
    }

    async list({ query }) {
        const { searchTerm = '' } = query;
        const promos = await PromoCode.find(SearchQuery(searchTerm, ['code', 'type'])).populate("appliedTo");
        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: promos
        }
    }


    async delete(req: Request) {
        const { id } = req.params;
        const promo = await PromoCode.findByIdAndDelete(id);
        if (!promo) {
            return {
                message: ResponseMessage.PROMO_CODE_NOT_FOUND,
                statusCode: EHttpStatus.NOT_FOUND
            }
        }

        try {
            const stripeCoupon = await stripe.coupons.del(promo.stripeCouponId);
            const stripePromotionCode = await stripe.promotionCodes.update(promo.stripePromoCodeId, { active: false });
        } catch (error) {
            console.log("Error while deleting coupon from stripe", error);
        }

        return {
            message: ResponseMessage.PROMO_CODE_DELETED,
            statusCode: EHttpStatus.OK,
            data: promo
        }

    }

}

export default new PromoCodeService()