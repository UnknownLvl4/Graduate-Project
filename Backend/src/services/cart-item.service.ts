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

  async create(cartItem: any) {
    const cartId = await this.getCartIdByUserId(cartItem.user_id);

    // Check if the product already exists in the cart
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cartId, product_id: cartItem.product_id },
    });

    if (existingCartItem) {
      // If the product exists, update the quantity
      existingCartItem.quantity += cartItem.quantity;
      console.log('Updating cart item quantity:', existingCartItem);
      return this.cartItemRepository.save(existingCartItem);
    } else {
      // If the product does not exist, create a new cart item
      const newCartItem = {
        ...cartItem,
        id: crypto.randomUUID(),
        cart_id: cartId,
      };
      console.log('Creating new cart item:', newCartItem);
      return this.cartItemRepository.save(newCartItem);
    }
  }

  private async getCartIdByUserId(userId: string): Promise<string> {
    console.log('Fetching cart ID for user ID:', userId);
    const cart = await this.cartItemRepository.query(
      `SELECT cart_id FROM cart WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    if (cart.length === 0) {
      throw new Error('Cart not found for the given user ID');
    }
    return cart[0].cart_id;
  }

  delete(cartItemId: string) {
    return this.cartItemRepository.delete(cartItemId);
  }

  deleteByCartId(cartId: string) {
    return this.cartItemRepository.delete({ cart_id: cartId });
  }

}
