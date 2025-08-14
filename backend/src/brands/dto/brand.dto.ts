import { Expose } from 'class-transformer';

export class BrandDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  logo?: string; // URL or file path to brand logo

  @Expose()
  isActive: boolean;

  @Expose()
  productCount?: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
