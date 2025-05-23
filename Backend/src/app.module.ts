import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product.module';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { ReviewModule } from './modules/review.module';
import { Review } from './entities/review.entity';
import { CategoryModule } from './modules/category.module';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import { SubCategoryModule } from './modules/sub-category.module';
import { CartModule } from './modules/cart.module';
import { CartItemModule } from './modules/cart-item.module';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { BillModule } from './modules/bill.module';
import { BillItemModule } from './modules/bill-item.module';
import { BillItem } from './entities/bill-item.entity';
import { Bill } from './entities/bill.entity';
import { DiscountModule } from './modules/discount.module';
import { Discount } from './entities/discount.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'E_commerce',
      entities: [
        Product,
        User,
        Review,
        Category,
        SubCategory,
        Cart,
        CartItem,
        BillItem,
        Bill,
        Discount,
      ],
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductModule,
    AuthModule,
    UsersModule,
    ReviewModule,
    CategoryModule,
    SubCategoryModule,
    CartModule,
    CartItemModule,
    BillModule,
    BillItemModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
