import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { CartService } from './cart.service';
import { BillItem } from 'src/entities/bill-item.entity';
import { CartItemService } from './cart-item.service';
import { DiscountService } from './discount.service';
import { ProductService } from './product.service';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(BillItem)
    private readonly billItemsRepository: Repository<BillItem>,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly discountService: DiscountService,
    private readonly productService: ProductService,
  ) {}

  async findAll(): Promise<Bill[]> {
    // Fetch all bills from the database
    const bills: any[] = await this.billRepository.find();
    // Loop through each bill and fetch the items associated with it
    for (const bill of bills) {
      const items = await this.billItemsRepository.find({
        where: { bill_id: bill.id },
      });
      bill.total = items.reduce((acc, item) => acc + item.price, 0);
    }
    return bills;
  }

  async findByUser(userId: string): Promise<Bill[]> {
    return await this.billRepository.find({ where: { user_id: userId } });
  }

  async create(billData: { user_id: string }): Promise<Bill> {
    const newBill = this.billRepository.create(billData);
    return await this.billRepository.save(newBill);
  }

  async update(billId: string, billData: { status: string }): Promise<Bill> {
    await this.billRepository.update(billId, billData);
    const bill = await this.billRepository.findOne({ where: { id: billId } });
    if (!bill) {
      throw new Error(`Bill with ID ${billId} not found`);
    }
    return bill;
  }

  async delete(billId: string): Promise<{ message: string }> {
    await this.billRepository.delete(billId);
    return { message: 'Bill deleted successfully' };
  }

  async createBillFromCart(userId: string): Promise<Bill> {
    // get Cart from CartService (not implemented here)
    const cart = await this.cartService.findByUser(userId);
    if (!cart) {
      throw new Error('Cart not found for user');
    }

    for (const item of cart) {
      const product = await this.productService.findById(item.product_id);
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.product_id} not found`,
        );
      }
      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Không đủ số lượng sản phẩm cho ${product.product_name}. Hiện tại còn ${product.stock_quantity} sản phẩm`,
        );
      }
    }
    // create a new Bill from the Cart
    const newBill = this.billRepository.create({
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date(),
    });
    await this.billRepository.save(newBill);

    // Get all discounts from DiscountService (not implemented here)
    const discounts = await this.discountService.findAll();

    // Loop cart array and save each item to the bill items table
    this.billItemsRepository.save(
      cart.map((item) => ({
        ...item,
        price:
          (item.price *
            (100 -
              (discounts.find((d) => d.product_id === item.product_id)?.value ??
                0) || 0)) /
          100,
        bill_id: newBill.id,
        id: crypto.randomUUID(),
      })),
    );

    // Update stock in the product table
    for (const item of cart) {
      const product = await this.productService.findById(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      product.stock_quantity -= item.quantity;
      await this.productService.update(product.product_id, product);
    }

    // clear the Cart after creating the Bill
    await this.cartItemService.deleteByCartId(cart[0].cart_id);

    return newBill;
  }
}
