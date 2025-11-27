import { Router } from 'express';
import express from 'express';
import AuthController from './auth.controller';
import { validateDTO } from '../../middlewares/validation.middleware';
import { LoginDto } from './dto/login.dto';
import { SignDto } from './dto/signup.dto';
import { ForgotPassword } from './dto/forgotPassword.dto';
import { ResetPassword } from './dto/resetPassword.dto';
import { AddCompanyDetail } from './dto/addCompanyDetail.dto';
import { GoogleAuth } from './dto/googleAuth.dto';
import { authorizeRequest } from '../../middlewares/authorization.middleware';
import { FreePlanSubscriptionDto } from './dto/subscription.dto';
import { paypalWebhook } from './paypal-webhook';

export const authRoutes = Router();

authRoutes.post('/login', validateDTO(LoginDto), AuthController.login);

authRoutes.post('/signup', validateDTO(SignDto), AuthController.signup);

authRoutes.post('/signup-otp', AuthController.signUpWithOTP);
authRoutes.post('/otp-verification', AuthController.otpVerification);

authRoutes.post('/resend-otp-verification', AuthController.resendSignUpWithOTP);

authRoutes.post('/user-verification', AuthController.userVerification);

authRoutes.post('/get-details-by-email', AuthController.postUserDetailsByEmail);
authRoutes.get('/verify-user-email/:token', AuthController.verifyUserEmail);
authRoutes.get(
  '/get-details-by-email/:email',
  AuthController.getUserDetailsFromEmail
);
authRoutes.post(
  '/forgot-password',
  validateDTO(ForgotPassword),
  AuthController.forgotPassword
);
authRoutes.post(
  '/resend-forgot-password-email',
  validateDTO(ForgotPassword),
  AuthController.forgotResendEmail
);

authRoutes.post(
  '/resend-create-account-email',
  AuthController.createAccountResendEmail
);

authRoutes.post(
  '/reset-password',
  validateDTO(ResetPassword),
  AuthController.resetPassword
);
authRoutes.post(
  '/add-company-detail',
  validateDTO(AddCompanyDetail),
  AuthController.addCompanyDetail
);

authRoutes.post(
  '/add-verification-detail',
  AuthController.addVerificationDetail
);

authRoutes.post('/add-selected-trades', AuthController.addSelectedTrades);

authRoutes.post(
  '/auth-with-google',
  validateDTO(GoogleAuth),
  AuthController.googleAuth
);
authRoutes.post(
  '/verify-social-auth-user',
  AuthController.socialAuthUserVerification
);
authRoutes.get('/verify-user-email/:token', AuthController.verifyUserEmail);

authRoutes.post(
  '/stripe-checkout',
  authorizeRequest,
  AuthController.stripeCheckoutSession
);

authRoutes.post(
  '/paymob-checkout',
  authorizeRequest,
  AuthController.paymobCheckout
);

authRoutes.post(
  '/suspend-paymob-subscription',
  authorizeRequest,
  AuthController.suspendPaymobSubscription
);

authRoutes.post(
  '/stripe-upgrade-subscription',
  authorizeRequest,
  AuthController.stripeUpgradeSubscription
);
// authRoutes.post("/stripe/cancel-subscription", authorizeRequest, AuthController.stripeCancelSubscription);

authRoutes.post('/stripe-success-webhook', AuthController.stripeSuccessRequest);
authRoutes.post('/paypal-webhook', paypalWebhook);
authRoutes.post(
  '/create-order',
  authorizeRequest,
  AuthController.paypalCreateOrder
);
authRoutes.post(
  '/capture-order',
  authorizeRequest,
  AuthController.paypalCaptureOrder
);
authRoutes.get('/paypal-invoices', AuthController.paypalInvoices);
authRoutes.get('/me', authorizeRequest, AuthController.me);

// subscribe to free plan

authRoutes.post(
  '/subscribe-to-free-plan',
  authorizeRequest,
  validateDTO(FreePlanSubscriptionDto),
  AuthController.subscribeToFreePlan
);

authRoutes.put(
  '/change-auto-renew',
  authorizeRequest,
  AuthController.changeAutoRenew
);
