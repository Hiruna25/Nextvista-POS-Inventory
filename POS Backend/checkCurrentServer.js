const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  try {
    console.log('=== CHECKING BACKEND DATABASE ===\n');

    // Login
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'Admin', password: 'Admin123' });

    if (!loginRes.body.success) {
      console.log('✗ Login failed');
      process.exit(1);
    }

    const token = loginRes.body.token;
    console.log('✓ Logged in successfully\n');

    // Get products
    const productsRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/products?page=1&limit=20',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (productsRes.body && productsRes.body.data) {
      console.log(`Found ${productsRes.body.data.length} products:\n`);
      productsRes.body.data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   Price: $${p.price} | Stock: ${p.stockQuantity}`);
      });
      
      console.log(`\n=== ANALYSIS ===`);
      if (productsRes.body.data.length === 5) {
        console.log('✓ Server showing 5 products (LOCAL MongoDB)');
        console.log('⚠️  Your 13 products are in MongoDB Atlas, not here');
        console.log('\nNext step: Fix Atlas connection or migrate data');
      } else if (productsRes.body.data.length === 13) {
        console.log('✓ Server showing 13 products (MONGODB ATLAS)');
        console.log('✓ Everything is working correctly!');
      }
    } else {
      console.log('Error:', productsRes.body);
    }
    
    process.exit(0);
  } catch (err) {
    console.log('✗ Error:', err.message);
    process.exit(1);
  }
}

test();
