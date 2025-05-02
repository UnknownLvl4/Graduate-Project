import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Controller('categories')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all categories');
      return await this.categoryService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching categories: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching category with ID: ${id}`);
      return await this.categoryService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      this.logger.log('Creating a new category');
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      this.logger.error(`Error creating category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error creating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      this.logger.log(`Updating category with ID: ${id}`);
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      this.logger.error(`Error updating category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error updating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting category with ID: ${id}`);
      return await this.categoryService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting category: ${error.message}`, error.stack);
      throw new HttpException(
        'Error deleting category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}