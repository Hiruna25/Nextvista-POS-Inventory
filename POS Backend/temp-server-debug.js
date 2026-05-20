const dotenv = require('dotenv');
dotenv.config({ override: true });
const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('dns servers on debug', dns.getServers());
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_inventory';
console.log('mongoUri', mongoUri);
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  family: 4,
  retryWrites: true,
  retryReads: true,
};
(async () => {
  try {
    await mongoose.connect(mongoUri, mongooseOptions);
    console.log('connected debug');
    await mongoose.disconnect();
  } catch (err) {
    console.error('connect err', err);
    process.exit(1);
  }
})();
