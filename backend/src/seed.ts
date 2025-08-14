import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { seedProducts } from './products/product.seeder';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Product],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await seedProducts(dataSource);

    await dataSource.destroy();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();