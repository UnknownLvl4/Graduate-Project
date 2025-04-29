import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
export declare class ProductController {
    private readonly productService;
    private readonly logger;
    constructor(productService: ProductService);
    findAll(page?: number, limit?: number, category?: string): Promise<{
        items: import("../entities/product.entity").Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(categoryId: string, productId: string): Promise<import("../entities/product.entity").Product>;
    create(createProductDto: CreateProductDto, imageFile: Express.Multer.File): Promise<import("../entities/product.entity").Product>;
    update(categoryId: string, productId: string, updateProductDto: UpdateProductDto, imageFile: Express.Multer.File): Promise<{
        category_id: string;
        product_id: string;
        product_name: string;
        description: string;
        stock_quantity: number;
        image: string;
        price: number;
    } & import("../entities/product.entity").Product>;
    remove(categoryId: string, productId: string): Promise<{
        category_id: string;
        product_id: string;
    }>;
    bulkDelete(ids: Array<{
        category_id: string;
        product_id: string;
    }>): Promise<{
        ids: {
            category_id: string;
            product_id: string;
        }[];
    }>;
}
