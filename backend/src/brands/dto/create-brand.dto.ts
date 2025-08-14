import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Logo must be a valid URL' })
  logo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
