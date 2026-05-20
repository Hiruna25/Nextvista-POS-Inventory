/**
 * Seed Route Handler
 * API endpoint for populating database with initial data
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Branch = require('../models/Branch');
const InventoryHistory = require('../models/InventoryHistory');
const SupplierOrder = require('../models/SupplierOrder');
const POSTransaction = require('../models/POSTransaction');

router.post('/clear-database', async (req, res) => {
  try {
    console.log('🗑️  Clearing all collections...');
    
    await Promise.all([
      User.collection.drop().catch(() => {}),
      Category.collection.drop().catch(() => {}),
      Product.collection.drop().catch(() => {}),
      Supplier.collection.drop().catch(() => {}),
      Branch.collection.drop().catch(() => {}),
      InventoryHistory.collection.drop().catch(() => {}),
      SupplierOrder.collection.drop().catch(() => {}),
      POSTransaction.collection.drop().catch(() => {})
    ]);
    
    res.json({ success: true, message: 'Database cleared successfully' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ success: false, message: 'Error clearing database', error: error.message });
  }
});

router.post('/seed-database', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding via API...');

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

    // Create Users with hashed passwords
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const managerPassword = await bcrypt.hash('Manager123', 10);
    const cashierPassword = await bcrypt.hash('Cashier123', 10);

    const users = await User.insertMany([
      {
        username: 'Admin',
        password: adminPassword,
        roles: ['admin'],
        email: 'admin@pos.com',
        permissions: ['manage_products', 'manage_inventory', 'view_reports', 'manage_users']
      },
      {
        username: 'Manager',
        password: managerPassword,
        roles: ['manager'],
        email: 'manager@pos.com',
        permissions: ['manage_products', 'manage_inventory', 'view_reports']
      },
      {
        username: 'Cashier',
        password: cashierPassword,
        roles: ['user'],
        email: 'cashier@pos.com',
        permissions: ['view_reports']
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Branches
    const branches = await Branch.insertMany([
      {
        name: 'Main Store',
        location: '123 Main Street, City'
      },
      {
        name: 'Downtown Branch',
        location: '456 Downtown Ave, City'
      },
      {
        name: 'Mall Store',
        location: '789 Shopping Mall, City'
      }
    ]);
    console.log(`✅ Created ${branches.length} branches`);

    // Create Suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'Premium Electronics Co.',
        contact: 'Mr. Ahmed - 555-1001',
        email: 'sales@premiumelec.com',
        address: '100 Trade Street'
      },
      {
        name: 'Fresh Foods Ltd.',
        contact: 'Ms. Sarah - 555-1002',
        email: 'orders@freshfoods.com',
        address: '200 Farm Road'
      },
      {
        name: 'Fashion & Apparel Inc.',
        contact: 'Mr. David - 555-1003',
        email: 'wholesale@fashioninc.com',
        address: '300 Fashion District'
      },
      {
        name: 'Home & Office Supplies',
        contact: 'Ms. Lisa - 555-1004',
        email: 'sales@homeoffice.com',
        address: '400 Industrial Way'
      }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers`);

    // Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      },
      {
        name: 'Groceries',
        description: 'Fresh and packaged food items'
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items'
      },
      {
        name: 'Home & Office',
        description: 'Home and office supplies'
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Cosmetics and personal care products'
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Products
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        sku: 'ELEC-001',
        barcode: '8901234567890',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 79.99,
        cost: 40.00,
        stockQuantity: 45,
        minStockLevel: 10,
        maxStockLevel: 100,
        description: 'High-quality wireless headphones with noise cancellation'
      },
      {
        name: 'USB-C Fast Charger',
        sku: 'ELEC-002',
        barcode: '8901234567891',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 29.99,
        cost: 12.00,
        stockQuantity: 120,
        minStockLevel: 20,
        maxStockLevel: 200,
        description: '65W USB-C fast charging adapter'
      },
      {
        name: 'Smartphone Screen Protector',
        sku: 'ELEC-003',
        barcode: '8901234567892',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 9.99,
        cost: 2.50,
        stockQuantity: 200,
        minStockLevel: 50,
        maxStockLevel: 500,
        description: 'Tempered glass screen protector for various phones'
      },
      // Groceries
      {
        name: 'Organic Whole Wheat Bread',
        sku: 'GROC-001',
        barcode: '8901234567893',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 3.99,
        cost: 1.80,
        stockQuantity: 35,
        minStockLevel: 10,
        maxStockLevel: 60,
        description: 'Fresh organic whole wheat bread'
      },
      {
        name: 'Greek Yogurt 500g',
        sku: 'GROC-002',
        barcode: '8901234567894',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 4.49,
        cost: 2.00,
        stockQuantity: 28,
        minStockLevel: 10,
        maxStockLevel: 50,
        description: 'Plain Greek yogurt, high protein'
      },
      {
        name: 'Free-Range Eggs Dozen',
        sku: 'GROC-003',
        barcode: '8901234567895',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 5.99,
        cost: 2.80,
        stockQuantity: 42,
        minStockLevel: 15,
        maxStockLevel: 80,
        description: 'Fresh free-range eggs, one dozen'
      },
      // Clothing
      {
        name: 'Classic Cotton T-Shirt',
        sku: 'CLOTH-001',
        barcode: '8901234567896',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 19.99,
        cost: 8.00,
        stockQuantity: 150,
        minStockLevel: 30,
        maxStockLevel: 300,
        description: '100% cotton comfortable t-shirt, available in multiple colors'
      },
      {
        name: 'Slim Fit Jeans',
        sku: 'CLOTH-002',
        barcode: '8901234567897',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 49.99,
        cost: 22.00,
        stockQuantity: 75,
        minStockLevel: 15,
        maxStockLevel: 150,
        description: 'Premium denim slim fit jeans'
      },
      {
        name: 'Winter Wool Sweater',
        sku: 'CLOTH-003',
        barcode: '8901234567898',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 59.99,
        cost: 28.00,
        stockQuantity: 35,
        minStockLevel: 10,
        maxStockLevel: 80,
        description: 'Warm wool blend sweater, perfect for winter'
      },
      // Home & Office
      {
        name: 'Ergonomic Office Chair',
        sku: 'HOME-001',
        barcode: '8901234567899',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 199.99,
        cost: 95.00,
        stockQuantity: 18,
        minStockLevel: 5,
        maxStockLevel: 40,
        description: 'Adjustable ergonomic office chair with lumbar support'
      },
      {
        name: 'Desk Lamp LED',
        sku: 'HOME-002',
        barcode: '8901234567900',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 34.99,
        cost: 15.00,
        stockQuantity: 62,
        minStockLevel: 15,
        maxStockLevel: 120,
        description: 'Adjustable LED desk lamp with USB charging port'
      },
      {
        name: 'A4 Paper Ream (500 sheets)',
        sku: 'HOME-003',
        barcode: '8901234567901',
        category: categories[3]._id,
        supplier: suppliers[3]._id,
        price: 5.49,
        cost: 2.20,
        stockQuantity: 180,
        minStockLevel: 50,
        maxStockLevel: 400,
        description: 'High-quality white A4 paper, 80 gsm'
      },
      // Beauty & Personal Care
      {
        name: 'Moisturizing Face Cream 50ml',
        sku: 'BEAUTY-001',
        barcode: '8901234567902',
        category: categories[4]._id,
        supplier: suppliers[1]._id,
        price: 24.99,
        cost: 10.00,
        stockQuantity: 85,
        minStockLevel: 20,
        maxStockLevel: 150,
        description: 'Daily moisturizing face cream with SPF 20'
      },
      {
        name: 'Natural Shampoo 250ml',
        sku: 'BEAUTY-002',
        barcode: '8901234567903',
        category: categories[4]._id,
        supplier: suppliers[1]._id,
        price: 12.99,
        cost: 5.00,
        stockQuantity: 110,
        minStockLevel: 25,
        maxStockLevel: 200,
        description: 'Natural herbal shampoo, sulfate-free'
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create Inventory History
    const inventoryHistory = await InventoryHistory.insertMany([
      {
        product: products[0]._id,
        action: 'add',
        quantity: 45,
        previousStock: 0,
        newStock: 45,
        notes: 'Initial stock setup'
      },
      {
        product: products[1]._id,
        action: 'add',
        quantity: 120,
        previousStock: 0,
        newStock: 120,
        notes: 'Bulk purchase from supplier'
      },
      {
        product: products[3]._id,
        action: 'sale',
        quantity: 5,
        previousStock: 40,
        newStock: 35,
        notes: 'POS transaction'
      }
    ]);
    console.log(`✅ Created ${inventoryHistory.length} inventory history records`);

    // Create Supplier Orders
    const supplierOrders = await SupplierOrder.insertMany([
      {
        supplier: suppliers[0]._id,
        product: products[0]._id,
        quantity: 50,
        orderDate: new Date(),
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        supplier: suppliers[1]._id,
        product: products[3]._id,
        quantity: 30,
        orderDate: new Date(),
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'ordered'
      }
    ]);
    console.log(`✅ Created ${supplierOrders.length} supplier orders`);

    // Create POS Transactions
    const posTransactions = await POSTransaction.insertMany([
      {
        product: products[0]._id,
        quantity: 1,
        totalAmount: 79.99,
        branch: branches[0]._id
      },
      {
        product: products[3]._id,
        quantity: 2,
        totalAmount: 7.98,
        branch: branches[0]._id
      },
      {
        product: products[6]._id,
        quantity: 2,
        totalAmount: 39.98,
        branch: branches[0]._id
      }
    ]);
    console.log(`✅ Created ${posTransactions.length} POS transactions`);

    const summary = {
      success: true,
      message: '✅ Database seeding completed successfully!',
      data: {
        users: users.length,
        branches: branches.length,
        suppliers: suppliers.length,
        categories: categories.length,
        products: products.length,
        inventoryHistory: inventoryHistory.length,
        supplierOrders: supplierOrders.length,
        posTransactions: posTransactions.length
      }
    };

    console.log('\n✅ Summary:', summary);
    res.json(summary);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

module.exports = router;

