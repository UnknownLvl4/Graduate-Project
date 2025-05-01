import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  review_id: string;

  @IsNotEmpty()
  product_id: string;

  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class UpdateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
