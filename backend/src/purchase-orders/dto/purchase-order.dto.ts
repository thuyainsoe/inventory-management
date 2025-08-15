import { Expose, Type } from 'class-transformer';

export class PurchaseOrderItemDto {
  @Expose()
  id: string;

  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  unitPrice: number;

  @Expose()
  discount: number;

  @Expose()
  tax: number;

  @Expose()
  lineTotal: number;

  @Expose()
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

export class PurchaseOrderDto {
  @Expose()
  id: string;

  @Expose()
  poNumber: string;

  @Expose()
  poDate: string;

  @Expose()
  supplierId: number;

  @Expose()
  deliveryDate: string;

  @Expose()
  status: string;

  @Expose()
  paymentTerms: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  totalAmount: number;

  @Expose()
  paidAmount: number;

  @Expose()
  notes: string;

  @Expose()
  createdBy: number;

  @Expose()
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

  @Expose()
  creator: {
    id: number;
    name: string;
    email: string;
  };

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}