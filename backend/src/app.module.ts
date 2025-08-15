import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { BrandsModule } from './brands/brands.module';
import { Brand } from './brands/brand.entity';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseOrder } from './purchase-orders/purchase-order.entity';
import { PurchaseOrderItem } from './purchase-orders/purchase-order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        User,
        Product,
        Category,
        Brand,
        PurchaseOrder,
        PurchaseOrderItem,
      ],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    PurchaseOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
