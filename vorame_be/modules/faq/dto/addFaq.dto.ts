import { IsString } from "class-validator";

export class AddFaqDto {
  @IsString()
  question: string;

  @IsString()
  description: string;
}
