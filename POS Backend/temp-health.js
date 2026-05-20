const http = require('http');
http.get('http://localhost:3001/api/health', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
  });
}).on('error', err => {
  console.error('error', err.message);
});
