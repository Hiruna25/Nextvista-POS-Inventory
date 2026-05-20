const http = require('http');

const credentials = {
  username: 'Admin',
  password: 'Admin123'
};

const postData = JSON.stringify(credentials);

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

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Headers:', res.headers);
    try {
      const json = JSON.parse(data);
      console.log('Response Body:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response Body:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();
