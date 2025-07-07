import { IsEnum, IsPositive, IsString } from "class-validator";

export class CreatePromoCodeDto {

    @IsString()
    code: string;

    @IsEnum(['percentage', 'price'], { message: "type must be 'percentage' or 'price'" })
    @IsString()
    type: "percentage" | "price";

    @IsPositive()
    amount: number;

    @IsString()
    appliedTo: string;

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}