import mongoose, { Schema } from "mongoose";
import IUser, { IBlockedUser, IFollow } from "./interfaces/user.interface";
import { USER_ROLES_ENUM, userRoles } from "../user/enums/roles.enums";
import { OTP_ENUM } from "./enums/otp.enums";

let companySchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    countryName: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    longitude: {
      type: String,
    },
    lattitude: {
      type: String,
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: String, default: "active" },
    loginAttempts: { type: Number, default: 0 },
    providerId: { type: String, default: "" },
    providerType: { type: String, default: "" },
    otp: { type: Number },
    otpStatus: {
      type: String,
      enum: Object.values(OTP_ENUM),
      default: OTP_ENUM.NOT_VERIFIED,
    },
    otpSentAt: {
      type: Date,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    userRole: {
      type: String,
      enum: Object.values(USER_ROLES_ENUM),
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    isPaymentConfirm: { type: Boolean, default: false },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseHistory",
    },
    stripePaymentIntentId: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    lockTime: {
      type: Number,
      default: 0,
    },
    isPasscodeActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const blockedUserSchema = new Schema<IBlockedUser>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    blockedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const BlockedUser = mongoose.model<IBlockedUser>(
  "blockeduser",
  blockedUserSchema
);
export const Follow = mongoose.model<IFollow>("follow", followSchema);
const Users = mongoose.model<IUser>("users", companySchema);

export default Users;
