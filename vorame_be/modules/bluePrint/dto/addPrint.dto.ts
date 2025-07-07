import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "./file.dto";

export class AddPrintDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
