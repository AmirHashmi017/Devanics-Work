import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class PricingPlanDto {
  @IsString()
  type: string;

  @IsString()
  planName: string;

  @IsNumber()
  price: Number;

  @IsString()
  duration: Number;

  // @IsNumber()
  // freeTrailDays: Number;

  @IsString()
  planDescription: string;

  @IsString()
  features: string;

  @IsOptional()
  @IsBoolean()
  isInternal: boolean;
}
