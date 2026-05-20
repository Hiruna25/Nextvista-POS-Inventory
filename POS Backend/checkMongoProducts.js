const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ override: true });

const Product = require('./models/Product');

async function checkProducts() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const mongoUri = process.env.MONGODB_URI;
    console.log('URI:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    const totalCount = await Product.countDocuments();
    console.log(`Total products in database: ${totalCount}`);

    const products = await Product.find().limit(20);
    console.log(`\nRetrieved ${products.length} products:\n`);
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - Price: $${p.price}, Stock: ${p.stockQuantity}`);
    });

    if (totalCount === 0) {
      console.log('\n⚠️  No products found! Database might be empty.');
    } else if (products.length < totalCount) {
      console.log(`\n... and ${totalCount - products.length} more products`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkProducts();
