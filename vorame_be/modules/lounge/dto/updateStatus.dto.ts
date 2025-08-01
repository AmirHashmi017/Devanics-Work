import { IsString } from "class-validator";

export class UpdateStatusDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
