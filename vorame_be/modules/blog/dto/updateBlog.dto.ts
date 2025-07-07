import { IsString, IsArray, ValidateNested } from "class-validator";
import { FileDto } from "./file.dto";
import { Type } from "class-transformer";

export class UpdateBlogDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
