import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Unit } from './unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async findAllWithPagination(
    offset: number,
    limit: number,
    search?: string,
  ): Promise<[Unit[], number]> {
    const findOptions: any = {
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    };

    const where: any = {};
    if (search) {
      where.name = ILike(`%${search}%`);
    }
    findOptions.where = where;

    const [units, total] = await this.unitRepository.findAndCount(findOptions);
    return [units, total];
  }

  async findAll(): Promise<Unit[]> {
    return this.unitRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    // Check for duplicate name
    const existingUnit = await this.unitRepository.findOne({
      where: { name: createUnitDto.name },
    });

    if (existingUnit) {
      throw new ConflictException(
        `Unit with name "${createUnitDto.name}" already exists`,
      );
    }

    const unit = this.unitRepository.create({
      ...createUnitDto,
      isActive: createUnitDto.isActive !== false,
    });

    return this.unitRepository.save(unit);
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.findOne(id);

    // Check if updating name to an existing name
    if (updateUnitDto.name && updateUnitDto.name !== unit.name) {
      const existingUnit = await this.unitRepository.findOne({
        where: { name: updateUnitDto.name },
      });

      if (existingUnit) {
        throw new ConflictException(
          `Unit with name "${updateUnitDto.name}" already exists`,
        );
      }
    }

    Object.assign(unit, updateUnitDto);
    return this.unitRepository.save(unit);
  }

  async remove(id: number): Promise<void> {
    const unit = await this.findOne(id);
    await this.unitRepository.remove(unit);
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const [total, active] = await Promise.all([
      this.unitRepository.count(),
      this.unitRepository.count({ where: { isActive: true } }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }
}
