const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ override: true });

const User = require('./models/User');

async function createManagerUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Check if manager already exists
    const existing = await User.findOne({ email: 'manager@example.com' });
    if (existing) {
      console.log('✓ Manager user already exists');
      console.log('  Username: Manager');
      console.log('  Email: manager@example.com');
      process.exit(0);
    }
    
    // Create new manager user
    const hashedPassword = await bcrypt.hash('Manager123', 10);
    
    const manager = new User({
      username: 'Manager',
      email: 'manager@example.com',
      password: hashedPassword,
      roles: ['manager'],
      permissions: [
        'manage_products',
        'manage_inventory',
        'view_reports'
      ]
    });
    
    await manager.save();
    console.log('✓ Manager user created successfully\n');
    console.log('Login Credentials:');
    console.log('  Username: Manager');
    console.log('  Password: Manager123');
    console.log('  Email: manager@example.com');
    console.log('  Role: Manager');
    console.log('\nPermissions:');
    console.log('  - Manage products');
    console.log('  - Manage inventory');
    console.log('  - View reports');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createManagerUser();
