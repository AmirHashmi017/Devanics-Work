import { IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";

export class AddWhistleDto {
  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  date: Date;
}
