import {IsString,IsNotEmpty} from "class-validator"

export class chatgptResponseDTO
{
    @IsString()
    @IsNotEmpty()
    userMessage:string;
}