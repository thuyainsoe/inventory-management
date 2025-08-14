import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAllWithPagination(
    offset: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<[Category[], number]> {
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

    // For now, ignore search to avoid query builder issues
    // TODO: Implement search functionality later
    const [categories, total] = await this.categoryRepository.findAndCount(findOptions);

    // Add product count to categories
    const categoriesWithCount = categories.map((category) => ({
      ...category,
      productCount: 0, // TODO: Calculate actual product count later
    }));

    return [categoriesWithCount, total];
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      // Remove relations until Product-Category relationship is fixed
      // relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      color: createCategoryDto.color || '#3B82F6',
      icon: createCategoryDto.icon || 'folder',
      isActive: createCategoryDto.isActive !== false,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Check if updating name to an existing name
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // For now, skip product count check until relationships are fixed
    // TODO: Check if category has products later
    // const productCount = ...

    await this.categoryRepository.remove(category);
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withProducts: number;
  }> {
    const [total, active] = await Promise.all([
      this.categoryRepository.count(),
      this.categoryRepository.count({ where: { isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      withProducts: 0, // TODO: Calculate actual count later when products are properly related
    };
  }
}