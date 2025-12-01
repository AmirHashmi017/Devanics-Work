import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsArray, 
  ValidateNested,
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocalizedPriceDto {
  @IsString()
  country: string;

  @IsString()
  countryCode: string;

  @IsString()
  currency: string;

  @IsNumber()
  price: number;
}

export class PricingPlanDto {
  @IsString()
  type: string;

  @IsString()
  planName: string;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsString()
  baseCurrency?: string;

  @IsString()
  duration: string;

  @IsOptional()
  @IsNumber()
  freeTrailDays?: number;

  @IsString()
  planDescription: string;

  @IsString()
  features: string;

  @IsOptional()
  @IsBoolean()
  isInternal: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedPriceDto)
  @ArrayMinSize(1, { message: 'At least one localized price is required' })
  localizedPricing: LocalizedPriceDto[];
}