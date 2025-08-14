import { Expose } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  sku: string;

  @Expose()
  barcode: string;

  @Expose()
  category: string;

  @Expose()
  price: number;

  @Expose()
  cost: number;

  @Expose()
  stock: number;

  @Expose()
  minStock: number;

  @Expose()
  images: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}