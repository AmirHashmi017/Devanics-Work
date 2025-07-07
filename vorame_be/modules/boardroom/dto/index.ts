import { IsArray, IsMongoId, IsNumber, IsString } from "class-validator";
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

class UpdatePollDto {

  @IsMongoId()
  messageId: string;

  @IsNumber()
  selectedOption: number
}

export { ReportDto, UpdatePollDto, MessageDto };
