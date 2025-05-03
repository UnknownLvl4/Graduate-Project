import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';

@Controller('carts')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll() {
    this.logger.log('Fetching all carts');
    return this.cartService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    this.logger.log(`Fetching carts for user ID: ${userId}`);
    return this.cartService.findByUser(userId);
  }

  @Post()
  create(@Body() cart: { cart_id: string; user_id: string }) {
    this.logger.log('Creating a new cart');
    return this.cartService.create(cart);
  }

  @Delete(':cartId')
  delete(@Param('cartId') cartId: string) {
    this.logger.log(`Deleting cart ID: ${cartId}`);
    return this.cartService.delete(cartId);
  }
}
