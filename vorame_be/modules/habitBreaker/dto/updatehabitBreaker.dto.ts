import {IsString,IsOptional} from "class-validator"

export class UpdatehabitBreakerDto {
  @IsOptional()
  @IsString()
  habit?: string;

  @IsOptional()
  @IsString()
  material_needed?: string;

  @IsOptional()
  @IsString()
  focus_behaviour?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsString()
  measures?: string;

  @IsOptional()
  @IsString()
  results?: string;
}