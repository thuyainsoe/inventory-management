export const serviceTemplate = `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { {{singular.pascal}} } from './{{singular.param}}.entity';
import { Create{{singular.pascal}}Dto } from './dto/create-{{singular.param}}.dto';
import { Update{{singular.pascal}}Dto } from './dto/update-{{singular.param}}.dto';

@Injectable()
export class {{plural.pascal}}Service {
  constructor(
    @InjectRepository({{singular.pascal}})
    private {{plural.camel}}Repository: Repository<{{singular.pascal}}>,
  ) {}

  async create(create{{singular.pascal}}Dto: Create{{singular.pascal}}Dto, creatorId?: string): Promise<{{singular.pascal}}> {
    const {{singular.camel}} = this.{{plural.camel}}Repository.create({
      ...create{{singular.pascal}}Dto,
      creatorId,
    });

    return await this.{{plural.camel}}Repository.save({{singular.camel}});
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: {{singular.pascal}}[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.{{plural.camel}}Repository.createQueryBuilder('{{singular.camel}}')
      .leftJoinAndSelect('{{singular.camel}}.creator', 'creator');

    if (search) {
      query.where('{{singular.camel}}.name ILIKE :search', { search: \`%\${search}%\` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('{{singular.camel}}.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<{{singular.pascal}}> {
    const {{singular.camel}} = await this.{{plural.camel}}Repository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!{{singular.camel}}) {
      throw new NotFoundException(\`{{singular.sentence}} with ID "\${id}" not found\`);
    }

    return {{singular.camel}};
  }

  async update(id: string, update{{singular.pascal}}Dto: Update{{singular.pascal}}Dto): Promise<{{singular.pascal}}> {
    const {{singular.camel}} = await this.findOne(id);
    
    Object.assign({{singular.camel}}, update{{singular.pascal}}Dto);
    
    return await this.{{plural.camel}}Repository.save({{singular.camel}});
  }

  async remove(id: string): Promise<void> {
    const {{singular.camel}} = await this.findOne(id);
    await this.{{plural.camel}}Repository.remove({{singular.camel}});
  }

  async getStats(): Promise<{
    total: number;
    // Add more stats as needed
  }> {
    const total = await this.{{plural.camel}}Repository.count();
    
    return {
      total,
    };
  }
}`;