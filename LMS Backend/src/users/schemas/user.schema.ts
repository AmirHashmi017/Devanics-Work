import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_ROLES_ENUM } from '../../common/enums/user-roles.enum';
import { OTP_ENUM } from '../../common/enums/otp.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  countryName?: string;

  @Prop()
  dob?: string;

  @Prop()
  gender?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  longitude?: string;

  @Prop()
  lattitude?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: 'active' })
  isActive: string;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ default: '' })
  providerId: string;

  @Prop({ default: '' })
  providerType: string;

  @Prop()
  otp?: number;

  @Prop({ enum: Object.values(OTP_ENUM), default: OTP_ENUM.NOT_VERIFIED })
  otpStatus: OTP_ENUM;

  @Prop()
  otpSentAt?: Date;

  @Prop()
  name?: string;

  @Prop()
  address?: string;

  @Prop({ enum: Object.values(USER_ROLES_ENUM), required: true })
  userRole: USER_ROLES_ENUM;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: 0 })
  lockTime: number;

  @Prop({ default: true })
  isPasscodeActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
