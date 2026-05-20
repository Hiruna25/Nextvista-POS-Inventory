const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

async function testConnections() {
  try {
    console.log('=== TESTING SYSTEM CONNECTIONS ===\n');

    // Test 1: Backend Health
    console.log('1. Testing Backend Health...');
    try {
      const healthRes = await axios.get(`${baseURL}/health`);
      console.log('✓ Backend is running:', healthRes.data.message);
    } catch (err) {
      console.log('✗ Backend health check failed:', err.message);
    }

    // Test 2: Login (MongoDB test)
    console.log('\n2. Testing MongoDB Connection (via Login)...');
    try {
      const loginRes = await axios.post(`${baseURL}/auth/login`, {
        username: 'Admin',
        password: 'Admin123'
      });
      
      if (loginRes.data.success) {
        console.log('✓ MongoDB is connected');
        console.log('✓ User authenticated:', loginRes.data.user.name);
        const token = loginRes.data.token;

        // Test 3: Fetch Products with token
        console.log('\n3. Testing Data Flow (Products)...');
        try {
          const productsRes = await axios.get(`${baseURL}/products`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✓ Data retrieved from MongoDB');
          console.log(`✓ Found ${productsRes.data.data.length} products`);
          if (productsRes.data.data.length > 0) {
            console.log('  Sample product:', productsRes.data.data[0].name);
          }
        } catch (err) {
          console.log('✗ Failed to fetch products:', err.message);
        }
      } else {
        console.log('✗ Login failed:', loginRes.data.message);
      }
    } catch (err) {
      console.log('✗ MongoDB connection test failed:', err.message);
    }

    console.log('\n=== TEST COMPLETE ===');
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }

  process.exit(0);
}

testConnections();
