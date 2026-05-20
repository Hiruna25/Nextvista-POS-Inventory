// MongoDB connection with direct IP instead of hostname
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Try with direct IP (if you have it) or use local MongoDB
const mongoUriOptions = [
  // Option 1: Your Atlas URI (current)
  'mongodb+srv://Hiruna:Dakshitha6531@cluster0.k7pou0s.mongodb.net/pos_inventory',
  
  // Option 2: If cluster exists but hostname is DNS issue (try without +srv)
  // Note: This requires knowing the direct IP
  
  // Option 3: Local MongoDB fallback
  'mongodb://localhost:27017/pos_inventory'
];

async function findWorkingConnection() {
  for (const uri of mongoUriOptions) {
    try {
      console.log(`\nTrying: ${uri.substring(0, 50)}...`);
      await mongoose.connect(uri, { 
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000 
      });
      console.log('✓ Connection successful!');
      return uri;
    } catch (err) {
      console.log(`✗ Failed: ${err.message.substring(0, 60)}`);
      await mongoose.disconnect();
    }
  }
  return null;
}

findWorkingConnection().then(uri => {
  if (uri) {
    console.log('\n✓ Found working MongoDB connection');
    process.exit(0);
  } else {
    console.log('\n⚠️  No MongoDB connection available');
    console.log('\nNext steps:');
    console.log('1. Check if cluster0 exists in MongoDB Atlas');
    console.log('2. If deleted, create a new cluster');
    console.log('3. Copy new connection string to .env');
    process.exit(1);
  }
});
