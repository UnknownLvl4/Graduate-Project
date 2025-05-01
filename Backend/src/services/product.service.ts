import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly uploadsPath = path.join(process.cwd(), 'uploads', 'products');

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsPath)) {
      fs.mkdirSync(this.uploadsPath, { recursive: true });
    }
  }

  async findAll(page = 1, limit = 10, category?: string) {
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
    } catch (error) {
      this.logger.error('Error finding products:', error);
      throw error;
    }
  }

  async findOne(category_id: string, product_id: string) {
    this.logger.debug(`Finding product with category_id: ${category_id} and product_id: ${product_id}`);
    const product = await this.productRepository.findOne({ 
      where: { category_id, product_id } 
    });
    if (!product) {
      this.logger.warn(`Product not found with category ${category_id} and id ${product_id}`);
      throw new NotFoundException(`Product with category ${category_id} and id ${product_id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, imageFile?: Express.Multer.File) {
    this.logger.debug('Creating new product:', createProductDto);
    try {
      // Check if product already exists
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

      // Handle image upload if provided
      if (imageFile) {
        const fileName = `${createProductDto.category_id}${createProductDto.product_id}${path.extname(imageFile.originalname)}`;
        const filePath = path.join(this.uploadsPath, fileName);
        
        // Save the file
        fs.writeFileSync(filePath, imageFile.buffer);
        
        // Update the image path in DTO
        const host = process.env.BACKEND_HOST || 'http://localhost:3001';
        createProductDto.image = `${host}/uploads/products/${fileName}`;
      }

      // Handle updateProductDto.stock_quantity is number and convert it to number
      if (createProductDto.stock_quantity) {
        createProductDto.stock_quantity = Number(createProductDto.stock_quantity);
      }

      // Handle updateProductDto.price is number and convert it to number
      if (createProductDto.price) {
        createProductDto.price = Number(createProductDto.price);
      }

      const product = this.productRepository.create(createProductDto);
      const result = await this.productRepository.save(product);
      this.logger.debug('Product created successfully:', result);
      return result;
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw error;
    }
  }

  async update(category_id: string, product_id: string, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File) {
    this.logger.debug(`Updating product with category_id: ${category_id} and product_id: ${product_id}`, updateProductDto);
    try {
      const product = await this.findOne(category_id, product_id);
      
      // Handle image upload if provided
      if (imageFile) {
        const fileName = `${category_id}${product_id}${path.extname(imageFile.originalname)}`;
        const filePath = path.join(this.uploadsPath, fileName);
        
        // Delete old image if exists
        if (product.image) {
          const oldImagePath = path.join(process.cwd(), product.image.replace(/^\//, ''));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        // Save the new file
        fs.writeFileSync(filePath, imageFile.buffer);
        
        // Update the image path in DTO
        const host = process.env.BACKEND_HOST || 'http://localhost:3001';
        updateProductDto.image = `${host}/uploads/products/${fileName}`;
      }

      // Handle updateProductDto.stock_quantity is number and convert it to number
      if (updateProductDto.stock_quantity) {
        updateProductDto.stock_quantity = Number(updateProductDto.stock_quantity);
      }

      // Handle updateProductDto.price is number and convert it to number
      if (updateProductDto.price) {
        updateProductDto.price = Number(updateProductDto.price);
      }

      // Create a new object with only the fields we want to update
      const updatedProduct = {
        ...product,
        ...updateProductDto,
        // Ensure we don't change the primary keys
        category_id: product.category_id,
        product_id: product.product_id
      };

      const result = await this.productRepository.save(updatedProduct);
      this.logger.debug('Product updated successfully:', result);
      return result;
    } catch (error) {
      this.logger.error('Error updating product:', error);
      throw error;
    }
  }

  async remove(category_id: string, product_id: string) {
    this.logger.debug(`Removing product with category_id: ${category_id} and product_id: ${product_id}`);
    try {
      const product = await this.findOne(category_id, product_id);

      // Delete image file if exists
      if (product.image) {
        const imagePath = path.join(process.cwd(), product.image.replace(/^\//, ''));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await this.productRepository.remove(product);
      this.logger.debug('Product removed successfully');
      return { category_id, product_id };
    } catch (error) {
      this.logger.error('Error removing product:', error);
      throw error;
    }
  }

  async bulkDelete(ids: Array<{category_id: string, product_id: string}>) {
    this.logger.debug('Bulk deleting products:', ids);
    try {
      for (const id of ids) {
        await this.remove(id.category_id, id.product_id);
      }
      return { ids };
    } catch (error) {
      this.logger.error('Error bulk deleting products:', error);
      throw error;
    }
  }

  async findMostExpensiveByCategory(): Promise<any> {
    this.logger.debug('Finding the most expensive product in each category and sub-category');
    try {
      const query = `
        SELECT p.*, c.name as category_name
        FROM product p
        INNER JOIN (
          SELECT 
            category_id, 
            MAX(price) as max_price
          FROM 
            product
          GROUP BY 
            category_id, sub_category_id
        ) max_prices
        ON p.category_id = max_prices.category_id 
        AND p.price = max_prices.max_price
        INNER JOIN category c ON p.category_id = c.id
      `;

      const result = await this.productRepository.query(query);

      this.logger.debug('Most expensive products by category and sub-category retrieved successfully:', result);
      return result;
    } catch (error) {
      this.logger.error('Error finding the most expensive products by category and sub-category:', error);
      throw error;
    }
  }
}