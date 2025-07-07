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
import { Boardroom, BoardroomComment, BoardroomPoll, BoardroomReaction, BoardroomReport } from "../boardroom/boardroom.model";

class UserService {
  constructor() { }

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
    const { limit = "9", offset = "0", searchTerm = "" } = query;
    const total = await User.find({
      //@ts-ignore
      userRole: { $nin: "admin" },
      deleted: { $ne: true },
      isEmailVerified: true,
      $or: ["firstName", "lastName", "email", "isActive"].map((field) => ({
        [field]: { $regex: new RegExp("^" + searchTerm, "i") },
      })),
    }).countDocuments();
    const users = await User.aggregate([
      {
        $match: {
          userRole: { $nin: ["admin"] },
          deleted: { $ne: true },
          isEmailVerified: true,
          $or: [
            { firstName: { $regex: new RegExp("^" + searchTerm, "i") } },
            { lastName: { $regex: new RegExp("^" + searchTerm, "i") } },
            { email: { $regex: new RegExp("^" + searchTerm, "i") } },
            { isActive: { $regex: new RegExp("^" + searchTerm, "i") } },
          ],
        },
      },
      {
        $lookup: {
          from: 'purchasehistories',
          localField: '_id',
          foreignField: 'user',
          as: 'purchaseHistory',
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $sortArray: { input: '$purchaseHistory', sortBy: { createdAt: -1 } },
          },
        },
      },
      {
        $addFields: {
          purchaseHistory: {
            $cond: {
              if: { $gt: [{ $size: '$purchaseHistory' }, 0] },
              then: { $arrayElemAt: ['$purchaseHistory', 0] },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'purchaseHistory.planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      {
        $addFields: {
          plan: {
            $cond: {
              if: { $gt: [{ $size: '$plan' }, 0] },
              then: { $arrayElemAt: ['$plan', 0] },
              else: null,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },  // Sort users by createdAt field (in the User collection)
      },
      {
        $skip: parseInt(offset),
      },
      {
        $limit: parseInt(limit),
      },
    ]);



    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: { total, users },
    };
  }

  // get users
  async getUsers({ query }) {
    const { limit = "9", offset = "0", searchTerm = "" } = query;
    const total = await User.find({
      //@ts-ignore
      userRole: { $ne: "admin" },
      deleted: { $ne: true },
      isEmailVerified: true,
      $or: ["firstName", "lastName", "email", "isActive"].map((field) => ({
        [field]: { $regex: new RegExp("^" + searchTerm, "i") },
      })),
    }).countDocuments();
    const users = await User.aggregate([{
      $match: {
        userRole: { $ne: "admin" },
        deleted: { $ne: true },
        isEmailVerified: true,
        $or: ["firstName", "lastName", "email", "isActive"].map((field) => ({
          [field]: { $regex: new RegExp("^" + searchTerm, "i") },
        })),
      }
    }, {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'following',
        as: 'following'
      }
    }, {
      $addFields: {
        isFollowing: {
          $gt: [{ $size: '$following' }, 0]
        }
      }
    }, {
      $skip: parseInt(offset)
    }, {
      $limit: parseInt(limit)
    }, {
      $project: {
        following: 0
      }
    }]);

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

  async updateUser({ params, body }) {
    const { id } = params;
    const user = await User.findByIdAndUpdate(id, {
      $set: body,
    }, { new: true });

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
      ...body
    });

    let name = '';

    if (fName) {
      name = fName + " "
    }
    if (lastName) {
      name = lName
    }
    if (!name) {
      name = firstName + ' ' + lastName;
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
      data
    };
  }

  //   get account
  async getAccount({ payload, body }: Request) {
    const { _id: loginUserId } = payload;
    const { id } = body;
    const userId = objectId(id);
    const user = await User.findById(id);
    let myProfile = id === loginUserId;

    let isFollowing = myProfile ? 'me' : myProfile;

    const followers = await Follow.find({ user: userId }).populate('user').populate('following').countDocuments();
    const followings = await Follow.find({ following: userId }).populate('user').populate('following').countDocuments();
    const totalLikes = await BoardroomReaction.aggregate([
      {
        $lookup: {
          from: 'boardrooms',
          localField: 'messageId',
          foreignField: '_id',
          as: 'messageDetails',
        },
      },
      {
        $unwind: '$messageDetails',
      },
      {
        $match: {
          'messageDetails.postedBy': userId,
        },
      },
      {
        $group: {
          _id: null,
          likesCount: { $sum: { $size: '$likedBy' } },
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
      user: { ...userAccount, likes, followers, followings, ...(isFollowing !== 'me' && { isFollowing: isFollowing ? true : false }) },
    };
  }

  //  get blocked users
  async getBlockedUsers({ payload }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const users = await BlockedUser.find({ userId }).populate('userId').populate('blockedUserId');

    return {
      statusCode: EHttpStatus.OK,
      data: users,
    };
  }

  //  get user followers
  async followers({ params }: Request) {
    const { id } = params;
    const userId = objectId(id);

    const users = await Follow.aggregate([
      {
        $match: {
          user: userId
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: 'following',
          foreignField: 'user',
          as: 'followings'
        }
      },
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: "_id",
          localField: 'user'
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] }
        }
      },
      {
        $lookup: {
          from: 'users',
          as: 'following',
          foreignField: "_id",
          localField: 'following'
        }
      },
      {
        $addFields: {
          following: { $arrayElemAt: ["$following", 0] }
        }
      },
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
                        { $eq: ["$$f.user", "$following._id"] }
                      ]
                    }
                  }
                }
              },
              then: true,
              else: false
            }
          }
        }
      }, {
        $project: {
          followings: 0
        }
      }
    ]);


    return {
      statusCode: EHttpStatus.OK,
      data: users,
    };
  }

  //  get following users
  async following({ params }: Request) {
    const { id } = params;

    const userId = objectId(id);

    const users = await Follow.aggregate([{
      $match: {
        following: userId
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'user',
        foreignField: 'following',
        as: 'followings'
      }
    },

    {
      $lookup: {
        from: 'users',
        as: 'user',
        foreignField: "_id",
        localField: 'user'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] }
      },
    },
    {
      $lookup: {
        from: 'users',
        as: 'following',
        foreignField: "_id",
        localField: 'following'
      }
    },
    {
      $addFields: {
        following: { $arrayElemAt: ["$following", 0] }
      },
    },
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
                      { $eq: ["$$f.user", "$following._id"] }
                    ]
                  }
                }
              }
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        followings: 0
      }
    }

    ]);

    return {
      statusCode: EHttpStatus.OK,
      data: users,
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

    await BoardroomComment.deleteMany({ postedBy: userId })
    await BoardroomReport.deleteMany({ $or: [{ reportedBy: userId }, { reportedUser: userId }] });

    return {
      message: ResponseMessage.ACCOUNT_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new UserService();
