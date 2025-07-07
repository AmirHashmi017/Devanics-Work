import { IsArray, IsString } from "class-validator";
import { FileDto } from "./file.dto";

class ReportDto {
  @IsArray()
  reportCategory: string[];
}

class MessageDto {

  @IsString()
  message: string;

  @IsArray()
  files: FileDto[]
}

export { ReportDto, MessageDto };
