import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MinLength(1, { message: 'Unit name is required' })
  @MaxLength(100, { message: 'Unit name must not exceed 100 characters' })
  name: string; // e.g., Pieces, Kilogram

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Symbol must not exceed 10 characters' })
  symbol?: string; // e.g., pc, kg

  @IsOptional()
  @IsNumber({}, { message: 'Conversion factor must be a number' })
  conversionFactor?: number; // e.g., 1

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
