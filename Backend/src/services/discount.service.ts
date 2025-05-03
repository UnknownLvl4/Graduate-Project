import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { CreateDiscountDto } from '../dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository.find();
  }

  async findByProductId(product_id: string): Promise<Discount[]> {
    return await this.discountRepository.find({ where: { product_id } });
  }

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const discount = this.discountRepository.create({
      ...createDiscountDto,
      id: crypto.randomUUID(),
    });
    return await this.discountRepository.save(discount);
  }

  async update(
    id: string,
    updateDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    await this.discountRepository.update(id, updateDiscountDto);
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new Error(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.discountRepository.delete(id);
    return { message: 'Discount deleted successfully' };
  }
}
