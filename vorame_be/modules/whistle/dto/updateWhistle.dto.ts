import { IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class UpdateWhistleDto {
  @IsString()
  id: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
