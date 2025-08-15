import { Expose, Type } from 'class-transformer';
import { PurchaseOrderDto } from './purchase-order.dto';

export class PaginatedPurchaseOrdersDto {
  @Expose()
  @Type(() => PurchaseOrderDto)
  data: PurchaseOrderDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}