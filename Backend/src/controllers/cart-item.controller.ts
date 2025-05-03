import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { CartItemService } from '../services/cart-item.service';

@Controller('cart-items')
export class CartItemController {
  private readonly logger = new Logger(CartItemController.name);

  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  findAll() {
    this.logger.log('Fetching all cart items');
    return this.cartItemService.findAll();
  }

  @Get(':cartId')
  findByCartId(@Param('cartId') cartId: string) {
    this.logger.log(`Fetching cart items for cart ID: ${cartId}`);
    return this.cartItemService.findByCartId(cartId);
  }

  @Post()
  create(@Body() cartItem: { user_id: string; product_id: string; quantity?: number }) {
    this.logger.log('Creating a new cart item');
    const cartItemWithDefaults = { ...cartItem, quantity: cartItem.quantity ?? 1 };
    return this.cartItemService.create(cartItemWithDefaults);
  }

  @Delete(':cartItemId')
  delete(@Param('cartItemId') cartItemId: string) {
    this.logger.log(`Deleting cart item ID: ${cartItemId}`);
    return this.cartItemService.delete(cartItemId);
  }
}