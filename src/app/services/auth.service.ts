// auth.service.ts

// Importing base class
import { HttpService } from '@/app/services/base.service';

// Importing interfaces
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IUser } from '../interfaces/companyEmployeeInterfaces/user.interface';
import { ILogInInterface } from '@/app/interfaces/authInterfaces/login.interface';
import { ILoginWithGoogle } from '@/app/interfaces/authInterfaces/loginWithGoogle.interface';
import { ISignUpInterface } from '@/app/interfaces/authInterfaces/signup.interface';
import { IUserVerification } from '@/app/interfaces/authInterfaces/userVerfication.interface';
// import { IRegisterCompany } from '../interfaces/companyInterfaces/companyRegister.interface';
import { IForgotPasswordInterface } from '../interfaces/authInterfaces/forgotPassword.interface';
import { IResetPasswordInterface } from '../interfaces/authInterfaces/resetPassword.interface';
import {
  IPaymentProps,
  IPaypalPaymentProps,
} from '../interfaces/authInterfaces/payment.interface';
import { IUserInterface } from '../interfaces/user.interface';
import { IPaymobIntention } from '../interfaces/authInterfaces/paymob.interface';

class AuthService extends HttpService {
  private readonly prefix: string = 'api/auth';

  httpResetPasswordHandler = (
    data: IResetPasswordInterface
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/reset-password`, data);

  httpForgotPassword = (
    data: IForgotPasswordInterface
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/forgot-password`, data);

  httpResendForgotPasswordEmail = (
    data: IForgotPasswordInterface
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/resend-forgot-password-email`, data);
  httpResendCreateAccountEmail = (
    data: any
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/resend-create-account-email`, data);

  httpVerifyUserByEmail = (data: any): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/get-details-by-email`, data);

  addCompanyDetailHandler = (
    data: Partial<IUserInterface> & { userId: string }
  ): Promise<
    IResponseInterface<{ user: any; token: string; message: string }>
  > => this.post(`${this.prefix}/add-company-detail`, data);

  addVerificationDetailsHandler = (data: any): Promise<any> =>
    this.post(`${this.prefix}/add-verification-detail`, data);

  addSelectedTradesHandler = (data: any): Promise<any> =>
    this.post(`${this.prefix}/add-selected-trades`, data);

  signupHandler = (data: ISignUpInterface): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/signup`, data);
  httpUserVerification = (
    data: IUserVerification
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/user-verification`, data);

  verifyUserEmail = (token: string): Promise<IResponseInterface<any>> =>
    this.get(`${this.prefix}/verify-user-email/${token}`);

  loginHandler = (
    data: ILogInInterface
  ): Promise<
    IResponseInterface<{ token: string; user: IUser; message: string }>
  > => this.post(`${this.prefix}/login`, data);

  httpLoginWithGoogleHandler = (
    data: ILoginWithGoogle
  ): Promise<
    IResponseInterface<{
      token: string;
      user: IUser;
      message: string;
      statusCode: number;
    }>
  > => this.post(`${this.prefix}/auth-with-google`, data);

  httpSocialAuthUserVerification = (data: {
    email: string;
  }): Promise<
    IResponseInterface<{
      token: string;
      user: IUser;
      message: string;
      statusCode: number;
    }>
  > => this.post(`${this.prefix}/verify-social-auth-user`, data);

  httpStripeCheckout = (
    data: IPaymentProps
  ): Promise<
    IResponseInterface<{
      statusCode: number;
      message: string;
      data: any;
    }>
  > => this.post(`${this.prefix}/stripe-checkout`, data);

  httpPaymobCheckout = (
    data: IPaymentProps & { price?: number }
  ): Promise<IResponseInterface<IPaymobIntention>> =>
    this.post(`${this.prefix}/paymob-checkout`, data);

  httpUpgradeStripeMutation = (data: {
    planId: string;
  }): Promise<
    IResponseInterface<{
      statusCode: number;
      message: string;
      data: { planId: string };
    }>
  > => this.post(`${this.prefix}/stripe-upgrade-subscription`, data);

  httpStripeInvoices = (): Promise<IResponseInterface<any>> =>
    this.get(`${this.prefix}/stripe-invoices`);

  httpGetLoggedInUserDetails = (): Promise<
    IResponseInterface<{ user: IUserInterface }>
  > => this.get(`${this.prefix}/me`);

  httpPaypalCreateOrder = (
    data: IPaypalPaymentProps
  ): Promise<IResponseInterface<string>> =>
    this.post(`${this.prefix}/create-order`, data);

  httpPaypalCaptureOrder = (data: {
    orderID: string;
    subscriptionID: string;
    facilitatorAccessToken?: string;
    paymentSource: string;
  }): Promise<
    IResponseInterface<{
      status: number;
      msg: string;
      data: any;
    }>
  > => this.post(`${this.prefix}/capture-order`, data);

  httpGetUserDetailsByEmail = (
    email: string
  ): Promise<
    IResponseInterface<{
      user: IUserInterface;
    }>
  > => this.get(`${this.prefix}/get-details-by-email/${email}`);

  httpSubscribeToFreePlan = (
    planId: string
  ): Promise<IResponseInterface<IUserInterface>> =>
    this.post(`${this.prefix}/subscribe-to-free-plan`, { planId: planId });

  httpChangeAutoRenew = (data: {
    autoRenewal: boolean;
  }): Promise<IResponseInterface<IUserInterface>> =>
    this.put(`${this.prefix}/change-auto-renew`, data);

  httpSuspendPaymobSubscription = (): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/suspend-paymob-subscription`);
}
export const authService = new AuthService();
