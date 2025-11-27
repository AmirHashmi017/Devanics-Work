import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class AddCompanyDetail {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  companyName: string;

  @IsOptional()
  @IsString()
  industry: string;

  @IsOptional()
  @IsNumber()
  employee: number;
}
