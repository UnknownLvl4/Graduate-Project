import { IsString, IsUUID, IsDate } from 'class-validator';

export class CreateCartDto {
  @IsString()
  cart_id: string;

  @IsString()
  user_id: string;
}