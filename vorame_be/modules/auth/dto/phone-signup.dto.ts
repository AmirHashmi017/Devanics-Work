import { IsString, IsPhoneNumber } from "class-validator";

export class PhoneSignUpDto {
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
