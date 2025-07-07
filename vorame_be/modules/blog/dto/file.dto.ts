import { IsString } from "class-validator";

export class FileDto {
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsString()
  extension: string;

  @IsString()
  name: string;
}
