import mongoose from "mongoose";
import { IPlan } from "./plan.model";
import IUser from "../../modules/user/interfaces/user.interface";


export interface IPlanPromotion extends mongoose.Document {
    planId: string | IPlan;
    title: string;
    startDate: Date;
    endDate: Date;
    discount: number;
    type: "percentage" | "flat";
    user: string | IUser;
}

const schema = new mongoose.Schema<IPlanPromotion>({
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "plans", },
    title: { type: String, },
    startDate: { type: Date, },
    endDate: { type: Date, },
    discount: { type: Number, },
    type: { type: String, },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", },
}, { timestamps: true });

const PlanPromotion = mongoose.model<IPlanPromotion>("planPromotions", schema);
export default PlanPromotion;


