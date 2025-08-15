import { Expose } from 'class-transformer';

export class UnitDto {
  @Expose()
  id: number;

  @Expose()
  name: string; // Full name like "Pieces", "Kilogram"

  @Expose()
  description: string;

  @Expose()
  symbol: string; // Display symbol like "pc", "kg", "m"

  @Expose()
  conversionFactor: number; // e.g., 1 for base unit

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
