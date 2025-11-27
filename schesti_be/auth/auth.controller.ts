import { generateErrorResponse } from '../../helper/errorResponse';
import AuthService from './auth.service';
import type { Request, Response } from 'express';
export class AuthController {
  async login(req: any, res: any) {
    try {
      const user = await AuthService.login(req.body);
      return res.status(200).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async signup(req: any, res: any) {
    try {
      const userCreation = await AuthService.signup(req.body);
      return res.status(201).json(userCreation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async signUpWithOTP(req: any, res: any) {
    try {
      const userCreation = await AuthService.signUpWithOTP(req.body);
      return res.status(201).json(userCreation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async otpVerification(req: any, res: any) {
    try {
      const userCreation = await AuthService.otpVerification(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async resendSignUpWithOTP(req: any, res: any) {
    try {
      const userCreation = await AuthService.resendSignUpWithOTP(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async userVerification(req: any, res: any) {
    try {
      const userCreation = await AuthService.userVerification(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = await AuthService.me(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      console.log(error, 'here is error');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async forgotPassword(req: any, res: any) {
    try {
      const userForgotPassword = await AuthService.forgotPassword(req.body);
      return res.status(201).json(userForgotPassword);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async forgotResendEmail(req: any, res: any) {
    try {
      const userResetEmail = await AuthService.forgotResendEmail(req.body);
      return res.status(201).json(userResetEmail);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async createAccountResendEmail(req: any, res: any) {
    try {
      const userResetEmail = await AuthService.createAccountResendEmail(
        req.body
      );
      return res.status(201).json(userResetEmail);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async resetPassword(req: any, res: any) {
    try {
      const userResetPassword = await AuthService.resetPassword(req.body);
      return res.status(201).json(userResetPassword);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async addCompanyDetail(req: any, res: any) {
    try {
      const companyDetail = await AuthService.addCompanyDetail(req, res);
      return res.status(201).json(companyDetail);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async addVerificationDetail(req: any, res: any) {
    try {
      const verificationDetail = await AuthService.addVerificationDetail(req);
      return res.status(201).json(verificationDetail);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async addSelectedTrades(req: any, res: any) {
    try {
      const selectedTrades = await AuthService.addSelectedTrades(req);
      return res.status(201).json(selectedTrades);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async googleAuth(req: any, res: any) {
    try {
      const googleLoginAuth = await AuthService.googleAuthHandler(req.body);
      return res.status(201).json(googleLoginAuth);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async socialAuthUserVerification(req, res) {
    try {
      const socialAuthUser = await AuthService.socialAuthUserVerification(
        req.body
      );
      return res.status(socialAuthUser.statusCode).json(socialAuthUser);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async verifyUserEmail(req: any, res: any) {
    try {
      const verifiedUser = await AuthService.verifyUserEmail(req, res);
      return res.status(201).json(verifiedUser);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async postUserDetailsByEmail(req: any, res: any) {
    try {
      const userDetails = await AuthService.postUserDetailsByEmail(req, res);
      return res.status(201).json(userDetails);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getUserDetailsFromEmail(req: any, res: any) {
    try {
      const userDetails = await AuthService.getUserDetailsFromEmail(req, res);
      return res.status(201).json(userDetails);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async stripeCheckoutSession(req: any, res: any) {
    try {
      const stripeCheckout = await AuthService.stripeCheckoutSession(req);
      return res.status(201).json(stripeCheckout);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async paymobCheckout(req: any, res: any) {
    try {
      const result = await AuthService.paymobCheckout(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async stripeSuccessRequest(req: any, res: any) {
    try {
      const stripeCheckout = await AuthService.stripeSuccessRequest(req);
      return res.status(200).json(stripeCheckout);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async stripeUpgradeSubscription(req: Request, res: Response) {
    try {
      const stripeUpgradeSubscription =
        await AuthService.stripeUpgradeSubscription(req);
      return res.status(201).json(stripeUpgradeSubscription);
    } catch (error) {
      console.log(error, 'errorerror');
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async paypalCreateOrder(req: any, res: any) {
    try {
      const paypalOrder = await AuthService.paypalCreateOrder(req);
      return res.status(201).json(paypalOrder);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async paypalCaptureOrder(req: any, res: any) {
    try {
      const paypalOrder = await AuthService.paypalCaptureOrder(req);
      return res.status(201).json(paypalOrder);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async paypalInvoices(req: any, res: any) {
    try {
      const paypalInvoices = await AuthService.paypalInvoices();
      return res.status(201).json(paypalInvoices);
    } catch (error) {
      console.log(error, 'errorerror');

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // subscribeToFreePlan
  async subscribeToFreePlan(req: Request, res: Response) {
    try {
      const subscribeToFreePlan = await AuthService.subscribeToFreePlan(req);
      return res.status(201).json(subscribeToFreePlan);
    } catch (error) {
      console.log(error, 'errorerror');
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // changeAutoRenew
  async changeAutoRenew(req: Request, res: Response) {
    try {
      const result = await AuthService.changeAutoRenewal(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error, 'errorerror');
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async suspendPaymobSubscription(req: Request, res: Response) {
    try {
      const result = await AuthService.suspendPaymobSubscription(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.log(error, 'errorerror');
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new AuthController();
