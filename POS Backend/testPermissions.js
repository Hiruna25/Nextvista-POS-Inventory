const http = require('http');

const testUsers = [
  { username: 'Admin', password: 'Admin123', expectedPermissions: ['manage_products', 'manage_inventory', 'view_reports', 'manage_users'] },
  { username: 'Manager', password: 'Manager123', expectedPermissions: ['manage_products', 'manage_inventory', 'view_reports'] },
  { username: 'Cashier', password: 'Cashier123', expectedPermissions: ['view_reports'] }
];

async function testLogin(username, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ username, password });
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.substring(0, 100)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Testing MongoDB User Permissions\n');
  console.log('='.repeat(80));

  for (const user of testUsers) {
    console.log(`\n✅ Testing user: ${user.username}`);
    console.log('   Expected permissions:', user.expectedPermissions.join(', '));
    
    try {
      const loginResponse = await testLogin(user.username, user.password);
      
      if (loginResponse && loginResponse.success && loginResponse.user) {
        console.log('   ✓ Login successful');
        console.log('   Actual permissions:  ', loginResponse.user.permissions.join(', '));
        
        // Verify permissions match
        const actualPerms = loginResponse.user.permissions.sort().join(',');
        const expectedPerms = user.expectedPermissions.sort().join(',');
        if (actualPerms === expectedPerms) {
          console.log('   ✓ Permissions match expected values');
        } else {
          console.log('   ✗ Permissions do NOT match!');
        }
      } else {
        console.log('   ✗ Login failed:', loginResponse?.message || JSON.stringify(loginResponse));
      }
    } catch (error) {
      console.log(`   ✗ Error: ${error.message || String(error)}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Permission tests completed\n');
  process.exit(0);
}

runTests().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
