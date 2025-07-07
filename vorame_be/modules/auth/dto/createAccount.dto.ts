import { IsString, IsEmail, Matches, IsOptional } from "class-validator";

export class CreateAccountDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  userName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  countryName: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  dob: string;

  @IsString()
  @IsOptional()
  lattitude: string;

  @IsString()
  @IsOptional()
  longitude: string;

  @IsString()
  @IsOptional() //mark as optional
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message:
  //       "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
  //   }
  // )
  @Matches(/^\d{6,12}$/, {
    message: "Passcode should be 6 to 12 digits long.",
  })
  password?: string;
}
