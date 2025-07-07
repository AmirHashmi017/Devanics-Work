import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePlanDto {
    @IsString()
    name: string;

    @IsEnum([6, 12, -1], {
        message: "duration must be 6, 12 or -1" // 6 for 6 months, 12 for 12 months and -1 for unlimited
    })
    duration: 1 | 12 | -1;

    @IsNumber()
    price: number;

    @IsNumber()
    discount: number;

    @IsString()
    @IsOptional()
    description: string;
}

export class UpdatePlanDto {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}

export class UpdatePlanStatusDto {
    @IsString()
    status: "active" | "inactive";
}