import { Controller, Get, Post, Delete, Body, Param, Logger } from '@nestjs/common';
import { BillItemService } from '../services/bill-item.service';

@Controller('bill-items')
export class BillItemController {
  private readonly logger = new Logger(BillItemController.name);

  constructor(private readonly billItemService: BillItemService) {}

  @Get()
  findAll() {
    this.logger.log('Fetching all bill items');
    return this.billItemService.findAll();
  }

  @Get(':billId')
  findByBillId(@Param('billId') billId: string) {
    this.logger.log(`Fetching bill items for bill ID: ${billId}`);
    return this.billItemService.findByBillId(billId);
  }

  @Post()
  create(@Body() billItem: { bill_id: string; product_id: string; pricing: number; quantity: number }) {
    this.logger.log('Creating a new bill item');
    return this.billItemService.create(billItem);
  }

  @Delete(':billItemId')
  delete(@Param('billItemId') billItemId: string) {
    this.logger.log(`Deleting bill item ID: ${billItemId}`);
    return this.billItemService.delete(billItemId);
  }
}