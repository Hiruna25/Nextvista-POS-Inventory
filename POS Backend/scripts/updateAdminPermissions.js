const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function updateAdminPermissions() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Find Admin user and add permissions
    const adminUser = await User.findOne({ username: 'Admin' });
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Current Admin permissions:', adminUser.permissions);

    // Add manage_products permission if not present
    if (!adminUser.permissions.includes('manage_products')) {
      adminUser.permissions.push('manage_products');
    }
    if (!adminUser.permissions.includes('manage_inventory')) {
      adminUser.permissions.push('manage_inventory');
    }
    if (!adminUser.permissions.includes('view_reports')) {
      adminUser.permissions.push('view_reports');
    }
    if (!adminUser.permissions.includes('manage_users')) {
      adminUser.permissions.push('manage_users');
    }

    await adminUser.save();
    console.log('Admin permissions updated:', adminUser.permissions);
    console.log('Admin user updated successfully');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error updating admin permissions:', error.message);
    process.exit(1);
  }
}

updateAdminPermissions();
