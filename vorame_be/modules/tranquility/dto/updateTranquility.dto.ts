import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { FileDto } from "../../bookClub/dto/file.dto";

export class UpdateTranquilityDto {

  @IsOptional()
  @IsString()
  title: string;
  
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  video: FileDto[];
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  thumbnail: FileDto[];

  @IsString()
  duration
}
