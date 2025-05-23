import { Controller, Get, Post, Body, Param, Put, Query, UseInterceptors, UploadedFile, ParseIntPipe, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('query') query?: string,
  ) {
    try {
      this.logger.log(`Finding all products - Page: ${page}, Limit: ${limit}, Query: ${query}`);
      const result = await this.productService.findAll(page, limit, query);
      this.logger.log(`Found ${result.items.length} products`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding products: ${error.message}`, error.stack);
      throw new HttpException('Error finding products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':categoryId/:productId')
  async findOne(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    try {
      this.logger.log(`Finding product - Category ID: ${categoryId}, Product ID: ${productId}`);
      const result = await this.productService.findOne(categoryId, productId);
      this.logger.log(`Found product: ${result.product_name}`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding product: ${error.message}`, error.stack);
      throw new HttpException('Error finding product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() imageFile: Express.Multer.File
  ) {
    try {
      this.logger.log(`Creating product: ${createProductDto.product_name}`);
      const result = await this.productService.create(createProductDto, imageFile);
      this.logger.log(`Created product: ${result.product_name}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`, error.stack);
      throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':categoryId/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageFile: Express.Multer.File
  ) {
    try {
      this.logger.log(`Updating product - Product ID: ${productId}`);
      const result = await this.productService.update(productId, updateProductDto, imageFile);
      this.logger.log(`Updated product: ${result.product_name}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating product: ${error.message}`, error.stack);
      throw new HttpException('Error updating product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('most-expensive-by-category')
  async findMostExpensiveByCategory() {
    try {
      this.logger.log(`Finding most expensive products by category`);
      const result = await this.productService.findMostExpensiveByCategory();
      this.logger.log(`Found most expensive products by category`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding most expensive products by category: ${error.message}`, error.stack);
      throw new HttpException('Error finding most expensive products by category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: string) {
    try {
      this.logger.log(`Getting product by ID: ${productId}`);
      const result = await this.productService.getProductById(productId);
      this.logger.log(`Found product: ${result.product_name}`);
      return result;
    } catch (error) {
      this.logger.error(`Error getting product by ID: ${error.message}`, error.stack);
      throw new HttpException('Error getting product by ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}