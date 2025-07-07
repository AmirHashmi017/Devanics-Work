import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class ResetPassword {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
 @Matches(/^\d{6,12}$/, {
    message: "Passcode should be 6 to 12 digits long.",
  })  password: string;
}
