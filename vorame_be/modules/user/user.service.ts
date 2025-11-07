import bcrypt from "bcrypt";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { CustomError } from "../../errors/custom.error";
import mailNotification from "../../helper/SESMail";
import User, { BlockedUser, Follow } from "./user.model";
import { EMails } from "../../contants/EMail";
import ContactUs from "./contactus.model";
import { objectId, VORAME_EMAIL } from "../../utils";
import { Request } from "express";
import {
  Boardroom,
  BoardroomComment,
  BoardroomPoll,
  BoardroomReaction,
  BoardroomReport,
} from "../boardroom/boardroom.model";

// Helper to robustly extract string query params
function getStringParam(val: any, fallback: string): string {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
  return fallback;
}

class UserService {
  constructor() {}
  isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
  async blockUser(params) {
    const { id: userId } = params;
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: EHttpStatus.NOT_FOUND,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }
    if (!(user.isBoardroomBlocked && user.isTouchpointBlocked)) {
      user.isBoardroomBlocked = true;
      user.isTouchpointBlocked = true;
      await user.save();
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.USER_BLOCKED,
      };
    } else {
      user.isBoardroomBlocked = false;
      user.isTouchpointBlocked = false;
      await user.save();
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.USER_UNBLOCKED,
      };
    }
  }

  async hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  }

  async comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }

  //   Change password
  async changePassword(body) {
    const { id, oldPassword, newPassword } = body;

    const user = await User.findById({ _id: id });

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    let validatePassoword = await this.comparePassword(
      oldPassword,
      user.password
    );

    if (!validatePassoword) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.INCORRECT_PASSWORD
      );
    }

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;

    const updatedUser = await user.save();

    if (!updatedUser) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PASSWORD_NOT_UPDATED
      );
    }

    return {
      message: ResponseMessage.PASS_RESET,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Change avatar
  async changeAvatar(body) {
    const { id, avatar } = body;

    const user = await User.findById({ _id: id });

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    user.avatar = avatar;
    const updatedAvatar = await user.save();

    if (!updatedAvatar) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PROFILE_PICTURE_NOT_UPDATED
      );
    }

    return {
      message: ResponseMessage.PROFILE_PICTURE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // get users
  async getUsersByAdmin({ query }) {
    const { limit = "9", offset = "0", searchTerm = "", plan = "" } = query;
    let match: any = {
      userRole: { $nin: ["admin"] },
      deleted: { $ne: true },
      isEmailVerified: true,
    };

    const searchOr = [
      { firstName: { $regex: new RegExp("^" + searchTerm, "i") } },
      { lastName: { $regex: new RegExp("^" + searchTerm, "i") } },
      { email: { $regex: new RegExp("^" + searchTerm, "i") } },
      { isActive: { $regex: new RegExp("^" + searchTerm, "i") } },
    ];

    if (plan === "blocked") {
      match.$and = [
        { $or: searchOr },
        {
          $or: [
            { isBoardroomBlocked: true },
            { isTouchpointBlocked: true },
          ],
        },
      ];
    } else {
      match.$or = searchOr;
    }

    const users = await User.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "purchasehistories",
          localField: "_id",
          foreignField: "user",
          as: "purchaseHistory",
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $sortArray: {
              input: "$purchaseHistory",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $cond: {
              if: { $gt: [{ $size: "$purchaseHistory" }, 0] },
              then: { $arrayElemAt: ["$purchaseHistory", 0] },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "purchaseHistory.planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $addFields: {
          plan: {
            $cond: {
              if: { $gt: [{ $size: "$plan" }, 0] },
              then: { $arrayElemAt: ["$plan", 0] },
              else: null,
            },
          },
        },
      },
      // Plan-based filtering after lookup
      ...(plan === "all"
        ? [
            {
              $match: {
                $and: [
                  { "purchaseHistory": { $ne: null } },
                  { "purchaseHistory.status": { $nin: ["expired", "cancelled"] } },
                  {
                    $or: [
                      { "purchaseHistory.endDate": null },
                      { $expr: { $gte: ["$purchaseHistory.endDate", new Date()] } }
                    ]
                  }
                ],
              },
            },
          ]
        : plan === "expired"
        ? [
            {
              $match: {
                $or: [
                  { "purchaseHistory.status": "expired" },
                  {
                    $and: [
                      { "purchaseHistory.endDate": { $ne: null } },
                      { $expr: { $lt: ["$purchaseHistory.endDate", new Date()] } },
                      { "purchaseHistory.status": { $ne: "cancelled" } },
                    ],
                  },
                ],
              },
            },
          ]
        : plan === "cancelled"
        ? [
            {
              $match: {
                "purchaseHistory.status": "cancelled",
              },
            },
          ]
        : []),
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) },
    ]);

    // For total count, repeat the aggregation with $count
    let totalAgg = [
      { $match: match },
      {
        $lookup: {
          from: "purchasehistories",
          localField: "_id",
          foreignField: "user",
          as: "purchaseHistory",
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $sortArray: {
              input: "$purchaseHistory",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $cond: {
              if: { $gt: [{ $size: "$purchaseHistory" }, 0] },
              then: { $arrayElemAt: ["$purchaseHistory", 0] },
              else: null,
            },
          },
        },
      },
      ...(plan === "all"
        ? [
            {
              $match: {
                $and: [
                  { "purchaseHistory": { $ne: null } },
                  { "purchaseHistory.status": { $nin: ["expired", "cancelled"] } },
                  {
                    $or: [
                      { "purchaseHistory.endDate": null },
                      { $expr: { $gte: ["$purchaseHistory.endDate", new Date()] } }
                    ]
                  }
                ],
              },
            },
          ]
        : plan === "expired"
        ? [
            {
              $match: {
                $or: [
                  { "purchaseHistory.status": "expired" },
                  {
                    $and: [
                      { "purchaseHistory.endDate": { $ne: null } },
                      { $expr: { $lt: ["$purchaseHistory.endDate", new Date()] } },
                      { "purchaseHistory.status": { $ne: "cancelled" } },
                    ],
                  },
                ],
              },
            },
          ]
        : plan === "cancelled"
        ? [
            {
              $match: {
                "purchaseHistory.status": "cancelled",
              },
            },
          ]
        : []),
      { $count: "total" },
    ];
    const totalResult = await User.aggregate(totalAgg);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: { total, users },
    };
  }

  // get users
  async getUsers(query, payload ) {
    const { limit = "9", offset = "0", searchTerm = "" } = query;
    const currentUserId = payload?._id;
    
    console.log("Debug - currentUserId:", currentUserId);
    
    // Exclude current user from the results
    const matchCondition = {
      userRole: { $ne: "admin" },
      deleted: { $ne: true },
      isEmailVerified: true,
      // ...(currentUserId && { _id: { $ne: currentUserId } }), // Temporarily removed to test
      $or: ["firstName", "lastName", "email", "isActive"].map((field) => ({
        [field]: { $regex: new RegExp("^" + searchTerm, "i") },
      })),
    };
    
    const total = await User.find(matchCondition).countDocuments();
    
    const users = await User.aggregate([
      {
        $match: matchCondition,
      },
      ...(currentUserId ? [{
        $lookup: {
          from: "follows",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                                  $expr: {
                    $and: [
                      { $eq: [{ $toString: "$user" }, { $toString: "$$userId" }] },
                      { $eq: [{ $toString: "$following" }, currentUserId] }
                    ]
                  }
              }
            }
          ],
          as: "isFollowingCheck",
        },
      }] : [{
        $addFields: {
          isFollowingCheck: []
        }
      }]),

      {
        $addFields: {
          isFollowing: {
            $gt: [{ $size: "$isFollowingCheck" }, 0],
          },
        },
      },
      {
        $skip: parseInt(offset),
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          isFollowingCheck: 0,
        },
      },
    ]);

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: { total, users },
    };
  }

  //get user by id
  async getUserById({ params }) {
    const { id } = params;
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    const { password: _, ...userData } = user.toObject();
    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: userData,
    };
  }

  // get user id by username (case-insensitive)
  async getUserByName({ query }: Request) {
    const usernameRaw: any = (query as any)?.username;
    const username = getStringParam(usernameRaw, "").trim();

    if (!username) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        "username is required"
      );
    }

    const user = await User.findOne({ name: username })
      .collation({ locale: "en", strength: 2 })
      .select("_id");

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: { id: user._id },
    };
  }

  async updateUser({ params, body }) {
    const { id } = params;
    // If attempting to change the name, ensure uniqueness (case-insensitive)
    if (body && typeof body.name === "string" && body.name.trim()) {
      const candidate = body.name.trim();
      const existing = await User.findOne({ name: candidate }).collation({ locale: "en", strength: 2 });
      if (existing && String(existing._id) !== String(id)) {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.USERNAME_ALREADY_EXISTS
        );
      }
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      { new: true }
    );

    await user.populate("subscription");
    await user.populate("subscription.planId");

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: user,
    };
  }

  async contactUs({ payload, body }) {
    const { _id } = payload;
    const { subject, message, firstName: fName, lastName: lName } = body;
    const { firstName, lastName, email } = await User.findById(_id);
    const data = await ContactUs.create({
      user: _id,
      ...body,
    });

    let name = "";

    if (fName) {
      name = fName + " ";
    }
    if (lastName) {
      name = lName;
    }
    if (!name) {
      name = firstName + " " + lastName;
    }
    try {
      const mailOptions = {
        to: VORAME_EMAIL,
        subject,
        html: EMails["CONTACT_US"]({
          name,
          email,
          subject,
          message,
          redirectLink: ``,
        }),
      };

      await mailNotification.sendMail(mailOptions);
    } catch (error) {
      console.log("Error from mail");
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data,
    };
  }

  //   get account
  async getAccount({ payload, body }: Request) {
    const { _id: loginUserId } = payload;
    const { id } = body;
    const userId = objectId(id);
    const user = await User.findById(id);
    let myProfile = id === loginUserId;

    let isFollowing = myProfile ? "me" : myProfile;

    const followers = await Follow.find({ user: userId })
      .populate("user")
      .populate("following")
      .countDocuments();
    const followings = await Follow.find({ following: userId })
      .populate("user")
      .populate("following")
      .countDocuments();
    const totalLikes = await BoardroomReaction.aggregate([
      {
        $lookup: {
          from: "boardrooms",
          localField: "messageId",
          foreignField: "_id",
          as: "messageDetails",
        },
      },
      {
        $unwind: "$messageDetails",
      },
      {
        $match: {
          "messageDetails.postedBy": userId,
        },
      },
      {
        $group: {
          _id: null,
          likesCount: { $sum: { $size: "$likedBy" } },
        },
      },
    ]);

    const likes = totalLikes.length > 0 ? totalLikes[0].likesCount : 0;

    if (!isFollowing) {
      isFollowing = await Follow.findOne({ following: loginUserId, user: id });
    }

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.ACCOUNT_NOT_FOUND
      );
    }

    const { password: _, ...userAccount } = user.toObject();

    return {
      statusCode: EHttpStatus.OK,
      user: {
        ...userAccount,
        likes,
        followers,
        followings,
        ...(isFollowing !== "me" && {
          isFollowing: isFollowing ? true : false,
        }),
      },
    };
  }

  //  get blocked users
  async getBlockedUsers({ payload }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const users = await BlockedUser.find({ userId })
      .populate("userId")
      .populate("blockedUserId");

    return {
      statusCode: EHttpStatus.OK,
      data: users,
    };
  }

  async setStreak({payload}:Request)
  {
    const userId= payload._id

    const user= await User.findById(userId)
    if(!user){
      return{
        statusCode:EHttpStatus.NOT_FOUND,
        ResponseMessage: ResponseMessage.USER_NOT_FOUND
      }
    }
    const now = new Date();
    if (!user.streakUpdatedDate || !this.isSameDay(user.streakUpdatedDate, now))
    {
    user.currentStreak+=1
    user.streakUpdatedDate = now;
    await user.save();
    }
    return{
      statusCode:EHttpStatus.OK,
      ResponseMessage: ResponseMessage.SUCCESSFUL,
      currentStreak: user.currentStreak
    }
  }
  async getStreak({payload}:Request)
  {
    const userId=payload._id
    const user= await User.findById(userId)
    if(!user){
      return{
        statusCode:EHttpStatus.NOT_FOUND,
        ResponseMessage: ResponseMessage.USER_NOT_FOUND
      }
    }
    if(user.streakUpdatedDate)
    {
    const today = new Date();
    const lastUpdate = user.streakUpdatedDate;
    const diffInMs = today.getTime() - lastUpdate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if(diffInDays>1)
    {
      user.currentStreak=0
      await user.save()
    }
  }
    return{
      statusCode:EHttpStatus.OK,
      ResponseMessage: ResponseMessage.SUCCESSFUL,
      currentStreak: user.currentStreak
    }
  }
  //  get user followers
  async followers({ params, query }: Request) {
    const { id } = params;
    const userId = objectId(id);
    const limitStr = getStringParam((query as any).limit, "15");
    const offsetStr = getStringParam((query as any).offset, "0");
    const rawSearch = (query as any)?.name ?? (query as any)?.search ?? (query as any)?.searchTerm;
    const searchTermStr = getStringParam(rawSearch, "");
    const userOffset = parseInt(offsetStr, 10);
    const userLimit = parseInt(limitStr, 10);

    // Build the aggregation pipeline
    const basePipeline = [
      { $match: { user: userId } },
      {
        $lookup: {
          from: "follows",
          localField: "following",
          foreignField: "user",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "users",
          as: "user",
          foreignField: "_id",
          localField: "user",
        },
      },
      { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
      {
        $lookup: {
          from: "users",
          as: "following",
          foreignField: "_id",
          localField: "following",
        },
      },
      { $addFields: { following: { $arrayElemAt: ["$following", 0] } } },
      {
        $addFields: {
          isFollowing: {
            $cond: {
              if: {
                $anyElementTrue: {
                  $map: {
                    input: "$followings",
                    as: "f",
                    in: {
                      $and: [
                        { $eq: ["$$f.following", "$user._id"] },
                        { $eq: ["$$f.user", "$following._id"] },
                      ],
                    },
                  },
                },
              },
              then: true,
              else: false,
            },
          },
        },
      },
      // Search on user fields
      {
        $match: {
          $or: [
            { "following.firstName": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "following.lastName": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "following.name": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "following.email": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "following.isActive": { $regex: new RegExp("^" + searchTermStr, "i") } },
          ],
        },
      },
      { $project: { followings: 0 } },
    ];

    // Get total count
    const totalResult = await Follow.aggregate([
      ...basePipeline,
      { $count: "total" },
    ]);
    const total = totalResult[0]?.total || 0;

    // Get paginated data
    const users = await Follow.aggregate([
      ...basePipeline,
      { $skip: userOffset },
      { $limit: userLimit },
    ]);

    return {
      statusCode: EHttpStatus.OK,
      data: {
        total,
        limit: userLimit,
        offset: userOffset,
        users,
      },
    };
  }

  //  get following users
  async following({ params, query }: Request) {
    const { id } = params;
    const userId = objectId(id);
    const limitStr = getStringParam(query.limit, "15");
    const offsetStr = getStringParam(query.offset, "0");
    const searchTermStr = getStringParam(query.searchTerm, "");
    const userOffset = parseInt(offsetStr, 10);
    const userLimit = parseInt(limitStr, 10);

    // Build the aggregation pipeline
    const basePipeline = [
      { $match: { following: userId } },
      {
        $lookup: {
          from: "follows",
          localField: "user",
          foreignField: "following",
          as: "followings",
        },
      },
      {
        $lookup: {
          from: "users",
          as: "user",
          foreignField: "_id",
          localField: "user",
        },
      },
      { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
      {
        $lookup: {
          from: "users",
          as: "following",
          foreignField: "_id",
          localField: "following",
        },
      },
      { $addFields: { following: { $arrayElemAt: ["$following", 0] } } },
      {
        $addFields: {
          isFollowing: {
            $cond: {
              if: {
                $anyElementTrue: {
                  $map: {
                    input: "$followings",
                    as: "f",
                    in: {
                      $and: [
                        { $eq: ["$$f.following", "$user._id"] },
                        { $eq: ["$$f.user", "$following._id"] },
                      ],
                    },
                  },
                },
              },
              then: true,
              else: false,
            },
          },
        },
      },
      // Search on user fields
      {
        $match: {
          $or: [
            { "user.firstName": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "user.lastName": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "user.email": { $regex: new RegExp("^" + searchTermStr, "i") } },
            { "user.isActive": { $regex: new RegExp("^" + searchTermStr, "i") } },
          ],
        },
      },
      { $project: { followings: 0 } },
    ];

    // Get total count
    const totalResult = await Follow.aggregate([
      ...basePipeline,
      { $count: "total" },
    ]);
    const total = totalResult[0]?.total || 0;

    // Get paginated data
    const users = await Follow.aggregate([
      ...basePipeline,
      { $skip: userOffset },
      { $limit: userLimit },
    ]);

    return {
      statusCode: EHttpStatus.OK,
      data: {
        total,
        limit: userLimit,
        offset: userOffset,
        users,
      },
    };
  }

  //   delete account
  async deleteAccount(body) {
    const { id } = body;

    const findUser = await User.findById({ _id: id });

    if (!findUser) {
      return {
        message: ResponseMessage.ACCOUNT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletedAccount = await User.findByIdAndDelete({ _id: id });

    if (!deletedAccount) {
      return {
        message: ResponseMessage.ACCOUNT_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    const userId = deletedAccount._id;

    await Boardroom.deleteMany({ postedBy: userId });

    await BoardroomReaction.updateMany(
      {},
      {
        $pull: {
          reactedBy: userId,
          likedBy: userId,
          dislikedBy: userId,
        },
      }
    );

    await BoardroomPoll.updateMany(
      {},
      {
        $pull: {
          votes: { user: userId },
        },
      }
    );

    await BoardroomComment.deleteMany({ postedBy: userId });
    await BoardroomReport.deleteMany({
      $or: [{ reportedBy: userId }, { reportedUser: userId }],
    });

    return {
      message: ResponseMessage.ACCOUNT_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Map friendly keys to schema fields
  private notificationKeyMap: Record<string, keyof import('./interfaces/user.interface').default> = {
    // New canonical keys
    commentsOnMyPost: 'notifyPostComment',
    repliesToMyComment: 'notifyCommentReply',
    mentions: 'notifyMentions',
    likesOnMyPost: 'notifyPostLike',
    repostsOfMyPost: 'notifyPostRepost',
    newFollower: 'notifyNewFollower',
    directMessage: 'notifyDirectMessage',
    groupChatMessages: 'notifyGroupChatMessage',
    messageReaction: 'notifyMessageReaction',
    streakReminder: 'notifyStreakReminder',
    streakMilestone: 'notifyStreakMilestone',
    studySessionReminder: 'notifyStudySessionReminder',
    newBlogUploaded: 'notifyNewBlogUploaded',
    newBookClubAvailable: 'notifyNewBookClubAvailable',

    // Backward-compatible aliases
    groupChatMessage: 'notifyGroupChatMessage',
    commentOnYourPost: 'notifyPostComment',
    replyToYourComment: 'notifyCommentReply',
    mentionInPost: 'notifyMentions',
    mentionInComment: 'notifyMentions',
    mentionInReply: 'notifyMentions',
    likeOnYourPost: 'notifyPostLike',
    likeOnYourComment: 'notifyLikeOnYourComment',
  } as any;

  async updateNotificationPreference(payload: any, body: any, enabled: boolean) {
    const userId = payload?._id;
    const key = (body?.key || '').toString();

    const field = this.notificationKeyMap[key];
    if (!field) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.INVALID_NOTIFICATION_KEY,
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: EHttpStatus.NOT_FOUND,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }

    // @ts-ignore dynamic set
    user[field] = enabled;
    await user.save();

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.NOTIFICATION_PREFERENCE_UPDATED,
      data: { key, value: enabled },
    };
  }
}

export default new UserService();
