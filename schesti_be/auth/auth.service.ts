// packages imports
import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Stripe } from 'stripe';
import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

// module imports
import User from '../user/user.model';
import Users from '../user/user.model';
import SESMail from '../../helper/SESMail';
import { render } from '@react-email/render';
import { config } from '../../config/config';
import { EMails } from '../../contants/EMail';
import * as paypal from '../../helper/paypal';
import * as Paymob from '../../helper/paymob';
import mailNotification from '../../helper/SESMail';
import { sendEmail } from '../../helper/mail.helper';
import { FRONTEND_LINKS } from '../../contants/Links';
import { generateOTP } from '../../helper/otpGenerate';
import { CustomError } from '../../errors/custom.error';
import SignUpEmail from '../../emails/auth/SignUpEmail';
import ICompany from '../user/interfaces/user.interface';
import { EHttpStatus } from '../../enums/httpStatus.enum';
import { paypalService } from '../../helper/paypalHelper';
import PlansModel from '../pricingPlans/pricingPlan.model';
import PricingPlans from '../pricingPlans/pricingPlan.model';
import { ResponseMessage } from '../../enums/resMessage.enum';
import { sentemailHelper } from '../../helper/sentEmailHelper';
import { sendEmail as sendEmailViaMailchimp } from '../../helper/mailship';
import CommonEmail from '../../emails/common-email/CommonEmail';
import { FreePlanSubscriptionDto } from './dto/subscription.dto';
import { stripe as StripeHelper } from '../../helper/stripe.helper';
import ResetPasswordEmail from '../../emails/auth/ResetPasswordEmail';
import FailedPaymentEmail from '../../emails/auth/FailedPaymentEmail';
import VerificationOTPEmail from '../../emails/auth/VerificationOTPEmail';
import VerificationCodeEmail from '../../emails/auth/VerificationCodeEmail';
import IPricingPlan from '../../modules/pricingPlans/pricingPlan.interface';
import SubcriptionHistory from '../subcriptionHistory/subcriptionHistory.model';
import SubscriptionHistory from '../subcriptionHistory/subcriptionHistory.model';
import SubscriptionPlanUpgradeEmail from '../../emails/auth/SubscriptionPlanUpgradeEmail';
import SubscriptionCancellationEmail from '../../emails/auth/SubscriptionCancellationEmail';
import ChangePasswordConfirmationEmail from '../../emails/auth/ChangePasswordConfirmationEmail';
import NewSubscriptionPlanPurchaseEmail from '../../emails/auth/NewSubscriptionPlanPurchaseEmail';
import SubscriptionRenewelReminderEmail from '../../emails/auth/SubscriptionRenewelReminderEmail';
import ISubriptionHistory from '../../modules/subcriptionHistory/interfaces/subcriptionHistory.interface';
import {
  OTP_ENUM,
  USER_ROLES_ENUM,
  // userRoles,
} from '../user/enums/roles.enums';



