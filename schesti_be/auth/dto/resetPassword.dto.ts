import { IsString, MinLength } from 'class-validator';

export class ResetPassword {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  userId: string;
}
