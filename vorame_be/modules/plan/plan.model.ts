import mongoose, { Document, Schema } from "mongoose";
import IUser from "../user/interfaces/user.interface";
import { IPlanPromotion } from "./plan-promotion.model";

export interface IPlan extends Document {
    name: string;
    duration: 1 | 12 | -1; // -1 for lifetime
    price: number;
    discount: number;
    user: string | IUser;
    priceId: string;
    productId: string;
    description: string;
    status: "active" | "inactive";
    promotion: IPlanPromotion | string;
}

const PlanSchema = new Schema<IPlan>({
    name: { type: String },
    duration: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    description: { type: String, default: "Empty" },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    priceId: { type: String },
    productId: { type: String },
    status: { type: String, default: "active" },
    promotion: { type: Schema.Types.ObjectId, ref: "planPromotions" },
}, { timestamps: true });


const Plan = mongoose.model<IPlan>("plans", PlanSchema);

export default Plan