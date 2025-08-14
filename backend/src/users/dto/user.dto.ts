import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  avatar: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
