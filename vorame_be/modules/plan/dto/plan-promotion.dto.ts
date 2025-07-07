import { IsEnum, IsPositive, IsString } from "class-validator";

export class CreatePlanPromotionDto {
    @IsString()
    title: string

    @IsString()
    startDate: Date;

    @IsString()
    endDate: Date;

    @IsEnum(['percentage', 'flat'], { message: 'type must be percentage or flat' })
    type: "percentage" | "flat";

    @IsPositive()
    discount: number

}

export class UpdatePlanPromotionDto extends CreatePlanPromotionDto {

    @IsString()
    planId: string

}