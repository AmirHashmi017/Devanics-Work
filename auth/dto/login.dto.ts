import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from "class-validator";

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @Matches(/^\d{6,12}$/, {
      message: "Passcode should be 6 to 12 digits long.",
    })
  password: string;
}
