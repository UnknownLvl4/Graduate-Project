"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const fs = require("fs");
const path = require("path");
let ProductService = ProductService_1 = class ProductService {
    productRepository;
    logger = new common_1.Logger(ProductService_1.name);
    uploadsPath = path.join(process.cwd(), 'uploads', 'products');
    constructor(productRepository) {
        this.productRepository = productRepository;
        if (!fs.existsSync(this.uploadsPath)) {
            fs.mkdirSync(this.uploadsPath, { recursive: true });
        }
    }
    async findAll(page = 1, limit = 10, category) {
        this.logger.debug(`Finding all products. Page: ${page}, Limit: ${limit}, Category: ${category}`);
        try {
            const queryBuilder = this.productRepository.createQueryBuilder('product');
            if (category) {
                queryBuilder.where('product.category_id = :category', { category });
            }
            queryBuilder
                .orderBy('product.category_id')
                .addOrderBy('product.product_id');
            const [items, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            this.logger.debug(`Found ${items.length} products out of ${total} total`);
            return {
                items,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Error finding products:', error);
            throw error;
        }
    }
    async findOne(category_id, product_id) {
        this.logger.debug(`Finding product with category_id: ${category_id} and product_id: ${product_id}`);
        const product = await this.productRepository.findOne({
            where: { category_id, product_id }
        });
        if (!product) {
            this.logger.warn(`Product not found with category ${category_id} and id ${product_id}`);
            throw new common_1.NotFoundException(`Product with category ${category_id} and id ${product_id} not found`);
        }
        return product;
    }
    async create(createProductDto, imageFile) {
        this.logger.debug('Creating new product:', createProductDto);
        try {
            const exists = await this.productRepository.findOne({
                where: {
                    category_id: createProductDto.category_id,
                    product_id: createProductDto.product_id
                }
            });
            if (exists) {
                this.logger.warn('Product already exists with these IDs');
                throw new Error('Product with these IDs already exists');
            }
            if (imageFile) {
                const fileName = `${createProductDto.category_id}${createProductDto.product_id}${path.extname(imageFile.originalname)}`;
                const filePath = path.join(this.uploadsPath, fileName);
                fs.writeFileSync(filePath, imageFile.buffer);
                createProductDto.image = `/uploads/products/${fileName}`;
            }
            if (createProductDto.stock_quantity) {
                createProductDto.stock_quantity = Number(createProductDto.stock_quantity);
            }
            if (createProductDto.price) {
                createProductDto.price = Number(createProductDto.price);
            }
            const product = this.productRepository.create(createProductDto);
            const result = await this.productRepository.save(product);
            this.logger.debug('Product created successfully:', result);
            return result;
        }
        catch (error) {
            this.logger.error('Error creating product:', error);
            throw error;
        }
    }
    async update(category_id, product_id, updateProductDto, imageFile) {
        this.logger.debug(`Updating product with category_id: ${category_id} and product_id: ${product_id}`, updateProductDto);
        try {
            const product = await this.findOne(category_id, product_id);
            if (imageFile) {
                const fileName = `${category_id}${product_id}${path.extname(imageFile.originalname)}`;
                const filePath = path.join(this.uploadsPath, fileName);
                if (product.image) {
                    const oldImagePath = path.join(process.cwd(), product.image.replace(/^\//, ''));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                fs.writeFileSync(filePath, imageFile.buffer);
                updateProductDto.image = `/uploads/products/${fileName}`;
            }
            if (updateProductDto.stock_quantity) {
                updateProductDto.stock_quantity = Number(updateProductDto.stock_quantity);
            }
            if (updateProductDto.price) {
                updateProductDto.price = Number(updateProductDto.price);
            }
            const updatedProduct = {
                ...product,
                ...updateProductDto,
                category_id: product.category_id,
                product_id: product.product_id
            };
            const result = await this.productRepository.save(updatedProduct);
            this.logger.debug('Product updated successfully:', result);
            return result;
        }
        catch (error) {
            this.logger.error('Error updating product:', error);
            throw error;
        }
    }
    async remove(category_id, product_id) {
        this.logger.debug(`Removing product with category_id: ${category_id} and product_id: ${product_id}`);
        try {
            const product = await this.findOne(category_id, product_id);
            if (product.image) {
                const imagePath = path.join(process.cwd(), product.image.replace(/^\//, ''));
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            await this.productRepository.remove(product);
            this.logger.debug('Product removed successfully');
            return { category_id, product_id };
        }
        catch (error) {
            this.logger.error('Error removing product:', error);
            throw error;
        }
    }
    async bulkDelete(ids) {
        this.logger.debug('Bulk deleting products:', ids);
        try {
            for (const id of ids) {
                await this.remove(id.category_id, id.product_id);
            }
            return { ids };
        }
        catch (error) {
            this.logger.error('Error bulk deleting products:', error);
            throw error;
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map