import { IsString } from "class-validator";

export class UpdateLibraryDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  description: string;
}
