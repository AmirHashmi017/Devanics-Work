import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { USER_ROLES_ENUM } from '../../common/enums/user-roles.enum';

export class RegisterDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(USER_ROLES_ENUM)
  userRole: USER_ROLES_ENUM = USER_ROLES_ENUM.USER;
}
