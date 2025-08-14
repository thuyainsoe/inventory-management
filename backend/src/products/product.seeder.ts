import { DataSource } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';

export async function seedProducts(dataSource: DataSource) {
  const productRepository = dataSource.getRepository(Product);
  const categoryRepository = dataSource.getRepository(Category);

  const existingProducts = await productRepository.count();
  if (existingProducts > 0) {
    console.log('Products already exist, skipping seeding...');
    return;
  }

  // Get category IDs
  const electronics = await categoryRepository.findOne({ where: { name: 'Electronics' } });
  const clothing = await categoryRepository.findOne({ where: { name: 'Clothing' } });
  const books = await categoryRepository.findOne({ where: { name: 'Books' } });
  const homeGarden = await categoryRepository.findOne({ where: { name: 'Home & Garden' } });
  const sports = await categoryRepository.findOne({ where: { name: 'Sports & Outdoors' } });
  const toysGames = await categoryRepository.findOne({ where: { name: 'Toys & Games' } });
  const healthBeauty = await categoryRepository.findOne({ where: { name: 'Health & Beauty' } });
  const automotive = await categoryRepository.findOne({ where: { name: 'Automotive' } });
  const foodBeverages = await categoryRepository.findOne({ where: { name: 'Food & Beverages' } });
  const officeSupplies = await categoryRepository.findOne({ where: { name: 'Office Supplies' } });

  const products = [
    {
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone with Pro features',
      sku: 'IPHONE15PRO-001',
      barcode: '123456789001',
      categoryId: electronics?.id || 1,
      price: 999.99,
      cost: 750.00,
      stock: 25,
      minStock: 5,
      images: ['iphone15pro-1.jpg', 'iphone15pro-2.jpg']
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone',
      sku: 'GALAXYS24-001',
      barcode: '123456789002',
      categoryId: electronics?.id || 1,
      price: 899.99,
      cost: 650.00,
      stock: 30,
      minStock: 8,
      images: ['galaxys24-1.jpg']
    },
    {
      name: 'MacBook Air M3',
      description: '13-inch laptop with M3 chip',
      sku: 'MACBOOKAIR-M3-001',
      barcode: '123456789003',
      categoryId: electronics?.id || 1,
      price: 1299.99,
      cost: 950.00,
      stock: 15,
      minStock: 3,
      images: ['macbookair-1.jpg', 'macbookair-2.jpg']
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Wireless noise-cancelling headphones',
      sku: 'SONY-WH1000XM5-001',
      barcode: '123456789004',
      categoryId: electronics?.id || 1,
      price: 399.99,
      cost: 280.00,
      stock: 50,
      minStock: 10,
      images: ['sony-headphones-1.jpg']
    },
    {
      name: 'iPad Pro 12.9"',
      description: 'Professional tablet with M2 chip',
      sku: 'IPADPRO-129-001',
      barcode: '123456789005',
      categoryId: electronics?.id || 1,
      price: 1099.99,
      cost: 800.00,
      stock: 20,
      minStock: 5,
      images: ['ipadpro-1.jpg', 'ipadpro-2.jpg']
    },
    {
      name: 'Dell XPS 13',
      description: 'Premium ultrabook laptop',
      sku: 'DELLXPS13-001',
      barcode: '123456789006',
      categoryId: electronics?.id || 1,
      price: 1199.99,
      cost: 850.00,
      stock: 12,
      minStock: 3,
      images: ['dellxps13-1.jpg']
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced smartwatch with health monitoring',
      sku: 'APPLEWATCH9-001',
      barcode: '123456789007',
      categoryId: electronics?.id || 1,
      price: 429.99,
      cost: 320.00,
      stock: 40,
      minStock: 8,
      images: ['applewatch9-1.jpg', 'applewatch9-2.jpg']
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'Gaming console with OLED display',
      sku: 'SWITCH-OLED-001',
      barcode: '123456789008',
      categoryId: toysGames?.id || 6,
      price: 349.99,
      cost: 250.00,
      stock: 35,
      minStock: 7,
      images: ['switch-oled-1.jpg']
    },
    {
      name: 'Bose QuietComfort Earbuds',
      description: 'Wireless earbuds with noise cancellation',
      sku: 'BOSE-QC-EARBUDS-001',
      barcode: '123456789009',
      categoryId: electronics?.id || 1,
      price: 279.99,
      cost: 200.00,
      stock: 60,
      minStock: 12,
      images: ['bose-earbuds-1.jpg']
    },
    {
      name: 'LG 27" 4K Monitor',
      description: '27-inch 4K UHD monitor for professionals',
      sku: 'LG-27-4K-001',
      barcode: '123456789010',
      categoryId: electronics?.id || 1,
      price: 499.99,
      cost: 350.00,
      stock: 18,
      minStock: 4,
      images: ['lg-monitor-1.jpg', 'lg-monitor-2.jpg']
    }
  ];

  await productRepository.save(products);
  console.log('Successfully seeded 10 products!');
}