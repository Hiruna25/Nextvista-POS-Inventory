const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== VERIFYING SYSTEM CONNECTIONS ===\n');

  try {
    // Test 1: Backend Health
    console.log('1. Testing Backend Health...');
    const health = await testEndpoint('/api/health');
    if (health.status === 200 && health.data.success) {
      console.log('   ✓ Backend is running');
      console.log('   ✓ Status:', health.data.message);
    } else {
      console.log('   ✗ Backend health check failed');
    }

    // Test 2: Login (tests MongoDB)
    console.log('\n2. Testing MongoDB Connection (Login)...');
    const login = await testEndpoint('/api/auth/login', 'POST', {
      username: 'Admin',
      password: 'Admin123'
    });
    
    if (login.status === 200 && login.data.success) {
      console.log('   ✓ MongoDB is connected');
      console.log('   ✓ Admin user found');
      console.log('   ✓ User:', login.data.user.name || login.data.user.username);
      
      const token = login.data.token;

      // Test 3: Fetch data with token
      console.log('\n3. Testing Data Flow (Products)...');
      const products = await testEndpoint('/api/products?page=1&limit=5', 'GET');
      
      // Try with Authorization header
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/products?page=1&limit=5',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const productData = JSON.parse(data);
            if (productData.success || productData.data) {
              console.log('   ✓ Data retrieved from MongoDB');
              const count = productData.data?.length || 0;
              console.log(`   ✓ Found ${count} products`);
              if (count > 0 && productData.data[0]) {
                console.log('   ✓ Sample product:', productData.data[0].name);
              }
            }
          } catch (e) {
            console.log('   Error parsing response:', e.message);
          }
          printSummary();
        });
      });
      req.on('error', (e) => console.log('   ✗ Request error:', e.message));
      req.end();
    } else {
      console.log('   ✗ Login failed:', login.data?.message || 'Unknown error');
      console.log('   Status code:', login.status);
      printSummary();
    }
  } catch (err) {
    console.log('✗ Error:', err.message);
    printSummary();
  }
}

function printSummary() {
  console.log('\n=== SUMMARY ===');
  console.log('Frontend → Backend: Configured');
  console.log('Backend → MongoDB: Testing...');
  console.log('Data Flow: Testing...');
  process.exit(0);
}

runTests();
