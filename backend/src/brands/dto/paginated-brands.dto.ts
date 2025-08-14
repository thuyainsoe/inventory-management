import { Expose, Type } from 'class-transformer';
import { BrandDto } from './brand.dto';

export class PaginatedBrandsDto {
  @Expose()
  @Type(() => BrandDto)
  data: BrandDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}
