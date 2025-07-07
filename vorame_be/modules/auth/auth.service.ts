// packages imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { CustomError } from "../../errors/custom.error";
import User from "../user/user.model";
import { EMails } from "../../contants/EMail";
import mailNotification from "../../helper/AWSService";
import smsNotification from "../../helper/AWSService";
import { generateOTP } from "../../helper/otpGenerate";
import { config } from "../../config/config";
import type { Request, Response } from "express";
import { OTP_ENUM } from "../../modules/user/enums/otp.enums";
import { AppTypes } from "../../contants/types";
import moment from "moment";
import { toLower } from "lodash";

const EMAIL_VERIFICATION_EXPIRE_TIME = 60 * 5;

class AuthService {
  async hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  }

  // compare password
  async comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }

  /**
   * Login method
   * @param req
   * @param res
   * @returns authentication object
   */

  async login(body) {
    const { email, phoneNumber, password } = body;

    // Check if email or phone number is provided
    if (!email && !phoneNumber) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.INVALID_CREDENTIALS
      );
    }

    // Find user by email or phone number
    const user = await User.findOne(
      email ? { email: email.toLowerCase() } : { phoneNumber }
    );

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // Validate the corresponding password field
    if (email) {
      if (
        !user.password ||
        !(await this.comparePassword(password, user.password))
      ) {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.INCORRECT_PASSWORD
        );
      }
    } else if (phoneNumber) {
      if (
        !user.password ||
        !(await this.comparePassword(password, user.password))
      ) {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.INCORRECT_PASSWORD
        );
      }
    }

    // Create JWT token payload
    const payload = {
      _id: user._id,
    };

    // Populate additional fields
    await user.populate("subscription");
    await user.populate("subscription.planId");

    const token = jwt.sign(payload, "JWT_SECRET_VORAME_KEY", {
      expiresIn: "168h", // Ensure this is a valid string or number
    });

    return {
      message: "Login Successfully",
      data: { user },
      token,
      statusCode: EHttpStatus.OK,
    };
  }

  /**
   * Register new user
   * @param req
   * @param res
   * @returns errors|user
   */
  async emailSignup(body: any) {
    const { email } = body;
    if (!email) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.EMAIL_REQUIRED
      );
    }

    const userOtp = generateOTP();
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // if (user.isEmailVerified) {
      //   throw new CustomError(
      //     EHttpStatus.BAD_REQUEST,
      //     ResponseMessage.ALREADY_USER_EXIST
      //   );
      // }

      // Update existing unverified user
      user.otp = userOtp;
      user.otpStatus = OTP_ENUM.NOT_VERIFIED;
      user.otpSentAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        otp: userOtp,
        otpStatus: OTP_ENUM.NOT_VERIFIED,
        otpSentAt: new Date(),
      });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { _id: user._id },
      `${config.JWT_SECRET_VORAME}`,
      { expiresIn: EMAIL_VERIFICATION_EXPIRE_TIME }
    );

    try {
      await mailNotification.sendMail({
        to: email,
        subject: ResponseMessage.USER_CREATED_MAIL,
        html: EMails["REGISTER_USER"]({
          name: email,
          email,
          redirectLink: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
          otp: userOtp,
        }),
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return {
      statusCode: EHttpStatus.CREATED,
      message: ResponseMessage.ACCOUNT_CREATED,
    };
  }

  async phoneSignup(body: any) {
    const { phoneNumber } = body;

    if (!phoneNumber) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PHONE_NUMBER_REQUIRED
      );
    }

    const userOtp = generateOTP();
    let user = await User.findOne({ phoneNumber });

    if (user) {
      // if (user.isPhoneVerified) {
      //   throw new CustomError(
      //     EHttpStatus.BAD_REQUEST,
      //     ResponseMessage.ALREADY_USER_EXIST
      //   );
      // }

      // Update existing unverified user
      user.otp = userOtp;
      user.otpStatus = OTP_ENUM.NOT_VERIFIED;
      user.otpSentAt = new Date();
      // await user.save();
      await User.findByIdAndUpdate(user._id, user);
    } else {
      // console.log("=================================");

      user = await User.create({
        phoneNumber,
        otp: userOtp,
        otpStatus: OTP_ENUM.NOT_VERIFIED,
        otpSentAt: new Date(),
      });

      // Check if a user with a null phone number exists (this can happen if the user previously registered using an email)
      // user = await User.findOne({ phoneNumber: null });

      // if (user) {
      //   // Update the user with the provided phone number
      //   user.phoneNumber = phoneNumber;
      //   user.otp = userOtp;
      //   user.otpStatus = OTP_ENUM.NOT_VERIFIED;
      //   await user.save();
      // } else {
      //   // Create new user
      //   user = await User.create({
      //     phoneNumber,
      //     otp: userOtp,
      //     otpStatus: OTP_ENUM.NOT_VERIFIED,
      //   });
      // }
    }

    try {
      await smsNotification.sendSms({
        otp: userOtp.toString(),
        phone: phoneNumber,
      });
      return {
        statusCode: EHttpStatus.CREATED,
        message: ResponseMessage.OTP_SENT,
      };
    } catch (error) {
      console.error("Error sending OTP via SMS:", error);
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.OTP_SEND_FAILED,
      };
    }
  }

  // Create user account after signup
  async createAccount(body: any) {
    const { email, userName, password } = body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // Hash password if provided
    let passwordHash = user.password;
    if (password) {
      passwordHash = await this.hashPassword(password);
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { ...body, password: passwordHash, name: userName },
      { new: true, lean: true } // Returns updated user and converts it to a plain object
    );

    if (!updatedUser) {
      throw new CustomError(
        EHttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.UPDATE_FAILED
      );
    }

    // Generate token
    const payload = { _id: user._id };
    const token = jwt.sign(payload, config.JWT_SECRET_VORAME as jwt.Secret, {
      expiresIn: `168h`,
    });

    // Remove password from response
    const { password: _, ...userData } = updatedUser;

    return {
      data: { user: updatedUser },
      token,
      statusCode: EHttpStatus.CREATED,
      message: ResponseMessage.ACCOUNT_CREATED,
    };
  }

  async createAccountPhoneNo(body: any) {
    const { phoneNumber, userName, password } = body;

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // Handle password hashing only if a password is provided
    let passwordHash = user.password;
    if (password) {
      passwordHash = await this.hashPassword(password);
    }

    // Update user data
    await User.findByIdAndUpdate(user._id, {
      ...body,
      password: passwordHash,
      name: userName,
    });

    // Fetch the updated user data
    const updatedUser = await User.findById(user._id).lean();

    if (!updatedUser) {
      throw new CustomError(
        EHttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.UPDATE_FAILED
      );
    }

    // Remove password from response
    const { password: _, ...userData } = updatedUser;

    // Generate token
    const payload = { _id: user._id };
    const token = jwt.sign(payload, `${config.JWT_SECRET_VORAME}`, {
      expiresIn: `164h`,
    });

    console.log(userData);
    return {
      data: { user: updatedUser },
      token,
      statusCode: EHttpStatus.CREATED,
      message: ResponseMessage.ACCOUNT_CREATED,
    };
  }

  //compare Password same or not
  async verifyPassword(userId: string, body: { currentPassword: string }) {
    const { currentPassword } = body;

    // Fetch user by userId
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // Check if old password matches
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new CustomError(
        EHttpStatus.UNAUTHORIZED,
        ResponseMessage.INVALID_OLD_PASSWORD
      );
    }

    return { success: true, message: "Password verified successfully" };
  }

  //change the password
  async changePassword(userId: string, body: any) {
    const { oldPassword, newPassword } = body;

    // Fetch user by userId
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // Check if old password matches
    const isPasswordValid = await this.comparePassword(
      oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new CustomError(
        EHttpStatus.UNAUTHORIZED,
        ResponseMessage.INVALID_OLD_PASSWORD
      );
    }

    // Hash the new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update the user's password
    user.password = newPasswordHash;
    const response = await user.save();

    if (!response) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PASSWORD_NOT_UPDATED
      );
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.PASSWORD_UPDATED,
    };
  }

  async userVerification(req: Request) {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    return {
      data: {
        user,
      },
      statusCode: EHttpStatus.OK,
    };
  }

  // Otp verification using email
  async otpVerification(req: Request) {
    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({
      email:lowerEmail
    });
    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    const currentTime = moment();
    const isTimeExpired = currentTime.diff(moment(user.otpSentAt), "minutes");
    if (isTimeExpired >= 1) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.OTP_EXPIRED
      );
    }
    if (user.otp !== otp) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.INVALID_OTP
      );
    }
    user.isEmailVerified = true;
    user.otp = null;
    user.otpStatus = OTP_ENUM.VERIFIED;
    await user.save();
    if (user.name && user.firstName && user.lastName) {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, config.JWT_SECRET_VORAME as jwt.Secret, {
        expiresIn: `168h`,
      });
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.OTP_VERIFIED,
        data: {
          user,
          token,
        },
      };
    } else {
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.OTP_VERIFIED,
      };
    }
  }

  //  phone number OTP verification
  async phoneOtpVerification(req: Request) {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });

    const currentTime = moment();
    const isTimeExpired = currentTime.diff(moment(user.otpSentAt), "minutes");

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    if (isTimeExpired >= 1) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.OTP_EXPIRED
      );
    }

    if (user.otp !== otp) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.INVALID_OTP
      );
    }

    user.isPhoneVerified = true;
    user.otp = null;
    user.otpStatus = OTP_ENUM.VERIFIED;
    await user.save();

    if (user.name && user.firstName && user.lastName) {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, config.JWT_SECRET_VORAME as jwt.Secret, {
        expiresIn: `168h`,
      });
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.OTP_VERIFIED,
        data: {
          user,
          token,
        },
      };
    } else {
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.OTP_VERIFIED,
      };
    }
  }

  async getAllCountries() {
    // Retrieve distinct country names from the User collection
    const mapData = await User.find(
      {},
      { countryName: 1, lattitude: 1, longitude: 1 }
    );

    if (!mapData || mapData.length === 0) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.COUNTRIES_NOT_FOUND
      );
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.COUNTRIES_RETRIEVED,
      data: mapData,
    };
  }

  async me(req: Request | any) {
    const { _id } = req.payload;
    const user = await User.findById(_id);

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    await user.populate("subscription");
    await user.populate("subscription.planId");

    return {
      data: user,
      statusCode: EHttpStatus.OK,
    };
  }

  async getUserDetailsFromEmail(req: Request, res: Response) {
    const { email } = req.params as { email: string };

    const user = await User.findOne({ email: email?.toLowerCase() }).select(
      "-password"
    );

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    return {
      data: {
        user,
      },
      statusCode: EHttpStatus.OK,
    };
  }

  /**
   * Forgot user password using phone number
   * @param body
   * @returns OTP sent response or user not found error
   */
  async phoneForgotPassword(body: any) {
    const { phoneNumber } = body;

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    try {
      // Generate OTP for password reset
      let userOtp = generateOTP();

      user.otp = userOtp;
      await user.save();

      // Send OTP via SMS
      await smsNotification.sendSms({
        otp: userOtp.toString(),
        phone: phoneNumber,
      });
    } catch (error) {
      console.error("Error sending OTP via SMS:", error);
      throw new CustomError(
        EHttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.OTP_SEND_FAILED
      );
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.OTP_SENT,
    };
  }

  /**
   * forgot user password using email
   * @param req
   * @param res
   * @returns reset password link
   */
  async forgotPassword(body) {
    const { email, appType } = body;

    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    try {
      // Updating user otp for forgot password
      let userOtp;
      if (appType === AppTypes.MOBILE) {
        userOtp = generateOTP();
      } else {
        userOtp = null;
      }
      user.otp = userOtp;
      await user.save();
      // Email message options
      const mailOptions = {
        to: email,
        subject: ResponseMessage.FORGOT_MAIL,
        html: EMails["FORGOT_PASSWORD"]({
          email,
          redirectLink: `${config.FRONTEND_URL}/setnewpassword/${user._id}`,
          otp: userOtp,
        }),
      };

      await mailNotification.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
    };
  }

  /**
   * User reset password
   * @param body
   * @returns password reset message
   */
  async resetPassword(body) {
    const { password, userId, email, phoneNumber } = body;

    let user;
    let passwordHash = await this.hashPassword(password);

    if (phoneNumber) {
      user = await User.findOneAndUpdate(
        { phoneNumber: phoneNumber },
        { password: passwordHash },
        { new: true }
      );
    } else if (email) {
      user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { password: passwordHash },
        { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        userId,
        { password: passwordHash },
        { new: true }
      );
    }

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    return {
      user: user,
      message: ResponseMessage.PASS_RESET,
      statusCode: EHttpStatus.OK,
    };
  }

  /**
   * user auth with google
   * @param req
   * @param res
   * @returns return user detail
   */
  async googleAuthHandler(body) {
    const { email, providerId, name, avatar, providerType } = body;

    let user = await User.create({
      isEmailVerified: true,
      isActive: "active",
      name,
      avatar,
      providerId,
      providerType,
      email: email.toLowerCase(),
    });

    const token = jwt.sign({ _id: user._id }, `${config.JWT_SECRET_VORAME}`, {
      expiresIn: `168h`,
    });

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      token,
      data: { user },
    };
  }

  async socialAuthUserVerification(body) {
    const { email } = body;

    let user: any = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    if (user && user.isEmailVerified) {
      const token = jwt.sign({ _id: user._id }, `${config.JWT_SECRET_VORAME}`, {
        expiresIn: `168h`,
      });

      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SUCCESSFUL,
        token,
        data: { user },
      };
    } else if (user && !user.isEmailVerified) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.UNOTHORIZED_USER,
        data: { user },
      };
    }
  }
}

export default new AuthService();
