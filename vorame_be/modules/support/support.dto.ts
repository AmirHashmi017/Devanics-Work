import { IsString } from "class-validator";

export class CreateTicketDto {
  @IsString()
  category: string;

  @IsString()
  subject: string;
}

export class TicketMessageDto {
  @IsString()
  message: string;
}

