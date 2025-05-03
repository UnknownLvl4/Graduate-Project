import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find();
  }

  async findByUser(userId: string): Promise<Cart[]> {
    return await this.cartRepository.find({ where: { user_id: userId } });
  }

  async create(cartData: { user_id: string }): Promise<Cart> {
    const newCart = this.cartRepository.create(cartData);
    return await this.cartRepository.save(newCart);
  }

  async delete(cartId: string): Promise<{ message: string }> {
    const result = await this.cartRepository.delete(cartId);
    if ((result.affected || 0) > 0) {
      return { message: 'Cart deleted successfully' };
    }
    return { message: 'Cart not found' };
  }
}
