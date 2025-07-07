import { IsString, Matches } from "class-validator";

export class VerifyPasswordDto {
 @IsString()
  @Matches(/^\d{6,12}$/, {
    message: "Passcode should be 6 to 12 digits long.",
  })  currentPassword: string;
}
