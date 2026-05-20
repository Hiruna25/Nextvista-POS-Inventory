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
  console.log('=== FRONTEND LOGIN TEST ===\n');

  try {
    // Test 1: Login with Admin credentials
    console.log('1. Attempting login with Admin/Admin123...');
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'Admin', password: 'Admin123' });

    if (loginRes.status === 200 && loginRes.body.success) {
      const token = loginRes.body.token;
      console.log(`✓ Login successful`);
      console.log(`✓ Token: ${token.substring(0, 20)}...`);
      
      // Test 2: Use the token to get products
      console.log('\n2. Using token to fetch products...');
      const productsRes = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/products?page=1&limit=20',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (productsRes.status === 200) {
        console.log(`✓ Products fetched: ${productsRes.body.data?.length || 0} items`);
        console.log('\n✓✓✓ FRONTEND SHOULD WORK NOW! ✓✓✓');
        console.log('\nNext step: Clear localStorage in browser console and reload');
        console.log('localStorage.clear()');
        console.log('Then refresh the page and login again');
      } else {
        console.log(`✗ Failed to fetch products. Status: ${productsRes.status}`);
      }
    } else {
      console.log(`✗ Login failed:`, loginRes.body);
    }
  } catch (err) {
    console.log('✗ Error:', err.message);
  }

  process.exit(0);
}

test();
