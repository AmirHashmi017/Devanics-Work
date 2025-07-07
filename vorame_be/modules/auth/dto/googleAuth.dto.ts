import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GoogleAuth {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  name: string;

  @IsString()
  avatar: string;

  @IsString()
  providerId: string;

  @IsOptional()
  userRole: string;
}
