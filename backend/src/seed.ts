import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { seedProducts } from './products/product.seeder';
import { seedUsers } from './users/user.seeder';
import { seedCategories } from './categories/category.seeder';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Product, Category],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    // Seed users first
    const userRepo = dataSource.getRepository(User);
    await seedUsers(userRepo);

    // Seed categories
    const categoryRepo = dataSource.getRepository(Category);
    await seedCategories(categoryRepo);

    // Then seed products
    await seedProducts(dataSource);

    await dataSource.destroy();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();