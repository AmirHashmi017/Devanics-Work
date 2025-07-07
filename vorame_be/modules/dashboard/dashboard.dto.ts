import { IsString } from "class-validator";

export class DashboardDto {
  @IsString()
  question: string;

  @IsString()
  description: string;
}
