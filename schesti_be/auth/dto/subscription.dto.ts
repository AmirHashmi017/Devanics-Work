import { IsString } from 'class-validator';

export class FreePlanSubscriptionDto {
  @IsString()
  planId: string;
}
