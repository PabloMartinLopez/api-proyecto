const http = require('http');

const data = JSON.stringify({
  name: 'Test Collection ' + Date.now(),
  user_id: 1,
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/collections',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Sending POST to /api/collections');
const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
