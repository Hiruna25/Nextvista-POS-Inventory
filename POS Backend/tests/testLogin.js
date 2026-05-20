const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Admin', password: 'Admin123' })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Login Success');
      console.log(`Username: ${data.user.username}`);
      console.log(`Email: ${data.user.email}`);
      console.log(`Roles: ${data.user.roles.join(', ')}`);
      console.log(`Token: ${data.token.substring(0, 40)}...`);
    } else {
      console.log('❌ Login Failed');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('\nChecklist:');
    console.error('- Backend running on :3001?');
    console.error('- MongoDB connected?');
    console.error('- Admin user exists in DB?');
  }
}

testLogin();
