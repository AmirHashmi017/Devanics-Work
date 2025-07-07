import { IPurchaseHistory } from "modules/purchase-history/purchase-history.model";
import { Document, ObjectId, Schema } from "mongoose";

export default interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  countryName: string;
  longitude: String;
  lattitude: string;
  dob: string;
  gender: string;
  password: string;
  providerId: string;
  providerType: string;
  isEmailVerified: Boolean;
  isPhoneVerified: Boolean;
  isPaymentConfirm: Boolean;
  loginAttempts: Number;
  name: string;
  address: string;
  deleted: boolean;
  secondAddress: string;
  avatar: string;
  membership: string;
  isActive: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  userRole: string;
  otp: Number;
  otpStatus: String;
  otpSentAt: Date;
  createdAt: Date; // Adding this for otp expiration cron job
  updatedAt: Date; // Adding this for otp new genrated after expired (cron job)
  subscription: IPurchaseHistory | string;
  stripePaymentIntentId: string;
  lockTime: number;
  isPasscodeActive: boolean;
  bio?: string;
}

export interface IBlockedUser extends Document {
  userId: ObjectId;
  blockedUserId: ObjectId;
}

export interface IFollow extends Document {
  user: ObjectId;
  following: ObjectId;
}
