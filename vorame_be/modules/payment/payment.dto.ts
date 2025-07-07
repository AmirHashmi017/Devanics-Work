import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePaymentIntentDto {
    @IsString()
    planId: string;

    @IsOptional()
    @IsBoolean()
    withPromotion?: boolean;

    @IsOptional()
    @IsString()
    promoCode: string;
}


export class VerifyPromoCodeDto {
    @IsString()
    promoCode: string;

    @IsString()
    planId: string;
}