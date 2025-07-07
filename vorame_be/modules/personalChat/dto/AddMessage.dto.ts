import {IsString,IsArray,ValidateNested,IsOptional} from "class-validator"
import { Type } from "class-transformer";
import { FileDto } from "../../lounge/dto/file.dto";

export class AddMessageDto
{
    @IsString()
    sentTo:string;

    @IsOptional()
    @IsString()
    message:string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    file: FileDto[];
}