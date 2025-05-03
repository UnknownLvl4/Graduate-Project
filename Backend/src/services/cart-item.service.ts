import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  findAll() {
    return this.cartItemRepository.find();
  }

  findByCartId(cartId: string) {
    return this.cartItemRepository.find({ where: { cart_id: cartId } });
  }

  create(cartItem: Partial<CartItem>) {
    return this.cartItemRepository.save(cartItem);
  }

  delete(cartItemId: string) {
    return this.cartItemRepository.delete(cartItemId);
  }
}