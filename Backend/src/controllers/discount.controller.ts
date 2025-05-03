import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { DiscountService } from '../services/discount.service';
import { CreateDiscountDto } from '../dto/discount.dto';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  async findAll() {
    return await this.discountService.findAll();
  }

  @Get(':productId')
  async findByProductId(@Param('productId') productId: string) {
    return await this.discountService.findByProductId(productId);
  }

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountService.create(createDiscountDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDiscountDto: CreateDiscountDto) {
    return await this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.discountService.delete(id);
  }
}