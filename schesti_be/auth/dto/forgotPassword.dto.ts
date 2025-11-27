import { IsString, IsEmail } from 'class-validator';

export class ForgotPassword {
  @IsString()
  @IsEmail()
  email!: string;
}
