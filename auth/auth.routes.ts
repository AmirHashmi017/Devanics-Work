import { Router } from "express";

import AuthController from "./auth.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { LoginDto } from "./dto/login.dto";
import { SignDto } from "./dto/signup.dto";
import { PhoneSignUpDto } from "./dto/phone-signup.dto";
import { ForgotPassword, PhoneForgotPassword } from "./dto/forgotPassword.dto";
import { ResetPassword } from "./dto/resetPassword.dto";
import { AddCompanyDetail } from "./dto/addCompanyDetail.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { GoogleAuth } from "./dto/googleAuth.dto";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
// import googleSignIn from "./singinWithGoogle";
import { createAccountPhoneNo } from "./dto/createAccountPhoneNo.dto";
import { ChangePasswordDto } from "./dto/changepassword.dto";
import { VerifyPasswordDto } from "./dto/verifyPassword.dto";
export const authRoutes = Router();

//signUp user by email
authRoutes.post("/login", validateDTO(LoginDto), AuthController.login);

authRoutes.post(
  "/email-signup",
  validateDTO(SignDto),
  AuthController.emailsignup
);

authRoutes.post(
  "/create-account",
  validateDTO(CreateAccountDto),
  AuthController.createAccount
);
authRoutes.post("/otp-verification", AuthController.otpVerification);

//signUp user by Phone Number
authRoutes.post(
  "/phone-signup",
  validateDTO(PhoneSignUpDto),
  AuthController.phoneSignup
);

authRoutes.post(
  "/createAccount-PhoneNo",
  validateDTO(createAccountPhoneNo),
  AuthController.createAccountPhoneNo
);

authRoutes.post(
  "/phone-forgot-password",
  validateDTO(PhoneForgotPassword),
  AuthController.phoneForgotPassword
);

authRoutes.post("/phoneotp-verification", AuthController.phoneOtpVerification);

authRoutes.post("/user-verification", AuthController.userVerification);

authRoutes.post(
  "/change-password/:userId",
  validateDTO(ChangePasswordDto),
  AuthController.changePassword
);

authRoutes.post(
  "/verify-password/:userId",
  validateDTO(VerifyPasswordDto),
  AuthController.verifyPassword
);

authRoutes.get("/countries", AuthController.getAllCountries);

authRoutes.post(
  "/forgot-password",
  validateDTO(ForgotPassword),
  AuthController.forgotPassword
);

authRoutes.post(
  "/reset-password",
  validateDTO(ResetPassword),
  AuthController.resetPassword
);

authRoutes.post(
  "/user-social-authentication",
  validateDTO(GoogleAuth),
  AuthController.googleAuth
);

// authRoutes.post("/google-sigin", googleSignIn);
authRoutes.post(
  "/verify-social-auth-user",
  AuthController.socialAuthUserVerification
);

authRoutes.get("/me", authorizeRequest, AuthController.me);
