const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config({ override: true });

const User = require('./models/User');

async function updateAdminCredentials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Find the existing admin user
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('Found admin user:', admin.username);
    
    // Update password to Admin123 (without exclamation)
    const hashedPassword = await bcrypt.hash('Admin123', 10);
    admin.password = hashedPassword;
    admin.username = 'Admin'; // Ensure correct username
    
    await admin.save();
    console.log('✓ Admin credentials updated successfully');
    console.log('  Username: Admin');
    console.log('  Password: Admin123');
    console.log('  Email: admin@example.com');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateAdminCredentials();
