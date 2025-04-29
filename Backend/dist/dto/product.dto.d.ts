export declare class CreateProductDto {
    category_id: string;
    product_id: string;
    product_name: string;
    description: string;
    stock_quantity: number;
    image: string;
    price: number;
}
export declare class UpdateProductDto implements Partial<CreateProductDto> {
    category_id?: string;
    product_id?: string;
    product_name?: string;
    description?: string;
    stock_quantity?: number;
    image?: string;
    price?: number;
}
