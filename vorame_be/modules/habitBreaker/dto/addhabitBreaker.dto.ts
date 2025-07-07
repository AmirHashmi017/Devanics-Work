import { IsString, IsOptional } from "class-validator";

export class AddhabitBreakerDto {
  @IsString()
  habit: string;

  @IsString()
  material_needed: string;

  @IsString()
  focus_behaviour: string;

  @IsString()
  plan: string;

  @IsString()
  measures: string;

  @IsString()
  results: string;
}

