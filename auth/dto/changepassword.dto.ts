import { IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  verifyPassword: string;

  @IsString()
  @Matches(/^\d{6,12}$/, {
    message: "Passcode should be 6 to 12 digits long.",
  })
  newPassword: string;
}
