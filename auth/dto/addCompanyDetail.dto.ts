import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class AddCompanyDetail {
  @IsString()
  userId: string;

  @IsString()
  companyName: string;

  @IsString()
  industry: string;

  @IsOptional()
  @IsNumber()
  employee: number;
}
