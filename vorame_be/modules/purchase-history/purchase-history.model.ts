import { IPlan } from "../../modules/plan/plan.model"
import IUser from "../../modules/user/interfaces/user.interface";
import mongoose, { Schema } from "mongoose";

export type IPurchaseHistory = {
    planId: string | IPlan, // Reference to the plan the user is currently subscribed to
    startDate: Date,
    endDate: Date | null, // Null for lifetime subscriptions
    status: "active" | "cancelled" | "expired" | "trial" | "trial_ending" | "payment_failed"
    subscriptionId: string;
    paymentIntentId: string;
    user: string | IUser;
    reason?: string;
    expirationAt?: Date;
}

const PurchaseHistorySchema = new Schema<IPurchaseHistory>({
    planId: { type: Schema.Types.ObjectId, ref: "plans" },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String },
    subscriptionId: { type: String },
    paymentIntentId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    reason: { type: String, default: "" },
    expirationAt: { type: Date }
}, { timestamps: true });


const PurchaseHistory = mongoose.model<IPurchaseHistory>("PurchaseHistory", PurchaseHistorySchema);

export default PurchaseHistory