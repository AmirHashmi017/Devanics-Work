import { IPlan } from "../../modules/plan/plan.model";
import IUser from "../../modules/user/interfaces/user.interface";
import mongoose from "mongoose";

export interface IPromoCode extends mongoose.Document {
    code: string;
    type: "percentage" | "price"
    amount: number;
    startDate: Date;
    endDate: Date;
    user: string | IUser;
    appliedTo: string | IPlan;
    stripeCouponId: string;
    stripePromoCodeId: string;
}


const schema = new mongoose.Schema<IPromoCode>({
    code: { type: String, },
    type: { type: String, },
    amount: { type: Number, },
    startDate: { type: Date, },
    endDate: { type: Date, },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", },
    appliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "plans", },
    stripeCouponId: { type: String, },
    stripePromoCodeId: { type: String, },
}, { timestamps: true });

const PromoCode = mongoose.model<IPromoCode>("promoCodes", schema);

export default PromoCode;