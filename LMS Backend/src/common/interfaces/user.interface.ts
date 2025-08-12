import { Document } from 'mongoose';
import { USER_ROLES_ENUM } from '../enums/user-roles.enum';
import { OTP_ENUM } from '../enums/otp.enum';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  countryName?: string;
  dob?: string;
  gender?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  longitude?: string;
  lattitude?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: string;
  loginAttempts: number;
  providerId: string;
  providerType: string;
  otp?: number;
  otpStatus: OTP_ENUM;
  otpSentAt?: Date;
  name?: string;
  address?: string;
  userRole: USER_ROLES_ENUM;
  avatar?: string;
  bio?: string;
  deleted: boolean;
  lockTime: number;
  isPasscodeActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
