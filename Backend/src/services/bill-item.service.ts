import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillItem } from '../entities/bill-item.entity';

@Injectable()
export class BillItemService {
  constructor(
    @InjectRepository(BillItem)
    private readonly billItemRepository: Repository<BillItem>,
  ) {}

  async findAll(): Promise<BillItem[]> {
    return await this.billItemRepository.find();
  }

  async findByBillId(billId: string): Promise<BillItem[]> {
    return await this.billItemRepository.find({ where: { bill_id: billId } });
  }

  async create(billItemData: { bill_id: string; product_id: string; pricing: number; quantity: number }): Promise<BillItem> {
    const newBillItem = this.billItemRepository.create(billItemData);
    return await this.billItemRepository.save(newBillItem);
  }

  async delete(billItemId: string): Promise<{ message: string }> {
    await this.billItemRepository.delete(billItemId);
    return { message: 'Bill item deleted successfully' };
  }
}