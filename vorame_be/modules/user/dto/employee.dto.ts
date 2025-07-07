import { IsString, IsEmail, IsArray, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  roles: string[];

  @IsString()
  @IsEmail()
  email: string;
}
