import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  userRole: string;
}
