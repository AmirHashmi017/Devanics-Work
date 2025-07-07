import { IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCareerDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  lastDate: string;

  @IsString()
  description: string;
}

export class CreateCareerApplicantDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  country: string;

  @IsString()
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  criminalConduct: number;

  @IsNumber()
  financialProblem: number;
}

export class UpdateCareerDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsDate()
  @IsOptional()
  endDate: string;

}

export class UpdateStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
