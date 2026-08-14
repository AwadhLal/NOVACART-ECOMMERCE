/**
 * NovaCart Database Seed Script
 * Usage: npm run seed
 * This will clear existing products & categories, then insert fresh seed data.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Product = require('../models/Product');
const Category = require('../models/Category');
const productsData = require('../dataset/products.json');

// Derive unique categories from products data
const derivedCategories = [
  ...new Set(productsData.map((p) => p.category)),
].map((name) => ({
  name,
  description: getCategoryDescription(name),
  image: getCategoryImage(name),
}));

function getCategoryDescription(name) {
  const descriptions = {
    Electronics: 'Latest gadgets, devices, and electronic accessories for modern living.',
    Clothing: 'Stylish and comfortable clothing for every occasion and season.',
    'Home & Garden': 'Everything you need to beautify and maintain your home and garden.',
    Sports: 'High-performance gear and equipment for athletes and fitness enthusiasts.',
    Books: 'Bestselling books across every genre — fiction, non-fiction, and technical.',
  };
  return descriptions[name] || `Quality products in the ${name} category.`;
}

function getCategoryImage(name) {
  const images = {
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    Clothing: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
    'Home & Garden': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500',
    Sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500',
    Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
  };
  return images[name] || 'https://placehold.co/500x300?text=Category';
}

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined. Please create a .env file in the backend directory.');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing existing products and categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Existing data cleared.');

    // Seed categories first
    console.log(`Seeding ${derivedCategories.length} categories...`);
    const insertedCategories = await Category.insertMany(derivedCategories);
    console.log(`✓ ${insertedCategories.length} categories seeded successfully.`);

    // Seed products
    console.log(`Seeding ${productsData.length} products...`);
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`✓ ${insertedProducts.length} products seeded successfully.`);

    // Summary
    console.log('\n=== Seed Summary ===');
    console.log(`Categories: ${insertedCategories.length}`);
    console.log(`Products:   ${insertedProducts.length}`);
    console.log('\nCategories seeded:');
    derivedCategories.forEach((c) => console.log(`  - ${c.name}`));
    console.log('\nDatabase seeding complete!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
