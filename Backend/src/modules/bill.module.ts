import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '../entities/bill.entity';
import { BillService } from '../services/bill.service';
import { BillController } from '../controllers/bill.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}