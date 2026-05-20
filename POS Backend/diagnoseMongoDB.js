const dns = require('dns');
const { MongoClient } = require('mongodb');

async function diagnoseConnection() {
  console.log('=== MONGODB ATLAS CONNECTION DIAGNOSTICS ===\n');

  const mongoUri = 'mongodb+srv://Hiruna:Dakshitha6531@cluster0.k7pou0s.mongodb.net/pos_inventory';
  const hostToDns = 'cluster0.k7pou0s.mongodb.net';

  // Step 1: DNS Resolution
  console.log('1. Testing DNS Resolution...');
  dns.resolve4(hostToDns, (err, addresses) => {
    if (err) {
      console.log(`   ✗ DNS Failed: ${err.code} - ${err.message}`);
      console.log('   This is likely a network/firewall issue.\n');
    } else {
      console.log(`   ✓ DNS Resolved: ${addresses.join(', ')}\n`);
    }

    // Step 2: Direct Connection Test
    console.log('2. Testing Direct MongoDB Connection...');
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      family: 4
    });

    client.connect()
      .then(async () => {
        console.log('   ✓ Connected to MongoDB Atlas!');
        
        // Get database info
        const db = client.db('pos_inventory');
        const collections = await db.listCollections().toArray();
        console.log(`   ✓ Database: pos_inventory`);
        console.log(`   ✓ Collections: ${collections.map(c => c.name).join(', ')}\n`);

        // Check products collection
        const productsCollection = db.collection('products');
        const count = await productsCollection.countDocuments();
        console.log(`3. Product Count in MongoDB Atlas:`);
        console.log(`   ✓ Found ${count} products in Atlas\n`);

        if (count > 0) {
          const sample = await productsCollection.findOne();
          console.log('   Sample product:');
          console.log(`   - Name: ${sample.name}`);
          console.log(`   - Price: $${sample.price}`);
          console.log(`   - Stock: ${sample.stockQuantity}`);
        }

        await client.close();
        process.exit(0);
      })
      .catch(err => {
        console.log(`   ✗ Connection Failed: ${err.message}\n`);
        console.log('   Possible causes:');
        console.log('   - Firewall blocking MongoDB ports');
        console.log('   - Network connectivity issues');
        console.log('   - VPN/Proxy interference');
        console.log('   - Wrong password in connection string\n');
        process.exit(1);
      });
  });
}

diagnoseConnection();
