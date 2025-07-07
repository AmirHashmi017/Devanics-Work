import {IsString,IsArray,ValidateNested} from "class-validator"
import { Type } from "class-transformer";
import { FileDto } from "../../bookClub/dto/file.dto";

export class AddTranquilityDTO{

    @IsString()
    title: string;

    @IsString()
    description: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    video: FileDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    thumbnail: FileDto[];

    @IsString()
    duration

}