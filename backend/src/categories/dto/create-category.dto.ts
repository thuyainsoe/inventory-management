import { IsString, IsOptional, IsHexColor, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1, { message: 'Category name is required' })
  @MaxLength(100, { message: 'Category name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Icon must not exceed 50 characters' })
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}