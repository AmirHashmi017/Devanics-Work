import { IsString } from "class-validator";

export class AddLibraryDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  description: string;
}
