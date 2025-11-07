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
    isBoardroomBlocked: {type: Boolean, default: false},
    isTouchpointBlocked: {type: Boolean, default: false},
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
    currentStreak:{
      type: Number,
      default:0
    },
    streakUpdatedDate:{
      type: Date
    },
    FCMToken: {
      type: [String],
      default: [],
    },
    // Notification preferences (all enabled by default)
    notifyDirectMessage: { type: Boolean, default: true }, // 1. Someone sends you a message
    notifyGroupChatMessage: { type: Boolean, default: true }, // 2. Group chat message received
    notifyMentionInPost: { type: Boolean, default: true }, // 3. Mentioned in a post
    notifyMentionInComment: { type: Boolean, default: true }, // 4. Mentioned in a comment
    notifyMentionInReply: { type: Boolean, default: true }, // 5. Mentioned in a reply
    notifyCommentOnYourPost: { type: Boolean, default: true }, // 6. Someone commented on your post
    notifyReplyToYourComment: { type: Boolean, default: true }, // 7. Someone replied to your comment
    notifyLikeOnYourPost: { type: Boolean, default: true }, // 8. Someone liked your post
    notifyLikeOnYourComment: { type: Boolean, default: true }, // 9. Someone liked your comment
    // New consolidated preferences
    notifyPostComment: { type: Boolean, default: true },
    notifyCommentReply: { type: Boolean, default: true },
    notifyMentions: { type: Boolean, default: true },
    notifyPostLike: { type: Boolean, default: true },
    notifyPostRepost: { type: Boolean, default: true },
    notifyNewFollower: { type: Boolean, default: true },
    notifyMessageReaction: { type: Boolean, default: true },
    notifyStreakReminder: { type: Boolean, default: true },
    notifyStreakMilestone: { type: Boolean, default: true },
    notifyStudySessionReminder: { type: Boolean, default: true },
    notifyNewBlogUploaded: { type: Boolean, default: true },
    notifyNewBookClubAvailable: { type: Boolean, default: true },
    isProUser:{
      type:Boolean
    }
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
