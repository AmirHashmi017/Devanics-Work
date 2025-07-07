import { IsString } from 'class-validator';

export class ContactUsDto {

  @IsString()
  subject: string;

  @IsString()
  message: string;
}
