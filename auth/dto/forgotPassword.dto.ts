import { IsString, IsEmail , IsPhoneNumber} from 'class-validator';

export class ForgotPassword {
  @IsString()
  @IsEmail()
  email!: string;
}

export class PhoneForgotPassword {
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}