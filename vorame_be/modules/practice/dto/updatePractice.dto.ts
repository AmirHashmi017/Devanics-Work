import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "./file.dto";

export class UpdatePracticeDto {
  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
