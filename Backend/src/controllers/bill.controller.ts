import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
  Put,
} from '@nestjs/common';
import { BillService } from '../services/bill.service';

@Controller('bills')
export class BillController {
  private readonly logger = new Logger(BillController.name);

  constructor(private readonly billService: BillService) {}

  @Get()
  findAll() {
    this.logger.log('Fetching all bills');
    return this.billService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    this.logger.log(`Fetching bills for user ID: ${userId}`);
    return this.billService.findByUser(userId);
  }

  @Post()
  create(@Body() bill: { user_id: string }) {
    this.logger.log('Creating a new bill');
    return this.billService.create(bill);
  }

  @Put(':billId')
  update(@Param('billId') billId: string, @Body() bill: { status: string }) {
    this.logger.log(`Updating bill ID: ${billId}`);
    return this.billService.update(billId, bill);
  }

  @Delete(':billId')
  delete(@Param('billId') billId: string) {
    this.logger.log(`Deleting bill ID: ${billId}`);
    return this.billService.delete(billId);
  }

  @Post('checkout')
  createBillFromCart(@Body() cart: { user_id: string }) {
    this.logger.log('Creating a bill from cart');
    return this.billService.createBillFromCart(cart.user_id);
  }
}
