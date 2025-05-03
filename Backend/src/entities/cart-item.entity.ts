import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cart_id: string;

  @Column()
  product_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  sold_price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}