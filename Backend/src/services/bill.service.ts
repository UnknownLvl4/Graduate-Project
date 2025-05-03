import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async findAll(): Promise<Bill[]> {
    return await this.billRepository.find();
  }

  async findByUser(userId: string): Promise<Bill[]> {
    return await this.billRepository.find({ where: { user_id: userId } });
  }

  async create(billData: { user_id: string }): Promise<Bill> {
    const newBill = this.billRepository.create(billData);
    return await this.billRepository.save(newBill);
  }

  async delete(billId: string): Promise<{ message: string }> {
    await this.billRepository.delete(billId);
    return { message: 'Bill deleted successfully' };
  }
}