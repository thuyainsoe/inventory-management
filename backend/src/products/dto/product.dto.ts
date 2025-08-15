import { Expose, Type } from 'class-transformer';
import { BrandDto } from 'src/brands/dto/brand.dto';
import { CategoryDto } from 'src/categories/dto/category.dto';

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
  @Type(() => CategoryDto) // ✅ Tell Nest to serialize relation
  category: CategoryDto;

  @Expose()
  @Type(() => BrandDto) // ✅ Tell Nest to serialize relation
  brand: BrandDto;

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
