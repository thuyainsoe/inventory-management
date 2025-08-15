import { Expose, Type } from 'class-transformer';
import { UnitDto } from './unit.dto';

export class PaginatedUnitsDto {
  @Expose()
  @Type(() => UnitDto)
  data: UnitDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}
