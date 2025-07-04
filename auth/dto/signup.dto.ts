import { IsString, IsEmail, MinLength } from "class-validator";

export class SignDto {
  @IsString()
  @IsEmail()
  email: string;
}
