import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '../entities/bill.entity';
import { BillService } from '../services/bill.service';
import { BillController } from '../controllers/bill.controller';
import { CartModule } from './cart.module';
import { BillItem } from 'src/entities/bill-item.entity';
import { CartItemModule } from './cart-item.module';
import { DiscountModule } from './discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillItem]),
    CartModule,
    CartItemModule,
    DiscountModule,
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
