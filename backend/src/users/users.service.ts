import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, name: string, role?: string, avatar?: string) {
    const user = this.repo.create({ 
      email, 
      password, 
      name, 
      role: role || 'staff',
      avatar 
    });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.repo.remove(user);
  }

  async findAllWithPagination(
    offset: number,
    limit: number,
    search?: string,
    role?: string,
  ): Promise<[User[], number]> {
    const queryBuilder = this.repo.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      if (search) {
        queryBuilder.andWhere('user.role = :role', { role });
      } else {
        queryBuilder.where('user.role = :role', { role });
      }
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    return queryBuilder.getManyAndCount();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email is already in use
    const existingUser = await this.repo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    // Create user
    const user = this.repo.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      role: createUserDto.role || 'staff',
      avatar: createUserDto.avatar,
    });

    return this.repo.save(user);
  }
}
