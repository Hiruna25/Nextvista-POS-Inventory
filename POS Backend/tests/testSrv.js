const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.k7pou0s.mongodb.net', (err, res) => {
  if (err) {
    console.error('SRV resolve error:', err);
    process.exit(1);
  }
  console.log('SRV result:', res);
});
