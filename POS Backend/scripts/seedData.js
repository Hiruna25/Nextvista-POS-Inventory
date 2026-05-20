/**
 * Comprehensive Database Seeding Script
 * Seeds all collections with initial data
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Branch = require('../models/Branch');
const InventoryHistory = require('../models/InventoryHistory');
const SupplierOrder = require('../models/SupplierOrder');
const POSTransaction = require('../models/POSTransaction');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Supplier.deleteMany({}),
      Branch.deleteMany({}),
      InventoryHistory.deleteMany({}),
      SupplierOrder.deleteMany({}),
      POSTransaction.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = await User.insertMany([
      {
        username: 'Admin',
        password: 'Admin123', // This will be hashed by pre-save middleware
        role: 'admin',
        email: 'admin@pos.com',
        branch: 'Main Store'
      },
      {
        username: 'Manager',
        password: 'Manager123',
        role: 'manager',
        email: 'manager@pos.com',
        branch: 'Main Store'
      },
      {
        username: 'Cashier',
        password: 'Cashier123',
        role: 'cashier',
        email: 'cashier@pos.com',
        branch: 'Main Store'
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Branches
    const branches = await Branch.insertMany([
      {
        name: 'Main Store',
        location: '123 Main Street, City',
        manager: 'John Manager',
        contact: '555-0001',
        status: 'active'
      },
      {
        name: 'Downtown Branch',
        location: '456 Downtown Ave, City',
        manager: 'Jane Smith',
        contact: '555-0002',
        status: 'active'
      },
      {
        name: 'Mall Store',
        location: '789 Shopping Mall, City',
        manager: 'Bob Johnson',
        contact: '555-0003',
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${branches.length} branches`);

    // Create Suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'Premium Electronics Co.',
        contact_person: 'Mr. Ahmed',
        phone: '555-1001',
        email: 'sales@premiumelec.com',
        address: '100 Trade Street',
        payment_terms: 'Net 30',
        status: 'active'
      },
      {
        name: 'Fresh Foods Ltd.',
        contact_person: 'Ms. Sarah',
        phone: '555-1002',
        email: 'orders@freshfoods.com',
        address: '200 Farm Road',
        payment_terms: 'Net 15',
        status: 'active'
      },
      {
        name: 'Fashion & Apparel Inc.',
        contact_person: 'Mr. David',
        phone: '555-1003',
        email: 'wholesale@fashioninc.com',
        address: '300 Fashion District',
        payment_terms: 'Net 45',
        status: 'active'
      },
      {
        name: 'Home & Office Supplies',
        contact_person: 'Ms. Lisa',
        phone: '555-1004',
        email: 'sales@homeoffice.com',
        address: '400 Industrial Way',
        payment_terms: 'Net 30',
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers`);

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        status: 'active'
      },
      {
        name: 'Groceries',
        description: 'Fresh and packaged food items',
        status: 'active'
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        status: 'active'
      },
      {
        name: 'Home & Office',
        description: 'Home and office supplies',
        status: 'active'
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Cosmetics and personal care products',
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Products
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        sku: 'ELEC-001',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 79.99,
        cost: 40.00,
        stock_quantity: 45,
        min_stock_level: 10,
        max_stock_level: 100,
        description: 'High-quality wireless headphones with noise cancellation',
        status: 'active'
      },
      {
        name: 'USB-C Fast Charger',
        sku: 'ELEC-002',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 29.99,
        cost: 12.00,
        stock_quantity: 120,
        min_stock_level: 20,
        max_stock_level: 200,
        description: '65W USB-C fast charging adapter',
        status: 'active'
      },
      {
        name: 'Smartphone Screen Protector',
        sku: 'ELEC-003',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 9.99,
        cost: 2.50,
        stock_quantity: 200,
        min_stock_level: 50,
        max_stock_level: 500,
        description: 'Tempered glass screen protector for various phones',
        status: 'active'
      },
      // Groceries
      {
        name: 'Organic Whole Wheat Bread',
        sku: 'GROC-001',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 3.99,
        cost: 1.80,
        stock_quantity: 35,
        min_stock_level: 10,
        max_stock_level: 60,
        description: 'Fresh organic whole wheat bread',
        status: 'active'
      },
      {
        name: 'Greek Yogurt 500g',
        sku: 'GROC-002',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 4.49,
        cost: 2.00,
        stock_quantity: 28,
        min_stock_level: 10,
        max_stock_level: 50,
        description: 'Plain Greek yogurt, high protein',
        status: 'active'
      },
      {
        name: 'Free-Range Eggs Dozen',
        sku: 'GROC-003',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 5.99,
        cost: 2.80,
        stock_quantity: 42,
        min_stock_level: 15,
        max_stock_level: 80,
        description: 'Fresh free-range eggs, one dozen',
        status: 'active'
      },
      // Clothing
      {
        name: 'Classic Cotton T-Shirt',
        sku: 'CLOTH-001',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 19.99,
        cost: 8.00,
        stock_quantity: 150,
        min_stock_level: 30,
        max_stock_level: 300,
        description: '100% cotton comfortable t-shirt, available in multiple colors',
        status: 'active'
      },
      {
        name: 'Slim Fit Jeans',
        sku: 'CLOTH-002',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 49.99,
        cost: 22.00,
        stock_quantity: 75,
        min_stock_level: 15,
        max_stock_level: 150,
        description: 'Premium denim slim fit jeans',
        status: 'active'
      },
      {
        name: 'Winter Wool Sweater',
        sku: 'CLOTH-003',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 59.99,
        cost: 28.00,
        stock_quantity: 35,
        min_stock_level: 10,
        max_stock_level: 80,
        description: 'Warm wool blend sweater, perfect for winter',
        status: 'active'
      },
      // Home & Office
      {
        name: 'Ergonomic Office Chair',
        sku: 'HOME-001',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 199.99,
        cost: 95.00,
        stock_quantity: 18,
        min_stock_level: 5,
        max_stock_level: 40,
        description: 'Adjustable ergonomic office chair with lumbar support',
        status: 'active'
      },
      {
        name: 'Desk Lamp LED',
        sku: 'HOME-002',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 34.99,
        cost: 15.00,
        stock_quantity: 62,
        min_stock_level: 15,
        max_stock_level: 120,
        description: 'Adjustable LED desk lamp with USB charging port',
        status: 'active'
      },
      {
        name: 'A4 Paper Ream (500 sheets)',
        sku: 'HOME-003',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 5.49,
        cost: 2.20,
        stock_quantity: 180,
        min_stock_level: 50,
        max_stock_level: 400,
        description: 'High-quality white A4 paper, 80 gsm',
        status: 'active'
      },
      // Beauty & Personal Care
      {
        name: 'Moisturizing Face Cream 50ml',
        sku: 'BEAUTY-001',
        category: categories[4]._id,
        supplier: suppliers[1]._id,
        price: 24.99,
        cost: 10.00,
        stock_quantity: 85,
        min_stock_level: 20,
        max_stock_level: 150,
        description: 'Daily moisturizing face cream with SPF 20',
        status: 'active'
      },
      {
        name: 'Natural Shampoo 250ml',
        sku: 'BEAUTY-002',
        category: categories[4]._id,
        supplier: suppliers[1]._id,
        price: 12.99,
        cost: 5.00,
        stock_quantity: 110,
        min_stock_level: 25,
        max_stock_level: 200,
        description: 'Natural herbal shampoo, sulfate-free',
        status: 'active'
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create Inventory History
    const inventoryHistory = await InventoryHistory.insertMany([
      {
        product: products[0]._id,
        change_type: 'initial_stock',
        quantity: 45,
        previous_quantity: 0,
        reason: 'Initial stock setup',
        created_by: users[0]._id
      },
      {
        product: products[1]._id,
        change_type: 'purchase',
        quantity: 120,
        previous_quantity: 0,
        reason: 'Bulk purchase from supplier',
        created_by: users[0]._id
      },
      {
        product: products[3]._id,
        change_type: 'sale',
        quantity: -5,
        previous_quantity: 40,
        reason: 'POS transaction #001',
        created_by: users[2]._id
      }
    ]);
    console.log(`✅ Created ${inventoryHistory.length} inventory history records`);

    // Create Supplier Orders
    const supplierOrders = await SupplierOrder.insertMany([
      {
        order_number: 'PO-001',
        supplier: suppliers[0]._id,
        product: products[0]._id,
        quantity: 50,
        unit_price: 40.00,
        total_amount: 2000.00,
        order_date: new Date(),
        expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        order_number: 'PO-002',
        supplier: suppliers[1]._id,
        product: products[3]._id,
        quantity: 30,
        unit_price: 1.80,
        total_amount: 54.00,
        order_date: new Date(),
        expected_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'confirmed'
      }
    ]);
    console.log(`✅ Created ${supplierOrders.length} supplier orders`);

    // Create POS Transactions
    const posTransactions = await POSTransaction.insertMany([
      {
        transaction_number: 'TXN-001',
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            unit_price: 79.99,
            subtotal: 79.99
          },
          {
            product: products[3]._id,
            quantity: 2,
            unit_price: 3.99,
            subtotal: 7.98
          }
        ],
        subtotal: 87.97,
        tax: 5.28,
        total: 93.25,
        payment_method: 'cash',
        cashier: users[2]._id,
        branch: branches[0]._id,
        timestamp: new Date()
      },
      {
        transaction_number: 'TXN-002',
        items: [
          {
            product: products[6]._id,
            quantity: 2,
            unit_price: 19.99,
            subtotal: 39.98
          }
        ],
        subtotal: 39.98,
        tax: 2.40,
        total: 42.38,
        payment_method: 'credit_card',
        cashier: users[2]._id,
        branch: branches[0]._id,
        timestamp: new Date()
      }
    ]);
    console.log(`✅ Created ${posTransactions.length} POS transactions`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Branches: ${branches.length}`);
    console.log(`   - Suppliers: ${suppliers.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Inventory History: ${inventoryHistory.length}`);
    console.log(`   - Supplier Orders: ${supplierOrders.length}`);
    console.log(`   - POS Transactions: ${posTransactions.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
