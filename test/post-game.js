const http = require('http');

const data = JSON.stringify({
  name: 'Test Game ' + Date.now(),
  genero: 'Action',
  nota: 8.5,
  companyId: 1,
  collectionId: 1,
  platformId: 1,
  plataforma_id: 1,
  platform_id: 1
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/videogames',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

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
