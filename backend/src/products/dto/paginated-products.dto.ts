import { Expose, Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class PaginatedProductsDto {
  @Expose()
  @Type(() => ProductDto)
  data: ProductDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}