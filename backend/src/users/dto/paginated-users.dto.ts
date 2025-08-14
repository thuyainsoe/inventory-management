import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class PaginatedUsersDto {
  @Expose()
  @Type(() => UserDto)
  data: UserDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}