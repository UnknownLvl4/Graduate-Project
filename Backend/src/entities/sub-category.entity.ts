import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sub_category')
export class SubCategory {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  category_id: string;
}