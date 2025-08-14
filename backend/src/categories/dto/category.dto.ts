import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  color: string;

  @Expose()
  icon: string;

  @Expose()
  isActive: boolean;

  @Expose()
  productCount?: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}