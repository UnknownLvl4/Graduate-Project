import { IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  product_id: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;
}
