const dns = require('dns');
const net = require('net');

async function testDNS() {
  console.log('=== TESTING DNS RESOLUTION ===\n');

  const host = 'cluster0.k7pou0s.mongodb.net';

  // Test 1: Current system DNS
  console.log('1. Testing with Current System DNS...');
  dns.resolve4(host, (err, addresses) => {
    if (err) {
      console.log(`   ✗ Failed: ${err.code}`);
    } else {
      console.log(`   ✓ Resolved: ${addresses[0]}`);
    }

    // Test 2: Google DNS
    console.log('\n2. Testing with Google DNS (8.8.8.8)...');
    const googleDns = new dns.Resolver();
    googleDns.setServers(['8.8.8.8']);
    
    googleDns.resolve4(host, (err, addresses) => {
      if (err) {
        console.log(`   ✗ Failed: ${err.code}`);
      } else {
        console.log(`   ✓ Resolved: ${addresses[0]}`);
      }

      // Test 3: Cloudflare DNS
      console.log('\n3. Testing with Cloudflare DNS (1.1.1.1)...');
      const cfDns = new dns.Resolver();
      cfDns.setServers(['1.1.1.1']);
      
      cfDns.resolve4(host, (err, addresses) => {
        if (err) {
          console.log(`   ✗ Failed: ${err.code}`);
        } else {
          console.log(`   ✓ Resolved: ${addresses[0]}`);
        }

        console.log('\n=== ANALYSIS ===');
        console.log('If Google or Cloudflare DNS work but your current DNS fails:');
        console.log('Your router\'s DNS cannot resolve MongoDB Atlas.');
        console.log('Solution: Change system DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1)');
        process.exit(0);
      });
    });
  });
}

testDNS();
