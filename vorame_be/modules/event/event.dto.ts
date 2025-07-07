import { IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  eventName: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  description: string;
}

export class JoinEventDto {
  @IsString()
  firstName: string;
  @IsOptional()

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  eventName: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsString()
  @IsOptional()
  description: string;

}

export class UpdateStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
