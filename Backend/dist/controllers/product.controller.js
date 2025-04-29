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
var ProductController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const product_service_1 = require("../services/product.service");
const product_dto_1 = require("../dto/product.dto");
let ProductController = ProductController_1 = class ProductController {
    productService;
    logger = new common_1.Logger(ProductController_1.name);
    constructor(productService) {
        this.productService = productService;
    }
    async findAll(page, limit, category) {
        try {
            this.logger.log(`Finding all products - Page: ${page}, Limit: ${limit}, Category: ${category}`);
            const result = await this.productService.findAll(page, limit, category);
            this.logger.log(`Found ${result.items.length} products`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error finding products: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error finding products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(categoryId, productId) {
        try {
            this.logger.log(`Finding product - Category ID: ${categoryId}, Product ID: ${productId}`);
            const result = await this.productService.findOne(categoryId, productId);
            this.logger.log(`Found product: ${result.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error finding product: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error finding product', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(createProductDto, imageFile) {
        try {
            this.logger.log(`Creating product: ${createProductDto.name}`);
            const result = await this.productService.create(createProductDto, imageFile);
            this.logger.log(`Created product: ${result.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error creating product: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error creating product', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(categoryId, productId, updateProductDto, imageFile) {
        try {
            this.logger.log(`Updating product - Category ID: ${categoryId}, Product ID: ${productId}`);
            const result = await this.productService.update(categoryId, productId, updateProductDto, imageFile);
            this.logger.log(`Updated product: ${result.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error updating product: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error updating product', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(categoryId, productId) {
        try {
            this.logger.log(`Removing product - Category ID: ${categoryId}, Product ID: ${productId}`);
            const result = await this.productService.remove(categoryId, productId);
            this.logger.log(`Removed product: ${result.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error removing product: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error removing product', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkDelete(ids) {
        try {
            this.logger.log(`Bulk deleting products`);
            const result = await this.productService.bulkDelete(ids);
            this.logger.log(`Bulk deleted ${result.deletedCount} products`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error bulk deleting products: ${error.message}`, error.stack);
            throw new common_1.HttpException('Error bulk deleting products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':categoryId/:productId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':categoryId/:productId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':categoryId/:productId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "bulkDelete", null);
exports.ProductController = ProductController = ProductController_1 = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map