import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import { SubCategoryService } from '../services/sub-category.service';
import { SubCategoryController } from '../controllers/sub-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}