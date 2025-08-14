import { Repository } from 'typeorm';
import { Category } from './category.entity';

export async function seedCategories(categoryRepo: Repository<Category>) {
  // Check if categories already exist
  const existingCategories = await categoryRepo.count();
  if (existingCategories > 0) {
    console.log('Categories already exist, skipping seeding');
    return;
  }

  console.log('Seeding categories...');

  const categoriesToCreate = [
    {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      color: '#3B82F6',
      icon: 'laptop',
    },
    {
      name: 'Clothing',
      description: 'Apparel and fashion items',
      color: '#F59E0B',
      icon: 'shirt',
    },
    {
      name: 'Books',
      description: 'Books, magazines and reading materials',
      color: '#10B981',
      icon: 'book-open',
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and gardening supplies',
      color: '#8B5CF6',
      icon: 'home',
    },
    {
      name: 'Sports & Outdoors',
      description: 'Sports equipment and outdoor gear',
      color: '#EF4444',
      icon: 'dribbble',
    },
    {
      name: 'Toys & Games',
      description: 'Toys, games and entertainment products',
      color: '#F97316',
      icon: 'gamepad-2',
    },
    {
      name: 'Health & Beauty',
      description: 'Health care and beauty products',
      color: '#EC4899',
      icon: 'heart',
    },
    {
      name: 'Automotive',
      description: 'Car parts and automotive accessories',
      color: '#6B7280',
      icon: 'car',
    },
    {
      name: 'Food & Beverages',
      description: 'Food items and beverages',
      color: '#FBBF24',
      icon: 'utensils',
    },
    {
      name: 'Office Supplies',
      description: 'Office equipment and stationery',
      color: '#06B6D4',
      icon: 'briefcase',
    },
  ];

  for (const categoryData of categoriesToCreate) {
    const category = categoryRepo.create({
      ...categoryData,
      isActive: true,
    });

    await categoryRepo.save(category);
  }

  console.log('Categories seeded successfully');
}