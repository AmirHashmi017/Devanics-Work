import { IsString } from "class-validator";

export class updateStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
