import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SubCategoryService } from '../services/sub-category.service';
import { SubCategory } from '../entities/sub-category.entity';

@Controller('sub-categories')
export class SubCategoryController {
  private readonly logger = new Logger(SubCategoryController.name);

  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all sub-categories');
      return await this.subCategoryService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching sub-categories: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching sub-categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching sub-category with ID: ${id}`);
      return await this.subCategoryService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching sub-category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching sub-category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() subCategory: Partial<SubCategory>) {
    try {
      this.logger.log('Creating a new sub-category');
      return await this.subCategoryService.create(subCategory);
    } catch (error) {
      this.logger.error(`Error creating sub-category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error creating sub-category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() subCategory: Partial<SubCategory>) {
    try {
      this.logger.log(`Updating sub-category with ID: ${id}`);
      return await this.subCategoryService.update(id, subCategory);
    } catch (error) {
      this.logger.error(`Error updating sub-category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error updating sub-category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}