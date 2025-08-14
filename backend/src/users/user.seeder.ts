import { Repository } from 'typeorm';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function seedUsers(userRepo: Repository<User>) {
  // Check if users already exist
  const existingUsers = await userRepo.count();
  if (existingUsers > 0) {
    console.log('Users already exist, skipping seeding');
    return;
  }

  console.log('Seeding users...');

  const usersToCreate = [
    {
      name: 'Admin User',
      email: 'admin@inventory.com',
      password: 'password123',
      role: 'admin',
    },
    {
      name: 'Manager John',
      email: 'manager@inventory.com',
      password: 'password123',
      role: 'manager',
    },
    {
      name: 'Staff Alice',
      email: 'staff@inventory.com',
      password: 'password123',
      role: 'staff',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@inventory.com',
      password: 'password123',
      role: 'staff',
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@inventory.com',
      password: 'password123',
      role: 'manager',
    },
  ];

  for (const userData of usersToCreate) {
    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userData.password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = userRepo.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    });

    await userRepo.save(user);
  }

  console.log('Users seeded successfully');
}