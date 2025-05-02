import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'product', schema: 'public' })
export class Product {
  @Column({ name: 'category_id' })
  category_id: string;

  @Column({ name: 'sub_category_id' })
  sub_category_id: string;

  @PrimaryColumn({ name: 'product_id' })
  product_id: string;

  @Column({ name: 'product_name' })
  product_name: string;

  @Column()
  description: string;

  @Column({ name: 'stock_quantity' })
  stock_quantity: number;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'price' })
  price: number;
}