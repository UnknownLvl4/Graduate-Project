import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Matches,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]+$/, {
    message: 'Category ID must contain only uppercase letters',
  })
  category_id: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]+$/, {
    message: 'Category ID must contain only uppercase letters',
  })
  sub_category_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Product ID cannot be longer than 10 characters' })
  product_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  product_name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  stock_quantity: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  price: number;
}

export class UpdateProductDto implements Partial<CreateProductDto> {
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]+$/, {
    message: 'Category ID must contain only uppercase letters',
  })
  category_id?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]+$/, {
    message: 'Category ID must contain only uppercase letters',
  })
  sub_category_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'Product ID cannot be longer than 10 characters' })
  product_id?: string;

  @IsString()
  @IsOptional()
  product_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  stock_quantity?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  price?: number;
}
