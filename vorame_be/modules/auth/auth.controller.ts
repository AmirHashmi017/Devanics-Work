import { generateErrorResponse } from "../../helper/errorResponse";
import AuthService from "./auth.service";
import type { Request, Response } from "express";
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
  async emailsignup(req: any, res: any) {
    try {
      const userCreation = await AuthService.emailSignup(req.body);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async phoneSignup(req: any, res: any) {
    try {
      const userCreation = await AuthService.phoneSignup(req.body);
      return res.status(userCreation.statusCode).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async createAccount(req: any, res: any) {
    try {
      const userCreation = await AuthService.createAccount(req.body);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //signup using phonenumber
  async createAccountPhoneNo(req: any, res: any) {
    try {
      const userCreation = await AuthService.createAccountPhoneNo(req.body);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //checkPassword the same or not
  async verifyPassword(req: any, res: any) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      const response = await AuthService.verifyPassword(userId, req.body);
      return res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
      console.error("Error occurred while checking password:", error);
      const errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode || 500).json(errorMessage);
    }
  }

  //change the password
  async changePassword(req: any, res: any) {
    try {
      const userId = req.params.userId;
      const response = await AuthService.changePassword(userId, req.body);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.log(error, "Error occurred while changing password");
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async userVerification(req: any, res: any) {
    try {
      const userCreation = await AuthService.userVerification(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getAllCountries(req: any, res: any) {
    try {
      const countryNames = await AuthService.getAllCountries();

      return res.status(201).json(countryNames);
    } catch (error) {
      console.log(error, "here is error");
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Otp verification by email
  async otpVerification(req: any, res: any) {
    try {
      const userCreation = await AuthService.otpVerification(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Otp verification by phone number
  async phoneOtpVerification(req: any, res: any) {
    try {
      const userCreation = await AuthService.phoneOtpVerification(req);
      return res.status(201).json(userCreation);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = await AuthService.me(req);
      return res.status(201).json(user);
    } catch (error) {
      console.log(error, "here is error");

      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //forgot password using email
  async forgotPassword(req: any, res: any) {
    try {
      const userForgotPassword = await AuthService.forgotPassword(req.body);
      return res.status(201).json(userForgotPassword);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //forgot password using phonenumber
  async phoneForgotPassword(req: any, res: any) {
    try {
      const userForgotPassword = await AuthService.phoneForgotPassword(req.body);
      return res.status(201).json(userForgotPassword);
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
      return res.status(201).json(socialAuthUser);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new AuthController();
