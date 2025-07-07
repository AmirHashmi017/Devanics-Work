import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "./file.dto";

export class UpdateLoungeDto {
  @IsString()
  id: string;

  @IsString()
  category: string;

  @IsString()
  status: string;

  @IsString()
  color: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
