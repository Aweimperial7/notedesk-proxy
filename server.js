const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const API_KEY = 'Wc9rrDmWqJW8h7cafhT52aopborKUxpoJtb9FCCm';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST') return res.writeHead(404).end();

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const options = {
      hostname: 'api.batchdata.com',
      path: '/api/v1/property/lookup/all-attributes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const proxy = https.request(options, r => {
      let data = '';
      r.on('data', chunk => data += chunk);
      r.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    proxy.on('error', e => {
      res.writeHead(500).end(JSON.stringify({ error: e.message }));
    });

    proxy.write(body);
    proxy.end();
  });
});

server.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
