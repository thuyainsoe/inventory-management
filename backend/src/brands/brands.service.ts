import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAllWithPagination(
    offset: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<[Brand[], number]> {
    let findOptions: any = {
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    };

    // Build where condition
    const where: any = {};
    if (status) {
      where.isActive = status === 'active';
    }
    findOptions.where = where;

    // TODO: Implement search functionality later
    const [brands, total] =
      await this.brandRepository.findAndCount(findOptions);

    // Add product count to brands
    const brandsWithCount = brands.map((brand) => ({
      ...brand,
      productCount: 0, // TODO: calculate actual product count if needed
    }));

    return [brandsWithCount, total];
  }

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existingBrand = await this.brandRepository.findOne({
      where: { name: createBrandDto.name },
    });

    if (existingBrand) {
      throw new ConflictException(
        `Brand with name "${createBrandDto.name}" already exists`,
      );
    }

    const brand = this.brandRepository.create({
      ...createBrandDto,
      isActive: createBrandDto.isActive !== false,
    });

    return this.brandRepository.save(brand);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
      const existingBrand = await this.brandRepository.findOne({
        where: { name: updateBrandDto.name },
      });

      if (existingBrand) {
        throw new ConflictException(
          `Brand with name "${updateBrandDto.name}" already exists`,
        );
      }
    }

    Object.assign(brand, updateBrandDto);
    return this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withProducts: number;
  }> {
    const [total, active] = await Promise.all([
      this.brandRepository.count(),
      this.brandRepository.count({ where: { isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      withProducts: 0, // TODO: calculate actual count when products are linked
    };
  }
}
