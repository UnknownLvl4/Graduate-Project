import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
export declare class ProductService {
    private productRepository;
    private readonly logger;
    private readonly uploadsPath;
    constructor(productRepository: Repository<Product>);
    findAll(page?: number, limit?: number, category?: string): Promise<{
        items: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(category_id: string, product_id: string): Promise<Product>;
    create(createProductDto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product>;
    update(category_id: string, product_id: string, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<{
        category_id: string;
        product_id: string;
        product_name: string;
        description: string;
        stock_quantity: number;
        image: string;
        price: number;
    } & Product>;
    remove(category_id: string, product_id: string): Promise<{
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
