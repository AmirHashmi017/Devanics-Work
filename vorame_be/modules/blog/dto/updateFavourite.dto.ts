import { IsString, IsBoolean } from "class-validator";

export class updateFavouriteDto {
  @IsString()
  id: string;

  @IsBoolean()
  favourite: string;
}
