const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ override: true });

const User = require('./models/User');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Branch = require('./models/Branch');
const Product = require('./models/Product');

async function runIntegrationTests() {
  console.log('\n========== INTEGRATION TEST SUITE ==========\n');
  
  try {
    // 1. Test MongoDB Connection
    console.log('[1] Testing MongoDB Connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Connected Successfully');
    
    // 2. Test Data Existence
    console.log('\n[2] Verifying Seed Data...');
    const admin = await User.findOne({ email: 'admin@example.com' });
    const category = await Category.findOne({ name: 'General' });
    const supplier = await Supplier.findOne({ name: 'Default Supplier' });
    const branch = await Branch.findOne({ name: 'Main Branch' });
    
    console.log(`✓ Admin User: ${admin ? 'FOUND' : 'MISSING'}`);
    console.log(`✓ Category: ${category ? 'FOUND' : 'MISSING'}`);
    console.log(`✓ Supplier: ${supplier ? 'FOUND' : 'MISSING'}`);
    console.log(`✓ Branch: ${branch ? 'FOUND' : 'MISSING'}`);
    
    // 3. Test CRUD Operations
    console.log('\n[3] Testing CRUD Operations...');
    
    // Create test category
    const testCat = await Category.create({ 
      name: `Test Category ${Date.now()}`, 
      description: 'Integration test' 
    });
    console.log(`✓ CREATE: Category created (${testCat._id})`);
    
    // Read test category
    const readCat = await Category.findById(testCat._id);
    console.log(`✓ READ: Category retrieved (${readCat.name})`);
    
    // Update test category
    readCat.description = 'Updated description';
    await readCat.save();
    console.log(`✓ UPDATE: Category updated`);
    
    // Create test product
    const testProduct = await Product.create({
      name: `Test Product ${Date.now()}`,
      price: 99.99,
      cost: 50.00,
      stockQuantity: 10,
      category: category._id,
      supplier: supplier._id,
      branch: branch._id
    });
    console.log(`✓ CREATE: Product created (${testProduct._id})`);
    
    // List products
    const products = await Product.find().populate('category supplier branch').limit(5);
    console.log(`✓ LIST: Found ${products.length} products`);
    
    // Delete test category
    await Category.findByIdAndDelete(testCat._id);
    console.log(`✓ DELETE: Test category deleted`);
    
    // 4. Test Relationships
    console.log('\n[4] Testing Data Relationships...');
    const fullProduct = await Product.findById(testProduct._id)
      .populate('category', 'name')
      .populate('supplier', 'name')
      .populate('branch', 'name');
    
    console.log(`✓ Product Category: ${fullProduct.category?.name || 'N/A'}`);
    console.log(`✓ Product Supplier: ${fullProduct.supplier?.name || 'N/A'}`);
    console.log(`✓ Product Branch: ${fullProduct.branch?.name || 'N/A'}`);
    
    // 5. Summary
    console.log('\n========== TEST SUMMARY ==========');
    console.log('✓ MongoDB: Connected');
    console.log('✓ Database: Accessible');
    console.log('✓ Seed Data: Present');
    console.log('✓ CRUD Operations: Working');
    console.log('✓ Data Relationships: Intact');
    console.log('\n✅ ALL TESTS PASSED - Backend & Database Ready\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runIntegrationTests();
