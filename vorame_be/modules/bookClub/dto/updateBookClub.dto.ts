import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "./file.dto";

export class updateBookClubDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  imageUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  file: FileDto[];
}
