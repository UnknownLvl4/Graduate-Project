import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  findAll() {
    return this.subCategoryRepository.find();
  }

  findOne(id: string) {
    return this.subCategoryRepository.findOne({ where: { id } });
  }

  create(subCategory: Partial<SubCategory>) {
    return this.subCategoryRepository.save(subCategory);
  }

  update(id: string, subCategory: Partial<SubCategory>) {
    return this.subCategoryRepository.update(id, subCategory);
  }
}