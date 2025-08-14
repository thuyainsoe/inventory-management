import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  minStock: number;

  @IsArray()
  @IsOptional()
  images?: string[];
}