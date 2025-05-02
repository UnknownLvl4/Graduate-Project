import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'category', schema: 'public' })
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}