type WebHookReqBody<T = {}> = {
  id: string;
  object: 'event';
  type: Stripe.Event.Type;
  data: T;
};

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
    const { email, password, remember } = body;

    console.log('Remember', remember);
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    } else if (user && user.isEmailVerified) {
      if (user.password) {
        let validatePassoword = await this.comparePassword(
          password,
          user.password
        );
        if (validatePassoword) {
          if (user.isActive === 'blocked') {
            throw new CustomError(
              EHttpStatus.BAD_REQUEST,
              ResponseMessage.ACCOUNT_BLOCKED
            );
          }
          // if the user is invited then we will send the associated company id as well otherwise we will not send the associated company id
          const payload = user.associatedCompany
            ? {
                _id: user._id,
                associatedCompany: user.associatedCompany,
              }
            : {
                _id: user._id,
              };

          const token = jwt.sign(payload, `${config.JWT_SECRET_SCHESTI}`, {
            expiresIn: remember ? '365d' : config.TOKENEXPIRE,
          });
          await user.populate('subscription');
          await user.populate('subscription.planId');
          // populate roles for a company employee
          if (user.associatedCompany) {
            await user.populate('roles');
          }
          return { data: { user }, token, statusCode: EHttpStatus.OK };
        } else {
          throw new CustomError(
            EHttpStatus.BAD_REQUEST,
            ResponseMessage.INCORRECT_PASSWORD
          );
        }
      } else {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.INCORRECT_PASSWORD
        );
      }
    } else {
      const verificationToken = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: EMAIL_VERIFICATION_EXPIRE_TIME, // 5 minutes ,
        }
      );
      try {
        // await sendEmail(
        //   email,
        //   ResponseMessage.USER_CREATED_MAIL,
        //   EMails['REGISTER_USER']({
        //     name: user.name,
        //     email,
        //     redirectLink: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
        //   })
        // );
        const mailOptions = {
          to: email,
          subject: ResponseMessage.USER_CREATED_MAIL,
          html: render(
            VerificationCodeEmail({
              link: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
              user: {
                name: user.name,
                email,
              },
            })
          ),
        };
      } catch (error) {
        console.log('Error from sending email');
      }
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.UNOTHORIZED_USER
      );
    }
  }

  /**
   * Register new user
   * @param req
   * @param res
   * @returns errors|user
   */
  async signup(body) {
    const { name, email, password, userRole } = body;

    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.isEmailVerified) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.ALREADY_USER_EXIST
      );
    }
    let passwordHash = await this.hashPassword(password);
    if (user && !user.isEmailVerified) {
      user.name = name;
      user.email = email.toLowerCase();
      user.password = passwordHash;
      user.roles = [];
      user.userRole = userRole;
      await user.save();

      // create a token that will be sent in the redirect link
      const verificationToken = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: EMAIL_VERIFICATION_EXPIRE_TIME, // 5 minutes ,
        }
      );

      try {
        // const mailOptions = {
        //   to: email,
        //   subject: ResponseMessage.USER_CREATED_MAIL,
        //   text: '',
        //   html: EMails['REGISTER_USER']({
        //     name,
        //     email,
        //     redirectLink: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
        //   }),
        // };
        const emailHtml = render(
          VerificationCodeEmail({
            link: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
            user: {
              name: user.name,
              email,
            },
          })
        );

        await sendEmailViaMailchimp({
          to: email,
          subject: ResponseMessage.USER_CREATED_MAIL,
          html: emailHtml,
        });
      } catch (error) {
        console.log('Error Register', error);
      }

      return {
        status: EHttpStatus.CREATED,
        message: ResponseMessage.ACCOUNT_CREATED,
      };
    } else if (!user) {
      user = await User.create({
        name: name,
        email: email.toLowerCase(),
        password: passwordHash,
        roles: [],
        userRole: userRole,
        isActive:
          userRole === USER_ROLES_ENUM.PROFESSOR ||
          userRole === USER_ROLES_ENUM.STUDENT
            ? 'pending'
            : 'active',
        verification:
          userRole === USER_ROLES_ENUM.OWNER
            ? {
                date: new Date(),
              }
            : undefined,
      });

      // create a token that will be sent in the redirect link
      const verificationToken = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: EMAIL_VERIFICATION_EXPIRE_TIME, // 5 minutes ,
        }
      );

      try {
        // Email message options
        const emailHtml = render(
          VerificationCodeEmail({
            link: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
            user: {
              name: user.name,
              email,
            },
          })
        );

        await sendEmailViaMailchimp({
          to: email,
          subject: ResponseMessage.USER_CREATED_MAIL,
          html: emailHtml,
        });
      } catch (error) {
        console.log(error);
      }

      return {
        status: EHttpStatus.CREATED,
        message: ResponseMessage.ACCOUNT_CREATED,
      };
    }
  }

  async userVerification(req: Request) {
    const { email } = req.body;

    console.log(email, 'emailemailemailemail');

    const user = await User.findOne({ email });

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
  async me(req: Request | any) {
    const { _id } = req.payload;

    const user = await User.findById(_id)
      .populate('associatedCompany')
      .populate('subscription')
      .populate('roles');

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    if (user.isActive === 'blocked') {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.ACCOUNT_BLOCKED
      );
    }

    await user.populate('subscription.planId');
    const token = jwt.sign({ _id: user._id }, `${config.JWT_SECRET_SCHESTI}`, {
      expiresIn: config.TOKENEXPIRE,
    });
    return {
      token,
      data: {
        user,
      },
      statusCode: EHttpStatus.OK,
    };
  }

  async postUserDetailsByEmail(req: Request, res: Response) {
    const { email }: any = req.body;

    const user = await User.findOne(
      { email: email?.toLowerCase() },
      { isEmailVerified: 1, _id: 1 }
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

  async getUserDetailsFromEmail(req: Request, res: Response) {
    const { email } = req.params as { email: string };

    const user = await User.findOne({ email: email?.toLowerCase() }).select(
      '-password'
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

  async forgotResendEmail(body) {
    const { email } = body;
    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    try {
      // Email message options
      const emailHtml = render(
        ResetPasswordEmail({
          user: {
            name: user.name,
          },
          link: `${config.FRONTEND_URL}/setnewpassword/${user._id}`,
        })
      );

      await sendEmailViaMailchimp({
        to: email,
        subject: ResponseMessage.FORGOT_MAIL,
        html: emailHtml,
      });
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
    };
  }

  async createAccountResendEmail(body) {
    const { email } = body;
    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }
    const verificationToken = jwt.sign(
      { _id: user._id },
      `${config.JWT_SECRET_SCHESTI}`,
      {
        expiresIn: EMAIL_VERIFICATION_EXPIRE_TIME, // 5 minutes ,
      }
    );

    try {
      // Email message options
      const emailHtml = render(
        VerificationCodeEmail({
          link: `${config.FRONTEND_URL}/companydetails/${verificationToken}`,
          user: {
            name: user.name,
            email,
          },
        })
      );

      await sendEmailViaMailchimp({
        to: email,
        subject: ResponseMessage.USER_CREATED_MAIL,
        html: emailHtml,
      });
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
    };
  }

  async signUpWithOTP(body: any) {
    const { name, email, password, userRole } = body;

    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.ALREADY_USER_EXIST
      );
    } else {
      const userOtp = generateOTP();
      let passwordHash = await this.hashPassword(password);

      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        roles: [],
        userRole: userRole,
        otp: userOtp,
        otpStatus: OTP_ENUM.NOT_VERIFIED,
        otpSentAt: new Date(),
        isActive:
          userRole === USER_ROLES_ENUM.PROFESSOR ||
          userRole === USER_ROLES_ENUM.STUDENT
            ? 'pending'
            : 'active',
        verification:
          userRole === USER_ROLES_ENUM.OWNER
            ? {
                date: new Date(),
              }
            : undefined,
      });

      try {
        const emailHtml = render(
          VerificationOTPEmail({
            otp: userOtp,
            user: {
              name: user.name,
              email,
            },
          })
        );

        await sendEmailViaMailchimp({
          to: email,
          subject: ResponseMessage.USER_CREATED_MAIL,
          html: emailHtml,
        });
      } catch (error) {}

      return {
        status: EHttpStatus.CREATED,
        message: ResponseMessage.ACCOUNT_CREATED,
      };
    }

    // =================

    // if (!email) {
    //   throw new CustomError(
    //     EHttpStatus.BAD_REQUEST,
    //     ResponseMessage.EMAIL_REQUIRED
    //   );
    // }

    // const userOtp = generateOTP();
    // let user = await User.findOne({ email: email.toLowerCase() });

    // if (user) {
    //   throw new CustomError(
    //     EHttpStatus.BAD_REQUEST,
    //     ResponseMessage.ALREADY_USER_EXIST
    //   );
    // } else {
    // user = await User.create({
    //   email: email.toLowerCase(),
    //   otp: userOtp,
    //   otpStatus: OTP_ENUM.NOT_VERIFIED,
    //   otpSentAt: new Date(),
    // });
    // }

    // const mailOptions = {
    //   to: email,
    //   subject: ResponseMessage.USER_CREATED_MAIL,
    //   html: render(
    //     VerificationOTPEmail({
    //       otp: userOtp,
    //       user: {
    //         name: user.name,
    //         email,
    //       },
    //     })
    //   ),
    // };

    // await mailNotification.sendMail(mailOptions);

    // return {
    //   statusCode: EHttpStatus.CREATED,
    //   message: ResponseMessage.ACCOUNT_CREATED,
    // };
  }

  async resendSignUpWithOTP(req: any) {
    const { email } = req.body;
    if (!email) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.EMAIL_REQUIRED
      );
    }

    const userOtp = generateOTP();
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user = await User.findOneAndUpdate(
        {
          email: email.toLowerCase(),
        },
        {
          otp: userOtp,
          otpStatus: OTP_ENUM.NOT_VERIFIED,
          otpSentAt: new Date(),
        }
      );

      const emailHtml = render(
        VerificationOTPEmail({
          otp: userOtp,
          user: {
            name: user.name,
            email,
          },
        })
      );

      await sendEmailViaMailchimp({
        to: email,
        subject: ResponseMessage.USER_CREATED_MAIL,
        html: emailHtml,
      });
    } else {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.OTP_VERIFIED,
      data: {
        user: user._id,
      },
    };
  }

  async otpVerification(req: Request) {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    const currentTime = moment();
    const isTimeExpired = currentTime.diff(moment(user.otpSentAt), 'minutes');

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

    if (user.otp !== Number(otp)) {
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
        data: {
          user: user._id,
        },
      };
    }
  }

  /**
   * forgot user password
   * @param req
   * @param res
   * @returns reset password link
   */
  async forgotPassword(body) {
    const { email } = body;

    let user;

    user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    try {
      // Email message options
      const emailHtml = render(
        ResetPasswordEmail({
          user: {
            name: user.name,
          },
          link: `${config.FRONTEND_URL}/setnewpassword/${user._id}`,
        })
      );

      await sendEmailViaMailchimp({
        to: email,
        subject: ResponseMessage.FORGOT_MAIL,
        html: emailHtml,
      });
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
    };
  }
  /**
   * user reset password
   * @param req
   * @param res
   * @returns password reset message
   */
  async resetPassword(body) {
    const { password, userId } = body;

    let user;

    let passwordHash = await this.hashPassword(password);

    user = await User.findByIdAndUpdate(userId, { password: passwordHash });

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    try {
      const emailHtml = render(
        ChangePasswordConfirmationEmail({
          user: {
            name: user.name,
          },
        })
      );

      await sendEmailViaMailchimp({
        to: user.email,
        subject: 'Your Password Has Been Changed',
        html: emailHtml,
      });
    } catch (error) {
      console.log('Error  while  send password change confirmation', error);
    }

    return {
      user: user,
      message: ResponseMessage.PASS_RESET,
      statusCode: EHttpStatus.OK,
    };
  }
  /**
   * user add company detail
   * @param req
   * @param res
   * @returns add compnany detail
   */
  async addCompanyDetail(req: Request, res: Response) {
    const {
      companyName,
      industry,
      address,
      organizationName,
      companyLogo,
      phone,
      employee,
      userId,
      country,
      state,
      city,
      educationalDocuments,
      university,
    } = req.body;

    let user;
    let response: { [key: string]: any } = {
      message: ResponseMessage.DETAIL_UPDATE,
      statusCode: EHttpStatus.OK,
    };

    // This case will be for the users if they are logged in with Google Provider
    if (isValidObjectId(userId)) {
      user = await User.findById(userId);

      if (!user) {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.USER_NOT_FOUND
        );
      }
      const token = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: config.TOKENEXPIRE,
        }
      );
      const { userId: id, ...remainingBody } = req.body;
      let updetailCompanyDetail = await Users.findByIdAndUpdate(
        id,
        remainingBody,
        {
          new: true,
        }
      );

      response = {
        data: { user: updetailCompanyDetail },
        message: ResponseMessage.DETAIL_UPDATE,
        statusCode: EHttpStatus.OK,
        token,
      };
      return response;
    }

    jwt.verify(userId, config.JWT_SECRET_SCHESTI, async (err, payload: any) => {
      if (err) {
        console.log('Link Expired');
        return res.status(401).send({
          status: 401,
          success: false,
          message: 'Link is expired',
          data: {},
        });
      }
      user = await User.findById(payload._id);

      if (!user) {
        throw new CustomError(
          EHttpStatus.BAD_REQUEST,
          ResponseMessage.USER_NOT_FOUND
        );
      }

      const token = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: config.TOKENEXPIRE,
        }
      );

      let updetailCompanyDetail = await User.findByIdAndUpdate(payload._id, {
        companyName,
        industry,
        employee,
        isEmailVerified: true,
      });

      response = {
        data: { user: updetailCompanyDetail },
        message: ResponseMessage.DETAIL_UPDATE,
        statusCode: EHttpStatus.OK,
        token,
      };
    });

    return response;
  }

  /**
   * user add verification detail
   * @param req
   * @param res
   * @returns add verification detail
   */
  async addVerificationDetail(req) {
    const {
      // einNumber,
      secretaryOfState,
      license,
      preQualification,
      userId,
    } = req.body;

    let user;

    user = await User.findById(userId);

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    // const token = jwt.sign({ _id: user._id }, config.JWT_SECRET_SCHESTI, {
    //   expiresIn: config.TOKENEXPIRE,
    // });

    let updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      {
        verificationsData: {
          // einNumber,
          secretaryOfState,
          license,
          preQualification,
        },
      },
      { new: true }
    );

    return {
      data: { user: updatedUserDetails },
      message: ResponseMessage.DETAIL_UPDATE,
      statusCode: EHttpStatus.OK,
      // token,
    };
  }

  /**
   * user add selected trades
   * @param req
   * @param res
   * @returns add selected trades
   */
  async addSelectedTrades(req) {
    const { selectedTrades, userId } = req.body;

    let user;

    user = await User.findById(userId);

    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    let updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      {
        selectedTrades: selectedTrades,
      },
      { new: true }
    );

    return {
      data: { user: updatedUserDetails },
      message: ResponseMessage.DETAIL_UPDATE,
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
    const { email } = body;

    let user: any = await User.findOne({ email: email });

    if (user && user.isEmailVerified) {
      const token = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: config.TOKENEXPIRE,
        }
      );
      await user.populate('subscription');
      await user.populate('subscription.planId');
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SUCCESSFUL,
        token,
        data: { user },
      };
    } else {
      // const newUser = await User.findOne({
      //   email: email,
      //   isEmailVerified: false,
      // });
      if (user && !user.isEmailVerified) {
        user = { ...body, password: null };
        await user.save();
        return {
          statusCode: EHttpStatus.BAD_REQUEST,
          message: ResponseMessage.REJECT,
          data: { user },
        };
      } else if (!user) {
        let user = await User.create({ ...body, isEmailVerified: true });
        return {
          statusCode: EHttpStatus.BAD_REQUEST,
          message: ResponseMessage.REJECT,
          data: { user },
        };
      } else {
        return {
          statusCode: EHttpStatus.BAD_REQUEST,
          message: ResponseMessage.REJECT,
          data: { user: user },
        };
      }
    }
  }

  async socialAuthUserVerification(body) {
    const { email } = body;

    let user = await Users.findOne({ email: email });

    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        `${config.JWT_SECRET_SCHESTI}`,
        {
          expiresIn: config.TOKENEXPIRE,
        }
      );
      await user.populate('subscription');
      await user.populate('subscription.planId');
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SUCCESSFUL,
        token,
        data: { user },
      };
    } else {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
        data: null,
      };
    }
  }

  async stripeCheckoutSession(req) {
    const { _id } = req.payload;

    const { planID, autoRenew } = req.body;
    const selectedPlan = await PlansModel.findById(planID);
    if (!selectedPlan) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PLAN_NOT_FOUND
      );
    }

    const userDetail = await User.findByIdAndUpdate(
      _id,
      { isAutoPayment: autoRenew },
      { new: true }
    );

    if (!userDetail) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    const stripeProduct = await StripeHelper.products.retrieve(
      selectedPlan.stripeProductId
    );

    const stripeProductPrices = await StripeHelper.prices.list({
      product: stripeProduct.id,
      active: true,
    });

    // if (selectedPlan.freeTrailDays && userDetail.trial?.startDate && userDetail.trial?.endDate) {
    //   throw new CustomError(
    //     EHttpStatus.BAD_REQUEST,
    //     ResponseMessage.TRIAL_ALREADY_USED
    //   )
    // }
    let productPrice: Stripe.Price;
    if (stripeProductPrices.data.length > 0) {
      const isUserEgyptBased = userDetail.country === 'EG';
      if (isUserEgyptBased) {
        const egyptPrice = stripeProductPrices.data.find(
          (item) => item.currency === 'egp' && item.unit_amount > 0
        );

        if (egyptPrice) {
          productPrice = egyptPrice;
        } else {
          const pPrice = stripeProductPrices.data.find(
            (item) => item.currency === 'usd' && item.unit_amount > 0
          );
          if (pPrice) {
            productPrice = pPrice;
          }
        }
      } else {
        const pPrice = stripeProductPrices.data.find(
          (item) => item.currency === 'usd' && item.unit_amount > 0
        );
        if (pPrice) {
          productPrice = pPrice;
        }
      }
    } else {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: 'Product price not found',
        data: null,
      };
    }

    try {
      const session = await StripeHelper.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: userDetail.stripeCustomerId
          ? undefined
          : userDetail.email,
        customer: userDetail.stripeCustomerId
          ? userDetail.stripeCustomerId
          : undefined,
        metadata: {
          planId: planID,
          customerId: _id,
          autoRenew: autoRenew,
        },
        client_reference_id: _id,
        line_items: [
          {
            //   // price_data: {
            //   //   currency: productPrice.currency,
            //   // product_data: {
            //   //   name: selectedPlan.planName,
            //   // },
            //   //   product: stripeProduct.id,
            //   //   unit_amount: productPrice.unit_amount,
            //   // },
            price: productPrice.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${config.FRONTEND_URL}/congratulation`,
        cancel_url: `${config.FRONTEND_URL}/payment`,
        allow_promotion_codes: true,
        // payment_method_collection: selectedPlan.freeTrailDays
        //   ? 'if_required'
        //   : 'always',
        payment_method_collection: 'always',
        subscription_data:
          selectedPlan.freeTrailDays &&
          !userDetail.trial?.startDate &&
          !userDetail.subscription
            ? {
                trial_period_days: selectedPlan.freeTrailDays,
                trial_settings: {
                  end_behavior: {
                    missing_payment_method: 'pause',
                  },
                },
              }
            : undefined,
      });

      return {
        statusCode: EHttpStatus.OK,
        message: 'Stripe Detail',
        data: { id: session.id },
      };
    } catch (error) {
      throw new CustomError(EHttpStatus.BAD_REQUEST, error.message);
    }
  }

  async stripeSuccessRequest(req) {
    const event =
      req.body as WebHookReqBody<Stripe.CheckoutSessionCompletedEvent.Data>;
    // console.log({ event, eventData: event.data });

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted':
        {
          const data =
            event.data as unknown as Stripe.CustomerSubscriptionDeletedEvent.Data;
          console.log('Subscription deleted', data);

          const user = await User.findOne({
            stripeCustomerId: data.object.customer as string,
            $or: [
              { associatedCompany: null },
              { associatedCompany: undefined },
            ],
          });

          if (user) {
            // update subscription
            try {
              const updatedSubscription =
                await SubcriptionHistory.findByIdAndUpdate(
                  user.subscription,
                  {
                    status: 'canceled',
                    currentPeriodEnd: new Date(),
                    canceledAt: new Date(),
                  },
                  { new: true, populate: 'planId' }
                );

              // await SESMail.sendMail({
              //   to: user.email,
              //   subject: 'Subscription Canceled',
              //   html: render(
              //     SubscriptionCancellationEmail({
              //       plan: {
              //         name: (
              //           updatedSubscription.planId as unknown as IPricingPlan
              //         ).planName,
              //       },
              //       user: {
              //         name: user.name,
              //       },
              //     })
              //   ),
              // });
            } catch (error) {
              console.log('Unable to update subscription history', error);
            }
          }
        }
        break;
      case 'invoice.payment_failed':
        {
          const data =
            event.data as unknown as Stripe.InvoicePaymentFailedEvent.Data;
          // console.log("invoice.payment_failed OBJECT", data.object);
          const customer = data.object.customer;
          console.log('CUstomer', data);
          if (!customer) {
            return {
              statusCode: EHttpStatus.BAD_REQUEST,
              message: ResponseMessage.USER_NOT_FOUND,
            };
          }
          const user = await User.findOne({
            stripeCustomerId: customer as string,
          });
          try {
            await SubcriptionHistory.findByIdAndUpdate(
              user.subscription,
              {
                status: 'expired',
                expiredAt: new Date(),
                currentPeriodEnd: new Date(),
              },
              { new: true }
            );
          } catch (error) {
            console.log('Unable to update subscription history', error);
          }
          if (user) {
            try {
              await StripeHelper.subscriptions.update(user.subscriptionId, {
                cancel_at_period_end: false,
              });
              await user.populate('subscription');
              const subscription = user.subscription as ISubriptionHistory;
              const plan = await PlansModel.findById(subscription.planId);
              await sendEmailViaMailchimp({
                to: user.email,
                subject: 'Payment Failed for Your Subscription',
                html: render(
                  FailedPaymentEmail({
                    user: {
                      name: user.name,
                    },
                    plan: {
                      name: plan ? plan.planName : '',
                      attemptedDate: moment
                        .unix(data.object.created)
                        .format('MMM Do YYYY, h:mm A'),
                      price: plan ? plan.price : 0,
                    },
                  })
                ),
              });
            } catch (error) {}
          }
        }

        break;
      case 'checkout.session.completed':
        const metadata: any = event.data.object.metadata;
        const checkoutSessionData = event.data;
        const subscriptionId = checkoutSessionData.object.subscription;
        const customerId = checkoutSessionData.object.customer;
        const user = await User.findById(metadata.customerId);
        let userData: Partial<ICompany> = {};
        userData['planId'] = metadata.planId as string;
        userData['isPaymentConfirm'] = true;
        userData['subscriptionId'] = subscriptionId as string;
        // set the default stripeCustomerId to user.stripeCustomerId
        userData['stripeCustomerId'] = user.stripeCustomerId;
        userData['stripeCustomerId'] = customerId as string;

        user.subscriptionId = userData.subscriptionId;
        user.stripeCustomerId = userData.stripeCustomerId;
        await user.save();
        const selectedPlan: any = await PlansModel.findById(metadata.planId);

        const customerSubscription = await StripeHelper.subscriptions.retrieve(
          subscriptionId as string
        );

        if (customerSubscription.status === 'trialing') {
          const subscriptionHistroy = await SubcriptionHistory.create({
            planId: metadata.planId,
            user: metadata.customerId,
            customerId,
            paymentMethod: 'Stripe',
            status: 'trialing',
            periodStart: customerSubscription.current_period_start * 1000,
            periodEnd: customerSubscription.current_period_end * 1000,
            subscriptionId: subscriptionId,
            amount: selectedPlan.price,
          });
          user.subscription = subscriptionHistroy._id as any;
          user.trial = {
            startDate: new Date(
              customerSubscription.current_period_start * 1000
            ),
            endDate: new Date(customerSubscription.current_period_end * 1000),
          };
        } else if (customerSubscription.status === 'active') {
          const subscriptionHistroy = await SubcriptionHistory.create({
            planId: metadata.planId,
            user: metadata.customerId,
            customerId,
            paymentMethod: 'Stripe',
            status: 'active',
            currentPeriodStart:
              customerSubscription.current_period_start * 1000,
            currentPeriodEnd: customerSubscription.current_period_end * 1000,
            subscriptionId: subscriptionId,
            amount: selectedPlan.price,
          });
          user.subscription = subscriptionHistroy._id as any;
        }

        console.log('customerSubscription', customerSubscription);
        await user.save();
        try {
          // Email message options
          const userEmailHtml = render(
            NewSubscriptionPlanPurchaseEmail({
              user: {
                name: user.name,
                email: user.email,
              },
              plan: {
                name: selectedPlan.planName,
                startDate: moment
                  .unix(customerSubscription.current_period_start)
                  .format('MM-DD-YYYY hh:mm:ss'),
                endDate: moment
                  .unix(customerSubscription.current_period_end)
                  .format('MM-DD-YYYY hh:mm:ss'),
                price:
                  customerSubscription.status === 'trialing'
                    ? 0
                    : selectedPlan.price,
                automaticRenewal: user.isAutoPayment,
                nextBillingDate: moment
                  .unix(customerSubscription.current_period_end)
                  .format('MM-DD-YYYY hh:mm:ss'),
              },
              cardTitle:
                customerSubscription.status === 'trialing'
                  ? 'Free Trial Started'
                  : 'Subscription Started',
            })
          );

          const adminEmailHtml = EMails['ADMIN_SUBCRIPTION']({
            name: selectedPlan.planName,
            email: user.email,
          });

          const userPromise = sendEmailViaMailchimp({
            to: user.email,
            subject:
              customerSubscription.status === 'trialing'
                ? 'Free Trial Started'
                : customerSubscription.status === 'active'
                  ? ResponseMessage.SUBCRIPTION_EMAIL
                  : 'Subscription Started',
            html: userEmailHtml,
          });

          const adminPromise = sendEmailViaMailchimp({
            to: config.ADMIN_MAIL,
            subject: ResponseMessage.SUBCRIPTION_EMAIL,
            html: adminEmailHtml,
          });

          await Promise.all([userPromise, adminPromise]);
          try {
            // Email message options
            await sendEmailViaMailchimp({
              to: user.email,
              subject: 'Welcome to Schesti Technologies, Inc.',
              html: render(
                SignUpEmail({
                  user: {
                    email: user.email,
                    name: user.name,
                  },
                })
              ),
            });
            console.log('Email sent successfully', SignUpEmail.name);
          } catch (error) {
            console.log('error from sending email', SignUpEmail.name, error);
          }
        } catch (error) {
          console.log(
            'Error While sending subscription email to user and admin',
            error
          );
        }

        break;
      case 'invoice.upcoming':
        {
          const data =
            event.data as unknown as Stripe.InvoiceUpcomingEvent.Data;
          const userEmail = data.object.customer_email;
          const user = await User.findOne({
            email: userEmail,
          });

          // if  user then proceed further and user has subscription
          if (user && user.subscription) {
            const subscription = await SubcriptionHistory.findById(
              user.subscription
            );
            // if subscription
            if (subscription && subscription.status === 'active') {
              const plan = await PlansModel.findById(subscription.planId);
              if (plan) {
                try {
                  sentemailHelper(
                    user.email,
                    SubscriptionRenewelReminderEmail({
                      plan: {
                        name: plan.planName,
                        price: plan.price,
                        nextBillingDate: moment(subscription.currentPeriodStart)
                          .add(30, 'days')
                          .format('DD-MM-YYYY hh:mm'),
                      },
                      user: {
                        name: user.name,
                      },
                    }),
                    'Subscription Renewal Reminder'
                  );
                } catch (error) {
                  console.log(
                    'Error while sending invoice.upcoming email to user',
                    error
                  );
                }
              }
            }
          }
        }
        break;
      case 'customer.subscription.updated':
        {
          type SubscriptionUpdatedEvent = Stripe.Event & {
            type: 'customer.subscription.updated';
            data: {
              object: Stripe.Subscription;
            };
          };
          const e = event as unknown as SubscriptionUpdatedEvent;
          const subscription = e.data.object;
          console.log('Subscription Updated', subscription);
          const user = await User.findOne({
            stripeCustomerId: subscription.customer,
          });

          if (!user) {
            console.log('User not found for subscription update');
            return;
          }
          const planId = subscription.object;

          const isTrialing = subscription.status === 'trialing';
          const trialEnd = subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null;

          if (
            // isTrialing &&
            trialEnd
          ) {
            console.log(`Trial ends on: ${trialEnd.toISOString()}`);

            // If the trial has ended and no payment has been made
            // if (trialEnd < new Date()) {
            console.log('Trial ended but payment not made.');

            // Update the subscription history to reflect expired status
            try {
              const userSubscription =
                await SubcriptionHistory.findByIdAndUpdate(user.subscription);
              await SubcriptionHistory.create({
                user: user._id,
                status: 'trial_end',
                subscriptionId: subscription.id,
                expiredAt: new Date(),
                planId: userSubscription.planId,
                customerId: subscription.customer as string,
                paymentMethod: 'Stripe',
              });

              // Send email notification to the user about the trial expiration
              await sendEmailViaMailchimp({
                to: user.email,
                subject: 'Your Free Trial has Ended',
                html: render(
                  CommonEmail({
                    company: {
                      name: '',
                      email: '',
                      companyName: 'Schesti',
                    },
                    receiver: {
                      email: user.name,
                    },
                    subject: 'Your Free Trial has Ended',
                    description:
                      'Your free trial has ended and your subscription continues. ',
                    actionBtn: {
                      text: 'Login Now',
                      link: FRONTEND_LINKS.LOGIN,
                      logo: '',
                    },
                  })
                ),
              });

              console.log('Trial end email sent successfully.');
            } catch (error) {
              console.log(
                'Error updating subscription or sending email:',
                error
              );
            }
            // }
          } else if (isTrialing) {
            // Update  the subscription and send email to the user that the trial has started
            console.log('Trial started');
            try {
              await SubcriptionHistory.create({
                user: user._id,
                status: 'trialing',
                subscriptionId: subscription.id,
                planId: planId,
                customerId: subscription.customer as string,
                paymentMethod: 'Stripe',
                periodStart: new Date(subscription.current_period_start * 1000),
                periodEnd: new Date(subscription.current_period_end * 1000),
              });
              user.trial = {
                startDate: new Date(subscription.current_period_start * 1000),
                endDate: new Date(subscription.current_period_end * 1000),
              };
              await user.save();
            } catch (error) {
              console.log('Error updating trial start subscription:', error);
            }
            try {
              await sendEmailViaMailchimp({
                to: user.email,
                subject: 'Your Free Trial has Started',
                html: render(
                  CommonEmail({
                    company: {
                      name: '',
                      email: '',
                      companyName: 'Schesti',
                    },
                    receiver: {
                      email: user.name,
                    },
                    subject: 'Your Free Trial has Started',
                    description:
                      'Your free trial has started and your subscription continues. The current trial period ends on ' +
                      moment(subscription.current_period_end * 1000).format(
                        'll'
                      ),
                    actionBtn: {
                      link: await this.createPaymentLink(subscription, {
                        userId: user._id,
                        planId: planId,
                        subscriptionId: subscription.id,
                        customerId: subscription.customer as string,
                        paymentMethod: 'Stripe',
                      }),
                      text: 'Pay Now',
                      logo: '',
                    },
                  })
                ),
              });
            } catch (error) {
              console.log('Error sending trial start email:', error);
            }
          } else if (subscription.status === 'active') {
            console.log('Trial is active.');
            try {
              await SubcriptionHistory.findByIdAndUpdate(
                user.subscription,
                {
                  status: 'active',
                  currentPeriodStart: new Date(
                    subscription.current_period_start * 1000
                  ),
                  currentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                  ),
                },
                { new: true }
              );
              console.log('Subscription status updated to active.');
            } catch (error) {
              console.log('Error updating subscription to active:', error);
            }
          } else if (
            [
              'past_due',
              'unpaid',
              'incomplete',
              'canceled',
              'paused',
              'incomplete_expired',
            ].includes(subscription.status)
          ) {
            try {
              const subscsriptionHistory =
                await SubcriptionHistory.findByIdAndUpdate(user.subscription, {
                  status: subscription.status,
                  expiredAt: new Date(subscription.current_period_end * 1000),
                  canceledAt: new Date(subscription.current_period_end * 1000),
                });
              const plan = await PricingPlans.findById(planId);
              await SESMail.sendMail({
                to: user.email,
                subject: `Payment Attempt for Your Subscription Plan Was Unsuccessful`,
                html: render(
                  CommonEmail({
                    company: {
                      companyName: '',
                      email: '',
                      name: '',
                    },
                    receiver: {
                      email: user.name,
                    },
                    description: `
                    We attempted to process your ${plan.duration} subscription payment for ${plan.planName}, but the transaction was unsuccessful due to an issue with your payment method.
                    Please update your payment details or ensure sufficient funds are available.
                    `,
                    subject: `Subscription ${subscription.status}`,
                    actionBtn: {
                      link: await this.createPaymentLink(subscription, {
                        stripeCustomer: subscription.customer,
                        planId: subscsriptionHistory.planId,
                        subscriptionId: subscription.id,
                        customerId: user._id.toString(),
                      }),
                      text: 'Pay Now',
                      logo: '',
                    },
                  })
                ),
              });
            } catch (error) {
              console.log(
                `Error while sending subscription ${subscription.status} email to user`,
                error
              );
            }
          }
        }
        break;
      default:
        return {
          statusCode: EHttpStatus.BAD_REQUEST,
          message: ResponseMessage.REJECT,
          data: event.type,
        };
    }
  }

  /**
   * verify user email
   * @param req
   * @param res
   * @returns return user detail
   */
  async verifyUserEmail(req, res) {
    const { params } = req;
    const { token } = params;
    let user;
    let response: { [key: string]: any } = {
      message: ResponseMessage.DETAIL_UPDATE,
      statusCode: EHttpStatus.OK,
    };

    await jwt.verify(
      token,
      config.JWT_SECRET_SCHESTI,
      async (err, payload: any) => {
        if (err) {
          throw new CustomError(
            EHttpStatus.UNAUTHORIZED,
            ResponseMessage.USER_NOT_FOUND
          );
        }
        user = await User.findById(payload._id);
        if (!user) {
          throw new CustomError(
            EHttpStatus.BAD_REQUEST,
            ResponseMessage.USER_NOT_FOUND
          );
        }

        const token = jwt.sign({ _id: user._id }, config.JWT_SECRET_SCHESTI, {
          expiresIn: config.TOKENEXPIRE,
        });

        let verifiedUser = await User.findByIdAndUpdate(payload._id, {
          isEmailVerified: true,
        });

        return (response = {
          data: { user: verifiedUser },
          message: ResponseMessage.DETAIL_UPDATE,
          statusCode: EHttpStatus.OK,
          token,
        });
      }
    );
    return response;
  }

  async stripeUpgradeSubscription(req: Request | any) {
    const { _id } = req.payload;
    const { planId } = req.body as { planId: string };

    const userDetail = await User.findById(_id);
    if (!userDetail) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }

    const currentSubscription = await SubscriptionHistory.findById(
      userDetail.subscription
    );

    if (!currentSubscription) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.SUBSCRIPTION_NOT_FOUND
      );
    }

    if (currentSubscription.status !== 'active') {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.SUBSCRIPTION_NOT_ACTIVE
      );
    }

    const userOldPlan = await PlansModel.findById(currentSubscription.planId);
    if (!userOldPlan) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PLAN_NOT_FOUND
      );
    }

    if (!currentSubscription.subscriptionId) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.NO_STRIPE_SUBSCRIPTION_ID
      );
    }

    const selectedPlan = await PlansModel.findById(planId);

    if (!selectedPlan) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PLAN_NOT_FOUND
      );
    }

    const userSubscription = await SubcriptionHistory.findById(
      userDetail.subscription
    );
    // if !userSubscription.subscriptionId that means the user  is using the free plan and  there is no data on stripe
    if (!userSubscription || !userSubscription.subscriptionId) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.SUBSCRIPTION_NOT_FOUND
      );
    }

    const stripePrice = await StripeHelper.prices.retrieve(
      selectedPlan.stripePriceId
    );
    const stripeSubscriptions = await StripeHelper.subscriptions.retrieve(
      userDetail.subscriptionId
    );

    const userCurrentSubscription = stripeSubscriptions;
    if (!userCurrentSubscription) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.SUBSCRIPTION_NOT_FOUND
      );
    }
    // Step 1: Retrieve the customer's current payment method
    const paymentMethods = await StripeHelper.paymentMethods.list({
      customer: userDetail.stripeCustomerId,
      type: 'card', // or 'payment_method' if using other types of payment methods
      limit: 1,
    });

    // If Customer has No payment methods
    if (paymentMethods.data.length === 0) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PAYMENT_METHOD_NOT_FOUND
      );
    }
    // Assuming the customer has only one payment method
    const defaultPaymentMethodId = paymentMethods.data[0].id;
    if (userCurrentSubscription) {
      await StripeHelper.subscriptions.cancel(userCurrentSubscription.id);
      try {
        const userSubscription = await SubcriptionHistory.findByIdAndUpdate(
          userDetail.subscription,
          {
            status: 'canceled',
            canceledAt: new Date(),
          },
          { new: true }
        );

        // await SESMail.sendMail({
        //   to: userDetail.email,
        //   subject: 'Your Subscription Has Been Canceled',
        //   html: render(
        //     SubscriptionCancellationEmail({
        //       plan: {
        //         name: userOldPlan.planName,
        //       },
        //       user: {
        //         name: userDetail.name,
        //       },
        //     })
        //   ),
        // });
      } catch (error) {
        console.log(
          'Unable to update subscription history and send subscription cancellation email',
          error
        );
      }
      // Send user and admin the mail that the user has unsubscribed the plan

      // try {
      //   // Email message options
      //   const userMailOptions = {
      //     to: userDetail.email,
      //     subject: ResponseMessage.UN_SUBCRIPTED_PLAN_EMAIL,
      //     html: EMails['CLIENT_UNSUBCRIPTION']({
      //       name: userOldPlan.planName,
      //       email: userDetail.email,
      //     }),
      //   };

      //   const adminMailOptions = {
      //     to: config.ADMIN_MAIL,
      //     subject: ResponseMessage.UN_SUBCRIPTED_PLAN_EMAIL,
      //     html: EMails['ADMIN_UN_SUBCRIPTION']({
      //       name: userOldPlan.planName,
      //       email: userDetail.email,
      //     }),
      //   };

      //   const userPromise = mailNotification.sendMail(userMailOptions);
      //   const adminPromise = mailNotification.sendMail(adminMailOptions);

      //   await Promise.all([userPromise, adminPromise]);
      // } catch (error) {
      //   console.log(error);
      // }
    }

    await StripeHelper.customers.update(userDetail.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: defaultPaymentMethodId,
      },
    });

    const newSubscription = await StripeHelper.subscriptions.create({
      customer: userDetail.stripeCustomerId,
      items: [
        {
          price: stripePrice.id,
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
      },
    });
    console.log('Created the new Subscription');

    const user = await User.findByIdAndUpdate(
      _id,
      {
        planId,
        isPaymentConfirm: true,
        subscriptionId: newSubscription.id,
      },
      { new: true }
    );

    const subscriptionHistroy = await SubcriptionHistory.create({
      planId: planId,
      customerId: userDetail._id,
      paymentMethod: 'Stripe',
      subscriptionId: newSubscription.id,
      status: 'active',
      currentPeriodStart: newSubscription.current_period_start * 1000,
      currentPeriodEnd: newSubscription.current_period_end * 1000,
      amount: selectedPlan.price,
      user: _id,
    });
    user.subscription = subscriptionHistroy._id as any;
    await user.save();
    // Update user employees plan
    await User.updateMany(
      {
        associatedCompany: user._id,
      },
      {
        subscription: subscriptionHistroy._id,
      }
    );

    console.log('mail on going for subscription upgrade');

    try {
      await sendEmailViaMailchimp({
        to: userDetail.email,
        subject: 'Your Subscription Plan Has Been Upgraded!',
        html: render(
          SubscriptionPlanUpgradeEmail({
            user: {
              name: userDetail.name,
            },
            plan: {
              name: selectedPlan.planName,
              currentPeriodStart:
                subscriptionHistroy.status === 'active'
                  ? moment(subscriptionHistroy.currentPeriodStart).format(
                      'DD/MM/YYYY hh:mm A'
                    )
                  : '',
              features: selectedPlan.features,
              price: selectedPlan.price,
            },
            oldPlan: {
              name: userOldPlan.planName,
            },
          })
        ),
      });
    } catch (error) {
      console.log('Error sending email on subscription upgrade', error);
    }

    // try {
    //   await sendEmail(
    //     userDetail.email,
    //     ResponseMessage.SUBCRIPTION_EMAIL,
    //     EMails['CLIENT_SUBCRIPTION']({
    //       name: selectedPlan.planName,
    //       email: userDetail.email,
    //     })
    //   );
    //   console.log('Email sent');
    // } catch (error) {
    //   console.log('Error from mail');
    // }

    // try {
    //   await sendEmail(
    //     'admin@gmail.com',
    //     ResponseMessage.SUBCRIPTION_EMAIL,
    //     EMails['ADMIN_SUBCRIPTION']({
    //       name: selectedPlan.planName,
    //       email: userDetail.email,
    //     })
    //   );
    //   console.log('Email sent');
    // } catch (error) {
    //   console.log('Error from mail');
    // }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: {
        user,
      },
    };
  }

  async paypalCreateOrder(req: Request) {
    const id = req.payload._id;
    const { planID, autoRenew } = req.body;

    const user = await Users.findById(id);
    const plan = await PricingPlans.findById(planID);
    // console.log('plan', plan._id);
    if (!user) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    if (!plan) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PLAN_NOT_FOUND
      );
    }

    if (!plan.paypalPlanId || !plan.paypalProductId) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.PLAN_IS_NOT_AVAILABLE_FOR_PAYPAL
      );
    }

    const userFullName = user.name.split(' ');

    const paypalSubscription = await paypal.PaypalSubscription.create({
      plan_id: plan.paypalPlanId,
      application_context: {
        brand_name: 'Schesti',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${config.FRONTEND_URL}/congratulation`,
        cancel_url: `${config.FRONTEND_URL}/payment`,
        payment_method: {
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          payer_selected: 'PAYPAL',
        },
        shipping_preference: 'NO_SHIPPING',
      },
      subscriber: {
        name: {
          given_name: userFullName[0],
          surname: userFullName[1],
        },
        email_address: user.email,
        shipping_address: undefined,
      },
    });

    user.method = 'Paypal';
    user.subscriptionId = paypalSubscription.id;
    user.isAutoPayment = autoRenew;
    await user.save();

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.ACCOUNT_CREATED,
      data: paypalSubscription.id,
    };
  }
  async paypalCaptureOrder(req: Request) {
    const data = req.body as {
      orderID: string;
      subscriptionID: string;
      facilitatorAccessToken?: string;
      paymentSource: string;
    };

    const order = await paypal.PaypalSubscription.details(data.subscriptionID);

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.ACCOUNT_CREATED,
      data: order,
    };
  }

  async paypalInvoices() {
    const jsonResponse = await paypalService.getPayPalInvoices();
    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: jsonResponse,
    };
  }

  async subscribeToFreePlan(req: Request) {
    const planId = req.body.planId as FreePlanSubscriptionDto;

    const { _id } = req.payload;

    let user = await User.findById(_id);
    const userOldSubscription = await SubcriptionHistory.findById(
      user.subscription
    );

    const plan = await PricingPlans.findById(planId);

    if (!plan) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.PLAN_NOT_FOUND,
      };
    }

    if (!plan.isInternal) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.UNABLE_TO_SUbSCRIBE,
      };
    }

    if (
      userOldSubscription &&
      (userOldSubscription.status === 'active' ||
        userOldSubscription.status === 'trialing') &&
      userOldSubscription.paymentMethod === 'Stripe'
    ) {
      // Check if the old subscription is active and bought with payment provider
      if (userOldSubscription.subscriptionId) {
        // Cancel the old subscription

        try {
          await StripeHelper.subscriptions.cancel(
            userOldSubscription.subscriptionId,
            {}
          );
        } catch (error) {
          console.log(
            'Unable to cancel the old subscription',
            this.subscribeToFreePlan
          );
        }

        // throw new CustomError(
        //   EHttpStatus.BAD_REQUEST,
        //   ResponseMessage.CANT_CHANGE_SUBSCRIPTION
        // );
      }
    }

    if (
      userOldSubscription &&
      (userOldSubscription.status === 'active' ||
        userOldSubscription.status === 'trialing') &&
      userOldSubscription.paymentMethod === 'Paymob'
    ) {
      // Check if the old subscription is active and bought with payment provider
      if (userOldSubscription.subscriptionId) {
        // Cancel the old subscription

        try {
          await Paymob.cancelUserSubscriptionOnPaymob(
            Number(userOldSubscription.subscriptionId)
          );
        } catch (error) {
          console.log(
            'Unable to cancel the old subscription on Paymob',
            this.subscribeToFreePlan
          );
        }

        // throw new CustomError(
        //   EHttpStatus.BAD_REQUEST,
        //   ResponseMessage.CANT_CHANGE_SUBSCRIPTION
        // );
      }
    }

    user = await User.findByIdAndUpdate(
      _id,
      {
        planId,
        isPaymentConfirm: true,
        subscriptionId: '',
      },
      { new: true }
    );

    if (!user) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }

    const isMonthly = plan.duration === 'monthly';
    const isYearly = plan.duration === 'yearly';
    const subscriptionHistroy = await SubcriptionHistory.create({
      planId: planId,
      customerId: user._id,
      paymentMethod: 'None',
      subscriptionId: '',
      status: 'active',
      currentPeriodStart: moment().unix() * 1000,
      currentPeriodEnd: isMonthly
        ? moment().add(1, 'month').unix() * 1000
        : moment().add(1, 'year').unix() * 1000,
      amount: plan.price,
      user: user._id,
    });
    user.subscription = subscriptionHistroy._id as any;
    await user.save();
    // Update user employees plan
    await User.updateMany(
      {
        associatedCompany: user._id,
      },
      {
        subscription: subscriptionHistroy._id,
      }
    );

    await user.populate('subscription');
    await user.populate('subscription.planId');
    // populate roles for a company employee
    if (user.associatedCompany) {
      await user.populate('roles');
    }

    // Send Email To User

    if (subscriptionHistroy.status === 'active') {
      try {
        // Email message options
        const userEmailHtml = render(
          NewSubscriptionPlanPurchaseEmail({
            user: {
              name: user.name,
              email: user.email,
            },
            plan: {
              name: plan.planName,
              startDate: moment(
                subscriptionHistroy.currentPeriodStart
              ).format('MM-DD-YYYY hh:mm:ss'),
              endDate: moment(subscriptionHistroy.currentPeriodEnd).format(
                'MM-DD-YYYY hh:mm:ss'
              ),
              price: plan.price,
              automaticRenewal: user.isAutoPayment,
              nextBillingDate: 'N/A',
            },
            cardTitle: 'Free Subscription Started',
          })
        );

        const adminEmailHtml = EMails['ADMIN_SUBCRIPTION']({
          name: plan.planName,
          email: user.email,
        });

        const userPromise = sendEmailViaMailchimp({
          to: user.email,
          subject: 'Free Subscription Started',
          html: userEmailHtml,
        });

        const adminPromise = sendEmailViaMailchimp({
          to: config.ADMIN_MAIL,
          subject: ResponseMessage.SUBCRIPTION_EMAIL,
          html: adminEmailHtml,
        });

        await Promise.all([userPromise, adminPromise]);
      } catch (error) {
        console.log(
          'Error While sending subscription email to user and admin',
          error
        );
      }
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: {
        user,
      },
    };
  }

  async changeAutoRenewal(req: Request) {
    const { _id } = req.payload;
    const { autoRenewal } = req.body as { autoRenewal: boolean };

    const user = await User.findById(_id);
    if (!user) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      };
    }
    const subscription = await SubcriptionHistory.findById(user.subscription);

    if (!subscription) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.SUBSCRIPTION_NOT_FOUND,
      };
    }

    if (!subscription?.subscriptionId) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.NO_STRIPE_SUBSCRIPTION_ID,
      };
    }

    if (subscription.status != 'active') {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.SUBSCRIPTION_NOT_ACTIVE,
      };
    }

    try {
      if (autoRenewal) {
        await StripeHelper.subscriptions.update(subscription.subscriptionId, {
          collection_method: 'charge_automatically',
        });
      } else {
        await StripeHelper.subscriptions.update(subscription.subscriptionId, {
          collection_method: 'send_invoice',
          days_until_due: 7,
        });
      }

      user.isAutoPayment = autoRenewal;
      await user.save();
    } catch (error) {
      console.log('Auto renewal error', error);
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: 'Unable to change auto renewal status',
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: {
        user,
      },
    };
  }

  async paymobCheckout(req: Request) {
  const _id = req.payload._id;
  const body = req.body;
  
  const user = await User.findById(_id);
  if (!user) {
    return {
      statusCode: EHttpStatus.NOT_FOUND,
      message: ResponseMessage.USER_NOT_FOUND,
    };
  }

  const plan = await PricingPlans.findById(body.planID);
  if (!plan) {
    return {
      statusCode: EHttpStatus.NOT_FOUND,
      message: ResponseMessage.PLAN_NOT_FOUND,
    };
  }

  if (!plan.paymob) {
    return {
      statusCode: EHttpStatus.BAD_REQUEST,
      message: "This plan doesn't exist on Paymob",
    };
  }

  const nameParts = user.name ? user.name.trim().split(' ') : ['Customer', 'Name'];
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Name';

  const discountedPrice = body.price && !isNaN(Number(body.price)) 
    ? Number(body.price) 
    : plan.egpPrice || plan.price;
  
  console.log('Base Price:', plan.egpPrice || plan.price);
  console.log('Discounted Price:', discountedPrice);

  if (!discountedPrice || isNaN(discountedPrice) || discountedPrice <= 0) {
    return {
      statusCode: EHttpStatus.BAD_REQUEST,
      message: 'Invalid price calculation',
    };
  }

  const amountInCents = Math.round(discountedPrice * 100);

  const ends_at = body.autoRenew
    ? undefined
    : plan.duration === 'monthly'
      ? moment().add(1, 'months').format('YYYY-MM-DD')
      : moment().add(1, 'years').format('YYYY-MM-DD');

  try {
    const response = await Paymob.createPaymentIntention({
      amount: amountInCents,
      currency: 'EGP',
      billing_data: {
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
        phone_number: user.phone || '+20000000000', 
        apartment: 'N/A',
        building: 'N/A',
        floor: 'N/A',
        street: 'N/A',
        country: user.country || 'EG',
        state: user.state || 'N/A'
      },
      notification_url: config.PAYMOB_WEBHOOK_END_POINT + `/paymob-webhook`,
      extras: {
        userId: user._id.toString(),
        planId: plan._id.toString(),
        oldSubscription: user.subscription ? user.subscription.toString() : null,
      },
      items: [
        {
          amount: amountInCents,
          description: plan.planDescription,
          name: plan.planName,
          quantity: 1,
        },
      ],
      payment_methods: [Number(config.PAYMOB_INTEGRATION_ID)],
      redirection_url: `${config.FRONTEND_URL}/congratulation`,
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: user.email,
      },
      subscription_plan_id: plan.paymob.id,
      ends_at,
      next_billing: null,
    });
    
    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: response,
    };
  } catch (error) {
    console.error('Paymob checkout error:', error);
    return {
      statusCode: EHttpStatus.BAD_REQUEST,
      message: error?.message || 'Failed to create Paymob checkout',
      data: null,
    };
  }
}

  async suspendPaymobSubscription(req: Request) {
    const user = await Users.findById(req.payload._id);
    if (!user) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.USER_NOT_FOUND
      );
    }

    const subscription = await SubcriptionHistory.findById(user.subscription);
    if (!subscription) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.SUBSCRIPTION_NOT_FOUND
      );
    }

    if (subscription.paymentMethod !== 'Paymob') {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        'This subscription is not with Paymob'
      );
    }

    try {
      const response = await Paymob.suspendUserSubscriptionOnPaymob(
        Number(subscription.subscriptionId)
      );
      console.log('Suspend paymob http response', response);
      subscription.isSuspended = true;
      subscription.suspendedAt = new Date();
      await subscription.save();
      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SUCCESSFUL,
        data: subscription,
      };
    } catch (error) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        'Unable to suspend subscription'
      );
    }
  }

  private async createPaymentLink(
    subscription: Stripe.Subscription,
    metadata: Record<string, any>
  ) {
    // try {
    //   const session = await StripeHelper.checkout.sessions.create({
    //     mode: 'subscription',
    //     line_items: [{
    //       price: subscription.items.data[0].price.id,
    //       quantity: 1,
    //     }],
    //     metadata,
    //     success_url: `${config.FRONTEND_URL}/congratulation`,
    //     cancel_url: `${config.FRONTEND_URL}/login`,
    //     payment_method_types: ['card'],
    //     customer: subscription.customer as string,
    //   });

    //   console.log('Checkout session created:', session.url);
    //   return session.url;
    // } catch (error) {
    //   console.log('Error creating checkout session:', error);
    //   return FRONTEND_LINKS.LOGIN;
    // }
    return FRONTEND_LINKS.LOGIN;
  }
}

export default new AuthService();
