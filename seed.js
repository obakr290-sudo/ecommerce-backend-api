require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connection');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const seedData = async () => {
  await connectDB();

  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Database cleaned successfully.');

    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Gadgets and devices', slug: 'electronics' },
      { name: 'Books', description: 'Novels and textbooks', slug: 'books' },
      { name: 'Clothing', description: 'Apparel and fashion', slug: 'clothing' }
    ]);

    await Product.insertMany([
      { name: 'Smartphone', price: 699, stock: 10, category: categories[0]._id, inStock: true },
      { name: 'Laptop', price: 1200, stock: 5, category: categories[0]._id, inStock: true },
      { name: 'Sci-Fi Novel', price: 15, stock: 50, category: categories[1]._id, inStock: true },
      { name: 'History Book', price: 20, stock: 30, category: categories[1]._id, inStock: true },
      { name: 'T-Shirt', price: 25, stock: 100, category: categories[2]._id, inStock: true },
      { name: 'Jacket', price: 80, stock: 0, category: categories[2]._id, inStock: false }
    ]);

    console.log('Successfully added 3 Categories and 6 Products!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedData();