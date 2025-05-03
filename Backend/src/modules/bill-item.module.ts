import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItem } from '../entities/bill-item.entity';
import { BillItemService } from '../services/bill-item.service';
import { BillItemController } from '../controllers/bill-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillItem])],
  controllers: [BillItemController],
  providers: [BillItemService],
})
export class BillItemModule {}