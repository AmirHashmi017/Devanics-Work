import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "./file.dto";

export class AddLoungeDto {
  @IsString()
  category: string;

  @IsString()
  color: string;

  @IsString()
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
