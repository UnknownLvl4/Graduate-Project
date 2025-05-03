import { IsUUID, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateBillDto {
  @IsString()
  user_id: string;
}

export class CreateBillItemDto {
  @IsUUID()
  bill_id: string;

  @IsUUID()
  product_id: string;

  @IsNumber()
  pricing: number;

  @IsInt()
  quantity: number;
}