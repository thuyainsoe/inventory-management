import { Expose, Type } from 'class-transformer';
import { CategoryDto } from './category.dto';

export class PaginatedCategoriesDto {
  @Expose()
  @Type(() => CategoryDto)
  data: CategoryDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}