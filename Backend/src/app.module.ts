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
      entities: [Product, User, Review, Category, SubCategory], // Add Review entity here
      synchronize: false, // Disable synchronization
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
